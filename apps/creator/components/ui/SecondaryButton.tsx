import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SecondaryButton({ label, onPress, disabled, style }: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.button, style, pressed && !disabled ? styles.pressed : null, disabled ? styles.disabled : null]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.18)",
    backgroundColor: "rgba(255,255,255,0.64)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  label: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700"
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.5
  }
});
