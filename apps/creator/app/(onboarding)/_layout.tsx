import { Slot, router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

const steps = ["Choose Niches", "Platform & Budget", "Connect Socials", "Verify KYC"];
const routes = ["/(onboarding)/niches", "/(onboarding)/platform", "/(onboarding)/social", "/(onboarding)/kyc"];

export default function OnboardingLayout() {
  const pathname = usePathname();
  const currentIndex = Math.max(
    0,
    routes.findIndex((route) => pathname.endsWith(route.split("/").pop() ?? ""))
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>
      <ProgressDots steps={steps} currentIndex={currentIndex} />
      <View style={styles.content}>
        <Slot />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1,
    paddingTop: 22
  }
});
