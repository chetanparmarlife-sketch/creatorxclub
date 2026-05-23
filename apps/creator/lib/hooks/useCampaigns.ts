import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Platform } from "@/store/onboarding";

export type CompensationType = "CASH" | "GIFTING" | "DIGITAL" | "MIXED";

export type ExploreFilters = {
  category: string[];
  budgetMin: string;
  budgetMax: string;
  platform: Platform | "ANY";
  compensationType: CompensationType | "ANY";
  search: string;
};

export type ExploreCampaign = {
  id: string;
  brandName: string;
  brandLogoUrl?: string | null;
  brandVerified: boolean;
  title: string;
  nicheCategories: string[];
  targetPlatforms: Platform[];
  compensationType: CompensationType;
  aiMatchScore: number;
  creatorNetPayout: number;
  slaDays: number;
  saved: boolean;
};

export type CampaignPage = {
  campaigns: ExploreCampaign[];
  page: number;
  totalPages: number;
  total: number | null;
  last: boolean;
};

type SaveContext = {
  previous?: Array<[readonly unknown[], InfiniteData<CampaignPage>]>;
};

const PAGE_SIZE = 10;

export function useExploreCampaigns(filters: ExploreFilters) {
  const query = useInfiniteQuery({
    queryKey: ["explore-campaigns", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const params = {
        category: filters.category.length ? filters.category.join(",") : undefined,
        budgetMin: numberParam(filters.budgetMin),
        budgetMax: numberParam(filters.budgetMax),
        platform: filters.platform === "ANY" ? undefined : filters.platform,
        compensationType: filters.compensationType === "ANY" ? undefined : filters.compensationType,
        search: filters.search.trim() || undefined,
        page: pageParam,
        limit: PAGE_SIZE
      };
      const { data } = await api.get("/api/campaigns", { params });
      return normalizeCampaignPage(data, Number(pageParam));
    },
    getNextPageParam: (lastPage, pages) => (lastPage.last ? undefined : pages.length)
  });

  return {
    ...query,
    campaigns: query.data?.pages.flatMap((page) => page.campaigns) ?? [],
    total: query.data?.pages[0]?.total ?? null,
    isFetching: query.isFetching,
    isLoading: query.isLoading
  };
}

export function useSaveCampaign() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { campaignId: string; isSaved: boolean }, SaveContext>({
    mutationFn: async ({ campaignId, isSaved }) => {
      if (isSaved) {
        await api.delete(`/api/creators/saved-campaigns/${campaignId}`);
      } else {
        await api.post(`/api/creators/saved-campaigns/${campaignId}`);
      }
    },
    onMutate: async ({ campaignId }) => {
      await queryClient.cancelQueries({ queryKey: ["explore-campaigns"] });
      const previous = queryClient
        .getQueriesData<InfiniteData<CampaignPage>>({ queryKey: ["explore-campaigns"] })
        .filter((entry): entry is [readonly unknown[], InfiniteData<CampaignPage>] => Boolean(entry[1]));

      previous.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<InfiniteData<CampaignPage>>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            campaigns: page.campaigns.map((campaign) =>
              campaign.id === campaignId ? { ...campaign, saved: !campaign.saved } : campaign
            )
          }))
        });
      });

      return { previous };
    },
    onError: (_error, _campaignId, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["explore-campaigns"] });
    }
  });
}

function normalizeCampaignPage(payload: any, fallbackPage: number): CampaignPage {
  const rawCampaigns = payload?.campaigns ?? payload?.content ?? payload?.items ?? payload?.data ?? [];
  const page = Number(payload?.page ?? payload?.number ?? fallbackPage);
  const totalPages = Number(payload?.totalPages ?? payload?.pageCount ?? (payload?.hasNext ? page + 1 : page));
  const total = typeof payload?.total === "number" ? payload.total : typeof payload?.totalElements === "number" ? payload.totalElements : null;
  const last = typeof payload?.last === "boolean" ? payload.last : page + 1 >= totalPages;

  return {
    campaigns: Array.isArray(rawCampaigns) ? rawCampaigns.map(normalizeCampaign) : [],
    page,
    totalPages: Math.max(totalPages, page),
    total,
    last
  };
}

function normalizeCampaign(campaign: any): ExploreCampaign {
  const brand = campaign.brand ?? campaign.brandProfile ?? {};
  const compensationType = String(campaign.compensationType ?? "CASH").toUpperCase() as CompensationType;
  return {
    id: String(campaign.id),
    brandName: campaign.brandName ?? brand.companyName ?? brand.name ?? "CreatorX Brand",
    brandLogoUrl: campaign.brandLogoUrl ?? brand.logoUrl ?? null,
    brandVerified: Boolean(campaign.brandVerified ?? brand.verified ?? brand.verificationStatus === "APPROVED"),
    title: campaign.title ?? "Untitled campaign",
    nicheCategories: toStringArray(campaign.nicheCategories ?? campaign.categories),
    targetPlatforms: toStringArray(campaign.targetPlatforms ?? campaign.platforms).filter(isPlatform),
    compensationType,
    aiMatchScore: Number(campaign.aiMatchScore ?? campaign.matchScore ?? campaign.matchPercentage ?? 0),
    creatorNetPayout: Number(campaign.creatorNetPayout ?? campaign.creatorPayout ?? campaign.payout ?? 0),
    slaDays: Number(campaign.slaDays ?? campaign.deadlineDays ?? campaign.deliverWithinDays ?? 14),
    saved: Boolean(campaign.saved ?? campaign.isSaved)
  };
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

function isPlatform(value: string): value is Platform {
  return value === "INSTAGRAM" || value === "YOUTUBE" || value === "TIKTOK";
}

function numberParam(value: string) {
  const normalized = value.replace(/\D/g, "");
  return normalized ? Number(normalized) : undefined;
}
