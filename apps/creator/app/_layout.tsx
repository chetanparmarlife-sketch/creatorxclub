import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

type CreatorMeResponse = {
  id?: string;
  userId?: string;
  userType?: "CREATOR";
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED";
  displayName?: string;
};

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const hydrate = useAuthStore((state) => state.hydrate);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      const { accessToken, refreshToken, user } = await hydrate();
      if (!accessToken || !refreshToken) {
        router.replace("/(auth)/launch");
        if (mounted) setBooting(false);
        return;
      }

      try {
        const { data } = await api.get<CreatorMeResponse>("/api/creators/me");
        const latestAuth = useAuthStore.getState();
        await setAuth(
          {
            id: data.userId ?? data.id ?? user?.id ?? "",
            userType: "CREATOR",
            kycStatus: data.kycStatus ?? user?.kycStatus ?? null,
            displayName: data.displayName ?? user?.displayName ?? null
          },
          latestAuth.accessToken ?? accessToken,
          latestAuth.refreshToken ?? refreshToken
        );
        router.replace("/(tabs)/explore");
      } catch {
        await clearAuth();
        router.replace("/(auth)/launch");
      } finally {
        if (mounted) setBooting(false);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, [clearAuth, hydrate, setAuth]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {booting ? (
          <View style={styles.loading}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>X</Text>
            </View>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Checking for your session...</Text>
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }} />
        )}
        <StatusBar style="dark" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    backgroundColor: colors.background
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 }
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900"
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.3
  }
});
