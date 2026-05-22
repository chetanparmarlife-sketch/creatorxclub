import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { colors } from "@/lib/theme";

export default function SocialRoute() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Connect socials</Text>
      <Text style={styles.subtitle}>Import audience metrics so campaigns can match with your real reach.</Text>
      <GlassCard style={styles.card}>
        <SecondaryButton label="Connect Instagram" />
        <SecondaryButton label="Connect YouTube" />
        <SecondaryButton label="Connect TikTok" />
        <PrimaryButton label="Continue" onPress={() => router.push("/(onboarding)/kyc")} />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 18 },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "900", letterSpacing: -0.4 },
  subtitle: { color: colors.textSecondary, fontSize: 15, lineHeight: 23 },
  card: { gap: 14 }
});
