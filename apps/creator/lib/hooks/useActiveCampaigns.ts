import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CompensationType } from "@/lib/hooks/useCampaigns";

export type DeliverableStatus = "NOT_SUBMITTED" | "PENDING_REVIEW" | "REVISION_REQUESTED" | "APPROVED" | "REJECTED";
export type ActiveCampaignStatus = "IN_PROGRESS" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PROCESSING" | "PAID";
export type ContractStatus = "NOT_READY" | "READY" | "CREATOR_SIGNED" | "COMPLETED";

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type ActiveCampaign = {
  campaignId: string;
  title: string;
  brandName: string;
  brandLogoUrl?: string | null;
  compensationType: CompensationType;
  applicationId: string;
  deliverableId?: string | null;
  deliverableStatus: DeliverableStatus;
  slaDeadline?: string | null;
  productReceiptConfirmed: boolean;
  campaignStatus: ActiveCampaignStatus;
  creatorNetPayout: number;
  paymentStatus: PaymentStatus;
  transactionReference?: string | null;
  paidAt?: string | null;
};

export type DeliverableRequirement = {
  contentType: string;
  description: string;
  quantity: number;
};

export type DeliverableSubmission = {
  id: string;
  contentFiles: string[];
  captions?: string | null;
  hashtags?: string[];
  submittedAt?: string | null;
  status: DeliverableStatus;
  revisionNotes?: string | null;
  contractStatus: ContractStatus;
};

export type ActiveCampaignDetail = ActiveCampaign & {
  description: string;
  keyRequirements: string[];
  deliverableRequirements: DeliverableRequirement[];
  applicationStatus: string;
  shippingAddress?: ShippingAddress | null;
  postingInstructions?: string | null;
  slaTerms?: string | null;
  creatorPayout: number;
  platformFee: number;
  deliverables: DeliverableSubmission[];
};

export function useActiveCampaigns() {
  return useQuery({
    queryKey: ["active-campaigns"],
    staleTime: 60 * 1000,
    queryFn: async () => {
      const { data } = await api.get("/api/creators/active-campaigns");
      const raw = data?.campaigns ?? data?.content ?? data?.items ?? data?.data ?? data ?? [];
      return Array.isArray(raw) ? raw.map(normalizeActiveCampaign) : [];
    }
  });
}

export function useActiveCampaignDetail(campaignId?: string) {
  return useQuery({
    queryKey: ["active-campaigns", campaignId],
    enabled: Boolean(campaignId),
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get(`/api/creators/active-campaigns/${campaignId}`);
      return normalizeActiveCampaignDetail(data);
    }
  });
}

export function useConfirmProductReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ deliverableId }: { deliverableId: string; campaignId: string }) => {
      const { data } = await api.post(`/api/deliverables/${deliverableId}/confirm-receipt`);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["active-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["active-campaigns", variables.campaignId] });
    }
  });
}

export function useUpdateShippingAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId: _campaignId, ...address }: ShippingAddress & { campaignId: string }) => {
      const { data } = await api.put("/api/creators/shipping-address", address);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["active-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["active-campaigns", variables.campaignId] });
    }
  });
}

export function useDeliverable(deliverableId?: string | null) {
  return useQuery({
    queryKey: ["deliverables", deliverableId],
    enabled: Boolean(deliverableId),
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get(`/api/deliverables/${deliverableId}`);
      return normalizeDeliverables(data)[0];
    }
  });
}

export type SubmitDeliverablePayload = {
  campaignId: string;
  applicationId?: string;
  deliverableId?: string | null;
  contentFiles: string[];
  captions: string;
  hashtags: string[];
  postingInstructions?: string | null;
};

export function useSubmitDeliverable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ deliverableId, ...payload }: SubmitDeliverablePayload) => {
      if (deliverableId) {
        const { data } = await api.put(`/api/deliverables/${deliverableId}`, {
          contentFiles: payload.contentFiles,
          captions: payload.captions,
          hashtags: payload.hashtags
        });
        return data;
      }

      const { data } = await api.post("/api/deliverables", payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["active-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["active-campaigns", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["deliverables"] });
    }
  });
}

function normalizeActiveCampaign(payload: any): ActiveCampaign {
  const campaign = payload?.campaign ?? payload ?? {};
  const brand = payload?.brand ?? payload?.brandProfile ?? campaign.brand ?? {};
  const deliverable = first(payload?.deliverables) ?? payload?.deliverable ?? {};
  const deliverableStatus = normalizeDeliverableStatus(payload.deliverableStatus ?? deliverable.status);
  const creatorNetPayout = numberValue(payload.creatorNetPayout ?? payload.netPayout ?? campaign.creatorNetPayout ?? campaign.creatorPayout);

  return {
    campaignId: String(payload.campaignId ?? campaign.id ?? payload.id ?? ""),
    title: String(payload.title ?? campaign.title ?? "Untitled campaign"),
    brandName: String(payload.brandName ?? brand.companyName ?? brand.name ?? "CreatorX Brand"),
    brandLogoUrl: payload.brandLogoUrl ?? brand.logoUrl ?? null,
    compensationType: normalizeCompensation(payload.compensationType ?? campaign.compensationType),
    applicationId: String(payload.applicationId ?? payload.application?.id ?? ""),
    deliverableId: payload.deliverableId ?? deliverable.id ?? null,
    deliverableStatus,
    slaDeadline: payload.slaDeadline ?? deliverable.slaDeadline ?? null,
    productReceiptConfirmed: Boolean(payload.productReceiptConfirmed ?? deliverable.productReceiptConfirmed),
    campaignStatus: deliverableStatus === "APPROVED" ? "COMPLETED" : "IN_PROGRESS",
    creatorNetPayout,
    paymentStatus: normalizePaymentStatus(payload.paymentStatus),
    transactionReference: payload.transactionReference ?? null,
    paidAt: payload.paidAt ?? null
  };
}

