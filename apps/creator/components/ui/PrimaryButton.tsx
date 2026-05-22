import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, loading, disabled, style }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [styles.shell, style, pressed && !isDisabled ? styles.pressed : null, isDisabled ? styles.disabled : null]}
    >
      <LinearGradient colors={[colors.primary, colors.primarySoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  gradient: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 20
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.55
  }
});
