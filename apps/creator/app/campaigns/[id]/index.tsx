import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CampaignDetail,
  DeliverableRequirement,
  InventoryProduct,
  useCampaignDetail,
  useSavedCampaigns,
  useToggleSave
} from "@/lib/hooks/useCampaignDetail";
import { useMyApplicationForCampaign } from "@/lib/hooks/useApplications";
import { CompensationType } from "@/lib/hooks/useCampaigns";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function CampaignDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Array.isArray(id) ? id[0] : id;
  const kycStatus = useAuthStore((state) => state.user?.kycStatus ?? null);
  const detailQuery = useCampaignDetail(campaignId);
  const savedQuery = useSavedCampaigns();
  const applicationQuery = useMyApplicationForCampaign(campaignId);
  const toggleSave = useToggleSave();
  const [kycModalOpen, setKycModalOpen] = useState(false);

  if (detailQuery.isLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    const status = (detailQuery.error as AxiosError | undefined)?.response?.status;
    return <CampaignErrorState notFound={status === 404} onRetry={() => detailQuery.refetch()} />;
  }

  const campaign = detailQuery.data;
  const saved = savedQuery.data?.includes(campaign.id) ?? false;
  const application = applicationQuery.data;

  const toggleBookmark = () => {
    toggleSave.mutate({ campaignId: campaign.id, saved });
  };

  const openApply = () => {
    if (application) return;
    if (kycStatus === "APPROVED") {
      router.push({ pathname: "/campaigns/[id]/apply", params: { id: campaign.id } });
    } else {
      setKycModalOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HeroHeader campaign={campaign} saved={saved} onToggleSave={toggleBookmark} />
        <PayoutBreakdown campaign={campaign} />
        <CampaignBrief campaign={campaign} />
        <DeliverablesRequired campaign={campaign} />
        <UsageRightsSection campaign={campaign} />
        <GiftingDetails campaign={campaign} />
        <BrandProfileCard campaign={campaign} />
        <PastCampaignExamples campaign={campaign} />
      </ScrollView>

      <BottomActionBar campaign={campaign} kycStatus={kycStatus} application={application} onApply={openApply} />
      <KycRequiredModal visible={kycModalOpen} kycStatus={kycStatus} onClose={() => setKycModalOpen(false)} />
    </SafeAreaView>
  );
}

function HeroHeader({ campaign, saved, onToggleSave }: { campaign: CampaignDetail; saved: boolean; onToggleSave: () => void }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroActions}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.heroIconButton}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onToggleSave} style={styles.heroIconButton}>
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={20} color={saved ? colors.primary : colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.brandHeroRow}>
        <BrandAvatar logoUrl={campaign.brand.logoUrl} name={campaign.brand.companyName} size={66} />
        <View style={styles.brandHeroCopy}>
          <View style={styles.brandNameRow}>
            <Text style={styles.brandName}>{campaign.brand.companyName}</Text>
            {campaign.brand.verified ? <Ionicons name="checkmark-circle" size={17} color={colors.primary} /> : null}
          </View>
          <Text style={styles.postedDate}>Posted {postedAgo(campaign.postedAt)}</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>{campaign.title}</Text>

      <View style={styles.platformRow}>
        {campaign.targetPlatforms.map((platform) => (
          <Tag key={platform} icon={platformIcon(platform)} label={platformLabel(platform)} />
        ))}
      </View>

      <View style={styles.tagRow}>
        {campaign.nicheCategories.map((category) => (
          <View key={category} style={styles.nicheTag}>
            <Text style={styles.nicheText}>{category}</Text>
          </View>
        ))}
      </View>

      <View style={styles.compensationRow}>
        <CompensationBadge type={campaign.compensationType} />
      </View>
    </View>
  );
}

