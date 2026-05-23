import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ExploreCampaign } from "@/lib/hooks/useCampaigns";
import { colors } from "@/lib/theme";
import { CreatorAuthUser } from "@/store/auth";

type CampaignCardProps = {
  campaign: ExploreCampaign;
  kycStatus: CreatorAuthUser["kycStatus"];
  onPress: () => void;
  onSave: () => void;
  onApply: () => void;
  onKycRequired: () => void;
};

export function CampaignCard({ campaign, kycStatus, onPress, onSave, onApply, onKycRequired }: CampaignCardProps) {
  const isKycApproved = kycStatus === "APPROVED";
  const matchStyle = getMatchStyle(campaign.aiMatchScore);
  const compensation = getCompensationMeta(campaign.compensationType);
  const visibleCategories = campaign.nicheCategories.slice(0, 2);
  const extraCategories = Math.max(campaign.nicheCategories.length - visibleCategories.length, 0);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}>
      <Pressable accessibilityRole="button" onPress={onSave} hitSlop={10} style={styles.saveButton}>
        <Ionicons name={campaign.saved ? "bookmark" : "bookmark-outline"} size={19} color={campaign.saved ? colors.primary : colors.textSecondary} />
      </Pressable>

      <View style={styles.topRow}>
        <View style={styles.avatar}>
          {campaign.brandLogoUrl ? (
            <Image source={{ uri: campaign.brandLogoUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials(campaign.brandName)}</Text>
          )}
        </View>
        <View style={styles.brandCopy}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName} numberOfLines={1}>{campaign.brandName}</Text>
            {campaign.brandVerified ? <Ionicons name="checkmark-circle" size={14} color={colors.primary} /> : null}
          </View>
          <Text style={styles.subtitle}>Recommended campaign</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{campaign.title}</Text>

      <View style={styles.tagRow}>
        {visibleCategories.map((category) => (
          <View key={category} style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
        {extraCategories > 0 ? (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>+{extraCategories} more</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.matchPill, { backgroundColor: matchStyle.backgroundColor }]}>
          <Text style={[styles.matchText, { color: matchStyle.color }]}>{matchStyle.icon} {Math.round(campaign.aiMatchScore)}% Match</Text>
        </View>
        <View style={[styles.compBadge, { backgroundColor: compensation.backgroundColor }]}>
          <Text style={[styles.compText, { color: compensation.color }]}>{compensation.label}</Text>
        </View>
      </View>

      <View style={styles.platformRow}>
        {campaign.targetPlatforms.length ? campaign.targetPlatforms.map((platform) => (
          <View key={platform} style={styles.platformTag}>
            <Ionicons name={platformIcon(platform)} size={13} color={colors.textSecondary} />
            <Text style={styles.platformText}>{platformLabel(platform)}</Text>
          </View>
        )) : (
          <View style={styles.platformTag}>
            <Ionicons name="apps-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.platformText}>Any platform</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.payoutBlock}>
          <Text style={styles.payout}>Earn up to {formatCurrency(campaign.creatorNetPayout)}</Text>
          <Text style={styles.feeText}>after platform fee</Text>
          <Text style={styles.sla}>Deliver within {campaign.slaDays} days</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={isKycApproved ? onApply : onKycRequired}
          style={[styles.applyButton, !isKycApproved ? styles.applyButtonDisabled : null]}
        >
          <Text style={[styles.applyText, !isKycApproved ? styles.applyTextDisabled : null]}>
            {isKycApproved ? "Apply Now" : "KYC Required"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function getMatchStyle(score: number) {
  if (score >= 85) return { icon: "🎯", color: "#2F7D4F", backgroundColor: "rgba(73,160,120,0.12)" };
  if (score >= 70) return { icon: "⚡", color: "#9A6A11", backgroundColor: "rgba(217,154,43,0.14)" };
  return { icon: "", color: colors.textSecondary, backgroundColor: "rgba(107,107,123,0.10)" };
}

function getCompensationMeta(type: ExploreCampaign["compensationType"]) {
  const map = {
    CASH: { label: "₹ Cash", color: "#2F7D4F", backgroundColor: "rgba(73,160,120,0.12)" },
    GIFTING: { label: "🎁 Gifting", color: "#A85F20", backgroundColor: "rgba(224,122,95,0.13)" },
    DIGITAL: { label: "💎 Digital", color: "#2D6EA3", backgroundColor: "rgba(45,110,163,0.12)" },
    MIXED: { label: "Mixed", color: colors.primary, backgroundColor: "rgba(91,79,233,0.10)" }
  };
  return map[type];
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
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CX";
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    padding: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  cardPressed: {
    transform: [{ scale: 0.99 }]
  },
  saveButton: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)"
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 38,
    marginBottom: 13
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  avatarImage: {
    width: "100%",
    height: "100%"
  },
  avatarText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  brandCopy: {
    flex: 1,
    minWidth: 0
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  brandName: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    maxWidth: "92%"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
    marginBottom: 12
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  categoryTag: {
    borderRadius: 14,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  matchPill: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  matchText: {
    fontSize: 12,
    fontWeight: "900"
  },
  compBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  compText: {
    fontSize: 12,
    fontWeight: "800"
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15
  },
  platformTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  platformText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700"
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12
  },
  payoutBlock: {
    flex: 1
  },
  payout: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900"
  },
  feeText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1
  },
  sla: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 7
  },
  applyButton: {
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 15
  },
  applyButtonDisabled: {
    backgroundColor: colors.borderSoft
  },
  applyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  applyTextDisabled: {
    color: colors.textSecondary
  }
});
