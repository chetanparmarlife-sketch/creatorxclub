import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { ActiveCampaign, DeliverableStatus, useActiveCampaigns } from "@/lib/hooks/useActiveCampaigns";
import { colors } from "@/lib/theme";

type CampaignTab = "IN_PROGRESS" | "COMPLETED";

export default function CampaignsRoute() {
  const [selectedTab, setSelectedTab] = useState<CampaignTab>("IN_PROGRESS");
  const { data = [], isLoading, isRefetching, refetch } = useActiveCampaigns();

  const grouped = useMemo(() => {
    const inProgress = data.filter((campaign) => campaign.deliverableStatus !== "APPROVED");
    const completed = data.filter((campaign) => campaign.deliverableStatus === "APPROVED");
    return { inProgress, completed };
  }, [data]);

  const campaigns = selectedTab === "IN_PROGRESS" ? grouped.inProgress : grouped.completed;

  return (
    <ScreenShell>
      <View style={styles.container}>
        <ScreenHeader title="My Campaigns" subtitle="Track approved work, deadlines, submissions, and payouts." />

        <View style={styles.tabs}>
          <TabButton label={`In Progress (${grouped.inProgress.length})`} active={selectedTab === "IN_PROGRESS"} onPress={() => setSelectedTab("IN_PROGRESS")} />
          <TabButton label={`Completed (${grouped.completed.length})`} active={selectedTab === "COMPLETED"} onPress={() => setSelectedTab("COMPLETED")} />
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primarySoft} />
          </View>
        ) : (
          <FlatList
            data={campaigns}
            keyExtractor={(item) => item.campaignId}
            contentContainerStyle={campaigns.length ? styles.listContent : styles.emptyContent}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primarySoft} />}
            renderItem={({ item }) => <ActiveCampaignCard campaign={item} />}
            ListEmptyComponent={<EmptyState tab={selectedTab} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenShell>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.tabButton, active ? styles.tabButtonActive : null]}>
      <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{label}</Text>
    </Pressable>
  );
}

function ActiveCampaignCard({ campaign }: { campaign: ActiveCampaign }) {
  const gifting = campaign.compensationType === "GIFTING" || campaign.compensationType === "MIXED";
  const sla = getSlaMeta(campaign.slaDeadline);

  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(`/campaigns/active/${campaign.campaignId}` as any)}>
      <GlassCard style={styles.card}>
        <View style={styles.cardTop}>
          <Avatar name={campaign.brandName} />
          <View style={styles.cardTitleBlock}>
            <Text style={styles.brandName}>{campaign.brandName}</Text>
            <Text style={styles.campaignTitle} numberOfLines={2}>
              {campaign.title}
            </Text>
          </View>
          <Text style={styles.payout}>{formatCurrency(campaign.creatorNetPayout)}</Text>
        </View>

        <View style={styles.metaRow}>
          <CompensationBadge type={campaign.compensationType} />
          {campaign.campaignStatus === "COMPLETED" ? <StatusPill color={colors.success} icon="checkmark-circle" label="Completed" /> : null}
        </View>

        <StatusStepper deliverableStatus={campaign.deliverableStatus} paymentStatus={campaign.paymentStatus} compact />

        {campaign.deliverableStatus !== "APPROVED" ? (
          <View style={[styles.alertPill, { borderColor: sla.color, backgroundColor: sla.background }]}>
            <Text style={[styles.alertText, { color: sla.color }]}>{sla.label}</Text>
          </View>
        ) : null}

        {gifting ? (
          <View style={[styles.alertPill, campaign.productReceiptConfirmed ? styles.greenSoft : styles.amberSoft]}>
            <Text style={[styles.alertText, { color: campaign.productReceiptConfirmed ? colors.success : colors.warning }]}>
              {campaign.productReceiptConfirmed ? "✓ Product received" : "📦 Awaiting product delivery"}
            </Text>
          </View>
        ) : null}
      </GlassCard>
    </Pressable>
  );
}

