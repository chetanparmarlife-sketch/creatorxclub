import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { OtpInput } from "@/components/ui/OtpInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function OtpRoute() {
  const { phoneNumber = "" } = useLocalSearchParams<{ phoneNumber?: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer((value) => Math.max(value - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (otp.length === 6 && !loading) {
      submit(otp);
    }
  }, [otp]);

  const submit = async (code = otp) => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { phoneNumber, otp: code });
      await setAuth(
        {
          id: data.user.id,
          userType: data.user.userType,
          kycStatus: data.user.kycStatus,
          displayName: data.user.displayName ?? null
        },
        data.accessToken,
        data.refreshToken
      );
      router.replace("/(onboarding)/niches");
    } catch {
      setOtp("");
      setError("The code you entered doesn't match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (timer > 0) return;
    await api.post("/api/auth/send-otp", { phoneNumber });
    setTimer(60);
  };

  return (
    <ScreenShell>
      <View style={styles.container}>
        <ScreenHeader title="Enter the code" subtitle={`Sent to ${phoneNumber}`} showBack />
        <GlassCard style={styles.card}>
          <OtpInput value={otp} onChange={setOtp} hasError={Boolean(error)} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton label={loading ? "Verifying..." : "Verify Code"} loading={loading} onPress={() => submit()} />
          <SecondaryButton label={timer > 0 ? `Resend in 0:${timer.toString().padStart(2, "0")}` : "Resend Code"} onPress={resend} disabled={timer > 0} />
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
    alignItems: "center",
    gap: 18
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center"
  }
});
