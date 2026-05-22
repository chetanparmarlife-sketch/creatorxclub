import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function ScreenHeader({ title, subtitle, showBack }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.3
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21
  }
});
