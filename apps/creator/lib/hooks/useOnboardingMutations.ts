import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Platform } from "@/store/onboarding";

type UpdateProfilePayload = {
  nicheCategories?: string[];
  primaryPlatform?: Platform;
  targetBudgetMin?: number;
  targetBudgetMax?: number;
  audienceDemographics?: {
    ageRanges?: string[];
    genderDistribution?: string;
  };
};

type ConnectSocialPayload = {
  platform: Platform;
  accessToken: string;
  followerCount: number;
  engagementRate: number;
};

type SubmitKycPayload = {
  idFrontUrl: string;
  idBackUrl: string;
  selfieUrl: string;
};

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.put("/api/creators/profile", payload);
      return data;
    }
  });
}

export function useConnectSocial() {
  return useMutation({
    mutationFn: async (payload: ConnectSocialPayload) => {
      const { data } = await api.post("/api/creators/social-accounts", payload);
      return data;
    }
  });
}

export function useSubmitKyc() {
  return useMutation({
    mutationFn: async (payload: SubmitKycPayload) => {
      const { data } = await api.post("/api/creators/kyc", payload);
      return data;
    }
  });
}
