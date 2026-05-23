import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ShippingAddressModal } from "@/components/campaigns/ShippingAddressModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import {
  ActiveCampaignDetail,
  DeliverableStatus,
  useActiveCampaignDetail,
  useConfirmProductReceipt
} from "@/lib/hooks/useActiveCampaigns";
import { colors } from "@/lib/theme";

export default function ActiveCampaignDetailRoute() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const { data: campaign, isLoading, isError, refetch } = useActiveCampaignDetail(campaignId);
  const [addressOpen, setAddressOpen] = useState(false);
  const [confirmReceiptOpen, setConfirmReceiptOpen] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const confirmReceipt = useConfirmProductReceipt();

  const gifting = campaign ? isGifting(campaign.compensationType) : false;
  const latestDeliverable = campaign?.deliverables[0];
  const action = useMemo(() => (campaign ? getPrimaryAction(campaign) : null), [campaign]);

  const confirmProductReceipt = async () => {
    if (!campaign?.deliverableId) return;
    await confirmReceipt.mutateAsync({ campaignId: campaign.campaignId, deliverableId: campaign.deliverableId });
    setConfirmReceiptOpen(false);
  };

  if (isLoading) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primarySoft} />
        </View>
      </ScreenShell>
    );
  }

  if (isError || !campaign) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={32} color={colors.error} />
          </View>
          <Text style={styles.errorTitle}>Failed to load campaign</Text>
          <Text style={styles.errorCopy}>The campaign details could not be loaded right now.</Text>
          <PrimaryButton label="Try again" onPress={() => refetch()} style={styles.errorButton} />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Campaign Details" showBack />

          <GlassCard style={styles.heroCard}>
            <Text style={styles.brandName}>{campaign.brandName}</Text>
            <Text style={styles.title}>{campaign.title}</Text>
            <StatusStepper deliverableStatus={campaign.deliverableStatus} paymentStatus={campaign.paymentStatus} />
            <SlaCountdown deadline={campaign.slaDeadline} large />
          </GlassCard>

          {gifting ? (
            <PhysicalGiftingSection
              campaign={campaign}
              onEditAddress={() => setAddressOpen(true)}
              onConfirmReceipt={() => setConfirmReceiptOpen(true)}
              confirming={confirmReceipt.isPending}
            />
          ) : null}

          <GlassCard style={styles.sectionCard}>
            <Pressable style={styles.sectionHeader} onPress={() => setBriefExpanded((value) => !value)}>
              <Text style={styles.sectionTitle}>Campaign Brief</Text>
              <Ionicons name={briefExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
            </Pressable>
            <Text numberOfLines={briefExpanded ? undefined : 3} style={styles.bodyText}>
              {campaign.description || "Campaign brief will appear here once the brand shares the full instructions."}
            </Text>
            {!briefExpanded ? <Text style={styles.linkText}>Show more</Text> : null}
            {campaign.keyRequirements.length ? (
              <View style={styles.bulletList}>
                {campaign.keyRequirements.map((requirement) => (
                  <View key={requirement} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What to Create</Text>
            <View style={styles.requirementList}>
              {campaign.deliverableRequirements.length ? (
                campaign.deliverableRequirements.map((item) => (
                  <View key={`${item.contentType}-${item.description}`} style={styles.requirementRow}>
                    <View style={styles.requirementIcon}>
                      <Text style={styles.requirementIconText}>{contentIcon(item.contentType)}</Text>
                    </View>
                    <View style={styles.requirementCopy}>
                      <Text style={styles.requirementTitle}>{item.contentType}</Text>
                      <Text style={styles.requirementDescription}>{item.description}</Text>
                    </View>
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>× {item.quantity}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.bodyText}>Deliverable requirements will be confirmed by the brand.</Text>
              )}
            </View>
            {campaign.slaTerms ? <Text style={styles.slaTerms}>Submit all content within {campaign.slaTerms} days of approval</Text> : null}
            {campaign.postingInstructions ? <Text style={styles.instructions}>{campaign.postingInstructions}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Your Submissions</Text>
            {!latestDeliverable ? (
              <View style={styles.submissionEmpty}>
                <Ionicons name="cloud-upload-outline" size={26} color={colors.primarySoft} />
                <Text style={styles.emptySubmissionTitle}>No submissions yet</Text>
                <Text style={styles.emptySubmissionCopy}>
                  {isUploadUnlocked(campaign) ? "Upload the required content when you are ready." : "Confirm product receipt to unlock content submission."}
                </Text>
                {isUploadUnlocked(campaign) ? <PrimaryButton label="Upload Content" onPress={() => goToActiveRoute(campaign.campaignId, "upload")} style={styles.inlineButton} /> : null}
              </View>
            ) : (
              <SubmissionCard deliverable={latestDeliverable} campaignId={campaign.campaignId} />
            )}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Payout Details</Text>
            <PayoutRow label="Gross amount" value={formatCurrency(campaign.creatorPayout)} />
            <PayoutRow label="Platform fee (10%)" value={`-${formatCurrency(campaign.platformFee)}`} muted />
            <View style={styles.divider} />
            <PayoutRow label="Net payout" value={formatCurrency(campaign.creatorNetPayout)} highlight />
            <View style={styles.paymentStatusRow}>
              <Text style={styles.paymentLabel}>Payment status</Text>
              <Text style={[styles.paymentValue, { color: campaign.paymentStatus === "PAID" ? colors.success : colors.warning }]}>{paymentLabel(campaign.paymentStatus)}</Text>
            </View>
            {campaign.paymentStatus === "PAID" ? (
              <Text style={styles.transactionText}>
                {campaign.transactionReference ? `Reference ${campaign.transactionReference}` : "Payment completed"}
                {campaign.paidAt ? ` • ${formatDate(campaign.paidAt)}` : ""}
              </Text>
            ) : null}
          </GlassCard>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable onPress={() => goToActiveRoute(campaign.campaignId, "dispute")} style={styles.disputeButton}>
            <Text style={styles.disputeText}>Raise Dispute</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={action?.disabled}
            onPress={action?.onPress ? () => action.onPress(campaign.campaignId) : undefined}
            style={[styles.primaryAction, action?.disabled ? styles.primaryActionDisabled : null]}
          >
            <Text style={styles.primaryActionText}>{action?.label}</Text>
          </Pressable>
        </View>

        <ShippingAddressModal visible={addressOpen} campaignId={campaign.campaignId} initialAddress={campaign.shippingAddress} onClose={() => setAddressOpen(false)} />
        <ConfirmReceiptModal
          visible={confirmReceiptOpen}
          loading={confirmReceipt.isPending}
          disabled={!campaign.deliverableId}
          onClose={() => setConfirmReceiptOpen(false)}
          onConfirm={confirmProductReceipt}
        />
      </View>
    </ScreenShell>
  );
}

function PhysicalGiftingSection({
  campaign,
  confirming,
  onEditAddress,
  onConfirmReceipt
}: {
  campaign: ActiveCampaignDetail;
  confirming: boolean;
  onEditAddress: () => void;
  onConfirmReceipt: () => void;
}) {
  if (campaign.productReceiptConfirmed) {
    return (
      <GlassCard style={[styles.sectionCard, styles.greenBorder]}>
        <Text style={styles.receivedTitle}>✓ Product Received</Text>
        <Text style={styles.bodyText}>Content submission is unlocked. You can now upload your deliverables for brand review.</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={[styles.sectionCard, styles.amberBorder]}>
      <Text style={styles.sectionTitle}>📦 Product Delivery</Text>
      <Text style={styles.bodyText}>Your product is on its way. Once you receive it, confirm receipt to unlock content submission.</Text>
      {campaign.shippingAddress ? (
        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>Shipping address</Text>
          <Text style={styles.addressText}>
            {campaign.shippingAddress.street}, {campaign.shippingAddress.city}, {campaign.shippingAddress.state} {campaign.shippingAddress.pincode}, {campaign.shippingAddress.country}
          </Text>
          <Pressable onPress={onEditAddress}>
            <Text style={styles.linkText}>Edit</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.noAddressRow}>
          <Text style={styles.noAddressText}>⚠ No shipping address</Text>
          <Pressable onPress={onEditAddress} style={styles.addAddressButton}>
            <Text style={styles.addAddressText}>Add Address</Text>
          </Pressable>
        </View>
      )}
      <PrimaryButton label="I've Received My Product" loading={confirming} onPress={onConfirmReceipt} style={styles.receiptButton} />
    </GlassCard>
  );
}

function SubmissionCard({ deliverable, campaignId }: { deliverable: ActiveCampaignDetail["deliverables"][number]; campaignId: string }) {
  return (
    <View style={styles.submissionCard}>
      {deliverable.contentFiles.length ? (
        <View style={styles.thumbnailGrid}>
          {deliverable.contentFiles.slice(0, 4).map((file, index) => (
            <View key={`${file}-${index}`} style={styles.thumbnail}>
              <Ionicons name="image-outline" size={18} color={colors.textSecondary} />
              {index === 3 && deliverable.contentFiles.length > 4 ? <Text style={styles.moreFiles}>+{deliverable.contentFiles.length - 4}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}
      {deliverable.submittedAt ? <Text style={styles.submittedDate}>Submitted {relativeDate(deliverable.submittedAt)}</Text> : null}
      <StatusBadge status={deliverable.status} />
      {deliverable.status === "REVISION_REQUESTED" ? (
        <View style={styles.revisionBox}>
          <Text style={styles.revisionTitle}>Brand's feedback</Text>
          <Text style={styles.revisionText}>{deliverable.revisionNotes || "The brand requested updates to your submission."}</Text>
          <PrimaryButton label="Update Submission" onPress={() => goToActiveRoute(campaignId, "upload")} style={styles.inlineButton} />
        </View>
      ) : null}
      {deliverable.status === "APPROVED" ? <ContractStatusLine contractStatus={deliverable.contractStatus} campaignId={campaignId} /> : null}
    </View>
  );
}

function ContractStatusLine({ contractStatus, campaignId }: { contractStatus: string; campaignId: string }) {
  if (contractStatus === "COMPLETED") {
    return <Text style={[styles.contractLine, { color: colors.success }]}>✓ Contract complete — Payment processing</Text>;
  }
  if (contractStatus === "CREATOR_SIGNED") {
    return <Text style={[styles.contractLine, { color: colors.warning }]}>⏳ Awaiting brand signature</Text>;
  }
  return (
    <Pressable onPress={() => goToActiveRoute(campaignId, "contract")}>
      <Text style={[styles.contractLine, { color: colors.primarySoft }]}>📝 Contract ready to sign</Text>
    </Pressable>
  );
}

function ConfirmReceiptModal({
  visible,
  loading,
  disabled,
  onClose,
  onConfirm
}: {
  visible: boolean;
  loading: boolean;
  disabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <GlassCard style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Confirm Product Receipt</Text>
          <Text style={styles.bodyText}>By confirming, you acknowledge receiving the product and agree to create the required content.</Text>
          {disabled ? <Text style={styles.modalError}>No deliverable is available yet. Try again after the campaign setup finishes.</Text> : null}
          <View style={styles.confirmActions}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable disabled={disabled || loading} onPress={onConfirm} style={[styles.confirmButton, disabled || loading ? styles.primaryActionDisabled : null]}>
              <Text style={styles.confirmButtonText}>{loading ? "Confirming..." : "Confirm Receipt"}</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

function StatusStepper({ deliverableStatus, paymentStatus }: { deliverableStatus: DeliverableStatus; paymentStatus: string }) {
  const submitted = deliverableStatus !== "NOT_SUBMITTED";
  const approved = deliverableStatus === "APPROVED";
  const paid = paymentStatus === "PAID";
  const steps = [
    { label: "Approved", state: "done" },
    { label: "In Progress", state: submitted ? "done" : "current" },
    { label: "Under Review", state: approved ? "done" : submitted ? "current" : "todo" },
    { label: "Paid", state: paid ? "done" : approved ? "current" : "todo" }
  ];

  return (
    <View style={styles.stepper}>
      {steps.map((step, index) => {
        const done = step.state === "done";
        const current = step.state === "current";
        const color = done ? colors.success : current ? colors.primarySoft : colors.textFaint;
        return (
          <View key={step.label} style={styles.stepItem}>
            <View style={styles.stepTrackRow}>
              <View style={[styles.stepDot, { borderColor: color, backgroundColor: done ? colors.success : current ? colors.primary : colors.surfaceSolid }]}>
                {done ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : <View style={[styles.stepInner, { backgroundColor: color }]} />}
              </View>
              {index < steps.length - 1 ? <View style={[styles.stepLine, done ? styles.stepLineDone : null]} /> : null}
            </View>
            <Text numberOfLines={1} style={[styles.stepLabel, { color }]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SlaCountdown({ deadline, large }: { deadline?: string | null; large?: boolean }) {
  const meta = getSlaMeta(deadline);
  return (
    <View style={[styles.slaPill, { borderColor: meta.color, backgroundColor: meta.background }, large ? styles.slaPillLarge : null]}>
      <Text style={[styles.slaText, { color: meta.color }, large ? styles.slaTextLarge : null]}>{meta.label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: DeliverableStatus }) {
  const config =
    status === "APPROVED"
      ? { label: "✓ Approved", color: colors.success }
      : status === "REVISION_REQUESTED"
        ? { label: "✏ Revision Requested", color: colors.error }
        : { label: "⏳ Under Review", color: colors.warning };
  return (
    <View style={[styles.statusBadge, { borderColor: config.color, backgroundColor: `${config.color}22` }]}>
      <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function PayoutRow({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <View style={styles.payoutRow}>
      <Text style={[styles.payoutLabel, muted ? styles.payoutMuted : null]}>{label}</Text>
      <Text style={[styles.payoutValue, highlight ? styles.payoutHighlight : null, muted ? styles.payoutMuted : null]}>{value}</Text>
    </View>
  );
}

function getPrimaryAction(campaign: ActiveCampaignDetail) {
  const latest = campaign.deliverables[0];
  if (!latest && isUploadUnlocked(campaign)) return { label: "Upload Content", disabled: false, onPress: (id: string) => goToActiveRoute(id, "upload") };
  if (!latest && !isUploadUnlocked(campaign)) return { label: "Awaiting Product", disabled: true };
  if (latest?.status === "REVISION_REQUESTED") return { label: "Update Submission", disabled: false, onPress: (id: string) => goToActiveRoute(id, "upload") };
  if (latest?.status === "PENDING_REVIEW") return { label: "Awaiting Review", disabled: true };
  if (latest?.status === "APPROVED" && latest.contractStatus !== "COMPLETED" && latest.contractStatus !== "CREATOR_SIGNED") {
    return { label: "Sign Contract", disabled: false, onPress: (id: string) => goToActiveRoute(id, "contract") };
  }
  if (latest?.status === "APPROVED" && campaign.paymentStatus !== "PAID") return { label: "Payment Processing", disabled: true };
  return { label: "Completed", disabled: true };
}

function isUploadUnlocked(campaign: ActiveCampaignDetail) {
  return !isGifting(campaign.compensationType) || campaign.productReceiptConfirmed;
}

function isGifting(type: string) {
  return type === "GIFTING" || type === "MIXED";
}

function goToActiveRoute(campaignId: string, suffix: "upload" | "contract" | "dispute") {
  router.push(`/campaigns/active/${campaignId}/${suffix}` as any);
}

function contentIcon(contentType: string) {
  const value = contentType.toLowerCase();
  if (value.includes("reel") || value.includes("video")) return "🎬";
  if (value.includes("story")) return "📱";
  if (value.includes("post") || value.includes("photo")) return "📸";
  return "✨";
}

function getSlaMeta(deadline?: string | null) {
  if (!deadline) return { label: "⏱ SLA pending", color: colors.textSecondary, background: "rgba(255,255,255,0.05)" };
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: "❌ SLA Breached", color: colors.error, background: "rgba(224,122,95,0.12)" };
  if (days < 3) return { label: `🔴 ${days} days left — Urgent`, color: colors.error, background: "rgba(224,122,95,0.12)" };
  if (days <= 7) return { label: `⚠ ${days} days left`, color: colors.warning, background: "rgba(217,154,43,0.12)" };
  return { label: `⏱ ${days} days left`, color: colors.success, background: "rgba(73,160,120,0.12)" };
}

function paymentLabel(status: string) {
  if (status === "PAID") return "Paid";
  if (status === "PROCESSING") return "Processing";
  return "Pending";
}

function relativeDate(value: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    gap: 16,
    paddingBottom: 132
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(224,122,95,0.12)",
    marginBottom: 16
  },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900"
  },
  errorCopy: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8
  },
  errorButton: {
    marginTop: 22
  },
  heroCard: {
    padding: 20,
    gap: 16
  },
  brandName: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900"
  },
  sectionCard: {
    padding: 20,
    gap: 14
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900"
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22
  },
  linkText: {
    color: colors.primarySoft,
    fontSize: 13,
    fontWeight: "900"
  },
  bulletList: {
    gap: 9
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primarySoft,
    marginTop: 8
  },
  bulletText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  requirementList: {
    gap: 10
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12
  },
  requirementIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.14)"
  },
  requirementIconText: {
    fontSize: 17
  },
  requirementCopy: {
    flex: 1
  },
  requirementTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900"
  },
  requirementDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2
  },
  quantityBadge: {
    borderRadius: 999,
    backgroundColor: "rgba(91,79,233,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  quantityText: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "900"
  },
  slaTerms: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "800"
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  amberBorder: {
    borderColor: colors.warning
  },
  greenBorder: {
    borderColor: colors.success
  },
  receivedTitle: {
    color: colors.success,
    fontSize: 18,
    fontWeight: "900"
  },
  addressBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    gap: 6
  },
  addressLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  addressText: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  },
  noAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  noAddressText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900"
  },
  addAddressButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  addAddressText: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "900"
  },
  receiptButton: {
    marginTop: 2
  },
  submissionEmpty: {
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 18
  },
  emptySubmissionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900"
  },
  emptySubmissionCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  },
  inlineButton: {
    marginTop: 4
  },
  submissionCard: {
    gap: 12
  },
  thumbnailGrid: {
    flexDirection: "row",
    gap: 8
  },
  thumbnail: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center"
  },
  moreFiles: {
    position: "absolute",
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900"
  },
  submittedDate: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "900"
  },
  revisionBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: "rgba(217,154,43,0.12)",
    padding: 14,
    gap: 8
  },
  revisionTitle: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900"
  },
  revisionText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20
  },
  contractLine: {
    fontSize: 13,
    fontWeight: "900"
  },
  payoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16
  },
  payoutLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700"
  },
  payoutValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900"
  },
  payoutMuted: {
    color: colors.textMuted
  },
  payoutHighlight: {
    color: colors.primarySoft,
    fontSize: 18
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGlass
  },
  paymentStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  paymentLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800"
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: "900"
  },
  transactionText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18
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
  disputeButton: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 4
  },
  disputeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "900"
  },
  primaryAction: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  primaryActionDisabled: {
    opacity: 0.5
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4
  },
  stepItem: {
    flex: 1
  },
  stepTrackRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  stepInner: {
    width: 7,
    height: 7,
    borderRadius: 4
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.10)"
  },
  stepLineDone: {
    backgroundColor: colors.success
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "900"
  },
  slaPill: {
    alignSelf: "flex-start",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  slaPillLarge: {
    alignSelf: "stretch",
    alignItems: "center"
  },
  slaText: {
    fontSize: 12,
    fontWeight: "900"
  },
  slaTextLarge: {
    fontSize: 15
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.62)",
    padding: 20
  },
  confirmCard: {
    gap: 14
  },
  confirmTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900"
  },
  modalError: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "800"
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
    flex: 1.4,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  }
});
