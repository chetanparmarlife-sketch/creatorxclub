import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ActiveCampaignDetail, useActiveCampaignDetail, useSubmitDeliverable } from "@/lib/hooks/useActiveCampaigns";
import { getSupabaseClient, supabaseUrl } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

type UploadMedia = {
  id: string;
  uri: string;
  fileName: string;
  mimeType: string;
  type: "image" | "video";
  duration?: number | null;
  uploadedUrl?: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

type FormErrors = {
  files?: string;
  caption?: string;
  hashtags?: string;
  checklist?: string;
  submit?: string;
};

const maxFiles = 10;
const maxFileSize = 50 * 1024 * 1024;
const checklistItems = [
  "My content matches the campaign brief",
  "I've included all required hashtags",
  "Caption is ready to post verbatim",
  "Content meets the quality guidelines"
];

export default function DeliverableUploadRoute() {
  const { campaignId: rawCampaignId } = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = Array.isArray(rawCampaignId) ? rawCampaignId[0] : rawCampaignId;
  const user = useAuthStore((state) => state.user);
  const campaignQuery = useActiveCampaignDetail(campaignId);
  const submitDeliverable = useSubmitDeliverable();

  const campaign = campaignQuery.data;
  const revisionDeliverable = campaign?.deliverables.find((item) => item.status === "REVISION_REQUESTED");
  const mode = revisionDeliverable ? "revision" : "new";
  const [media, setMedia] = useState<UploadMedia[]>(() => existingMedia(revisionDeliverable?.contentFiles));
  const [caption, setCaption] = useState(revisionDeliverable?.captions ?? "");
  const [hashtagText, setHashtagText] = useState((revisionDeliverable?.hashtags ?? []).join(" "));
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [mediaSheetOpen, setMediaSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prefilledDeliverableId, setPrefilledDeliverableId] = useState<string | null>(null);

  const hashtags = useMemo(() => parseHashtags(hashtagText), [hashtagText]);
  const allChecked = checklistItems.every((item) => checkedItems[item]);
  const anyUploading = media.some((item) => item.uploading);
  const anyFailed = media.some((item) => item.error);
  const uploadedUrls = media.map((item) => item.uploadedUrl).filter(Boolean) as string[];
  const canSubmit = media.length > 0 && !anyUploading && !anyFailed && caption.trim().length > 0 && hashtags.length > 0 && allChecked;

  useEffect(() => {
    if (!revisionDeliverable || prefilledDeliverableId === revisionDeliverable.id) return;
    setMedia(existingMedia(revisionDeliverable.contentFiles));
    setCaption(revisionDeliverable.captions ?? "");
    setHashtagText((revisionDeliverable.hashtags ?? []).join(" "));
    setPrefilledDeliverableId(revisionDeliverable.id);
  }, [prefilledDeliverableId, revisionDeliverable]);

  if (campaignQuery.isLoading) {
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
          <Ionicons name="cloud-offline-outline" size={34} color={colors.error} />
          <Text style={styles.blockTitle}>Could not load campaign</Text>
          <Text style={styles.blockCopy}>Please try again before uploading deliverables.</Text>
          <PrimaryButton label="Try Again" onPress={() => campaignQuery.refetch()} style={styles.blockButton} />
        </View>
      </ScreenShell>
    );
  }

  if (isGifting(campaign) && !campaign.productReceiptConfirmed) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <Text style={styles.blockEmoji}>📦</Text>
          <Text style={styles.blockTitle}>Confirm Product Receipt First</Text>
          <Text style={styles.blockCopy}>You need to confirm receiving the product before uploading your content.</Text>
          <PrimaryButton label="Go Back" onPress={() => router.back()} style={styles.blockButton} />
        </View>
      </ScreenShell>
    );
  }

  const slaBreached = campaign.slaDeadline ? Date.now() > new Date(campaign.slaDeadline).getTime() : false;

  const openPicker = async (source: "camera" | "library") => {
    setMediaSheetOpen(false);
    const remaining = maxFiles - media.length;
    if (remaining <= 0) return;

    const permission =
      source === "camera" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.82, videoQuality: ImagePicker.UIImagePickerControllerQualityType.High })
        : await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.82,
            selectionLimit: remaining,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.High
          });

    if (result.canceled) return;
    const assets = result.assets.slice(0, remaining);
    const invalid = assets.some((asset) => !isAcceptedAsset(asset));
    const tooLarge = assets.some((asset) => typeof asset.fileSize === "number" && asset.fileSize > maxFileSize);
    if (invalid || tooLarge) {
      setErrors((current) => ({ ...current, files: invalid ? "Accepted files: jpg, png, mp4, mov." : "Each file must be 50MB or less." }));
      return;
    }

    setErrors((current) => ({ ...current, files: undefined }));
    const next = assets.map((asset) => toUploadMedia(asset));
    setMedia((current) => [...current, ...next]);
    await Promise.all(next.map((item) => uploadMedia(item, campaign.campaignId, user?.id ?? "anonymous")));
  };

  const uploadMedia = async (item: UploadMedia, activeCampaignId: string, userId: string) => {
    try {
      setMediaProgress(item.id, 0.22, true);
      const supabase = getSupabaseClient();
      const response = await fetch(item.uri);
      const blob = await response.blob();
      setMediaProgress(item.id, 0.68, true);
      const safeName = item.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `deliverables/${userId}/${activeCampaignId}/${Date.now()}_${safeName}`;
      const { data, error } = await supabase.storage.from("deliverables").upload(path, blob, {
        contentType: item.mimeType,
        upsert: true
      });
      if (error) throw error;
      const uploadedUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/deliverables/${data.path}`;
      setMedia((current) => current.map((entry) => (entry.id === item.id ? { ...entry, uploadedUrl, progress: 1, uploading: false, error: undefined } : entry)));
    } catch {
      setMedia((current) => current.map((entry) => (entry.id === item.id ? { ...entry, uploading: false, error: "Upload failed" } : entry)));
    }
  };

  const retryUpload = (item: UploadMedia) => {
    setMedia((current) => current.map((entry) => (entry.id === item.id ? { ...entry, error: undefined, uploading: true, progress: 0 } : entry)));
    uploadMedia(item, campaign.campaignId, user?.id ?? "anonymous");
  };

  const setMediaProgress = (id: string, progress: number, uploading: boolean) => {
    setMedia((current) => current.map((entry) => (entry.id === id ? { ...entry, progress, uploading } : entry)));
  };

  const removeMedia = (id: string) => {
    setMedia((current) => current.filter((item) => item.id !== id));
  };

  const toggleCheck = (label: string) => {
    setCheckedItems((current) => ({ ...current, [label]: !current[label] }));
    setErrors((current) => ({ ...current, checklist: undefined }));
  };

  const removeHashtag = (tag: string) => {
    setHashtagText((current) => parseHashtags(current).filter((item) => item !== tag).join(" "));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!media.length) nextErrors.files = "Add at least one content file.";
    if (anyUploading) nextErrors.files = "Please wait for all uploads to finish.";
    if (anyFailed) nextErrors.files = "Retry or remove failed uploads before submitting.";
    if (uploadedUrls.length !== media.length) nextErrors.files = "All files must upload successfully.";
    if (!caption.trim()) nextErrors.caption = "Caption is required.";
    if (!hashtags.length) nextErrors.hashtags = "Add at least one hashtag.";
    if (!allChecked) nextErrors.checklist = "Complete the submission checklist.";
    setErrors(nextErrors);
    return !Object.keys(nextErrors).length;
  };

  const startSubmit = () => {
    if (validate()) setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (!validate()) return;
    try {
      await submitDeliverable.mutateAsync({
        campaignId: campaign.campaignId,
        applicationId: campaign.applicationId,
        deliverableId: mode === "revision" ? revisionDeliverable?.id : null,
        contentFiles: uploadedUrls,
        captions: caption.trim(),
        hashtags,
        postingInstructions: campaign.postingInstructions
      });
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (error) {
      setConfirmOpen(false);
      const message = deliverableErrorMessage(error);
      setErrors((current) => ({ ...current, submit: message }));
      if (message.includes("Product receipt")) {
        router.replace(`/campaigns/active/${campaign.campaignId}` as any);
      }
    }
  };

  return (
    <ScreenShell>
      <View style={styles.root}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={120}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ScreenHeader title={mode === "revision" ? "Revise Submission" : "Upload Content"} subtitle={mode === "revision" ? "Revision mode" : "New Submission"} showBack />

          {mode === "revision" ? (
            <GlassCard style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Brand's feedback</Text>
              <Text style={styles.feedbackText}>{revisionDeliverable?.revisionNotes || "Please update your content and resubmit for review."}</Text>
            </GlassCard>
          ) : null}

          {slaBreached ? (
            <View style={styles.slaWarning}>
              <Text style={styles.slaWarningText}>⚠ SLA deadline has passed. You can still submit but this may affect your standing.</Text>
            </View>
          ) : null}

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Your Content *" />
            {media.length === 0 ? (
              <Pressable onPress={() => setMediaSheetOpen(true)} style={styles.uploadArea}>
                <View style={styles.uploadIcon}>
                  <Ionicons name="cloud-upload-outline" size={28} color={colors.primarySoft} />
                </View>
                <Text style={styles.uploadTitle}>Upload photos or videos</Text>
                <Text style={styles.uploadCopy}>jpg, png, mp4, mov • up to 10 files • 50MB each</Text>
              </Pressable>
            ) : (
              <View style={styles.mediaGrid}>
                {media.map((item) => (
                  <MediaTile key={item.id} item={item} onRemove={() => removeMedia(item.id)} onRetry={() => retryUpload(item)} />
                ))}
                {media.length < maxFiles ? (
                  <Pressable onPress={() => setMediaSheetOpen(true)} style={styles.addMoreTile}>
                    <Ionicons name="add" size={24} color={colors.textSecondary} />
                    <Text style={styles.addMoreText}>Add more</Text>
                  </Pressable>
                ) : null}
              </View>
            )}
            {errors.files ? <Text style={styles.errorText}>{errors.files}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Caption *" hint="Write the caption exactly as you'll post it" />
            <TextInput
              value={caption}
              onChangeText={(value) => {
                setCaption(value);
                setErrors((current) => ({ ...current, caption: undefined }));
              }}
              multiline
              placeholder="Write your caption here..."
              placeholderTextColor={colors.textFaint}
              style={styles.captionInput}
            />
            <Text style={styles.counter}>{caption.length} characters</Text>
            {errors.caption ? <Text style={styles.errorText}>{errors.caption}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Hashtags *" hint="Add hashtags separated by spaces or commas" />
            <TextInput
              value={hashtagText}
              onChangeText={(value) => {
                setHashtagText(value);
                setErrors((current) => ({ ...current, hashtags: undefined }));
              }}
              autoCapitalize="none"
              placeholder="#CreatorX #BrandPartner"
              placeholderTextColor={colors.textFaint}
              style={styles.hashtagInput}
            />
            {hashtags.length ? (
              <View style={styles.hashtagWrap}>
                {hashtags.map((tag) => (
                  <Pressable key={tag} onPress={() => removeHashtag(tag)} style={styles.hashtagChip}>
                    <Text style={styles.hashtagText}>{tag}</Text>
                    <Ionicons name="close" size={12} color="#FFFFFF" />
                  </Pressable>
                ))}
              </View>
            ) : null}
            {errors.hashtags ? <Text style={styles.errorText}>{errors.hashtags}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Pressable style={styles.instructionsHeader} onPress={() => setInstructionsExpanded((value) => !value)}>
              <SectionLabel title="Posting Instructions from Brand" />
              <Ionicons name={instructionsExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
            </Pressable>
            <View style={styles.instructionsCard}>
              <Text numberOfLines={instructionsExpanded ? undefined : 3} style={styles.instructionsText}>
                {campaign.postingInstructions || "No additional posting instructions have been added yet."}
              </Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <SectionLabel title="Before you submit" />
            <View style={styles.checklist}>
              {checklistItems.map((item) => {
                const checked = Boolean(checkedItems[item]);
                return (
                  <Pressable key={item} onPress={() => toggleCheck(item)} style={styles.checkRow}>
                    <View style={[styles.checkCircle, checked ? styles.checkCircleActive : null]}>
                      {checked ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                    </View>
                    <Text style={[styles.checkText, checked ? styles.checkTextActive : null]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.checklist ? <Text style={styles.errorText}>{errors.checklist}</Text> : null}
            {errors.submit ? <Text style={styles.errorText}>{errors.submit}</Text> : null}
          </GlassCard>
        </KeyboardAwareScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.fileSummary}>
            <Text style={styles.fileSummaryText}>{uploadedUrls.length} files uploaded</Text>
            {anyUploading ? <Text style={styles.fileSummaryWarning}>Uploads still running</Text> : null}
          </View>
          <Pressable disabled={!canSubmit || submitDeliverable.isPending} onPress={startSubmit} style={[styles.submitButton, !canSubmit ? styles.submitDisabled : null]}>
            <Text style={styles.submitButtonText}>{mode === "revision" ? "Submit Revision" : "Submit for Review"}</Text>
          </Pressable>
        </View>

        <MediaSourceSheet visible={mediaSheetOpen} onClose={() => setMediaSheetOpen(false)} onPick={openPicker} />
        <ConfirmSubmitSheet
          visible={confirmOpen}
          loading={submitDeliverable.isPending}
          campaign={campaign}
          fileCount={uploadedUrls.length}
          mode={mode}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmSubmit}
        />
        <SuccessSheet visible={successOpen} mode={mode} campaignId={campaign.campaignId} />
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

function MediaTile({ item, onRemove, onRetry }: { item: UploadMedia; onRemove: () => void; onRetry: () => void }) {
  return (
    <View style={styles.mediaTile}>
      {item.type === "image" ? <Image source={{ uri: item.uri }} style={styles.mediaImage} /> : <View style={styles.videoPlaceholder} />}
      {item.type === "video" ? (
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={18} color="#FFFFFF" />
          {item.duration ? <Text style={styles.durationText}>{formatDuration(item.duration)}</Text> : null}
        </View>
      ) : null}
      <Pressable onPress={onRemove} style={styles.removeMediaButton}>
        <Ionicons name="close" size={13} color={colors.textPrimary} />
      </Pressable>
      <View style={styles.uploadStatus}>
        {item.uploading ? (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(item.progress * 100)}%` }]} />
            </View>
            <Text style={styles.uploadingText}>{Math.round(item.progress * 100)}%</Text>
          </>
        ) : item.error ? (
          <Pressable onPress={onRetry} style={styles.retryButton}>
            <Ionicons name="close-circle" size={13} color={colors.error} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        ) : (
          <View style={styles.completePill}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.completeText}>Uploaded</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function MediaSourceSheet({
  visible,
  onClose,
  onPick
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (source: "camera" | "library") => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Add content</Text>
          <Pressable onPress={() => onPick("camera")} style={styles.sourceButton}>
            <Ionicons name="camera-outline" size={22} color={colors.primarySoft} />
            <Text style={styles.sourceText}>Take Photo/Video</Text>
          </Pressable>
          <Pressable onPress={() => onPick("library")} style={styles.sourceButton}>
            <Ionicons name="images-outline" size={22} color={colors.primarySoft} />
            <Text style={styles.sourceText}>Choose from Library</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ConfirmSubmitSheet({
  visible,
  loading,
  campaign,
  fileCount,
  mode,
  onClose,
  onConfirm
}: {
  visible: boolean;
  loading: boolean;
  campaign: ActiveCampaignDetail;
  fileCount: number;
  mode: "new" | "revision";
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Submit for Review?</Text>
          <Text style={styles.sheetCopy}>Once submitted, the brand will review your content. You cannot edit unless they request revisions.</Text>
          <View style={styles.confirmSummary}>
            <SummaryLine icon="checkmark" label={`${fileCount} media files attached`} />
            <SummaryLine icon="document-text-outline" label={mode === "revision" ? "Revision submission" : "New content submission"} />
            <SummaryLine icon="time-outline" label={campaign.slaDeadline ? `Due ${formatDate(campaign.slaDeadline)}` : "SLA deadline pending"} warning />
          </View>
          <View style={styles.sheetActions}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} disabled={loading} style={[styles.confirmButton, loading ? styles.submitDisabled : null]}>
              <Text style={styles.confirmText}>{loading ? "Submitting..." : "Submit"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SuccessSheet({ visible, mode, campaignId }: { visible: boolean; mode: "new" | "revision"; campaignId: string }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{mode === "revision" ? "✓ Revision Submitted!" : "🎉 Content Submitted!"}</Text>
          <Text style={styles.sheetCopy}>
            {mode === "revision"
              ? "Your updated content is now under review."
              : "The brand will review within the SLA window. You'll be notified of their decision."}
          </Text>
          <PrimaryButton label="View Campaign" onPress={() => router.replace(`/campaigns/active/${campaignId}` as any)} />
        </View>
      </View>
    </Modal>
  );
}

function SummaryLine({ icon, label, warning }: { icon: keyof typeof Ionicons.glyphMap; label: string; warning?: boolean }) {
  return (
    <View style={styles.summaryLine}>
      <Ionicons name={icon} size={16} color={warning ? colors.warning : colors.primarySoft} />
      <Text style={[styles.summaryText, warning ? { color: colors.warning } : null]}>{label}</Text>
    </View>
  );
}

function isGifting(campaign: ActiveCampaignDetail) {
  return campaign.compensationType === "GIFTING" || campaign.compensationType === "MIXED";
}

function existingMedia(files?: string[]): UploadMedia[] {
  return (files ?? []).map((url, index) => ({
    id: `existing-${index}`,
    uri: url,
    fileName: url.split("/").pop() ?? `deliverable-${index + 1}`,
    mimeType: isVideoUrl(url) ? "video/mp4" : "image/jpeg",
    type: isVideoUrl(url) ? "video" : "image",
    uploadedUrl: url,
    progress: 1,
    uploading: false
  }));
}

function toUploadMedia(asset: ImagePicker.ImagePickerAsset): UploadMedia {
  const fileName = asset.fileName ?? `deliverable-${Date.now()}${asset.type === "video" ? ".mp4" : ".jpg"}`;
  const mimeType = asset.mimeType ?? (asset.type === "video" ? "video/mp4" : "image/jpeg");
  return {
    id: `${Date.now()}-${asset.assetId ?? asset.uri}`,
    uri: asset.uri,
    fileName,
    mimeType,
    type: asset.type === "video" ? "video" : "image",
    duration: asset.duration,
    progress: 0,
    uploading: true
  };
}

function isAcceptedAsset(asset: ImagePicker.ImagePickerAsset) {
  const name = (asset.fileName ?? asset.uri).toLowerCase();
  return /\.(jpe?g|png|mp4|mov)$/i.test(name) || ["image/jpeg", "image/png", "video/mp4", "video/quicktime"].includes(asset.mimeType ?? "");
}

function isVideoUrl(url: string) {
  return /\.(mp4|mov)$/i.test(url);
}

function parseHashtags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    )
  );
}

