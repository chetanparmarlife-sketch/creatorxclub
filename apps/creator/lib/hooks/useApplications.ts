import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api";

export type MyApplication = {
  id: string;
  status: string;
  createdAt?: string | null;
};

type SubmitApplicationPayload = {
  campaignId: string;
  pitchMessage: string;
  portfolioLinks: string[];
  proposedPrice: number | null;
};

export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, pitchMessage, portfolioLinks, proposedPrice }: SubmitApplicationPayload) => {
      const { data } = await api.post(`/api/campaigns/${campaignId}/applications`, {
        pitchMessage,
        portfolioLinks,
        proposedPrice
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaign-detail", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["my-campaign-application", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });
}

export function useMyApplicationForCampaign(campaignId?: string) {
  return useQuery<MyApplication | null>({
    queryKey: ["my-campaign-application", campaignId],
    enabled: Boolean(campaignId),
    staleTime: 30 * 1000,
    retry: false,
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/campaigns/${campaignId}/my-application`);
        return {
          id: String(data.id),
          status: String(data.status ?? "PENDING"),
          createdAt: data.createdAt ?? data.created_at ?? null
        };
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) return null;
        throw error;
      }
    }
  });
}
