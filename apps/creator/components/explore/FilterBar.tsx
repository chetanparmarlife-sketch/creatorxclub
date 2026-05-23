import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import { ExploreFilters } from "@/lib/hooks/useCampaigns";

type FilterBarProps = {
  filters: ExploreFilters;
  activeCount: number;
  onOpenFilters: () => void;
  onRemoveCategory: (category: string) => void;
  onClearField: (field: keyof ExploreFilters) => void;
  onClearAll: () => void;
};

export function FilterBar({ filters, activeCount, onOpenFilters, onRemoveCategory, onClearField, onClearAll }: FilterBarProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pressable accessibilityRole="button" onPress={onOpenFilters} style={[styles.filterButton, activeCount > 0 ? styles.filterButtonActive : null]}>
          <Ionicons name="options-outline" size={15} color={activeCount > 0 ? "#FFFFFF" : colors.textPrimary} />
          <Text style={[styles.filterText, activeCount > 0 ? styles.filterTextActive : null]}>
            Filters{activeCount > 0 ? ` ${activeCount}` : ""}
          </Text>
        </Pressable>

        {filters.category.map((category) => (
          <FilterChip key={category} label={category} onRemove={() => onRemoveCategory(category)} />
        ))}
        {filters.platform !== "ANY" ? <FilterChip label={platformLabel(filters.platform)} onRemove={() => onClearField("platform")} /> : null}
        {filters.compensationType !== "ANY" ? (
          <FilterChip label={compensationLabel(filters.compensationType)} onRemove={() => onClearField("compensationType")} />
        ) : null}
        {filters.budgetMin ? <FilterChip label={`Min ₹${filters.budgetMin}`} onRemove={() => onClearField("budgetMin")} /> : null}
        {filters.budgetMax ? <FilterChip label={`Max ₹${filters.budgetMax}`} onRemove={() => onClearField("budgetMax")} /> : null}
        {filters.search.trim() ? <FilterChip label={`"${filters.search.trim()}"`} onRemove={() => onClearField("search")} /> : null}

        {activeCount > 0 ? (
          <Pressable accessibilityRole="button" onPress={onClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={onRemove} hitSlop={8}>
        <Ionicons name="close" size={13} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

function platformLabel(platform: string) {
  const labels: Record<string, string> = {
    INSTAGRAM: "Instagram",
    YOUTUBE: "YouTube",
    TIKTOK: "TikTok"
  };
  return labels[platform] ?? platform;
}

function compensationLabel(type: string) {
  const labels: Record<string, string> = {
    CASH: "Cash",
    GIFTING: "Gifting",
    DIGITAL: "Digital",
    MIXED: "Mixed"
  };
  return labels[type] ?? type;
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14
  },
  row: {
    gap: 8,
    paddingRight: 20
  },
  filterButton: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700"
  },
  filterTextActive: {
    color: "#FFFFFF"
  },
  chip: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    backgroundColor: colors.surfaceSolid,
    paddingLeft: 14,
    paddingRight: 11
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700"
  },
  clearButton: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 8
  },
  clearText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  }
});
