import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/lib/theme";

type PhoneInputProps = {
  countryCode?: string;
  countryLabel?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  onCountryPress?: () => void;
};

export function PhoneInput({
  countryCode = "+91",
  countryLabel,
  value,
  onChangeText,
  error,
  placeholder = "98765 43210",
  onCountryPress
}: PhoneInputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputShell, error ? styles.errorBorder : null]}>
        <Pressable accessibilityRole="button" onPress={onCountryPress} style={styles.countryCode}>
          <Text style={styles.countryText}>{countryLabel ?? countryCode}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </Pressable>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 8
  },
  inputShell: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceSolid,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden"
  },
  countryCode: {
    height: "100%",
    minHeight: 58,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: "#D4D0E0"
  },
  countryText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
    marginTop: -4
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600"
  },
  errorBorder: {
    borderColor: colors.error
  },
  error: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 18
  }
});
