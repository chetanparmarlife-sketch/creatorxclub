import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompensationType } from "@/lib/hooks/useCampaigns";
import { CampaignDetail, useCampaignDetail } from "@/lib/hooks/useCampaignDetail";
import { useSubmitApplication } from "@/lib/hooks/useApplications";
import { getSupabaseClient, supabaseUrl } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

type PortfolioMedia = {
  id: string;
  uri: string;
  fileName: string;
  mimeType: string;
  uploadedUrl?: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

type FormErrors = {
  pitch?: string;
  portfolioLinks?: Record<number, string>;
  proposedPrice?: string;
  media?: string;
  submit?: string;
};

const maxPitchLength = 500;
const maxLinks = 5;
const maxMedia = 3;
const maxFileSize = 5 * 1024 * 1024;

export default function CampaignApplyRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Array.isArray(id) ? id[0] : id;
  const user = useAuthStore((state) => state.user);
  const kycStatus = user?.kycStatus ?? null;
  const campaignQuery = useCampaignDetail(campaignId);
  const submitApplication = useSubmitApplication();
  const scrollRef = useRef<KeyboardAwareScrollView | null>(null);

  const [pitchMessage, setPitchMessage] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState([""]);
  const [media, setMedia] = useState<PortfolioMedia[]>([]);
  const [proposedPriceText, setProposedPriceText] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  if (kycStatus !== "APPROVED") {
    return <KycRequiredGuard />;
  }

  if (campaignQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingState}>
          <Ionicons name="document-text-outline" size={34} color={colors.primary} />
          <Text style={styles.loadingText}>Preparing application...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (campaignQuery.isError || !campaignQuery.data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingState}>
          <Ionicons name="cloud-offline-outline" size={34} color={colors.primary} />
          <Text style={styles.loadingText}>Could not load campaign</Text>
          <Pressable accessibilityRole="button" onPress={() => campaignQuery.refetch()} style={styles.smallPrimaryButton}>
            <Text style={styles.smallPrimaryText}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const campaign = campaignQuery.data;
  const proposedPrice = parseAmount(proposedPriceText);
  const effectiveGross = campaign.negotiationEnabled ? proposedPrice : campaign.creatorPayout;
  const netPayout = calculateNet(effectiveGross);
  const fee = effectiveGross * 0.1;
  const higherThanBudget = campaign.negotiationEnabled && proposedPrice > campaign.creatorPayout * 3;

  const addPortfolioLink = () => {
    if (portfolioLinks.length < maxLinks) {
      setPortfolioLinks((current) => [...current, ""]);
    }
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setPortfolioLinks((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removePortfolioLink = (index: number) => {
    setPortfolioLinks((current) => current.filter((_item, itemIndex) => itemIndex !== index));
  };

  const pickMedia = async () => {
    const remaining = maxMedia - media.length;
    if (remaining <= 0) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.82,
      selectionLimit: remaining
    });

    if (result.canceled) return;

    const nextAssets = result.assets.slice(0, remaining);
    const tooLarge = nextAssets.some((asset) => typeof asset.fileSize === "number" && asset.fileSize > maxFileSize);
    if (tooLarge) {
      setErrors((current) => ({ ...current, media: "Each image must be 5MB or less." }));
      return;
    }

    setErrors((current) => ({ ...current, media: undefined }));
    const nextMedia = nextAssets.map((asset) => ({
      id: `${Date.now()}-${asset.assetId ?? asset.uri}`,
      uri: asset.uri,
      fileName: asset.fileName ?? `portfolio-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? "image/jpeg",
      progress: 0,
      uploading: true
    }));
    setMedia((current) => [...current, ...nextMedia]);

    await Promise.all(nextMedia.map(uploadPortfolioMedia));
  };

  const uploadPortfolioMedia = async (item: PortfolioMedia) => {
    try {
      setMediaProgress(item.id, 0.25, true);
      const supabase = getSupabaseClient();
      const response = await fetch(item.uri);
      const blob = await response.blob();
      setMediaProgress(item.id, 0.65, true);
      const safeName = item.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `portfolio/${user?.id ?? "anonymous"}/${campaign.id}/${Date.now()}-${safeName}`;
      const { data, error } = await supabase.storage.from("deliverables").upload(path, blob, {
        contentType: item.mimeType,
        upsert: true
      });
      if (error) throw error;
      const uploadedUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/deliverables/${data.path}`;
      setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, uploadedUrl, progress: 1, uploading: false } : entry));
    } catch {
      setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, uploading: false, error: "Upload failed" } : entry));
    }
  };

  const setMediaProgress = (id: string, progress: number, uploading: boolean) => {
    setMedia((current) => current.map((entry) => entry.id === id ? { ...entry, progress, uploading } : entry));
  };

  const removeMedia = (id: string) => {
    setMedia((current) => current.filter((entry) => entry.id !== id));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const trimmedLinks = portfolioLinks.map((link) => link.trim()).filter(Boolean);

    if (pitchMessage.trim().length < 50) {
      nextErrors.pitch = "Pitch must be at least 50 characters.";
    }

    const linkErrors: Record<number, string> = {};
    portfolioLinks.forEach((link, index) => {
      const trimmed = link.trim();
      if (trimmed && !/^https?:\/\//i.test(trimmed)) {
        linkErrors[index] = "URL must start with http:// or https://";
      }
    });
    if (Object.keys(linkErrors).length) {
      nextErrors.portfolioLinks = linkErrors;
    }

    if (campaign.negotiationEnabled && proposedPrice <= 0) {
      nextErrors.proposedPrice = "Enter a proposed amount.";
    }

    if (media.some((item) => item.uploading)) {
      nextErrors.media = "Please wait for uploads to finish.";
    }
    if (media.some((item) => item.error)) {
      nextErrors.media = "Remove failed uploads before submitting.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      scrollRef.current?.scrollToPosition(0, 0, true);
      return false;
    }

    return trimmedLinks;
  };

  const reviewSubmission = () => {
    const result = validate();
    if (result) {
      setConfirmVisible(true);
    }
  };

  const confirmSubmit = async () => {
    const result = validate();
    if (!result) return;

    try {
      await submitApplication.mutateAsync({
        campaignId: campaign.id,
        pitchMessage: pitchMessage.trim(),
        portfolioLinks: [...result, ...media.map((item) => item.uploadedUrl).filter(Boolean) as string[]],
        proposedPrice: campaign.negotiationEnabled ? proposedPrice : null
      });
      setConfirmVisible(false);
      setSuccessVisible(true);
    } catch (error) {
      setConfirmVisible(false);
      setErrors((current) => ({ ...current, submit: applicationErrorMessage(error) }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={110}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <View style={styles.formCard}>
          <CampaignSummary campaign={campaign} />
          <PitchSection value={pitchMessage} error={errors.pitch} onChangeText={(value) => setPitchMessage(value.slice(0, maxPitchLength))} />
          <PortfolioLinksSection links={portfolioLinks} errors={errors.portfolioLinks} onAdd={addPortfolioLink} onChange={updatePortfolioLink} onRemove={removePortfolioLink} />
          <PortfolioMediaSection media={media} error={errors.media} onPick={pickMedia} onRemove={removeMedia} />
          {campaign.negotiationEnabled ? (
            <ProposedPriceSection
              campaign={campaign}
              value={proposedPriceText}
              error={errors.proposedPrice}
              higherThanBudget={higherThanBudget}
              onChangeText={(value) => setProposedPriceText(value.replace(/[^0-9.]/g, ""))}
            />
          ) : null}
          <PayoutSummary gross={effectiveGross} fee={fee} net={netPayout} />
          {errors.submit ? <Text style={styles.submitError}>{errors.submit}</Text> : null}
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomCopy}>
          <Text style={styles.bottomLabel}>Applying to</Text>
          <Text style={styles.bottomBrand} numberOfLines={1}>{campaign.brand.companyName}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={reviewSubmission} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </Pressable>
      </View>

      <ConfirmSheet
        visible={confirmVisible}
        campaign={campaign}
        netPayout={netPayout}
        submitting={submitApplication.isPending}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmSubmit}
      />
      <SuccessSheet visible={successVisible} />
    </SafeAreaView>
  );
}