function StatusStepper({ deliverableStatus, paymentStatus, compact = false }: { deliverableStatus: DeliverableStatus; paymentStatus: string; compact?: boolean }) {
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
    <View style={[styles.stepper, compact ? styles.stepperCompact : null]}>
      {steps.map((step, index) => {
        const done = step.state === "done";
        const current = step.state === "current";
        const color = done ? colors.success : current ? colors.primarySoft : colors.textFaint;
        return (
          <View key={step.label} style={styles.stepItem}>
            <View style={styles.stepTrackRow}>
              <View style={[styles.stepDot, { borderColor: color, backgroundColor: done ? colors.success : current ? colors.primary : colors.surfaceSolid }]}>
                {done ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : <View style={[styles.stepInner, { backgroundColor: color }]} />}
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

function EmptyState({ tab }: { tab: CampaignTab }) {
  const inProgress = tab === "IN_PROGRESS";
  return (
    <GlassCard style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons name={inProgress ? "briefcase-outline" : "trophy-outline"} size={28} color={colors.primarySoft} />
      </View>
      <Text style={styles.emptyTitle}>{inProgress ? "No active campaigns yet" : "No completed campaigns yet"}</Text>
      <Text style={styles.emptyCopy}>
        {inProgress ? "Approved campaigns with SLA countdowns will appear here once brands select you." : "Completed work and paid campaigns will be collected here."}
      </Text>
      {inProgress ? <PrimaryButton label="Browse Campaigns" onPress={() => router.push("/(tabs)/explore" as any)} style={styles.emptyButton} /> : null}
    </GlassCard>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials || "CX"}</Text>
    </View>
  );
}

function CompensationBadge({ type }: { type: string }) {
  const config =
    type === "GIFTING"
      ? { label: "🎁 Gifting", color: colors.warning }
      : type === "DIGITAL"
        ? { label: "💎 Digital", color: "#5DADE2" }
        : type === "MIXED"
          ? { label: "Mixed", color: colors.primarySoft }
          : { label: "₹ Cash", color: colors.success };

  return (
    <View style={[styles.compBadge, { borderColor: config.color, backgroundColor: `${config.color}22` }]}>
      <Text style={[styles.compBadgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function StatusPill({ color, icon, label }: { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={[styles.compBadge, { borderColor: color, backgroundColor: `${color}22` }]}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.compBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

function getSlaMeta(deadline?: string | null) {
  if (!deadline) {
    return { label: "⏱ SLA pending", color: colors.textSecondary, background: "rgba(255,255,255,0.05)" };
  }
  const now = Date.now();
  const end = new Date(deadline).getTime();
  const days = Math.ceil((end - now) / 86_400_000);
  if (days < 0) return { label: "❌ SLA Breached", color: colors.error, background: "rgba(224,122,95,0.12)" };
  if (days < 3) return { label: `🔴 ${days} days left — Urgent`, color: colors.error, background: "rgba(224,122,95,0.12)" };
  if (days <= 7) return { label: `⚠ ${days} days left`, color: colors.warning, background: "rgba(217,154,43,0.12)" };
  return { label: `⏱ ${days} days left`, color: colors.success, background: "rgba(73,160,120,0.12)" };
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    paddingBottom: 82
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surface,
    padding: 5
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14
  },
  tabButtonActive: {
    backgroundColor: colors.primary
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: "#FFFFFF"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  listContent: {
    paddingBottom: 26
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 100
  },
  card: {
    padding: 18,
    gap: 14
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  cardTitleBlock: {
    flex: 1
  },
  brandName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  campaignTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
    marginTop: 3
  },
  payout: {
    color: colors.primarySoft,
    fontSize: 16,
    fontWeight: "900"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  compBadge: {
    minHeight: 28,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  compBadgeText: {
    fontSize: 12,
    fontWeight: "900"
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4
  },
  stepperCompact: {
    marginTop: 2
  },
  stepItem: {
    flex: 1
  },
  stepTrackRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  stepInner: {
    width: 6,
    height: 6,
    borderRadius: 3
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
    marginTop: 7,
    fontSize: 10,
    fontWeight: "900"
  },
  alertPill: {
    minHeight: 34,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  alertText: {
    fontSize: 12,
    fontWeight: "900"
  },
  greenSoft: {
    borderColor: colors.success,
    backgroundColor: "rgba(73,160,120,0.12)"
  },
  amberSoft: {
    borderColor: colors.warning,
    backgroundColor: "rgba(217,154,43,0.12)"
  },
  emptyCard: {
    alignItems: "center",
    padding: 24
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.14)",
    marginBottom: 16
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center"
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8
  },
  emptyButton: {
    marginTop: 20
  }
});