function PayoutBreakdown({ campaign }: { campaign: CampaignDetail }) {
  const fee = Math.max(campaign.creatorPayout - campaign.creatorNetPayout, campaign.creatorPayout * 0.1);
  const isGiftOnly = campaign.compensationType === "GIFTING";

  return (
    <GlassCard style={styles.payoutCard}>
      <Text style={styles.cardTitle}>Your Earnings</Text>
      {isGiftOnly ? (
        <>
          <BreakdownRow label="Product value" value={`${formatCurrency(totalInventoryValue(campaign.inventoryItems))} product`} />
          <BreakdownRow label="Service fee" value={`${formatCurrency(campaign.fixedServiceFee)} service fee`} mutedValue />
          <Text style={styles.payoutNote}>You keep the gifted products</Text>
        </>
      ) : (
        <>
          <BreakdownRow label="Gross amount" value={formatCurrency(campaign.creatorPayout)} />
          <BreakdownRow label="Platform fee" value={`- ${formatCurrency(fee)} (10% platform fee)`} mutedValue />
          <View style={styles.divider} />
          <View style={styles.netRow}>
            <Text style={styles.netLabel}>Net payout</Text>
            <Text style={styles.netValue}>{formatCurrency(campaign.creatorNetPayout)}</Text>
          </View>
        </>
      )}
      {campaign.negotiationEnabled ? (
        <View style={styles.negotiationBox}>
          <Text style={styles.negotiationTitle}>💬 Negotiation allowed</Text>
          <Text style={styles.negotiationText}>You can propose a different amount when applying</Text>
        </View>
      ) : null}
    </GlassCard>
  );
}