function KycRequiredGuard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.guardHeader}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={styles.guardState}>
        <View style={styles.guardIcon}>
          <Ionicons name="shield-checkmark-outline" size={34} color={colors.primary} />
        </View>
        <Text style={styles.guardTitle}>KYC Required to Apply</Text>
        <Text style={styles.guardBody}>Complete identity verification before sending applications to brands.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.replace("/(onboarding)/kyc")} style={styles.guardButton}>
          <Text style={styles.guardButtonText}>Complete KYC</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </Pressable>
      <View>
        <Text style={styles.headerEyebrow}>Explore</Text>
        <Text style={styles.headerTitle}>Apply to Campaign</Text>
      </View>
    </View>
  );
}

function CampaignSummary({ campaign }: { campaign: CampaignDetail }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryAvatar}>
        {campaign.brand.logoUrl ? <Image source={{ uri: campaign.brand.logoUrl }} style={styles.fillImage} /> : <Text style={styles.summaryAvatarText}>{initials(campaign.brand.companyName)}</Text>}
      </View>
      <View style={styles.summaryCopy}>
        <Text style={styles.summaryLabel}>Applying for</Text>
        <Text style={styles.summaryTitle} numberOfLines={2}>{campaign.title}</Text>
        <Text style={styles.summaryBrand}>{campaign.brand.companyName}</Text>
      </View>
      <CompensationBadge type={campaign.compensationType} />
    </View>
  );
}

