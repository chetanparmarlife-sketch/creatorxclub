import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function ExploreRoute() {
  const kycStatus = useAuthStore((state) => state.user?.kycStatus);
  const showPendingBanner = kycStatus !== "APPROVED";

  return (
    <ScreenShell>
      <View style={styles.wrapper}>
        <ScreenHeader title="Explore" subtitle="AI-matched campaigns will appear here once discovery is wired." />
        {showPendingBanner ? (
          <GlassCard style={styles.card}>
            <Badge label="KYC Pending" variant="pending" />
            <Text style={styles.title}>Verification is pending</Text>
            <Text style={styles.body}>You can browse campaigns now. Applications unlock once your KYC is approved.</Text>
          </GlassCard>
        ) : null}
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Campaign discovery is ready for data.</Text>
          <Text style={styles.body}>The shell, auth state, query client, and navigation are now in place for Phase 3 campaign cards.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, gap: 20, paddingBottom: 90 },
  card: { gap: 14 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "900" },
  body: { color: colors.textSecondary, fontSize: 14, lineHeight: 22 }
});
