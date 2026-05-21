export type UserType = "creator" | "brand" | "admin";
export type UserStatus = "active" | "suspended" | "pending_deletion";
export type Platform = "instagram" | "youtube" | "tiktok";
export type KycStatus = "pending" | "approved" | "rejected";
export type BrandVerificationStatus = "pending" | "approved" | "rejected";
export type BrandRole = "owner" | "manager" | "viewer";
export type InvitationStatus = "pending" | "accepted";
export type CompensationType = "cash" | "gifting" | "digital" | "mixed";
export type CampaignStatus = "draft" | "pending_moderation" | "live" | "paused" | "completed" | "cancelled";
export type ApplicationStatus = "pending" | "shortlisted" | "approved" | "rejected" | "countered";
export type DeliverableStatus = "pending_review" | "revision_requested" | "approved" | "rejected";
export type ContractStatus = "pending" | "completed";
export type TransactionType = "deposit" | "escrow_lock" | "escrow_release" | "withdrawal" | "fee" | "refund" | "referral_credit";
export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export type ChatFlagStatus = "none" | "user_flagged" | "auto_flagged";
export type DisputeReason = "quality_issue" | "non_payment" | "contract_breach" | "non_compliance" | "other";
export type DisputeStatus = "open" | "under_review" | "resolved_creator" | "resolved_brand";
export type EventOrganizerType = "creator" | "admin";
export type EventType = "virtual" | "physical";
export type SponsorshipStatus = "unsponsored" | "pending" | "sponsored";
export type EventRegistrationStatus = "registered" | "attended" | "cancelled";
export type EventSponsorshipState = "pending" | "active" | "completed";
export type NotificationType =
  | "kyc_status"
  | "application_status"
  | "deliverable_status"
  | "payment_received"
  | "chat_message"
  | "dispute_update"
  | "event_reminder"
  | "campaign_moderation";
export type ReferralStatus = "pending" | "completed";

export interface Timestamped {
  createdAt: string;
  updatedAt?: string;
}

export interface User extends Timestamped {
  id: string;
  email: string;
  phoneNumber?: string;
  passwordHash?: string;
  userType: UserType;
  status: UserStatus;
  notificationPreferences?: Record<string, unknown>;
}

export interface CreatorProfile {
  userId: string;
  displayName: string;
  bio?: string;
  nicheCategories: string[];
  primaryPlatform?: Platform;
  targetBudgetRange?: {
    min: number;
    max: number;
  };
  audienceDemographics?: Record<string, unknown>;
  followerCount?: number;
  engagementRate?: number;
  kycStatus: KycStatus;
  kycDocuments?: {
    idFrontUrl?: string;
    idBackUrl?: string;
    selfieUrl?: string;
  };
  referralCode: string;
  availableBalance: number;
}

export interface SocialAccount {
  id: string;
  creatorId: string;
  platform: Platform;
  handle?: string;
  followerCount: number;
  engagementRate: number;
  syncedAt: string;
}

export interface Brand {
  userId: string;
  companyName: string;
  taxId: string;
  gstDocuments?: string[];
  verificationStatus: BrandVerificationStatus;
  walletBalance: number;
  escrowAllocated: number;
  totalSpent: number;
}

export interface BrandTeamMember {
  id: string;
  brandId: string;
  userId?: string;
  email: string;
  role: BrandRole;
  invitationStatus: InvitationStatus;
  createdAt: string;
}

export interface Campaign extends Timestamped {
  id: string;
  brandId: string;
  title: string;
  description: string;
  nicheCategories: string[];
  targetPlatforms: Platform[];
  deliverableRequirements: Record<string, unknown>;
  slaTerms: string;
  usageRights: Record<string, unknown>;
  compensationType: CompensationType;
  totalBudget: number;
  creatorPayout: number;
  fixedServiceFee?: number;
  negotiationEnabled: boolean;
  status: CampaignStatus;
  escrowLocked: boolean;
  inventoryItems?: Array<{
    inventoryItemId: string;
    quantity: number;
  }>;
}

export interface InventoryItem {
  id: string;
  brandId: string;
  productName: string;
  description?: string;
  value: number;
  stockCount: number;
  sku?: string;
  images: string[];
  isActive: boolean;
}

export interface Application extends Timestamped {
  id: string;
  campaignId: string;
  creatorId: string;
  pitchMessage: string;
  proposedPrice?: number;
  portfolioLinks?: string[];
  status: ApplicationStatus;
  brandFeedback?: string;
  counterOfferAmount?: number;
}

export interface Deliverable {
  id: string;
  applicationId: string;
  campaignId: string;
  creatorId: string;
  contentFiles: string[];
  captions?: string;
  hashtags?: string[];
  postingInstructions?: string;
  submittedAt?: string;
  status: DeliverableStatus;
  revisionNotes?: string;
  slaDeadline: string;
}

export interface DigitalContract {
  id: string;
  campaignId: string;
  deliverableId: string;
  usageRightsSnapshot: Record<string, unknown>;
  creatorSignature?: string;
  brandSignature?: string;
  creatorSignedAt?: string;
  brandSignedAt?: string;
  status: ContractStatus;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  platformFee: number;
  currency: string;
  status: TransactionStatus;
  razorpayId?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  campaignId: string;
  participants: string[];
  createdAt: string;
  lastMessageAt?: string;
  isEscalated: boolean;
  adminJoined: boolean;
  sentimentAlert: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  sentimentScore?: number;
  flagStatus: ChatFlagStatus;
  createdAt: string;
}

export interface DisputeCase {
  id: string;
  campaignId: string;
  deliverableId?: string;
  raisedById: string;
  reason: DisputeReason;
  description: string;
  evidenceFiles?: string[];
  status: DisputeStatus;
  resolutionNotes?: string;
  adminId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerType: EventOrganizerType;
  organizerId: string;
  eventType: EventType;
  location: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  registrationCount: number;
  sponsorshipStatus: SponsorshipStatus;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  creatorId: string;
  status: EventRegistrationStatus;
  registeredAt: string;
}

export interface EventSponsorship {
  id: string;
  eventId: string;
  brandId: string;
  amount: number;
  tier?: string;
  status: EventSponsorshipState;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  dataPayload?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  refereeId: string;
  status: ReferralStatus;
  rewardAmount: number;
  creditedAt?: string;
}