function PitchSection({ value, error, onChangeText }: { value: string; error?: string; onChangeText: (value: string) => void }) {
  const danger = value.length >= 450;
  return (
    <Section title="Your Pitch *" hint="Tell the brand why you're the perfect fit...">
      <View style={[styles.textAreaShell, error ? styles.errorBorder : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={maxPitchLength}
          placeholder="Share your creative vision, audience insights, and why this campaign fits your content..."
          placeholderTextColor={colors.textFaint}
          style={styles.textArea}
          textAlignVertical="top"
        />
        <Text style={[styles.counter, danger ? styles.counterDanger : null]}>{value.length}/500</Text>
      </View>
      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
    </Section>
  );
}

function PortfolioLinksSection({
  links,
  errors,
  onAdd,
  onChange,
  onRemove
}: {
  links: string[];
  errors?: Record<number, string>;
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Section title="Portfolio / Past Work" hint="Add links to relevant content (Instagram posts, YouTube videos, etc.)">
      <View style={styles.linkList}>
        {links.map((link, index) => (
          <View key={index}>
            <View style={[styles.linkInputRow, errors?.[index] ? styles.errorBorder : null]}>
              <Ionicons name="link-outline" size={17} color={colors.textMuted} />
              <TextInput
                value={link}
                onChangeText={(value) => onChange(index, value)}
                placeholder="https://..."
                placeholderTextColor={colors.textFaint}
                autoCapitalize="none"
                keyboardType="url"
                style={styles.linkInput}
              />
              {links.length > 1 ? (
                <Pressable accessibilityRole="button" onPress={() => onRemove(index)} hitSlop={8}>
                  <Ionicons name="close" size={17} color={colors.textSecondary} />
                </Pressable>
              ) : null}
            </View>
            {errors?.[index] ? <Text style={styles.inlineError}>{errors[index]}</Text> : null}
          </View>
        ))}
      </View>
      {links.length < maxLinks ? (
        <Pressable accessibilityRole="button" onPress={onAdd} style={styles.addLinkButton}>
          <Ionicons name="add" size={17} color={colors.primary} />
          <Text style={styles.addLinkText}>Add another link</Text>
        </Pressable>
      ) : null}
    </Section>
  );
}

function PortfolioMediaSection({ media, error, onPick, onRemove }: { media: PortfolioMedia[]; error?: string; onPick: () => void; onRemove: (id: string) => void }) {
  return (
    <Section title="Upload Work Samples (optional)">
      <Pressable accessibilityRole="button" onPress={onPick} style={[styles.uploadArea, error ? styles.errorBorder : null]}>
        <Ionicons name="cloud-upload-outline" size={26} color={colors.primary} />
        <Text style={styles.uploadTitle}>Tap to upload images</Text>
        <Text style={styles.uploadHelp}>Up to 3 images, 5MB each</Text>
      </Pressable>
      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
      {media.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaRow}>
          {media.map((item) => (
            <View key={item.id} style={styles.mediaThumb}>
              <Image source={{ uri: item.uri }} style={styles.fillImage} />
              <Pressable accessibilityRole="button" onPress={() => onRemove(item.id)} style={styles.removeMedia}>
                <Ionicons name="close" size={13} color="#FFFFFF" />
              </Pressable>
              {item.uploading ? <ProgressBar progress={item.progress} /> : null}
              {item.uploadedUrl ? <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.mediaCheck} /> : null}
              {item.error ? <Text style={styles.mediaError}>{item.error}</Text> : null}
            </View>
          ))}
        </ScrollView>
      ) : null}
    </Section>
  );
}

