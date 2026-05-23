import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import { CreatorAuthUser } from "@/store/auth";

const DISMISS_KEY = "creatorx.explore.kycPendingBanner.dismissed";

type KycPendingBannerProps = {
  kycStatus: CreatorAuthUser["kycStatus"];
};

export function KycPendingBanner({ kycStatus }: KycPendingBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    AsyncStorage.removeItem(DISMISS_KEY).then(() => setDismissed(false));
  }, []);

  if (kycStatus === "APPROVED" || !kycStatus) return null;
  if (kycStatus === "PENDING" && dismissed) return null;

  const rejected = kycStatus === "REJECTED";

  const dismiss = async () => {
    await AsyncStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setDismissed(true);
  };

  return (
    <Pressable
      accessibilityRole={rejected ? "button" : undefined}
      onPress={rejected ? () => router.push("/(onboarding)/kyc") : undefined}
      style={[styles.banner, rejected ? styles.rejected : styles.pending]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, rejected ? styles.rejectedText : styles.pendingText]}>
          {rejected ? "❌ KYC Rejected" : "🔄 KYC Under Review"}
        </Text>
        <Text style={styles.body}>{rejected ? "Tap to resubmit documents" : "You can browse but not apply"}</Text>
      </View>
      {kycStatus === "PENDING" ? (
        <Pressable accessibilityRole="button" onPress={dismiss} hitSlop={10} style={styles.closeButton}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#A5403C" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14
  },
  pending: {
    borderColor: "rgba(217,154,43,0.22)",
    backgroundColor: "rgba(217,154,43,0.10)"
  },
  rejected: {
    borderColor: "rgba(224,122,95,0.24)",
    backgroundColor: "rgba(224,122,95,0.12)"
  },
  copy: {
    flex: 1
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3
  },
  pendingText: {
    color: "#9A6A11"
  },
  rejectedText: {
    color: "#A5403C"
  },
  body: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600"
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.55)"
  }
});