function formatDuration(duration?: number | null) {
  if (!duration) return "";
  const totalSeconds = Math.round(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function deliverableErrorMessage(error: unknown) {
  const status = error instanceof AxiosError ? error.response?.status : undefined;
  if (status === 409) return "Deliverable already submitted. Redirecting to campaign detail.";
  if (status === 403) return "Product receipt required before uploading.";
  if (status === 422) return "SLA breached. You can retry, but this may affect your standing.";
  return "Upload failed, please try again.";
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    gap: 16,
    paddingBottom: 132
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26
  },
  blockEmoji: {
    fontSize: 42,
    marginBottom: 12
  },
  blockTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center"
  },
  blockCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 9
  },
  blockButton: {
    marginTop: 24
  },
  sectionCard: {
    padding: 20,
    gap: 14
  },
  feedbackCard: {
    borderColor: colors.warning,
    padding: 18,
    gap: 8
  },
  feedbackTitle: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "900"
  },
  feedbackText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  slaWarning: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: "rgba(224,122,95,0.12)",
    padding: 14
  },
  slaWarningText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800"
  },
  labelBlock: {
    gap: 4,
    flex: 1
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
  uploadArea: {
    minHeight: 190,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primarySoft,
    backgroundColor: "rgba(91,79,233,0.08)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18
  },
  uploadIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.14)",
    marginBottom: 12
  },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900"
  },
  uploadCopy: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  mediaTile: {
    width: "48%",
    aspectRatio: 0.78,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.borderGlass
  },
  mediaImage: {
    width: "100%",
    height: "100%"
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: "rgba(91,79,233,0.20)"
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
    gap: 6
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900"
  },
  removeMediaButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,11,20,0.82)"
  },
  uploadStatus: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 10,
    backgroundColor: "rgba(11,11,20,0.80)",
    padding: 7
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.16)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#5DADE2"
  },
  uploadingText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  retryText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: "900"
  },
  completePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  completeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "900"
  },
  addMoreTile: {
    width: "48%",
    aspectRatio: 0.78,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderGlass,
    alignItems: "center",
    justifyContent: "center",
    gap: 7
  },
  addMoreText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  captionInput: {
    minHeight: 96,
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
    fontWeight: "700",
    textAlign: "right"
  },
  hashtagInput: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: colors.textPrimary,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "700"
  },
  hashtagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  hashtagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  hashtagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  instructionsCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.borderGlass,
    padding: 14
  },
  instructionsText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  checklist: {
    gap: 10
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: "center",
    justifyContent: "center"
  },
  checkCircleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  checkText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  },
  checkTextActive: {
    color: colors.textPrimary
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderGlass,
    backgroundColor: "rgba(11,11,20,0.96)",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18
  },
  fileSummary: {
    width: 116
  },
  fileSummaryText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900"
  },
  fileSummaryWarning: {
    color: colors.warning,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3
  },
  submitButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  submitDisabled: {
    opacity: 0.5
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
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
  sheetCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
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
  confirmSummary: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    gap: 12
  },
  summaryLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800"
  },
  sheetActions: {
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
    flex: 1.2,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  }
});
