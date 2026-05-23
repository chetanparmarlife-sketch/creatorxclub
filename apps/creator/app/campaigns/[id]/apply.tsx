import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

export default function CampaignApplyPlaceholder() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenShell>
      <View style={styles.wrapper}>
        <ScreenHeader title="Apply" subtitle="Application composer will be implemented in Phase 3.3." />
        <View style={styles.card}>
          <Text style={styles.label}>Campaign ID</Text>
          <Text style={styles.value}>{id}</Text>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 18
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "#FFFFFF",
    padding: 18
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800"
  }
});
