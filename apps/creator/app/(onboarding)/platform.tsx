import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useUpdateProfile } from "@/lib/hooks/useOnboardingMutations";
import { colors } from "@/lib/theme";
import { currencyNumber, formatInr, GenderDistribution, Platform, useOnboardingStore } from "@/store/onboarding";

const platforms: Array<{ id: Platform; name: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = [
  { id: "INSTAGRAM", name: "Instagram", label: "Primary Platform", icon: "logo-instagram", color: "#E4405F" },
  { id: "YOUTUBE", name: "YouTube", label: "Primary Platform", icon: "logo-youtube", color: "#FF0000" },
  { id: "TIKTOK", name: "TikTok", label: "Primary Platform", icon: "musical-notes-outline", color: "#000000" }
];

const ageRanges = ["18-24", "25-34", "35-44", "45+"];
const genders: GenderDistribution[] = ["Any", "Mostly Male", "Mostly Female", "Mixed"];

export default function PlatformRoute() {
  const primaryPlatform = useOnboardingStore((state) => state.primaryPlatform);
  const minBudget = useOnboardingStore((state) => state.targetBudgetMin);
  const maxBudget = useOnboardingStore((state) => state.targetBudgetMax);
  const selectedAgeRanges = useOnboardingStore((state) => state.ageRanges);
  const genderDistribution = useOnboardingStore((state) => state.genderDistribution);
  const setPlatform = useOnboardingStore((state) => state.setPlatform);
  const setBudget = useOnboardingStore((state) => state.setBudget);
  const toggleAgeRange = useOnboardingStore((state) => state.toggleAgeRange);
  const setGenderDistribution = useOnboardingStore((state) => state.setGenderDistribution);
  const updateProfile = useUpdateProfile();

  const min = currencyNumber(minBudget);
  const max = currencyNumber(maxBudget);
  const budgetInvalid = min > 0 && max > 0 && min > max;
  const canContinue = Boolean(primaryPlatform) && min > 0 && max > 0 && !budgetInvalid;

  const continueNext = async () => {
    if (!primaryPlatform || !canContinue) return;
    await updateProfile.mutateAsync({
      primaryPlatform,
      targetBudgetMin: min,
      targetBudgetMax: max,
      audienceDemographics: {
        ageRanges: selectedAgeRanges,
        genderDistribution
      }
    });
    router.push("/(onboarding)/social");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>Your platform & reach</Text>
        <Text style={styles.subtitle}>Help brands understand where you create and who you reach.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Primary platform</Text>
        <View style={styles.platformGrid}>
          {platforms.map((platform) => {
            const selected = primaryPlatform === platform.id;
            return (
              <Pressable
                key={platform.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setPlatform(platform.id)}
                style={({ pressed }) => [styles.platformCard, selected ? styles.platformSelected : null, pressed ? styles.cardPressed : null]}
              >
                <View style={[styles.platformIcon, selected ? styles.platformIconSelected : null]}>
                  <Ionicons name={platform.icon} size={25} color={selected ? "#FFFFFF" : platform.color} />
                </View>
                <Text style={[styles.platformName, selected ? styles.platformNameSelected : null]}>{platform.name}</Text>
                <Text style={[styles.platformLabel, selected ? styles.platformLabelSelected : null]}>{platform.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Expected campaign budget</Text>
        <View style={styles.budgetCard}>
          <BudgetInput label="Minimum Budget" value={minBudget} onChange={(value) => setBudget("min", value)} />
          <View style={styles.budgetDivider} />
          <BudgetInput label="Maximum Budget" value={maxBudget} onChange={(value) => setBudget("max", value)} />
          {budgetInvalid ? <Text style={styles.error}>Minimum budget must be less than or equal to maximum budget.</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Target audience</Text>
          <Text style={styles.optional}>Optional</Text>
        </View>

        <View style={styles.demoGroup}>
          <Text style={styles.groupLabel}>Age range</Text>
          <View style={styles.chips}>
            {ageRanges.map((ageRange) => {
              const selected = selectedAgeRanges.includes(ageRange);
              return (
                <Pressable key={ageRange} onPress={() => toggleAgeRange(ageRange)} style={[styles.chip, selected ? styles.chipSelected : null]}>
                  <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{ageRange}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.demoGroup}>
          <Text style={styles.groupLabel}>Gender distribution</Text>
          <View style={styles.chips}>
            {genders.map((gender) => {
              const selected = genderDistribution === gender;
              return (
                <Pressable key={gender} onPress={() => setGenderDistribution(gender)} style={[styles.chip, selected ? styles.chipSelected : null]}>
                  <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{gender}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {updateProfile.isError ? <Text style={styles.error}>Could not save this step. Please try again.</Text> : null}
      <View style={styles.cta}>
        <PrimaryButton label="Continue" loading={updateProfile.isPending} disabled={!canContinue} onPress={continueNext} />
      </View>
    </ScrollView>
  );
}

function BudgetInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.budgetInputWrap}>
      <Text style={styles.budgetLabel}>{label}</Text>
      <View style={styles.inputShell}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          value={formatInr(value)}
          onChangeText={onChange}
          keyboardType="number-pad"
          placeholder="25,000"
          placeholderTextColor={colors.textFaint}
          style={styles.budgetInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 34
  },
  header: {
    marginBottom: 28
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
  section: {
    marginBottom: 30
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14
  },
  optional: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 14
  },
  platformGrid: {
    gap: 12
  },
  platformCard: {
    minHeight: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.08)",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  platformSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 16
  },
  cardPressed: {
    transform: [{ scale: 0.99 }]
  },
  platformIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    marginRight: 15
  },
  platformIconSelected: {
    backgroundColor: colors.primary
  },
  platformName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    flex: 1
  },
  platformNameSelected: {
    color: colors.primary
  },
  platformLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500"
  },
  platformLabelSelected: {
    color: colors.primary
  },
  budgetCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    backgroundColor: "#FFFFFF",
    padding: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  budgetInputWrap: {
    gap: 8
  },
  budgetLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700"
  },
  inputShell: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 14
  },
  rupee: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
    marginRight: 8
  },
  budgetInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900"
  },
  budgetDivider: {
    height: 14
  },
  demoGroup: {
    marginBottom: 18
  },
  groupLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700"
  },
  chipTextSelected: {
    color: "#FFFFFF"
  },
  cta: {
    marginTop: 4
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12
  }
});
