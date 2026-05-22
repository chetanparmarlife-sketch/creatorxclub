import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/lib/theme";

const niches = ["Fashion", "Lifestyle", "Beauty", "Travel", "Fitness", "Food"];

export default function NichesRoute() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Choose your niches</Text>
      <Text style={styles.subtitle}>Pick up to three categories so CreatorX can tune campaign discovery.</Text>
      <GlassCard style={styles.card}>
        <View style={styles.grid}>
          {niches.map((niche, index) => (
            <Badge key={niche} label={niche} variant={index < 2 ? "neutral" : "pending"} />
          ))}
        </View>
        <PrimaryButton label="Continue" onPress={() => router.push("/(onboarding)/platform")} />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 18 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "900", letterSpacing: -0.4 },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 23 },
  card: { gap: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }
});
