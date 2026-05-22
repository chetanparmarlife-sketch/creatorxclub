import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type BadgeVariant = "pending" | "approved" | "rejected" | "neutral";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, { bg: string; fg: string }> = {
  pending: { bg: "rgba(217,154,43,0.12)", fg: colors.warning },
  approved: { bg: "rgba(73,160,120,0.12)", fg: colors.success },
  rejected: { bg: "rgba(224,122,95,0.12)", fg: colors.error },
  neutral: { bg: "rgba(91,79,233,0.08)", fg: colors.primary }
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const tone = variants[variant];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.label, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  label: {
    fontSize: 12,
    fontWeight: "800"
  }
});
