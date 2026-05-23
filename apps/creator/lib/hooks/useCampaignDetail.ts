import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CampaignPage } from "@/lib/hooks/useCampaigns";
import { CompensationType } from "@/lib/hooks/useCampaigns";
import { Platform } from "@/store/onboarding";

export type UsageRights = {
  exclusive: boolean;
  exclusivityPeriod?: string | null;
  usageDuration?: string | null;
  territorialScope?: string | null;
  restrictions: string[];
};

export type DeliverableRequirement = {
  contentType: string;
  description: string;
  quantity: number;
  platform?: Platform | null;
};

export type InventoryProduct = {
  id: string;
  productName: string;
  imageUrl?: string | null;
  value: number;
  stockCount: number;
  quantity: number;
};

export type BrandProfile = {
  id: string;
  companyName: string;
  logoUrl?: string | null;
  verified: boolean;
  description?: string | null;
  totalCampaigns: number;
  averageRating: number;
  reviewCount: number;
  averagePayout: number;
};

export type PastCampaignExample = {
  id: string;
  title: string;
  imageUrl?: string | null;
};

export type CampaignDetail = {
  id: string;
  title: string;
  description: string;
  postedAt?: string | null;
  brand: BrandProfile;
  targetPlatforms: Platform[];
  nicheCategories: string[];
  compensationType: CompensationType;
  creatorPayout: number;
  creatorNetPayout: number;
  fixedServiceFee: number;
  negotiationEnabled: boolean;
  deliverableRequirements: DeliverableRequirement[];
  keyRequirements: string[];
  slaDays: number;
  usageRights: UsageRights;
  inventoryItems: InventoryProduct[];
  pastCampaignExamples: PastCampaignExample[];
};

type ToggleSaveVariables = {
  campaignId: string;
  saved: boolean;
};

type ToggleSaveContext = {
  previousSaved?: string[];
  previousDetail?: CampaignDetail;
  previousExplore?: Array<[readonly unknown[], InfiniteData<CampaignPage>]>;
};

export function useCampaignDetail(campaignId?: string) {
  return useQuery({
    queryKey: ["campaign-detail", campaignId],
    enabled: Boolean(campaignId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const { data } = await api.get(`/api/campaigns/${campaignId}`);
      return normalizeCampaignDetail(data);
    }
  });
}

export function useSavedCampaigns() {
  return useQuery({
    queryKey: ["saved-campaigns"],
    queryFn: async () => {
      const { data } = await api.get("/api/creators/saved-campaigns");
      return normalizeSavedIds(data);
    }
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ToggleSaveVariables, ToggleSaveContext>({
    mutationFn: async ({ campaignId, saved }) => {
      if (saved) {
        await api.delete(`/api/creators/saved-campaigns/${campaignId}`);
      } else {
        await api.post(`/api/creators/saved-campaigns/${campaignId}`);
      }
    },
    onMutate: async ({ campaignId, saved }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["saved-campaigns"] }),
        queryClient.cancelQueries({ queryKey: ["campaign-detail", campaignId] }),
        queryClient.cancelQueries({ queryKey: ["explore-campaigns"] })
      ]);

      const previousSaved = queryClient.getQueryData<string[]>(["saved-campaigns"]);
      const previousDetail = queryClient.getQueryData<CampaignDetail>(["campaign-detail", campaignId]);
      const previousExplore = queryClient
        .getQueriesData<InfiniteData<CampaignPage>>({ queryKey: ["explore-campaigns"] })
        .filter((entry): entry is [readonly unknown[], InfiniteData<CampaignPage>] => Boolean(entry[1]));

      queryClient.setQueryData<string[]>(["saved-campaigns"], (current = []) =>
        saved ? current.filter((id) => id !== campaignId) : Array.from(new Set([...current, campaignId]))
      );

      previousExplore.forEach(([queryKey, data]) => {
        queryClient.setQueryData<InfiniteData<CampaignPage>>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            campaigns: page.campaigns.map((campaign) =>
              campaign.id === campaignId ? { ...campaign, saved: !saved } : campaign
            )
          }))
        });
      });

      return { previousSaved, previousDetail, previousExplore };
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData(["saved-campaigns"], context?.previousSaved);
      queryClient.setQueryData(["campaign-detail", variables.campaignId], context?.previousDetail);
      context?.previousExplore?.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["saved-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-detail", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["explore-campaigns"] });
    }
  });
}