function CampaignBrief({ campaign }: { campaign: CampaignDetail }) {
  const [expanded, setExpanded] = useState(false);
  const long = campaign.description.length > 190;
  return (
    <Section title="Campaign Brief">
      <Text style={styles.briefText} numberOfLines={expanded ? undefined : 4}>
        {campaign.description || "No campaign description provided yet."}
      </Text>
      {long ? (
        <Pressable accessibilityRole="button" onPress={() => setExpanded((current) => !current)}>
          <Text style={styles.readMore}>{expanded ? "Show less" : "Read more"}</Text>
        </Pressable>
      ) : null}
      <View style={styles.bullets}>
        {campaign.keyRequirements.map((requirement) => (
          <View key={requirement} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{requirement}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function DeliverablesRequired({ campaign }: { campaign: CampaignDetail }) {
  return (
    <Section title="What You'll Create">
      <View style={styles.deliverableList}>
        {campaign.deliverableRequirements.length ? campaign.deliverableRequirements.map((deliverable, index) => (
          <DeliverableItem key={`${deliverable.contentType}-${index}`} deliverable={deliverable} />
        )) : (
          <Text style={styles.emptyInline}>Deliverables will be shared after approval.</Text>
        )}
      </View>
      <View style={styles.slaBox}>
        <Text style={styles.slaText}>⏱ Submit within {campaign.slaDays} days of approval</Text>
      </View>
    </Section>
  );
}

function UsageRightsSection({ campaign }: { campaign: CampaignDetail }) {
  const [expanded, setExpanded] = useState(false);
  const restrictions = campaign.usageRights.restrictions;
  const visible = expanded ? restrictions : restrictions.slice(0, 3);
  return (
    <Section title="Usage Rights">
      <View style={styles.rightsCard}>
        <RightsRow label={campaign.usageRights.exclusive ? "🔒 Exclusive" : "✓ Non-exclusive"} value={campaign.usageRights.exclusive ? campaign.usageRights.exclusivityPeriod ?? "Limited period" : "No exclusivity"} />
        <RightsRow label="📅 Usage duration" value={campaign.usageRights.usageDuration ?? "12 months"} />
        <RightsRow label="🌍 Territorial scope" value={campaign.usageRights.territorialScope ?? "Global"} />
      </View>
      {restrictions.length ? (
        <View style={styles.restrictionRow}>
          {visible.map((restriction) => (
            <View key={restriction} style={styles.restrictionChip}>
              <Text style={styles.restrictionText}>{restriction}</Text>
            </View>
          ))}
          {restrictions.length > 3 ? (
            <Pressable accessibilityRole="button" onPress={() => setExpanded((current) => !current)} style={styles.restrictionChip}>
              <Text style={styles.restrictionText}>{expanded ? "Show less" : `+${restrictions.length - 3} more`}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Section>
  );
}

function GiftingDetails({ campaign }: { campaign: CampaignDetail }) {
  if (campaign.compensationType !== "GIFTING" && campaign.compensationType !== "MIXED") return null;
  return (
    <Section title="Products You'll Receive">
      <View style={styles.productList}>
        {campaign.inventoryItems.map((item) => (
          <InventoryItem key={item.id} item={item} />
        ))}
      </View>
      <View style={styles.shippingNote}>
        <Text style={styles.shippingText}>Products shipped to your registered address</Text>
        <Text style={styles.shippingSubtext}>Receipt confirmation required before content submission</Text>
      </View>
    </Section>
  );
}

function BrandProfileCard({ campaign }: { campaign: CampaignDetail }) {
  return (
    <Section title="About the Brand">
      <View style={styles.brandCard}>
        <View style={styles.brandCardHeader}>
          <BrandAvatar logoUrl={campaign.brand.logoUrl} name={campaign.brand.companyName} size={54} />
          <View style={styles.brandCardCopy}>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandCardName}>{campaign.brand.companyName}</Text>
              {campaign.brand.verified ? <Ionicons name="checkmark-circle" size={15} color={colors.primary} /> : null}
            </View>
            <Text style={styles.brandDescription}>{campaign.brand.description ?? "Premium brand partner on CreatorX."}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Stat label="Campaigns" value={String(campaign.brand.totalCampaigns || 0)} />
          <Stat label="Rating" value={`${campaign.brand.averageRating || 0}★`} />
          <Stat label="Avg payout" value={formatCurrency(campaign.brand.averagePayout)} />
        </View>
        <Text style={styles.ratingText}>★★★★★ <Text style={styles.ratingMuted}>({campaign.brand.reviewCount} reviews)</Text></Text>
        <Pressable accessibilityRole="button">
          <Text style={styles.linkText}>View past campaigns</Text>
        </Pressable>
      </View>
    </Section>
  );
}

function PastCampaignExamples({ campaign }: { campaign: CampaignDetail }) {
  return (
    <Section title="Previous Work">
      {campaign.pastCampaignExamples.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.examplesRow}>
          {campaign.pastCampaignExamples.map((example) => (
            <View key={example.id} style={styles.exampleCard}>
              {example.imageUrl ? <Image source={{ uri: example.imageUrl }} style={styles.exampleImage} /> : <Ionicons name="image-outline" size={28} color={colors.primary} />}
              <Text style={styles.exampleTitle} numberOfLines={2}>{example.title}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noExamples}>
          <Ionicons name="albums-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyInline}>No examples yet</Text>
        </View>
      )}
    </Section>
  );
}

function BottomActionBar({ campaign, kycStatus, application, onApply }: { campaign: CampaignDetail; kycStatus: string | null; application: { createdAt?: string | null } | null | undefined; onApply: () => void }) {
  const kycApproved = kycStatus === "APPROVED";
  const applied = Boolean(application);
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomPayout}>
        <Text style={styles.bottomAmount}>{formatCurrency(campaign.creatorNetPayout)} net</Text>
        <Text style={styles.bottomCaption}>{applied && application?.createdAt ? `Applied ${postedAgo(application.createdAt)}` : "per campaign"}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: applied }}
        onPress={applied ? undefined : onApply}
        style={[styles.bottomButton, !kycApproved || applied ? styles.bottomButtonMuted : null, applied ? styles.applicationSent : null]}
      >
        <Text style={[styles.bottomButtonText, !kycApproved || applied ? styles.bottomButtonTextMuted : null]}>
          {applied ? "Application Sent" : kycApproved ? "Apply Now" : "KYC Required"}
        </Text>
      </Pressable>
    </View>
  );
}

function KycRequiredModal({ visible, kycStatus, onClose }: { visible: boolean; kycStatus: string | null; onClose: () => void }) {
  const rejected = kycStatus === "REJECTED";
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.kycSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>KYC Verification Required</Text>
          <Text style={styles.modalBody}>
            {rejected
              ? "Complete identity verification to apply for campaigns. You can resubmit your documents now."
              : "Complete identity verification to apply for campaigns. Your documents are under review."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (rejected) {
                onClose();
                router.push("/(onboarding)/kyc");
              } else {
                onClose();
              }
            }}
            style={[styles.modalButton, rejected ? null : styles.modalButtonMuted]}
          >
            <Text style={[styles.modalButtonText, rejected ? null : styles.modalButtonTextMuted]}>{rejected ? "Go to KYC" : "Got it"}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function CampaignDetailSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SkeletonBlock height={190} radius={18} />
        <SkeletonBlock height={138} radius={22} />
        <SkeletonBlock height={170} radius={16} />
        <SkeletonBlock height={230} radius={16} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SkeletonBlock({ height, radius }: { height: number; radius: number }) {
  const opacity = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 760, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 760, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);
  return <Animated.View style={[styles.skeleton, { height, borderRadius: radius, opacity }]} />;
}

function CampaignErrorState({ notFound, onRetry }: { notFound: boolean; onRetry: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.errorState}>
        <View style={styles.errorIcon}>
          <Ionicons name={notFound ? "file-tray-outline" : "cloud-offline-outline"} size={36} color={colors.primary} />
        </View>
        <Text style={styles.errorTitle}>{notFound ? "This campaign is no longer available" : "Failed to load campaign"}</Text>
        <Pressable accessibilityRole="button" onPress={notFound ? () => router.replace("/(tabs)/explore") : onRetry} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>{notFound ? "Browse other campaigns" : "Try again"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BrandAvatar({ logoUrl, name, size }: { logoUrl?: string | null; name: string; size: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {logoUrl ? <Image source={{ uri: logoUrl }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{initials(name)}</Text>}
    </View>
  );
}

function Tag({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.platformTag}>
      <Ionicons name={icon} size={13} color={colors.textSecondary} />
      <Text style={styles.platformText}>{label}</Text>
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

function BreakdownRow({ label, value, mutedValue }: { label: string; value: string; mutedValue?: boolean }) {
  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, mutedValue ? styles.breakdownMuted : null]}>{value}</Text>
    </View>
  );
}

function DeliverableItem({ deliverable }: { deliverable: DeliverableRequirement }) {
  return (
    <View style={styles.deliverableItem}>
      <View style={styles.deliverableIcon}>
        <Text style={styles.deliverableEmoji}>{contentEmoji(deliverable.contentType)}</Text>
      </View>
      <View style={styles.deliverableCopy}>
        <Text style={styles.deliverableTitle}>{deliverable.description}</Text>
        <Text style={styles.deliverableMeta}>{deliverable.platform ? platformLabel(deliverable.platform) : "Creator content"}</Text>
      </View>
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>× {deliverable.quantity}</Text>
      </View>
    </View>
  );
}

function RightsRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rightsRow}>
      <Text style={styles.rightsLabel}>{label}</Text>
      <Text style={styles.rightsValue}>{value}</Text>
    </View>
  );
}

function InventoryItem({ item }: { item: InventoryProduct }) {
  const stock = stockMeta(item.stockCount);
  return (
    <View style={styles.productItem}>
      <View style={styles.productThumb}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.productImage} /> : <Ionicons name="cube-outline" size={22} color={colors.primary} />}
      </View>
      <View style={styles.productCopy}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productValue}>Estimated value {formatCurrency(item.value)} · Qty {item.quantity}</Text>
      </View>
      <Text style={[styles.stockText, { color: stock.color }]}>{stock.label}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
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

