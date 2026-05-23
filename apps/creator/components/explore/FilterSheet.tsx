import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CompensationType, ExploreFilters } from "@/lib/hooks/useCampaigns";
import { colors } from "@/lib/theme";
import { Platform } from "@/store/onboarding";

const categories = ["Fashion", "Beauty", "Fitness", "Food", "Travel", "Tech", "Gaming", "Lifestyle", "Finance", "Education", "Entertainment", "Parenting", "Pets", "Art", "Music", "Sports"];
const platforms: Array<{ id: Platform | "ANY"; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: "ANY", label: "Any", icon: "apps-outline" },
  { id: "INSTAGRAM", label: "Instagram", icon: "logo-instagram" },
  { id: "YOUTUBE", label: "YouTube", icon: "logo-youtube" },
  { id: "TIKTOK", label: "TikTok", icon: "musical-notes-outline" }
];
const compensationTypes: Array<{ id: CompensationType | "ANY"; label: string }> = [
  { id: "ANY", label: "Any" },
  { id: "CASH", label: "Cash" },
  { id: "GIFTING", label: "Gifting" },
  { id: "DIGITAL", label: "Digital" },
  { id: "MIXED", label: "Mixed" }
];

type FilterSheetProps = {
  visible: boolean;
  filters: ExploreFilters;
  onClose: () => void;
  onApply: (filters: ExploreFilters) => void;
  onReset: () => void;
};

export function FilterSheet({ visible, filters, onClose, onApply, onReset }: FilterSheetProps) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (visible) setDraft(filters);
  }, [filters, visible]);

  const toggleCategory = (category: string) => {
    setDraft((current) => ({
      ...current,
      category: current.category.includes(category)
        ? current.category.filter((item) => item !== category)
        : [...current.category, category]
    }));
  };

  const reset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable accessibilityRole="button" onPress={reset}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Section title="Category">
              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const selected = draft.category.includes(category);
                  return (
                    <Pressable
                      key={category}
                      accessibilityRole="button"
                      onPress={() => toggleCategory(category)}
                      style={[styles.categoryChip, selected ? styles.selectedChip : null]}
                    >
                      <Text style={[styles.categoryText, selected ? styles.selectedText : null]}>{category}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            <Section title="Platform">
              <View style={styles.optionGrid}>
                {platforms.map((platform) => {
                  const selected = draft.platform === platform.id;
                  return (
                    <Pressable
                      key={platform.id}
                      accessibilityRole="button"
                      onPress={() => setDraft((current) => ({ ...current, platform: platform.id }))}
                      style={[styles.optionCard, selected ? styles.optionCardSelected : null]}
                    >
                      <Ionicons name={platform.icon} size={19} color={selected ? colors.primary : colors.textSecondary} />
                      <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>{platform.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            <Section title="Budget range">
              <View style={styles.budgetRow}>
                <BudgetInput label="Min" value={draft.budgetMin} onChangeText={(budgetMin) => setDraft((current) => ({ ...current, budgetMin }))} />
                <BudgetInput label="Max" value={draft.budgetMax} onChangeText={(budgetMax) => setDraft((current) => ({ ...current, budgetMax }))} />
              </View>
            </Section>

            <Section title="Compensation type">
              <View style={styles.compRow}>
                {compensationTypes.map((type) => {
                  const selected = draft.compensationType === type.id;
                  return (
                    <Pressable
                      key={type.id}
                      accessibilityRole="button"
                      onPress={() => setDraft((current) => ({ ...current, compensationType: type.id }))}
                      style={[styles.compChip, selected ? styles.selectedChip : null]}
                    >
                      <Text style={[styles.categoryText, selected ? styles.selectedText : null]}>{type.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton label="Apply Filters" onPress={() => onApply(draft)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BudgetInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.budgetInput}>
      <Text style={styles.budgetLabel}>{label}</Text>
      <View style={styles.budgetField}>
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/\D/g, ""))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26,26,46,0.40)"
  },
  sheet: {
    maxHeight: "88%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingTop: 12
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    marginBottom: 12
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 18
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900"
  },
  resetText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 18
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  categoryChip: {
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  selectedChip: {
    borderColor: "rgba(91,79,233,0.16)",
    backgroundColor: "rgba(91,79,233,0.08)"
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  selectedText: {
    color: colors.primary
  },
  optionGrid: {
    flexDirection: "row",
    gap: 8
  },
  optionCard: {
    flex: 1,
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingHorizontal: 6
  },
  optionCardSelected: {
    borderColor: "rgba(91,79,233,0.24)",
    backgroundColor: "rgba(91,79,233,0.07)"
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "800"
  },
  optionTextSelected: {
    color: colors.primary
  },
  budgetRow: {
    flexDirection: "row",
    gap: 12
  },
  budgetInput: {
    flex: 1
  },
  budgetLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 7
  },
  budgetField: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 13,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 13
  },
  rupee: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900"
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    padding: 0
  },
  compRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  compChip: {
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft
  }
});
