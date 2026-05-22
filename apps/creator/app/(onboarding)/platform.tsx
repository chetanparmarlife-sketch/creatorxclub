import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/lib/theme";

export default function PlatformRoute() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Platform & budget</Text>
      <Text style={styles.subtitle}>Set your main channel and the payout range you want to see first.</Text>
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <Badge label="Instagram" variant="neutral" />
          <Badge label="YouTube" />
          <Badge label="TikTok" />
        </View>
        <View style={styles.budget}>
          <Text style={styles.budgetText}>Target budget</Text>
          <Text style={styles.budgetValue}>₹10k - ₹75k</Text>
        </View>
        <PrimaryButton label="Continue" onPress={() => router.push("/(onboarding)/social")} />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 18 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "900", letterSpacing: -0.4 },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 23 },
  card: { gap: 24 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  budget: { borderRadius: 16, backgroundColor: "rgba(91,79,233,0.06)", padding: 18 },
  budgetText: { color: colors.textSecondary, fontSize: 13 },
  budgetValue: { color: colors.textPrimary, fontSize: 24, fontWeight: "900", marginTop: 4 }
});
