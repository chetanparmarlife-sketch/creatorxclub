import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import { colors } from "@/lib/theme";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
  shakeKey?: number;
};

export function OtpInput({ value, onChange, hasError, autoFocus, shakeKey }: OtpInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const shake = useRef(new Animated.Value(0)).current;
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => inputRefs.current[0]?.focus(), 250);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoFocus]);

  useEffect(() => {
    if (!shakeKey) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: -6, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -4, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true })
    ]).start();
  }, [shake, shakeKey]);

  const updateDigit = (text: string, index: number) => {
    const numeric = text.replace(/\D/g, "");
    if (numeric.length > 1) {
      onChange(numeric.slice(0, 6));
      inputRefs.current[Math.min(numeric.length, 6) - 1]?.focus();
      return;
    }

    const next = digits.slice();
    next[index] = numeric;
    onChange(next.join("").slice(0, 6));
    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Animated.View style={[styles.row, { transform: [{ translateX: shake }] }]}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => updateDigit(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && !digit && index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
          selectTextOnFocus
          style={[styles.box, digit ? styles.filled : null, hasError ? styles.error : null]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderSoft,
    backgroundColor: "#FFFFFF",
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800"
  },
  filled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    color: "#FFFFFF",
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  error: {
    borderColor: colors.errorSoft,
    backgroundColor: "rgba(255,180,162,0.08)",
    color: colors.error
  }
});
