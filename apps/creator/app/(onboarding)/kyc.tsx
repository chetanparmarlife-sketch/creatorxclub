import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { colors } from "@/lib/theme";

export default function KycRoute() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Verify KYC</Text>
      <Text style={styles.subtitle}>Upload your documents to unlock campaign applications after review.</Text>
      <GlassCard style={styles.card}>
        <SecondaryButton label="Upload ID Front" />
        <SecondaryButton label="Upload ID Back" />
        <SecondaryButton label="Capture Selfie" />
        <PrimaryButton label="Finish Setup" onPress={() => router.replace("/(tabs)/explore")} />
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
