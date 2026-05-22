import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";

export default function PhoneRoute() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const submit = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid mobile number.");
      return;
    }

    const phoneNumber = `+91${digits.slice(-10)}`;
    setLoading(true);
    setError(undefined);
    try {
      await api.post("/api/auth/send-otp", { phoneNumber });
      router.push({ pathname: "/(auth)/otp", params: { phoneNumber } });
    } catch {
      setError("Could not send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <View style={styles.container}>
        <ScreenHeader title="Your phone" subtitle="We will send a 6-digit code to verify your CreatorX account." showBack />
        <GlassCard style={styles.card}>
          <PhoneInput value={phone} onChangeText={setPhone} error={error} />
          <PrimaryButton label="Send Code" loading={loading} onPress={submit} />
          <Text style={styles.terms}>By continuing, you agree to CreatorX verification and account security checks.</Text>
        </GlassCard>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 28
  },
  card: {
    gap: 18
  },
  terms: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  }
});
