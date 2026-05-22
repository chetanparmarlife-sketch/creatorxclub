import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/lib/theme";

const valuePoints = ["AI-matched campaigns", "Escrow-backed payouts", "Creator community"];

export default function LaunchRoute() {
  return (
    <View style={styles.screen}>
      <View style={styles.meshOne} />
      <View style={styles.meshTwo} />
      <View style={styles.meshThree} />
      <View style={styles.gridOverlay} />

      <View style={styles.content}>
        <View style={styles.logo}>
          <Ionicons name="cube-outline" size={42} color="#FFFFFF" />
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>
            Creator<Text style={styles.titleAccent}>X</Text>
          </Text>
          <Text style={styles.subtitle}>
            Where creators and brands build <Text style={styles.subtitleAccent}>beautiful</Text> partnerships.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Get Started" onPress={() => router.push("/(auth)/phone")} />
          <Pressable accessibilityRole="button" onPress={() => router.push("/(auth)/phone")} style={styles.signIn}>
            <Text style={styles.signInMuted}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign in</Text>
          </Pressable>
        </View>

        <View style={styles.valueList}>
          {valuePoints.map((point) => (
            <View key={point} style={styles.valueItem}>
              <View style={styles.valueDot} />
              <Text style={styles.valueText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>v2.4.0 · Soft Studio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    overflow: "hidden"
  },
  meshOne: {
    position: "absolute",
    top: "15%",
    left: "12%",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.primarySoft,
    opacity: 0.08
  },
  meshTwo: {
    position: "absolute",
    right: "4%",
    bottom: "18%",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: colors.errorSoft,
    opacity: 0.06
  },
  meshThree: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: colors.primary,
    opacity: 0.03
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    backgroundColor: "transparent"
  },
  content: {
    zIndex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 28
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
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
    maxWidth: 320,
    alignItems: "center"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 35,
    letterSpacing: -0.64,
    marginBottom: 16
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
  actions: {
    width: "100%",
    maxWidth: 320,
    gap: 18,
    marginTop: 44
  },
  signIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  signInMuted: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "400"
  },
  signInLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  valueList: {
    marginTop: 30,
    gap: 10,
    alignItems: "center"
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  valueDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary
  },
  valueText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600"
  },
  footer: {
    position: "absolute",
    bottom: 32,
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "300",
    letterSpacing: 1.1
  }
});
