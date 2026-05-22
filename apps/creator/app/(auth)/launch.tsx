import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { colors } from "@/lib/theme";

export default function LaunchRoute() {
  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Ionicons name="cube-outline" size={44} color="#FFFFFF" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>
            Creator<Text style={styles.titleAccent}>X</Text>
          </Text>
          <Text style={styles.subtitle}>
            Where creators and brands build <Text style={styles.subtitleAccent}>beautiful</Text> partnerships.
          </Text>
        </View>
        <PrimaryButton label="Get Started" onPress={() => router.push("/(auth)/phone")} style={styles.button} />
        <Text style={styles.footer}>v2.4.0 · Soft Studio</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  copy: {
    maxWidth: 310,
    alignItems: "center"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
    letterSpacing: -0.6,
    marginBottom: 14
  },
  titleAccent: {
    color: colors.primary
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 26,
    textAlign: "center"
  },
  subtitleAccent: {
    color: colors.primary,
    fontStyle: "italic",
    fontWeight: "500"
  },
  button: {
    marginTop: 44,
    maxWidth: 310
  },
  footer: {
    position: "absolute",
    bottom: 10,
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1
  }
});
