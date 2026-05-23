import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { DigitalContract, useActiveCampaignDetail, useContract, useSignContract, UsageRightsSnapshot } from "@/lib/hooks/useActiveCampaigns";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function CreatorContractRoute() {
  const { campaignId: rawCampaignId } = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = Array.isArray(rawCampaignId) ? rawCampaignId[0] : rawCampaignId;
  const user = useAuthStore((state) => state.user);
  const campaignQuery = useActiveCampaignDetail(campaignId);
  const contractQuery = useContract(campaignId);
  const signContract = useSignContract();
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const campaign = campaignQuery.data;
  const contract = contractQuery.data;
  const notReady = contractQuery.error instanceof AxiosError && contractQuery.error.response?.status === 404;
  const loading = campaignQuery.isLoading || contractQuery.isLoading;
  const creatorName = user?.displayName || "Creator";
  const rights = useMemo(() => contract?.usageRightsSnapshot ?? campaign?.usageRights ?? {}, [campaign?.usageRights, contract?.usageRightsSnapshot]);
  const canSign = Boolean(signature.trim()) && agreed && Boolean(contract?.id) && !contract?.creatorSignature;

  const submitSignature = async () => {
    if (!contract?.id || !signature.trim()) return;
    try {
      await signContract.mutateAsync({ campaignId, contractId: contract.id, signature: signature.trim() });
      setConfirmOpen(false);
      setSuccessMessage("Contract signed! Awaiting brand countersignature.");
      setSignature("");
      setAgreed(false);
    } catch {
      setConfirmOpen(false);
      setErrorMessage("Could not sign contract. Please try again.");
    }
  };

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
          <Text style={styles.stateCopy}>Campaign context is required before signing a contract.</Text>
          <PrimaryButton label="Try Again" onPress={() => campaignQuery.refetch()} style={styles.stateButton} />
        </View>
      </ScreenShell>
    );
  }

  if (notReady) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <Text style={styles.stateEmoji}>📝</Text>
          <Text style={styles.stateTitle}>Contract not ready yet</Text>
          <Text style={styles.stateCopy}>The brand needs to approve your deliverable before the usage rights contract is generated.</Text>
          <PrimaryButton label="Back to Campaign" onPress={() => router.replace(`/campaigns/active/${campaign.campaignId}` as any)} style={styles.stateButton} />
        </View>
      </ScreenShell>
    );
  }

  if (contractQuery.isError || !contract) {
    return (
      <ScreenShell>
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
          <Text style={styles.stateTitle}>Failed to load contract</Text>
          <Text style={styles.stateCopy}>Please try again before signing.</Text>
          <PrimaryButton label="Try Again" onPress={() => contractQuery.refetch()} style={styles.stateButton} />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Digital Contract" subtitle={`${campaign.title} • ${campaign.brandName}`} showBack />

          {successMessage ? (
            <View style={styles.successToast}>
              <Text style={styles.successToastText}>{successMessage}</Text>
            </View>
          ) : null}
          {errorMessage ? (
            <View style={styles.errorToast}>
              <Text style={styles.errorToastText}>{errorMessage}</Text>
            </View>
          ) : null}

          <ContractStatusBanner contract={contract} />

          <GlassCard style={styles.contractPaper}>
            <Text style={styles.contractEyebrow}>CONTENT USAGE AGREEMENT</Text>
            <Text style={styles.contractIntro}>
              This agreement is between {campaign.brandName} ("Brand") and {creatorName} ("Creator").
            </Text>

            <ContractSection title="§ 1 CONTENT DELIVERABLES">
              {campaign.deliverableRequirements.length ? (
                campaign.deliverableRequirements.map((item) => (
                  <Text key={`${item.contentType}-${item.description}`} style={styles.contractBody}>
                    • {item.contentType} × {item.quantity}: {item.description}
                  </Text>
                ))
              ) : (
                <Text style={styles.contractBody}>Deliverables are defined by the approved campaign brief.</Text>
              )}
            </ContractSection>

            <ContractSection title="§ 2 LICENSE GRANT">
              <Text style={styles.contractBody}>{isExclusive(rights) ? "Exclusive license" : "Non-exclusive license"}</Text>
              {isExclusive(rights) ? (
                <Text style={styles.contractBody}>
                  During the exclusivity period of {formatPeriod(rights.exclusivityPeriod)}, Creator agrees not to create similar content for competing brands.
                </Text>
              ) : null}
            </ContractSection>

            <ContractSection title="§ 3 USAGE DURATION">
              <Text style={styles.contractBody}>Brand is granted usage rights for: {rights.duration ?? rights.usageDuration ?? "12 months from content approval date"}</Text>
            </ContractSection>

            <ContractSection title="§ 4 TERRITORIAL SCOPE">
              <Text style={styles.contractBody}>Usage rights apply to: {rights.territorialScope ?? rights.scope ?? "Global"}</Text>
            </ContractSection>

            <ContractSection title="§ 5 CONTENT RESTRICTIONS">
              {rights.restrictions?.length ? (
                rights.restrictions.map((restriction) => (
                  <Text key={restriction} style={styles.contractBody}>
                    • {restriction}
                  </Text>
                ))
              ) : (
                <Text style={styles.contractBody}>None</Text>
              )}
            </ContractSection>

            <ContractSection title="§ 6 COMPENSATION">
              <Text style={styles.contractBody}>
                Creator shall receive {formatCurrency(campaign.creatorNetPayout)} upon contract execution, to be released from escrow within 3-5 business days.
              </Text>
            </ContractSection>

            <ContractSection title="§ 7 PLATFORM">
              <Text style={styles.contractBody}>This agreement is facilitated by CreatorX. Platform fee of 10% has been applied to the gross amount.</Text>
            </ContractSection>
          </GlassCard>

          {!contract.creatorSignature ? (
            <GlassCard style={styles.signatureCard}>
              <Text style={styles.signatureTitle}>Your Digital Signature</Text>
              <Text style={styles.signatureHint}>Type your full legal name as your digital signature</Text>
              <TextInput
                value={signature}
                onChangeText={(value) => {
                  setSignature(value);
                  setErrorMessage(null);
                }}
                autoCapitalize="words"
                placeholder="Full legal name"
                placeholderTextColor={colors.textFaint}
                style={styles.signatureInput}
              />
              <Text style={styles.legalText}>
                By signing, I confirm I have read and agree to the terms above. This digital signature is legally binding.
              </Text>
              <Pressable onPress={() => setAgreed((value) => !value)} style={styles.agreementRow}>
                <View style={[styles.checkbox, agreed ? styles.checkboxActive : null]}>{agreed ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}</View>
                <Text style={styles.agreementText}>I agree to the terms of this contract</Text>
              </Pressable>
            </GlassCard>
          ) : null}
        </ScrollView>

        <View style={styles.bottomBar}>
          <BottomAction contract={contract} canSign={canSign} onSign={() => setConfirmOpen(true)} />
        </View>

        <ConfirmSignModal
          visible={confirmOpen}
          signature={signature.trim()}
          loading={signContract.isPending}
          onClose={() => setConfirmOpen(false)}
          onConfirm={submitSignature}
        />
      </View>
    </ScreenShell>
  );
}

