import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassCard } from "@/components/ui/GlassCard";
import { OtpInput } from "@/components/ui/OtpInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

export default function OtpRoute() {
  const { phoneNumber = "" } = useLocalSearchParams<{ phoneNumber?: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const maskedPhone = useMemo(() => maskPhone(phoneNumber), [phoneNumber]);

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
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { phoneNumber, otp: code });
      await setAuth(
        {
          id: data.user.id,
          userType: data.user.userType,
          kycStatus: data.user.kycStatus ?? null,
          displayName: data.user.displayName ?? null
        },
        data.accessToken,
        data.refreshToken
      );

      if (data.user.kycStatus === null || data.user.kycStatus === undefined) {
        router.replace("/(onboarding)/niches");
      } else {
        router.replace("/(tabs)/explore");
      }
    } catch {
      setOtp("");
      setShakeKey((value) => value + 1);
      setError("The code you entered doesn't match. Please try again or request a new one.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await api.post("/api/auth/send-otp", { phoneNumber });
      setOtp("");
      setTimer(60);
    } catch {
      setError("We couldn't resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.center}>
        <View style={styles.mesh} />

        <Pressable accessibilityRole="button" onPress={() => router.replace("/(auth)/phone")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
        </Pressable>

        <GlassCard style={styles.card}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed-outline" size={28} color={colors.primary} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Enter the code</Text>
            <Text style={styles.subtitle}>
              Sent to <Text style={styles.phoneText}>{maskedPhone}</Text>
            </Text>
          </View>

          <OtpInput value={otp} onChange={setOtp} hasError={Boolean(error)} autoFocus shakeKey={shakeKey} />

          {loading ? (
            <View style={styles.processing}>
              <View style={styles.pulseRow}>
                <View style={styles.pulseDot} />
                <View style={styles.pulseDot} />
                <View style={styles.pulseDot} />
              </View>
              <Text style={styles.processingText}>Verifying your code...</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorWrap}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <View style={styles.errorCopy}>
                <Text style={styles.errorTitle}>Invalid code</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          ) : null}

          <PrimaryButton label="Verify" loading={loading} onPress={() => submit()} disabled={otp.length !== 6} />

          <View style={styles.resendWrap}>
            <View style={styles.resendLine}>
              <Text style={styles.muted}>Didn't receive it?</Text>
              <Pressable accessibilityRole="button" onPress={resend} disabled={timer > 0 || resending}>
                <Text style={[styles.resendLink, timer > 0 || resending ? styles.resendDisabled : null]}>
                  {timer > 0 ? `Resend in 0:${timer.toString().padStart(2, "0")}` : resending ? "Sending..." : "Resend OTP"}
                </Text>
              </Pressable>
            </View>

            <Pressable accessibilityRole="button" onPress={() => router.replace("/(auth)/phone")} style={styles.changeNumber}>
              <Ionicons name="pencil-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.changeNumberText}>Change number</Text>
            </Pressable>
          </View>

          <Text style={styles.keyboardHint}>Auto-fill from messages may be available</Text>
        </GlassCard>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return value;
  if (value.startsWith("+91") && digits.length >= 12) {
    return `+91 XXXXX XX${digits.slice(-3)}`;
  }
  return `${value.slice(0, 3)} ••••• ${digits.slice(-3)}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  mesh: {
    position: "absolute",
    top: "10%",
    left: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.primarySoft,
    opacity: 0.05
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    backgroundColor: colors.surfaceSolid,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  card: {
    maxWidth: 440,
    padding: 32,
    alignItems: "center"
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(91,79,233,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24
  },
  header: {
    alignItems: "center",
    marginBottom: 30
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.52,
    marginBottom: 12
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 21,
    textAlign: "center"
  },
  phoneText: {
    color: colors.textPrimary,
    fontWeight: "700"
  },
  processing: {
    alignItems: "center",
    gap: 14,
    marginTop: 22,
    marginBottom: 12
  },
  pulseRow: {
    flexDirection: "row",
    gap: 8
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.75
  },
  processingText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "300"
  },
  errorWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 20,
    marginBottom: 14
  },
  errorCopy: {
    flex: 1
  },
  errorTitle: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18
  },
  resendWrap: {
    alignItems: "center",
    gap: 16,
    marginTop: 22
  },
  resendLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "300"
  },
  resendLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  resendDisabled: {
    opacity: 0.65
  },
  changeNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  changeNumberText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  keyboardHint: {
    marginTop: 28,
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "300",
    textAlign: "center"
  }
});
