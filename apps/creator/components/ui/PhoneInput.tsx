import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/lib/theme";

type PhoneInputProps = {
  countryCode?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

export function PhoneInput({ countryCode = "+91", value, onChangeText, error }: PhoneInputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputShell, error ? styles.errorBorder : null]}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>{countryCode}</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="98765 43210"
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
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden"
  },
  countryCode: {
    height: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.borderSoft
  },
  countryText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
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
