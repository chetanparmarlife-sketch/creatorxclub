import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import {
  DisputeCase,
  DisputeReason,
  useActiveCampaignDetail,
  useExistingDispute,
  useRaiseDispute
} from "@/lib/hooks/useActiveCampaigns";
import { getSupabaseClient, supabaseUrl } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

type EvidenceFile = {
  id: string;
  uri: string;
  fileName: string;
  mimeType: string;
  type: "image" | "pdf";
  uploadedUrl?: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

type FormErrors = {
  reason?: string;
  description?: string;
  evidence?: string;
  submit?: string;
};

const maxFiles = 5;
const maxFileSize = 10 * 1024 * 1024;

const disputeReasons: Array<{ value: DisputeReason; title: string; description: string }> = [
  { value: "QUALITY_ISSUE", title: "Brand is disputing my content quality unfairly", description: "Use this when the content follows the brief but is being rejected without fair reason." },
  { value: "NON_PAYMENT", title: "I haven't received payment after contract was signed", description: "Use this when contract terms are complete but payment has not moved forward." },
  { value: "CONTRACT_BREACH", title: "Brand is violating the agreed contract terms", description: "Use this for usage rights, exclusivity, or licensing violations." },
  { value: "NON_COMPLIANCE", title: "Brand is not following the campaign as agreed", description: "Use this when the brand changes scope, shipping, or approval rules unexpectedly." },
  { value: "OTHER", title: "Other issue (describe below)", description: "Use this when your dispute does not fit the categories above." }
];

export default function DisputeRoute() {
  const { campaignId: rawCampaignId } = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = Array.isArray(rawCampaignId) ? rawCampaignId[0] : rawCampaignId;
  const user = useAuthStore((state) => state.user);
  const campaignQuery = useActiveCampaignDetail(campaignId);
  const disputeQuery = useExistingDispute(campaignId);
  const raiseDispute = useRaiseDispute();

  const [reason, setReason] = useState<DisputeReason | null>(null);
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successCase, setSuccessCase] = useState<DisputeCase | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const campaign = campaignQuery.data;
  const existingDispute = disputeQuery.data;
  const existingNotFound = disputeQuery.error instanceof AxiosError && disputeQuery.error.response?.status === 404;
  const loading = campaignQuery.isLoading || (disputeQuery.isLoading && !existingNotFound);
  const uploadedUrls = evidence.map((item) => item.uploadedUrl).filter(Boolean) as string[];
  const anyUploading = evidence.some((item) => item.uploading);
  const anyFailed = evidence.some((item) => item.error);
  const canSubmit = Boolean(reason) && description.trim().length >= 100 && !anyUploading && !raiseDispute.isPending;

  if (loading) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primarySoft} />
        </View>
      </ScreenShell>
    );
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <Ionicons name="cloud-offline-outline" size={36} color={colors.error} />
          <Text style={styles.stateTitle}>Failed to load campaign</Text>
          <Text style={styles.stateCopy}>Campaign context is required before opening a dispute.</Text>
          <PrimaryButton label="Try Again" onPress={() => campaignQuery.refetch()} style={styles.stateButton} />
        </View>
      </ScreenShell>
    );
  }

  if (successCase) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <Text style={styles.stateEmoji}>🔒</Text>
          <Text style={styles.stateTitle}>Dispute Submitted</Text>
          <Text style={styles.caseNumber}>Case #{successCase.id.slice(0, 8)}</Text>
          <Text style={styles.stateCopy}>
            Your dispute has been submitted and escrow has been locked. Our team will review and contact both parties within 3-7 business days. You'll receive notifications on updates.
          </Text>
          <PrimaryButton label="View Campaign" onPress={() => router.replace(`/campaigns/active/${campaign.campaignId}` as any)} style={styles.stateButton} />
        </View>
      </ScreenShell>
    );
  }

  if (existingDispute) {
    return (
      <ScreenShell>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Dispute Status" subtitle={`${campaign.title} • ${campaign.brandName}`} showBack />
          <ExistingDisputeView dispute={existingDispute} />
        </ScrollView>
      </ScreenShell>
    );
  }

  const pickEvidence = async (source: "library" | "document") => {
    setSourceSheetOpen(false);
    const remaining = maxFiles - evidence.length;
    if (remaining <= 0) return;

    if (source === "library") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.84,
        selectionLimit: remaining
      });
      if (result.canceled) return;
      const assets = result.assets.slice(0, remaining);
      const tooLarge = assets.some((asset) => typeof asset.fileSize === "number" && asset.fileSize > maxFileSize);
      if (tooLarge) {
        setErrors((current) => ({ ...current, evidence: "Each evidence file must be 10MB or less." }));
        return;
      }
      const files = assets.map((asset) => ({
        id: `${Date.now()}-${asset.assetId ?? asset.uri}`,
        uri: asset.uri,
        fileName: asset.fileName ?? `evidence-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? "image/jpeg",
        type: "image" as const,
        progress: 0,
        uploading: true
      }));
      setEvidence((current) => [...current, ...files]);
      await Promise.all(files.map((file) => uploadEvidence(file, campaign.campaignId, user?.id ?? "anonymous")));
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png"],
      multiple: true,
      copyToCacheDirectory: true
    });
    if (result.canceled) return;

    const assets = result.assets.slice(0, remaining);
    const invalid = assets.some((asset) => !["application/pdf", "image/jpeg", "image/png"].includes(asset.mimeType ?? ""));
    const tooLarge = assets.some((asset) => typeof asset.size === "number" && asset.size > maxFileSize);
    if (invalid || tooLarge) {
      setErrors((current) => ({ ...current, evidence: invalid ? "Evidence must be a PDF, JPG, or PNG file." : "Each evidence file must be 10MB or less." }));
      return;
    }
    const files = assets.map((asset) => ({
      id: `${Date.now()}-${asset.uri}`,
      uri: asset.uri,
      fileName: asset.name,
      mimeType: asset.mimeType ?? "application/pdf",
      type: asset.mimeType === "application/pdf" ? ("pdf" as const) : ("image" as const),
      progress: 0,
      uploading: true
    }));
    setEvidence((current) => [...current, ...files]);
    await Promise.all(files.map((file) => uploadEvidence(file, campaign.campaignId, user?.id ?? "anonymous")));
  };

  const uploadEvidence = async (file: EvidenceFile, activeCampaignId: string, userId: string) => {
    try {
      setEvidenceProgress(file.id, 0.24, true);
      const response = await fetch(file.uri);
      const blob = await response.blob();
      setEvidenceProgress(file.id, 0.7, true);
      const safeName = file.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `disputes/${userId}/${activeCampaignId}/${Date.now()}_${safeName}`;
      const { data, error } = await getSupabaseClient().storage.from("deliverables").upload(path, blob, {
        contentType: file.mimeType,
        upsert: true
      });
      if (error) throw error;
      const uploadedUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/deliverables/${data.path}`;
      setEvidence((current) => current.map((item) => (item.id === file.id ? { ...item, uploadedUrl, progress: 1, uploading: false, error: undefined } : item)));
    } catch {
      setEvidence((current) => current.map((item) => (item.id === file.id ? { ...item, uploading: false, error: "Upload failed" } : item)));
    }
  };

  const setEvidenceProgress = (id: string, progress: number, uploading: boolean) => {
    setEvidence((current) => current.map((item) => (item.id === id ? { ...item, progress, uploading } : item)));
  };

  const removeEvidence = (id: string) => {
    setEvidence((current) => current.filter((item) => item.id !== id));
  };

  const retryEvidence = (file: EvidenceFile) => {
    setEvidence((current) => current.map((item) => (item.id === file.id ? { ...item, uploading: true, progress: 0, error: undefined } : item)));
    uploadEvidence(file, campaign.campaignId, user?.id ?? "anonymous");
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!reason) nextErrors.reason = "Select a dispute reason.";
    if (description.trim().length < 100) nextErrors.description = "Description must be at least 100 characters.";
    if (anyUploading) nextErrors.evidence = "Please wait for evidence uploads to finish.";
    if (anyFailed) nextErrors.evidence = "Retry or remove failed evidence uploads.";
    setErrors(nextErrors);
    return !Object.keys(nextErrors).length;
  };

  const startSubmit = () => {
    if (validate()) setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (!reason || !validate()) return;
    try {
      const dispute = await raiseDispute.mutateAsync({
        campaignId: campaign.campaignId,
        applicationId: campaign.applicationId,
        reason,
        description: description.trim(),
        evidenceUrls: uploadedUrls
      });
      setConfirmOpen(false);
      setSuccessCase(dispute);
    } catch {
      setConfirmOpen(false);
      setErrors((current) => ({ ...current, submit: "Could not submit dispute. Please try again." }));
    }
  };

  return (
    <ScreenShell>
      <View style={styles.root}>
        <KeyboardAwareScrollView enableOnAndroid keyboardShouldPersistTaps="handled" extraScrollHeight={120} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ScreenHeader title="Raise Dispute" subtitle={`${campaign.title} • ${campaign.brandName}`} showBack />

          <GlassCard style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠ Raising a Dispute Locks Escrow</Text>
            <Text style={styles.warningCopy}>
              Once raised, the campaign payment will be held until an Admin reviews and resolves the case. This process takes 3-7 business days.
            </Text>
            <Text style={styles.warningStrong}>Only raise a dispute if you have a genuine issue.</Text>
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="What's the issue? *" />
            <View style={styles.reasonList}>
              {disputeReasons.map((option) => {
                const selected = reason === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setReason(option.value);
                      setErrors((current) => ({ ...current, reason: undefined }));
                    }}
                    style={[styles.reasonRow, selected ? styles.reasonRowSelected : null]}
                  >
                    <View style={[styles.radio, selected ? styles.radioSelected : null]}>{selected ? <View style={styles.radioInner} /> : null}</View>
                    <View style={styles.reasonCopy}>
                      <Text style={styles.reasonTitle}>{option.title}</Text>
                      <Text style={styles.reasonDescription}>{option.description}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {errors.reason ? <Text style={styles.errorText}>{errors.reason}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Describe the issue *" hint="Provide details about the dispute. Be specific." />
            <TextInput
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                setErrors((current) => ({ ...current, description: undefined }));
              }}
              multiline
              placeholder="Explain what happened, when it happened, and what outcome you are requesting..."
              placeholderTextColor={colors.textFaint}
              style={styles.descriptionInput}
            />
            <Text style={[styles.counter, description.length < 100 ? styles.counterWarning : null]}>{description.length}/100 minimum</Text>
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Upload Evidence (optional)" hint="Screenshots, messages, or any relevant files" />
            {evidence.length === 0 ? (
              <Pressable onPress={() => setSourceSheetOpen(true)} style={styles.uploadArea}>
                <Ionicons name="cloud-upload-outline" size={28} color={colors.warning} />
                <Text style={styles.uploadTitle}>Add evidence files</Text>
                <Text style={styles.uploadCopy}>PDF, JPG, PNG • up to 5 files • 10MB each</Text>
              </Pressable>
            ) : (
              <View style={styles.evidenceList}>
                {evidence.map((file) => (
                  <EvidenceTile key={file.id} file={file} onRemove={() => removeEvidence(file.id)} onRetry={() => retryEvidence(file)} />
                ))}
                {evidence.length < maxFiles ? (
                  <Pressable onPress={() => setSourceSheetOpen(true)} style={styles.addEvidenceButton}>
                    <Ionicons name="add" size={18} color={colors.warning} />
                    <Text style={styles.addEvidenceText}>Add more</Text>
                  </Pressable>
                ) : null}
              </View>
            )}
            {errors.evidence ? <Text style={styles.errorText}>{errors.evidence}</Text> : null}
            {errors.submit ? <Text style={styles.errorText}>{errors.submit}</Text> : null}
          </GlassCard>
        </KeyboardAwareScrollView>

        <View style={styles.bottomBar}>
          <Pressable disabled={!canSubmit} onPress={startSubmit} style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]}>
            <Text style={styles.submitButtonText}>Submit Dispute</Text>
          </Pressable>
        </View>

        <EvidenceSourceSheet visible={sourceSheetOpen} onClose={() => setSourceSheetOpen(false)} onPick={pickEvidence} />
        <ConfirmDisputeModal visible={confirmOpen} loading={raiseDispute.isPending} onClose={() => setConfirmOpen(false)} onConfirm={confirmSubmit} />
      </View>
    </ScreenShell>
  );
}

