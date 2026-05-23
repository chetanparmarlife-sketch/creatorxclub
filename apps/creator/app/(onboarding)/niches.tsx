import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useUpdateProfile } from "@/lib/hooks/useOnboardingMutations";
import { colors } from "@/lib/theme";
import { useOnboardingStore } from "@/store/onboarding";

const categories = [
  { name: "Fashion", emoji: "👗", description: "Style & trends" },
  { name: "Beauty", emoji: "✨", description: "Skincare & makeup" },
  { name: "Fitness", emoji: "💪", description: "Health & wellness" },
  { name: "Food", emoji: "🍜", description: "Recipes & dining" },
  { name: "Travel", emoji: "✈️", description: "Destinations & tips" },
  { name: "Tech", emoji: "💻", description: "Gadgets & reviews" },
  { name: "Gaming", emoji: "🎮", description: "Streams & esports" },
  { name: "Lifestyle", emoji: "☕", description: "Daily life & home" },
  { name: "Finance", emoji: "💸", description: "Money & markets" },
  { name: "Education", emoji: "📚", description: "Learning & tips" },
  { name: "Entertainment", emoji: "🎬", description: "Pop culture" },
  { name: "Parenting", emoji: "🧡", description: "Family & kids" },
  { name: "Pets", emoji: "🐾", description: "Pet care" },
  { name: "Art", emoji: "🎨", description: "Visual creativity" },
  { name: "Music", emoji: "🎵", description: "Artists & culture" },
  { name: "Sports", emoji: "🏆", description: "Teams & training" }
];

export default function NichesRoute() {
  const selected = useOnboardingStore((state) => state.nicheCategories);
  const toggleNiche = useOnboardingStore((state) => state.toggleNiche);
  const updateProfile = useUpdateProfile();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const onToggle = (name: string) => {
    const accepted = toggleNiche(name);
    if (!accepted) {
      setToast("Maximum 3 niches. You can edit these later.");
    }
  };

  const continueNext = async () => {
    await updateProfile.mutateAsync({ nicheCategories: selected });
    router.push("/(onboarding)/platform");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>What do you create?</Text>
        <Text style={styles.subtitle}>Select up to 3 niches that best describe your content. This helps us match you with relevant brands.</Text>
      </View>

      <View style={styles.counterRow}>
        <View style={styles.counterCopy}>
          <Text style={styles.counterLabel}>Selected:</Text>
          <Text style={[styles.counterValue, selected.length === 3 ? styles.counterLimit : null]}>{selected.length} of 3</Text>
        </View>
        {selected.length === 3 ? (
          <View style={styles.limitBadge}>
            <Ionicons name="alert-circle-outline" size={13} color={colors.error} />
            <Text style={styles.limitText}>Maximum reached</Text>
          </View>
        ) : null}
      </View>

      {toast ? (
        <View style={styles.toast}>
          <Ionicons name="alert-circle-outline" size={15} color={colors.error} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {categories.map((category) => {
          const isSelected = selected.includes(category.name);
          const isDisabled = selected.length >= 3 && !isSelected;
          return (
            <Pressable
              key={category.name}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              onPress={() => onToggle(category.name)}
              style={({ pressed }) => [
                styles.categoryCard,
                isSelected ? styles.categorySelected : null,
                isDisabled ? styles.categoryDisabled : null,
                pressed && !isDisabled ? styles.categoryPressed : null
              ]}
            >
              <View style={[styles.iconBox, isSelected ? styles.iconBoxSelected : null]}>
                <Text style={styles.emoji}>{category.emoji}</Text>
              </View>
              <Text style={[styles.categoryName, isSelected ? styles.categoryNameSelected : null]}>{category.name}</Text>
              <Text style={[styles.categoryDesc, isSelected ? styles.categoryDescSelected : null]}>{category.description}</Text>
              {isSelected ? (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={12} color={colors.primary} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {updateProfile.isError ? <Text style={styles.error}>Could not save your niches. Please try again.</Text> : null}

      <View style={styles.cta}>
        <PrimaryButton label="Continue" loading={updateProfile.isPending} disabled={selected.length === 0} onPress={continueNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 32
  },
  header: {
    marginBottom: 24
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
    fontSize: 15,
    fontWeight: "300",
    lineHeight: 24
  },
  counterRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  counterCopy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  counterLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  counterValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900"
  },
  counterLimit: {
    color: colors.error
  },
  limitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,180,162,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  limitText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: "800"
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,180,162,0.12)",
    padding: 12,
    marginBottom: 16
  },
  toastText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "700",
    flex: 1
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  categoryCard: {
    width: "47.9%",
    minHeight: 138,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  categorySelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    transform: [{ scale: 1.01 }]
  },
  categoryDisabled: {
    opacity: 0.4
  },
  categoryPressed: {
    transform: [{ scale: 0.98 }]
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.06)",
    marginBottom: 10
  },
  iconBoxSelected: {
    backgroundColor: "rgba(255,255,255,0.15)"
  },
  emoji: {
    fontSize: 24
  },
  categoryName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center"
  },
  categoryNameSelected: {
    color: "#FFFFFF"
  },
  categoryDesc: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 5
  },
  categoryDescSelected: {
    color: colors.textFaint
  },
  check: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceSolid,
    alignItems: "center",
    justifyContent: "center"
  },
  cta: {
    marginTop: 24
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14
  }
});
