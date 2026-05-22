import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function GlassCard({ children, style }: GlassCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surface,
    padding: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: "hidden"
  }
});