function ProposedPriceSection({
  campaign,
  value,
  error,
  higherThanBudget,
  onChangeText
}: {
  campaign: CampaignDetail;
  value: string;
  error?: string;
  higherThanBudget: boolean;
  onChangeText: (value: string) => void;
}) {
  const gross = parseAmount(value);
  const fee = gross * 0.1;
  const net = calculateNet(gross);
  return (
    <Section title="Propose Your Rate" hint={`Brand's offered amount: ${formatCurrency(campaign.creatorPayout)}`}>
      <View style={[styles.priceInputRow, error ? styles.errorBorder : null]}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter your proposed amount"
          placeholderTextColor={colors.textFaint}
          keyboardType="decimal-pad"
          style={styles.priceInput}
        />
      </View>
      {error ? <Text style={styles.inlineError}>{error}</Text> : null}
      {higherThanBudget ? (
        <Text style={styles.warningText}>Your rate is significantly higher than the brand's budget. This may reduce your chances of selection.</Text>
      ) : null}
      <PayoutSummary gross={gross} fee={fee} net={net} compact />
    </Section>
  );
}

function PayoutSummary({ gross, fee, net, compact }: { gross: number; fee: number; net: number; compact?: boolean }) {
  return (
    <View style={[styles.payoutCard, compact ? styles.compactPayout : null]}>
      <BreakdownRow label={compact ? "Your proposed rate" : "Your rate"} value={formatCurrency(gross)} />
      <BreakdownRow label="Platform fee (10%)" value={`-${formatCurrency(fee)}`} muted />
      <View style={styles.divider} />
      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Your net payout</Text>
        <Text style={styles.netValue}>{formatCurrency(net)}</Text>
      </View>
    </View>
  );
}

function ConfirmSheet({ visible, campaign, netPayout, submitting, onCancel, onConfirm }: { visible: boolean; campaign: CampaignDetail; netPayout: number; submitting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onCancel} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Confirm Application</Text>
          <InfoLine label="Campaign" value={campaign.title} />
          <InfoLine label="Brand" value={campaign.brand.companyName} />
          <InfoLine label={campaign.negotiationEnabled ? "Your proposed net payout" : "Your net payout"} value={formatCurrency(netPayout)} highlight />
          <View style={styles.sheetActions}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>{submitting ? "Submitting..." : "Submit Application"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SuccessSheet({ visible }: { visible: boolean }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.sheet}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>🎉</Text>
          </View>
          <Text style={styles.sheetTitle}>Application Submitted!</Text>
          <Text style={styles.successBody}>The brand will review your profile and pitch. You'll be notified when they respond.</Text>
          <View style={styles.sheetActions}>
            <Pressable accessibilityRole="button" onPress={() => router.replace("/(tabs)/campaigns")} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>View My Applications</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.replace("/(tabs)/explore")} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Explore More</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function CompensationBadge({ type }: { type: CompensationType }) {
  const meta = compensationMeta(type);
  return (
    <View style={[styles.compBadge, { backgroundColor: meta.backgroundColor }]}>
      <Text style={[styles.compText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

function BreakdownRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, muted ? styles.breakdownMuted : null]}>{value}</Text>
    </View>
  );
}

function InfoLine({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight ? styles.infoHighlight : null]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
    </View>
  );
}

