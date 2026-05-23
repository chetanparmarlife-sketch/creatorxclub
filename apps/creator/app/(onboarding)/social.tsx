import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useConnectSocial } from "@/lib/hooks/useOnboardingMutations";
import { colors } from "@/lib/theme";
import { Platform, SocialConnection, useOnboardingStore } from "@/store/onboarding";

const platforms: Array<{ id: Platform; name: string; handle: string; icon: keyof typeof Ionicons.glyphMap; color: string; authUrl: string }> = [
  { id: "INSTAGRAM", name: "Instagram", handle: "@creatorx", icon: "logo-instagram", color: "#E4405F", authUrl: "https://www.instagram.com/oauth/authorize" },
  { id: "YOUTUBE", name: "YouTube", handle: "@creatorx", icon: "logo-youtube", color: "#FF0000", authUrl: "https://accounts.google.com/o/oauth2/v2/auth" },
  { id: "TIKTOK", name: "TikTok", handle: "@creatorx", icon: "musical-notes-outline", color: "#000000", authUrl: "https://www.tiktok.com/v2/auth/authorize" }
];

const metricFixtures: Record<Platform, Pick<SocialConnection, "followerCount" | "engagementRate">> = {
  INSTAGRAM: { followerCount: 142000, engagementRate: 4.8 },
  YOUTUBE: { followerCount: 86000, engagementRate: 5.2 },
  TIKTOK: { followerCount: 238000, engagementRate: 6.4 }
};

export default function SocialRoute() {
  const socialAccounts = useOnboardingStore((state) => state.socialAccounts);
  const setSocialConnection = useOnboardingStore((state) => state.setSocialConnection);
  const disconnectSocial = useOnboardingStore((state) => state.disconnectSocial);
  const connectSocial = useConnectSocial();

  const connect = async (platform: (typeof platforms)[number]) => {
    await Linking.openURL(platform.authUrl);
    const metrics = metricFixtures[platform.id];
    const connection: SocialConnection = {
      platform: platform.id,
      accessToken: `oauth-${platform.id.toLowerCase()}-${Date.now()}`,
      followerCount: metrics.followerCount,
      engagementRate: metrics.engagementRate
    };
    await connectSocial.mutateAsync(connection);
    setSocialConnection(connection);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect your account</Text>
        <Text style={styles.subtitle}>Link your social platforms to import followers, engagement rate, and content history.</Text>
      </View>

      <View style={styles.cards}>
        {platforms.map((platform) => {
          const connected = socialAccounts[platform.id];
          return (
            <View key={platform.id} style={[styles.platformCard, connected ? styles.connectedCard : null]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, connected ? styles.iconConnected : null]}>
                  <Ionicons name={platform.icon} size={26} color={connected ? "#FFFFFF" : platform.color} />
                </View>
                <View style={styles.platformCopy}>
                  <Text style={[styles.platformName, connected ? styles.connectedText : null]}>{platform.name}</Text>
                  <Text style={[styles.platformHandle, connected ? styles.connectedMuted : null]}>{connected ? platform.handle : "Import audience metrics"}</Text>
                </View>
                {connected ? (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>

              {connected ? (
                <View style={styles.metrics}>
                  <Metric label="Followers" value={formatFollowers(connected.followerCount)} />
                  <Metric label="Engagement" value={`${connected.engagementRate.toFixed(1)}%`} />
                  <Pressable accessibilityRole="button" onPress={() => disconnectSocial(platform.id)} style={styles.disconnectButton}>
                    <Text style={styles.disconnectText}>Disconnect</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.connectRow}>
                  <Text style={styles.permissionText}>Follower count, engagement rate, and recent content history.</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => connect(platform)}
                    disabled={connectSocial.isPending}
                    style={styles.connectButton}
                  >
                    <Ionicons name="link-outline" size={15} color="#FFFFFF" />
                    <Text style={styles.connectText}>Connect</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {connectSocial.isError ? <Text style={styles.error}>Could not connect that account. Please try again.</Text> : null}

      <View style={styles.skipNote}>
        <Ionicons name="information-circle-outline" size={17} color={colors.primary} />
        <Text style={styles.skipText}>You can connect more platforms later in Settings</Text>
      </View>

      <PrimaryButton label="Continue" onPress={() => router.push("/(onboarding)/kyc")} />
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function formatFollowers(value: number) {
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return value.toString();
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 34
  },
  header: {
    marginBottom: 24
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.52,
    marginBottom: 10
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 22
  },
  cards: {
    gap: 14,
    marginBottom: 20
  },
  platformCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    padding: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  connectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 14
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: colors.surfaceSolid,
    alignItems: "center",
    justifyContent: "center"
  },
  iconConnected: {
    backgroundColor: "rgba(255,255,255,0.15)"
  },
  platformCopy: {
    flex: 1
  },
  platformName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900"
  },
  platformHandle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "300",
    marginTop: 3
  },
  connectedText: {
    color: "#FFFFFF"
  },
  connectedMuted: {
    color: colors.textFaint
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center"
  },
  connectRow: {
    marginTop: 16,
    gap: 14
  },
  permissionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18
  },
  connectButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 14
  },
  connectText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  metrics: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 10
  },
  metric: {
    flex: 1,
    alignItems: "center"
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: "300",
    marginTop: 2
  },
  disconnectButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  disconnectText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800"
  },
  skipNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: "rgba(91,79,233,0.04)",
    padding: 13,
    marginBottom: 22
  },
  skipText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500"
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14
  }
});