function SectionLabel({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.labelBlock}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
    </View>
  );
}

function EvidenceTile({ file, onRemove, onRetry }: { file: EvidenceFile; onRemove: () => void; onRetry: () => void }) {
  return (
    <View style={styles.evidenceTile}>
      <View style={styles.evidencePreview}>
        {file.type === "image" ? <Image source={{ uri: file.uri }} style={styles.evidenceImage} /> : <Ionicons name="document-text-outline" size={26} color={colors.warning} />}
      </View>
      <View style={styles.evidenceMeta}>
        <Text numberOfLines={1} style={styles.evidenceName}>{file.fileName}</Text>
        {file.uploading ? (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(file.progress * 100)}%` }]} />
          </View>
        ) : file.error ? (
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Ionicons name="close-circle" size={14} color={colors.error} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        ) : (
          <Text style={styles.uploadedText}>✓ Uploaded</Text>
        )}
      </View>
      <Pressable onPress={onRemove} style={styles.removeButton}>
        <Ionicons name="close" size={14} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

function ExistingDisputeView({ dispute }: { dispute: DisputeCase }) {
  return (
    <>
      <GlassCard style={styles.sectionCard}>
        <View style={styles.caseHeader}>
          <View>
            <Text style={styles.caseLabel}>Case #</Text>
            <Text style={styles.caseId}>{dispute.id.slice(0, 8)}</Text>
          </View>
          <StatusBadge dispute={dispute} />
        </View>
        <InfoRow label="Reason" value={reasonLabel(dispute.reason)} />
        <InfoRow label="Submitted" value={dispute.createdAt ? formatDate(dispute.createdAt) : "Recently"} />
        {dispute.resolution ? <ResolutionBanner resolution={dispute.resolution} /> : null}
        {dispute.adminNotes ? (
          <View style={styles.adminNotes}>
            <Text style={styles.adminNotesTitle}>Admin notes</Text>
            <Text style={styles.adminNotesText}>{dispute.adminNotes}</Text>
          </View>
        ) : null}
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <SectionLabel title="Evidence Files" />
        {dispute.evidenceUrls.length ? (
          <View style={styles.readOnlyEvidence}>
            {dispute.evidenceUrls.map((url, index) => (
              <View key={`${url}-${index}`} style={styles.readOnlyEvidenceTile}>
                <Ionicons name={url.toLowerCase().includes(".pdf") ? "document-text-outline" : "image-outline"} size={22} color={colors.textSecondary} />
                <Text numberOfLines={1} style={styles.readOnlyEvidenceText}>{url.split("/").pop() || `Evidence ${index + 1}`}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyEvidenceText}>No evidence files were uploaded.</Text>
        )}
      </GlassCard>

      <Pressable style={styles.supportButton}>
        <Text style={styles.supportText}>Contact Support</Text>
      </Pressable>
    </>
  );
}

function StatusBadge({ dispute }: { dispute: DisputeCase }) {
  const config =
    dispute.status === "RESOLVED"
      ? { label: "✓ Resolved", color: colors.success }
      : dispute.status === "UNDER_REVIEW"
        ? { label: "👤 Admin Reviewing", color: "#5DADE2" }
        : { label: "🔍 Under Review", color: colors.warning };
  return (
    <View style={[styles.statusBadge, { borderColor: config.color, backgroundColor: `${config.color}22` }]}>
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ResolutionBanner({ resolution }: { resolution: NonNullable<DisputeCase["resolution"]> }) {
  const creator = resolution === "RELEASED_TO_CREATOR";
  return (
    <View style={[styles.resolutionBanner, creator ? styles.resolutionCreator : styles.resolutionBrand]}>
      <Text style={[styles.resolutionText, { color: creator ? colors.success : colors.error }]}>
        {creator ? "✓ Payment Released to You" : "✗ Payment Refunded to Brand"}
      </Text>
    </View>
  );
}

function EvidenceSourceSheet({
  visible,
  onClose,
  onPick
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (source: "library" | "document") => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Upload Evidence</Text>
          <Pressable onPress={() => onPick("library")} style={styles.sourceButton}>
            <Ionicons name="images-outline" size={22} color={colors.warning} />
            <Text style={styles.sourceText}>Choose Screenshots</Text>
          </Pressable>
          <Pressable onPress={() => onPick("document")} style={styles.sourceButton}>
            <Ionicons name="document-attach-outline" size={22} color={colors.warning} />
            <Text style={styles.sourceText}>Choose Files or PDFs</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ConfirmDisputeModal({ visible, loading, onClose, onConfirm }: { visible: boolean; loading: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <GlassCard style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Submit Dispute?</Text>
          <Text style={styles.confirmCopy}>This will lock the campaign payment until resolved. An Admin will contact both parties within 3-7 business days.</Text>
          <View style={styles.confirmActions}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable disabled={loading} onPress={onConfirm} style={[styles.confirmButton, loading ? styles.submitButtonDisabled : null]}>
              <Text style={styles.confirmButtonText}>{loading ? "Submitting..." : "Submit Dispute"}</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

function reasonLabel(reason: DisputeReason) {
  return disputeReasons.find((item) => item.value === reason)?.title ?? "Other issue";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    gap: 16,
    paddingBottom: 122
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26
  },
  stateEmoji: {
    fontSize: 44,
    marginBottom: 12
  },
  stateTitle: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center"
  },
  caseNumber: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8
  },
  stateCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10
  },
  stateButton: {
    marginTop: 24
  },
  warningCard: {
    borderColor: colors.warning,
    padding: 18,
    gap: 8
  },
  warningTitle: {
    color: colors.warning,
    fontSize: 17,
    fontWeight: "900"
  },
  warningCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  warningStrong: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  sectionCard: {
    padding: 20,
    gap: 14
  },
  labelBlock: {
    gap: 4
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  reasonList: {
    gap: 10
  },
  reasonRow: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 13
  },
  reasonRowSelected: {
    borderColor: colors.primarySoft,
    backgroundColor: "rgba(91,79,233,0.12)"
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  radioSelected: {
    borderColor: colors.primarySoft
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primarySoft
  },
  reasonCopy: {
    flex: 1
  },
  reasonTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19
  },
  reasonDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  descriptionInput: {
    minHeight: 128,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: colors.textPrimary,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
    textAlignVertical: "top"
  },
  counter: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "right"
  },
  counterWarning: {
    color: colors.warning
  },
  uploadArea: {
    minHeight: 150,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.warning,
    backgroundColor: "rgba(217,154,43,0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18
  },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10
  },
  uploadCopy: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5
  },
  evidenceList: {
    gap: 10
  },
  evidenceTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 10
  },
  evidencePreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(217,154,43,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  evidenceImage: {
    width: "100%",
    height: "100%"
  },
  evidenceMeta: {
    flex: 1,
    gap: 7
  },
  evidenceName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.warning
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  retryText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "900"
  },
  uploadedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  addEvidenceButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.warning,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  addEvidenceText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900"
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "800"
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.borderGlass,
    backgroundColor: "rgba(11,11,20,0.96)",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center"
  },
  submitButtonDisabled: {
    opacity: 0.5
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  caseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  caseLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  caseId: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 3
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "900"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderGlass,
    paddingTop: 12
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800"
  },
  infoValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  resolutionBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12
  },
  resolutionCreator: {
    borderColor: colors.success,
    backgroundColor: "rgba(73,160,120,0.12)"
  },
  resolutionBrand: {
    borderColor: colors.error,
    backgroundColor: "rgba(224,122,95,0.12)"
  },
  resolutionText: {
    fontSize: 13,
    fontWeight: "900"
  },
  adminNotes: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.borderGlass,
    padding: 13,
    gap: 6
  },
  adminNotesTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  adminNotesText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  readOnlyEvidence: {
    gap: 10
  },
  readOnlyEvidenceTile: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12
  },
  readOnlyEvidenceText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800"
  },
  emptyEvidenceText: {
    color: colors.textSecondary,
    fontSize: 13
  },
  supportButton: {
    alignItems: "center",
    paddingVertical: 10
  },
  supportText: {
    color: colors.primarySoft,
    fontSize: 14,
    fontWeight: "900"
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.58)"
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    padding: 22,
    paddingBottom: 30,
    gap: 14
  },
  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900"
  },
  sourceButton: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14
  },
  sourceText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900"
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.62)",
    padding: 20
  },
  confirmCard: {
    gap: 13
  },
  confirmTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900"
  },
  confirmCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "900"
  },
  confirmButton: {
    flex: 1.3,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center"
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  }
});
