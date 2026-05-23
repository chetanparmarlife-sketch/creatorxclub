import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CampaignCard } from "@/components/explore/CampaignCard";
import { FilterBar } from "@/components/explore/FilterBar";
import { FilterSheet } from "@/components/explore/FilterSheet";
import { KycPendingBanner } from "@/components/explore/KycPendingBanner";
import { ExploreCampaign, ExploreFilters, useExploreCampaigns, useSaveCampaign } from "@/lib/hooks/useCampaigns";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/store/auth";

const initialFilters: ExploreFilters = {
  category: [],
  budgetMin: "",
  budgetMax: "",
  platform: "ANY",
  compensationType: "ANY",
  search: ""
};

export default function ExploreRoute() {
  const kycStatus = useAuthStore((state) => state.user?.kycStatus ?? null);
  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);
  const [searchText, setSearchText] = useState("");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({ ...current, search: searchText }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);
  const campaignQuery = useExploreCampaigns(filters);
  const saveCampaign = useSaveCampaign();
  const refreshing = campaignQuery.isRefetching && !campaignQuery.isFetchingNextPage;

  const clearField = (field: keyof ExploreFilters) => {
    setFilters((current) => ({ ...current, [field]: field === "category" ? [] : field === "platform" || field === "compensationType" ? "ANY" : "" }));
    if (field === "search") setSearchText("");
  };

  const clearAll = () => {
    setSearchText("");
    setFilters(initialFilters);
  };

  const removeCategory = (category: string) => {
    setFilters((current) => ({ ...current, category: current.category.filter((item) => item !== category) }));
  };

  const applyFilters = (nextFilters: ExploreFilters) => {
    setFilters(nextFilters);
    setSearchText(nextFilters.search);
    setFilterSheetOpen(false);
  };

  const openApply = (campaign: ExploreCampaign) => {
    router.push({ pathname: "/campaigns/[id]/apply", params: { id: campaign.id } });
  };

  const openDetail = (campaign: ExploreCampaign) => {
    router.push({ pathname: "/campaigns/[id]", params: { id: campaign.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={campaignQuery.campaigns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={campaignQuery.refetch} tintColor={colors.primary} />}
        onEndReachedThreshold={0.45}
        onEndReached={() => {
          if (campaignQuery.hasNextPage && !campaignQuery.isFetchingNextPage) {
            campaignQuery.fetchNextPage();
          }
        }}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.heading}>Discover</Text>
                <Text style={styles.subheading}>Campaigns matched for you</Text>
              </View>
              <View style={styles.headerActions}>
                <IconButton icon="chatbubble-ellipses-outline" dot />
                <IconButton icon="notifications-outline" dot />
              </View>
            </View>

            <View style={styles.searchShell}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search campaigns..."
                placeholderTextColor={colors.textFaint}
                style={styles.searchInput}
                returnKeyType="search"
              />
              {searchText ? (
                <Pressable accessibilityRole="button" onPress={() => setSearchText("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>

            <KycPendingBanner kycStatus={kycStatus} />

            <FilterBar
              filters={filters}
              activeCount={activeCount}
              onOpenFilters={() => setFilterSheetOpen(true)}
              onRemoveCategory={removeCategory}
              onClearField={clearField}
              onClearAll={clearAll}
            />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {typeof campaignQuery.total === "number" ? `${campaignQuery.total} campaigns found` : "Showing matches for you"}
              </Text>
              {campaignQuery.isFetching && !campaignQuery.isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            kycStatus={kycStatus}
            onPress={() => openDetail(item)}
            onSave={() => saveCampaign.mutate({ campaignId: item.id, isSaved: item.saved })}
            onApply={() => openApply(item)}
            onKycRequired={() => setKycModalOpen(true)}
          />
        )}
        ListFooterComponent={
          campaignQuery.isFetchingNextPage ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          campaignQuery.isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="search-outline" size={34} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No campaigns found</Text>
              <Text style={styles.emptyBody}>Try adjusting your filters or search for something different.</Text>
              {activeCount > 0 ? (
                <Pressable accessibilityRole="button" onPress={clearAll} style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Clear filters</Text>
                </Pressable>
              ) : null}
            </View>
          )
        }
      />

      <FilterSheet visible={filterSheetOpen} filters={filters} onClose={() => setFilterSheetOpen(false)} onApply={applyFilters} onReset={clearAll} />
      <KycRequiredModal visible={kycModalOpen} kycStatus={kycStatus} onClose={() => setKycModalOpen(false)} />
    </SafeAreaView>
  );
}

function IconButton({ icon, dot }: { icon: keyof typeof Ionicons.glyphMap; dot?: boolean }) {
  return (
    <View style={styles.iconButton}>
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
      {dot ? <View style={styles.dot} /> : null}
    </View>
  );
}

function KycRequiredModal({ visible, kycStatus, onClose }: { visible: boolean; kycStatus: string | null; onClose: () => void }) {
  const rejected = kycStatus === "REJECTED";
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.kycSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>KYC Verification Required</Text>
          <Text style={styles.modalBody}>
            {rejected
              ? "Complete identity verification to apply for campaigns. You can resubmit your documents now."
              : "Complete identity verification to apply for campaigns. Your documents are under review."}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (rejected) {
                onClose();
                router.push("/(onboarding)/kyc");
              } else {
                onClose();
              }
            }}
            style={[styles.modalButton, rejected ? null : styles.modalButtonMuted]}
          >
            <Text style={[styles.modalButtonText, rejected ? null : styles.modalButtonTextMuted]}>{rejected ? "Go to KYC" : "Got it"}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function countActiveFilters(filters: ExploreFilters) {
  return (
    filters.category.length +
    (filters.budgetMin ? 1 : 0) +
    (filters.budgetMax ? 1 : 0) +
    (filters.platform !== "ANY" ? 1 : 0) +
    (filters.compensationType !== "ANY" ? 1 : 0) +
    (filters.search.trim() ? 1 : 0)
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 29
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "400",
    marginTop: 3
  },
  headerActions: {
    flexDirection: "row",
    gap: 9
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  dot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.error
  },
  searchShell: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: "rgba(91,79,233,0.06)",
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    padding: 0
  },
  summaryRow: {
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  separator: {
    height: 12
  },
  footerLoading: {
    paddingVertical: 20
  },
  loadingState: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyState: {
    minHeight: 340,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22
  },
  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(91,79,233,0.07)",
    marginBottom: 18
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20
  },
  emptyButton: {
    minHeight: 44,
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.primary,
    paddingHorizontal: 22
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26,26,46,0.40)"
  },
  kycSheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.surfaceSolid,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30
  },
  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    marginBottom: 20
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 10
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20
  },
  modalButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary
  },
  modalButtonMuted: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  modalButtonTextMuted: {
    color: colors.textPrimary
  }
});