function normalizeActiveCampaignDetail(payload: any): ActiveCampaignDetail {
  const base = normalizeActiveCampaign(payload);
  const campaign = payload?.campaign ?? payload ?? {};
  const deliverables = normalizeDeliverables(payload?.deliverables ?? payload?.submissions ?? payload?.deliverable);
  const creatorPayout = numberValue(payload.creatorPayout ?? campaign.creatorPayout ?? base.creatorNetPayout / 0.9);
  const platformFee = numberValue(payload.platformFee ?? Math.max(creatorPayout - base.creatorNetPayout, creatorPayout * 0.1));

  return {
    ...base,
    description: String(payload.description ?? campaign.description ?? campaign.brief ?? ""),
    keyRequirements: normalizeRequirements(payload.keyRequirements ?? payload.requirements),
    deliverableRequirements: normalizeRequirementsList(payload.deliverableRequirements ?? campaign.deliverableRequirements),
    applicationStatus: String(payload.applicationStatus ?? payload.application?.status ?? "APPROVED"),
    shippingAddress: normalizeShippingAddress(payload.shippingAddress),
    postingInstructions: payload.postingInstructions ?? campaign.postingInstructions ?? null,
    slaTerms: payload.slaTerms ?? campaign.slaTerms ?? null,
    creatorPayout,
    platformFee,
    deliverables
  };
}

function normalizeDeliverables(value: unknown): DeliverableSubmission[] {
  const parsed = parseJson(value);
  const list = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  return list.map((item: any, index) => ({
    id: String(item.id ?? item.deliverableId ?? index),
    contentFiles: toStringArray(item.contentFiles ?? item.files ?? item.media),
    captions: item.captions ?? item.caption ?? null,
    hashtags: toStringArray(item.hashtags),
    submittedAt: item.submittedAt ?? item.createdAt ?? null,
    status: normalizeDeliverableStatus(item.status),
    revisionNotes: item.revisionNotes ?? item.feedback ?? null,
    contractStatus: normalizeContractStatus(item.contractStatus ?? item.digitalContract?.status ?? item.contract?.status)
  }));
}

function normalizeRequirementsList(value: unknown): DeliverableRequirement[] {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item: any, index) => ({
    contentType: String(item.contentType ?? item.type ?? "Content"),
    description: String(item.description ?? item.label ?? item.contentType ?? `Deliverable ${index + 1}`),
    quantity: numberValue(item.quantity ?? item.count ?? 1) || 1
  }));
}

function normalizeRequirements(value: unknown): string[] {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) {
    return parsed.map((item: any) => String(item.description ?? item.label ?? item));
  }
  if (typeof parsed === "string" && parsed) return [parsed];
  return [];
}

function normalizeShippingAddress(value: unknown): ShippingAddress | null {
  const parsed = parseJson(value);
  if (!parsed || typeof parsed !== "object") return null;
  const address = parsed as any;
  return {
    street: String(address.street ?? address.streetAddress ?? ""),
    city: String(address.city ?? ""),
    state: String(address.state ?? ""),
    pincode: String(address.pincode ?? address.postalCode ?? ""),
    country: String(address.country ?? "India")
  };
}

function normalizeDeliverableStatus(value: unknown): DeliverableStatus {
  const status = String(value ?? "NOT_SUBMITTED").toUpperCase();
  if (status === "PENDING_REVIEW" || status === "REVISION_REQUESTED" || status === "APPROVED" || status === "REJECTED") return status;
  return "NOT_SUBMITTED";
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const status = String(value ?? "PENDING").toUpperCase();
  if (status === "PROCESSING" || status === "PAID") return status;
  return "PENDING";
}

function normalizeContractStatus(value: unknown): ContractStatus {
  const status = String(value ?? "NOT_READY").toUpperCase();
  if (status === "READY" || status === "CREATOR_SIGNED" || status === "COMPLETED") return status;
  return "NOT_READY";
}

function normalizeCompensation(value: unknown): CompensationType {
  const type = String(value ?? "CASH").toUpperCase();
  if (type === "GIFTING" || type === "DIGITAL" || type === "MIXED") return type;
  return "CASH";
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

function first(value: unknown): any {
  return Array.isArray(value) ? value[0] : undefined;
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
