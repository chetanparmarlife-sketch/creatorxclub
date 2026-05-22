import { create } from "zustand";

export type Platform = "INSTAGRAM" | "YOUTUBE" | "TIKTOK";
export type GenderDistribution = "Any" | "Mostly Male" | "Mostly Female" | "Mixed";

export type SocialConnection = {
  platform: Platform;
  accessToken: string;
  followerCount: number;
  engagementRate: number;
};

export type KycAsset = {
  uri: string;
  fileName: string;
  mimeType?: string;
};

type OnboardingState = {
  nicheCategories: string[];
  primaryPlatform: Platform | null;
  targetBudgetMin: string;
  targetBudgetMax: string;
  ageRanges: string[];
  genderDistribution: GenderDistribution;
  socialAccounts: Partial<Record<Platform, SocialConnection>>;
  kyc: {
    idFront: KycAsset | null;
    idBack: KycAsset | null;
    selfie: KycAsset | null;
  };
  setNiches: (niches: string[]) => void;
  toggleNiche: (niche: string) => boolean;
  setPlatform: (platform: Platform) => void;
  setBudget: (field: "min" | "max", value: string) => void;
  toggleAgeRange: (ageRange: string) => void;
  setGenderDistribution: (gender: GenderDistribution) => void;
  setSocialConnection: (connection: SocialConnection) => void;
  disconnectSocial: (platform: Platform) => void;
  setKycAsset: (key: keyof OnboardingState["kyc"], asset: KycAsset | null) => void;
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  nicheCategories: [],
  primaryPlatform: null,
  targetBudgetMin: "",
  targetBudgetMax: "",
  ageRanges: [],
  genderDistribution: "Any",
  socialAccounts: {},
  kyc: {
    idFront: null,
    idBack: null,
    selfie: null
  },

  setNiches: (nicheCategories) => set({ nicheCategories }),

  toggleNiche: (niche) => {
    const current = get().nicheCategories;
    if (current.includes(niche)) {
      set({ nicheCategories: current.filter((item) => item !== niche) });
      return true;
    }
    if (current.length >= 3) {
      return false;
    }
    set({ nicheCategories: [...current, niche] });
    return true;
  },

  setPlatform: (primaryPlatform) => set({ primaryPlatform }),

  setBudget: (field, value) => {
    const normalized = value.replace(/\D/g, "");
    set(field === "min" ? { targetBudgetMin: normalized } : { targetBudgetMax: normalized });
  },

  toggleAgeRange: (ageRange) => {
    const current = get().ageRanges;
    set({ ageRanges: current.includes(ageRange) ? current.filter((item) => item !== ageRange) : [...current, ageRange] });
  },

  setGenderDistribution: (genderDistribution) => set({ genderDistribution }),

  setSocialConnection: (connection) =>
    set((state) => ({
      socialAccounts: {
        ...state.socialAccounts,
        [connection.platform]: connection
      }
    })),

  disconnectSocial: (platform) =>
    set((state) => {
      const next = { ...state.socialAccounts };
      delete next[platform];
      return { socialAccounts: next };
    }),

  setKycAsset: (key, asset) =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        [key]: asset
      }
    }))
}));

export function currencyNumber(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export function formatInr(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}