function applicationErrorMessage(error: unknown) {
  const status = (error as AxiosError | undefined)?.response?.status;
  if (status === 409) return "You've already applied to this campaign";
  if (status === 403) return "KYC required. Complete identity verification to apply.";
  if (status === 422) return "This campaign is no longer accepting applications";
  return "Something went wrong, please try again";
}

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateNet(gross: number) {
  return Math.max(0, gross - gross * 0.1);
}

function formatCurrency(value: number) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CX";
}

function compensationMeta(type: CompensationType) {
  const map = {
    CASH: { label: "₹ Cash", color: "#2F7D4F", backgroundColor: "rgba(73,160,120,0.12)" },
    GIFTING: { label: "🎁 Gifting", color: "#A85F20", backgroundColor: "rgba(224,122,95,0.13)" },
    DIGITAL: { label: "💎 Digital", color: "#2D6EA3", backgroundColor: "rgba(45,110,163,0.12)" },
    MIXED: { label: "Mixed", color: colors.primary, backgroundColor: "rgba(91,79,233,0.10)" }
  };
  return map[type];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 128
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 18
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)"
  },
  headerEyebrow: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 1
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 }
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    backgroundColor: colors.background,
    padding: 13,
    marginBottom: 24
  },
  summaryAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    overflow: "hidden"
  },
  fillImage: {
    width: "100%",
    height: "100%"
  },
  summaryAvatarText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  summaryCopy: {
    flex: 1
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2
  },
  summaryBrand: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2
  },
  compBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  compText: {
    fontSize: 11,
    fontWeight: "900"
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 7
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12
  },
  textAreaShell: {
    minHeight: 150,
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    padding: 14
  },
  textArea: {
    minHeight: 120,
    maxHeight: 170,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    padding: 0
  },
  counter: {
    alignSelf: "flex-end",
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 8
  },
  counterDanger: {
    color: colors.error
  },
  errorBorder: {
    borderColor: colors.error
  },
  inlineError: {
    color: colors.error,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 7
  },
  linkList: {
    gap: 10
  },
  linkInputRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 13
  },
  linkInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    padding: 0
  },
  addLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12
  },
  addLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  uploadArea: {
    minHeight: 118,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 16
  },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8
  },
  uploadHelp: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3
  },
  mediaRow: {
    gap: 12,
    paddingTop: 12,
    paddingRight: 20
  },
  mediaThumb: {
    width: 92,
    height: 92,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.background
  },
  removeMedia: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(26,26,46,0.72)"
  },
  progressTrack: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.62)"
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary
  },
  mediaCheck: {
    position: "absolute",
    left: 7,
    bottom: 7
  },
  mediaError: {
    position: "absolute",
    left: 5,
    right: 5,
    bottom: 6,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
    backgroundColor: "rgba(224,122,95,0.82)",
    borderRadius: 6,
    overflow: "hidden"
  },
  priceInputRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceSolid
  },
  rupee: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900"
  },
  priceInput: {
    flex: 1,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    padding: 0
  },
  warningText: {
    color: "#9A6A11",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 8
  },
  payoutCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 14
  },
  compactPayout: {
    marginTop: 12
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 9
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  breakdownMuted: {
    color: colors.textMuted
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 8
  },
  netRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  netLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  netValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900"
  },
  submitError: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
    marginTop: -8,
    marginBottom: 16
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24
  },
  bottomCopy: {
    flex: 1
  },
  bottomLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800"
  },
  bottomBrand: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2
  },
  submitButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
    paddingHorizontal: 17
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26,26,46,0.40)"
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    marginBottom: 20
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 16
  },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  infoValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  infoHighlight: {
    color: colors.primary,
    fontSize: 16
  },
  sheetActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingHorizontal: 10
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
    paddingHorizontal: 10
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.08)",
    marginBottom: 16
  },
  successEmoji: {
    fontSize: 34
  },
  successBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18
  },
  guardHeader: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  guardState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28
  },
  guardIcon: {
    width: 82,
    height: 82,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.07)",
    marginBottom: 18
  },
  guardTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 9
  },
  guardBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20
  },
  guardButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
    paddingHorizontal: 22
  },
  guardButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800"
  },
  smallPrimaryButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.primary,
    paddingHorizontal: 18
  },
  smallPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  }
});