function ContractStatusBanner({ contract }: { contract: DigitalContract }) {
  if (contract.status === "COMPLETED" || (contract.creatorSignature && contract.brandSignature)) {
    return (
      <View style={[styles.statusBanner, styles.statusComplete]}>
        <Text style={[styles.statusTitle, { color: colors.success }]}>✓ Contract Fully Executed</Text>
        <Text style={styles.statusCopy}>
          Creator signed {formatDateTime(contract.creatorSignedAt)} • Brand signed {formatDateTime(contract.brandSignedAt)}
        </Text>
      </View>
    );
  }
  if (contract.creatorSignature) {
    return (
      <View style={[styles.statusBanner, styles.statusWaiting]}>
        <Text style={[styles.statusTitle, { color: "#5DADE2" }]}>⏳ Awaiting brand signature</Text>
        <Text style={styles.statusCopy}>You signed on {formatDateTime(contract.creatorSignedAt)}. Waiting for brand to countersign.</Text>
      </View>
    );
  }
  return (
    <View style={[styles.statusBanner, styles.statusReview]}>
      <Text style={[styles.statusTitle, { color: colors.warning }]}>📝 Review and sign this contract</Text>
      <Text style={styles.statusCopy}>Read the usage rights and compensation terms carefully before signing.</Text>
    </View>
  );
}

function ContractSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.contractSection}>
      <Text style={styles.contractSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BottomAction({ contract, canSign, onSign }: { contract: DigitalContract; canSign: boolean; onSign: () => void }) {
  if (contract.status === "COMPLETED" || (contract.creatorSignature && contract.brandSignature)) {
    return (
      <View style={styles.bottomCopyOnly}>
        <Text style={[styles.bottomTitle, { color: colors.success }]}>✓ Contract Complete</Text>
        <Text style={styles.bottomSubtitle}>Payment will be processed within 3-5 business days</Text>
      </View>
    );
  }
  if (contract.creatorSignature) {
    return (
      <View style={styles.bottomCopyOnly}>
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>Awaiting Brand Signature</Text>
        </View>
        <Text style={styles.bottomSubtitle}>You'll be notified when the brand signs</Text>
      </View>
    );
  }
  return (
    <Pressable disabled={!canSign} onPress={onSign} style={[styles.signButton, !canSign ? styles.signButtonDisabled : null]}>
      <Text style={styles.signButtonText}>Sign Contract</Text>
    </Pressable>
  );
}

function ConfirmSignModal({
  visible,
  signature,
  loading,
  onClose,
  onConfirm
}: {
  visible: boolean;
  signature: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <GlassCard style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Sign Contract?</Text>
          <Text style={styles.confirmCopy}>Signing as: {signature}</Text>
          <Text style={styles.confirmWarning}>This action cannot be undone.</Text>
          <View style={styles.confirmActions}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable disabled={loading} onPress={onConfirm} style={[styles.confirmButton, loading ? styles.signButtonDisabled : null]}>
              <Text style={styles.confirmButtonText}>{loading ? "Signing..." : "Sign & Submit"}</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

function isExclusive(rights: UsageRightsSnapshot) {
  return Boolean(rights.exclusivity ?? rights.exclusive);
}

function formatPeriod(value: UsageRightsSnapshot["exclusivityPeriod"]) {
  if (!value) return "90 days";
  if (typeof value === "number") return `${value} days`;
  return value;
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "pending";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
    paddingHorizontal: 26
  },
  stateEmoji: {
    fontSize: 42,
    marginBottom: 12
  },
  stateTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center"
  },
  stateCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 9
  },
  stateButton: {
    marginTop: 24
  },
  successToast: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: "rgba(73,160,120,0.12)",
    padding: 13
  },
  successToastText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "900"
  },
  errorToast: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: "rgba(224,122,95,0.12)",
    padding: 13
  },
  errorToastText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "900"
  },
  statusBanner: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 5
  },
  statusComplete: {
    borderColor: colors.success,
    backgroundColor: "rgba(73,160,120,0.12)"
  },
  statusWaiting: {
    borderColor: "#5DADE2",
    backgroundColor: "rgba(93,173,226,0.12)"
  },
  statusReview: {
    borderColor: colors.warning,
    backgroundColor: "rgba(217,154,43,0.12)"
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "900"
  },
  statusCopy: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19
  },
  contractPaper: {
    padding: 22,
    gap: 18
  },
  contractEyebrow: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1
  },
  contractIntro: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  },
  contractSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderGlass,
    paddingTop: 16,
    gap: 8
  },
  contractSectionTitle: {
    color: colors.primarySoft,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.7
  },
  contractBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21
  },
  signatureCard: {
    padding: 20,
    gap: 12
  },
  signatureTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900"
  },
  signatureHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19
  },
  signatureInput: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    color: colors.textPrimary,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "800"
  },
  legalText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.textFaint,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  agreementText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
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
  signButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  signButtonDisabled: {
    opacity: 0.5
  },
  signButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  bottomCopyOnly: {
    alignItems: "center",
    gap: 6
  },
  bottomTitle: {
    fontSize: 15,
    fontWeight: "900"
  },
  bottomSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  disabledButton: {
    alignSelf: "stretch",
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center"
  },
  disabledButtonText: {
    color: colors.textSecondary,
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
  confirmWarning: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900"
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
    flex: 1.35,
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