function stockMeta(stock: number) {
  if (stock <= 0) return { label: "✗ Out of Stock", color: "#A5403C" };
  if (stock < 5) return { label: "⚠ Limited Stock", color: "#9A6A11" };
  return { label: "✓ In Stock", color: "#2F7D4F" };
}

function contentEmoji(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("reel") || normalized.includes("video")) return "🎬";
  if (normalized.includes("story")) return "📱";
  if (normalized.includes("post") || normalized.includes("photo")) return "📸";
  return "✨";
}

function platformIcon(platform: string): keyof typeof Ionicons.glyphMap {
  if (platform === "INSTAGRAM") return "logo-instagram";
  if (platform === "YOUTUBE") return "logo-youtube";
  return "musical-notes-outline";
}

function platformLabel(platform: string) {
  if (platform === "INSTAGRAM") return "Instagram";
  if (platform === "YOUTUBE") return "YouTube";
  return "TikTok";
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CX";
}

function totalInventoryValue(items: InventoryProduct[]) {
  return items.reduce((total, item) => total + item.value * item.quantity, 0);
}

function formatCurrency(value: number) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function postedAgo(value?: string | null) {
  if (!value) return "3 days ago";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "3 days ago";
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 132
  },
  hero: {
    marginBottom: 18
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  heroIconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)"
  },
  brandHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden"
  },
  avatarImage: {
    width: "100%",
    height: "100%"
  },
  avatarText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900"
  },
  brandHeroCopy: {
    flex: 1
  },
  brandNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900"
  },
  postedDate: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.5,
    marginBottom: 14
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  platformTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  platformText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  nicheTag: {
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  nicheText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800"
  },
  compensationRow: {
    flexDirection: "row"
  },
  compBadge: {
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  compText: {
    fontSize: 12,
    fontWeight: "900"
  },
  payoutCard: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 18,
    padding: 18,
    marginBottom: 22
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    flexShrink: 1
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
    justifyContent: "space-between"
  },
  netLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900"
  },
  netValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900"
  },
  payoutNote: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  negotiationBox: {
    borderRadius: 13,
    backgroundColor: "rgba(73,160,120,0.09)",
    padding: 12,
    marginTop: 14
  },
  negotiationTitle: {
    color: "#2F7D4F",
    fontSize: 13,
    fontWeight: "900"
  },
  negotiationText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
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
    marginBottom: 12
  },
  briefText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: "400"
  },
  readMore: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8
  },
  bullets: {
    gap: 8,
    marginTop: 14
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8
  },
  bulletDot: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 20
  },
  bulletText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700"
  },
  deliverableList: {
    gap: 10
  },
  deliverableItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    padding: 13
  },
  deliverableIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.07)"
  },
  deliverableEmoji: {
    fontSize: 19
  },
  deliverableCopy: {
    flex: 1
  },
  deliverableTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  deliverableMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3
  },
  quantityBadge: {
    borderRadius: 13,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  quantityText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  slaBox: {
    borderRadius: 13,
    backgroundColor: "rgba(224,122,95,0.08)",
    padding: 13,
    marginTop: 12
  },
  slaText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "900"
  },
  rightsCard: {
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    padding: 14,
    gap: 12
  },
  rightsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  rightsLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  rightsValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    flexShrink: 1,
    textAlign: "right"
  },
  restrictionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  restrictionChip: {
    borderRadius: 15,
    backgroundColor: colors.borderSoft,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  restrictionText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800"
  },
  productList: {
    gap: 10
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    padding: 12
  },
  productThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  productImage: {
    width: "100%",
    height: "100%"
  },
  productCopy: {
    flex: 1
  },
  productName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  productValue: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3
  },
  stockText: {
    fontSize: 10,
    fontWeight: "900",
    maxWidth: 74,
    textAlign: "right"
  },
  shippingNote: {
    borderRadius: 13,
    backgroundColor: "rgba(91,79,233,0.06)",
    padding: 13,
    marginTop: 12
  },
  shippingText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900"
  },
  shippingSubtext: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4
  },
  brandCard: {
    borderRadius: 16,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    padding: 15
  },
  brandCardHeader: {
    flexDirection: "row",
    gap: 13,
    marginBottom: 14
  },
  brandCardCopy: {
    flex: 1
  },
  brandCardName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900"
  },
  brandDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: 14,
    gap: 10
  },
  stat: {
    flex: 1
  },
  statValue: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3
  },
  ratingText: {
    color: "#D99A2B",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 14
  },
  ratingMuted: {
    color: colors.textSecondary
  },
  linkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 12
  },
  examplesRow: {
    gap: 12,
    paddingRight: 20
  },
  exampleCard: {
    width: 132,
    height: 146,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)",
    overflow: "hidden",
    padding: 10
  },
  exampleImage: {
    ...StyleSheet.absoluteFillObject
  },
  exampleTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  noExamples: {
    minHeight: 82,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)"
  },
  emptyInline: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
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
  bottomPayout: {
    flex: 1
  },
  bottomAmount: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900"
  },
  bottomCaption: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2
  },
  bottomButton: {
    minHeight: 48,
    minWidth: 132,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
    paddingHorizontal: 16
  },
  bottomButtonMuted: {
    backgroundColor: colors.borderSoft
  },
  applicationSent: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary
  },
  bottomButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  bottomButtonTextMuted: {
    color: colors.textSecondary
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26,26,46,0.40)"
  },
  kycSheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30
  },
  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    marginBottom: 20
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 10
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20
  },
  modalButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary
  },
  modalButtonMuted: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  modalButtonTextMuted: {
    color: colors.textPrimary
  },
  skeleton: {
    backgroundColor: colors.surfaceSolid,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.05)"
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28
  },
  errorIcon: {
    width: 82,
    height: 82,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.07)",
    marginBottom: 18
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18
  },
  errorButton: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 22
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  }
});