function normalizeCampaignDetail(payload: any): CampaignDetail {
  const brand = payload.brand ?? payload.brandProfile ?? {};
  const compensationType = String(payload.compensationType ?? "CASH").toUpperCase() as CompensationType;
  const creatorPayout = numberValue(payload.creatorPayout ?? payload.grossPayout ?? payload.totalBudget);
  const creatorNetPayout = numberValue(payload.creatorNetPayout ?? payload.netPayout ?? creatorPayout * 0.9);
  const deliverables = normalizeDeliverables(payload.deliverableRequirements);
  const usageRights = normalizeUsageRights(payload.usageRights);

  return {
    id: String(payload.id),
    title: payload.title ?? "Untitled campaign",
    description: payload.description ?? payload.brief ?? "",
    postedAt: payload.postedAt ?? payload.createdAt ?? null,
    brand: {
      id: String(brand.id ?? brand.userId ?? payload.brandId ?? ""),
      companyName: payload.brandName ?? brand.companyName ?? brand.name ?? "CreatorX Brand",
      logoUrl: payload.brandLogoUrl ?? brand.logoUrl ?? null,
      verified: Boolean(payload.brandVerified ?? brand.verified ?? brand.verificationStatus === "APPROVED"),
      description: brand.description ?? brand.bio ?? null,
      totalCampaigns: numberValue(brand.totalCampaigns ?? brand.campaignCount ?? payload.brandTotalCampaigns),
      averageRating: numberValue(brand.averageRating ?? brand.rating ?? payload.brandAverageRating ?? 0),
      reviewCount: numberValue(brand.reviewCount ?? brand.reviewsCount ?? payload.brandReviewCount ?? 0),
      averagePayout: numberValue(brand.averagePayout ?? payload.brandAveragePayout ?? 0)
    },
    targetPlatforms: toStringArray(payload.targetPlatforms ?? payload.platforms).filter(isPlatform),
    nicheCategories: toStringArray(payload.nicheCategories ?? payload.categories),
    compensationType,
    creatorPayout,
    creatorNetPayout,
    fixedServiceFee: numberValue(payload.fixedServiceFee),
    negotiationEnabled: Boolean(payload.negotiationEnabled),
    deliverableRequirements: deliverables,
    keyRequirements: normalizeRequirements(payload.keyRequirements ?? payload.requirements ?? deliverables.map((item) => item.description)),
    slaDays: numberValue(payload.slaDays ?? payload.deadlineDays ?? payload.slaTerms ?? 14),
    usageRights,
    inventoryItems: normalizeInventory(payload.inventoryItems ?? payload.inventory),
    pastCampaignExamples: normalizeExamples(payload.pastCampaignExamples ?? payload.previousWork ?? payload.examples)
  };
}

function normalizeSavedIds(payload: any): string[] {
  const raw = payload?.campaignIds ?? payload?.savedCampaignIds ?? payload?.items ?? payload?.data ?? payload ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => String(typeof item === "object" ? item.id ?? item.campaignId : item));
}

function normalizeDeliverables(value: unknown): DeliverableRequirement[] {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) {
    return parsed.map((item, index) => ({
      contentType: String(item.contentType ?? item.type ?? "Content"),
      description: String(item.description ?? item.label ?? item.contentType ?? `Deliverable ${index + 1}`),
      quantity: numberValue(item.quantity ?? item.count ?? 1) || 1,
      platform: isPlatform(String(item.platform)) ? String(item.platform) as Platform : null
    }));
  }
  if (parsed && typeof parsed === "object") {
    const item = parsed as any;
    return [{
      contentType: String(item.contentType ?? "Content"),
      description: String(item.description ?? item.contentType ?? "Campaign content"),
      quantity: numberValue(item.quantity ?? 1) || 1,
      platform: isPlatform(String(item.platform)) ? String(item.platform) as Platform : null
    }];
  }
  return [];
}

function normalizeUsageRights(value: unknown): UsageRights {
  const parsed = parseJson(value);
  const rights = parsed && typeof parsed === "object" ? parsed as any : {};
  const exclusivity = rights.exclusivity ?? rights.exclusive;
  const exclusive = exclusivity === true || (typeof exclusivity === "string" && !["none", "non-exclusive", "nonexclusive", "false"].includes(exclusivity.toLowerCase()));
  return {
    exclusive,
    exclusivityPeriod: rights.exclusivityPeriod ?? rights.exclusivity_period ?? rights.exclusivity ?? null,
    usageDuration: rights.usageDuration ?? rights.duration ?? null,
    territorialScope: rights.territorialScope ?? rights.territory ?? rights.scope ?? null,
    restrictions: toStringArray(rights.restrictions ?? rights.contentRestrictions)
  };
}

function normalizeInventory(value: unknown): InventoryProduct[] {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item, index) => ({
    id: String(item.id ?? item.inventoryItemId ?? index),
    productName: String(item.productName ?? item.name ?? "Gifted product"),
    imageUrl: Array.isArray(item.images) ? item.images[0] : item.imageUrl ?? item.image ?? null,
    value: numberValue(item.value ?? item.productValue),
    stockCount: numberValue(item.stockCount ?? item.stock_count ?? item.stock),
    quantity: numberValue(item.quantity ?? 1) || 1
  }));
}

function normalizeExamples(value: unknown): PastCampaignExample[] {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item, index) => ({
    id: String(item.id ?? index),
    title: String(item.title ?? item.caption ?? "Previous campaign"),
    imageUrl: item.imageUrl ?? item.thumbnailUrl ?? item.url ?? null
  }));
}

function normalizeRequirements(value: unknown): string[] {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) return parsed.map((item) => String(item.description ?? item));
  if (typeof parsed === "string") return parsed ? [parsed] : [];
  return [];
}

function parseJson(value: unknown): any {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function toStringArray(value: unknown): string[] {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) return parsed.map(String);
  if (typeof parsed === "string" && parsed) return [parsed];
  return [];
}

function isPlatform(value: string): value is Platform {
  return value === "INSTAGRAM" || value === "YOUTUBE" || value === "TIKTOK";
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
