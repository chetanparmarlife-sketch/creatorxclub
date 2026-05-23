export type UUID = string;
export type ISODateTime = string;
export type JsonString = string;

export type UserType = "CREATOR" | "BRAND" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_DELETION";
export type Platform = "INSTAGRAM" | "YOUTUBE" | "TIKTOK";
export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";
export type BrandVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type BrandTeamRole = "OWNER" | "MANAGER" | "VIEWER";
export type InvitationStatus = "PENDING" | "ACCEPTED";
export type CompensationType = "CASH" | "GIFTING" | "DIGITAL" | "MIXED";
export type CampaignStatus = "DRAFT" | "PENDING_MODERATION" | "LIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type ApplicationStatus = "PENDING" | "SHORTLISTED" | "APPROVED" | "REJECTED" | "COUNTERED";
export type DeliverableStatus = "PENDING_REVIEW" | "REVISION_REQUESTED" | "APPROVED" | "REJECTED";
export type DigitalContractStatus = "PENDING" | "COMPLETED";
export type TransactionType =
  | "ESCROW_LOCK"
  | "ESCROW_RELEASE"
  | "CREATOR_WITHDRAWAL"
  | "BRAND_DEPOSIT"
  | "PLATFORM_FEE"
  | "REFUND"
  | "REFERRAL_CREDIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";
export type ChatFlagStatus = "NONE" | "USER_FLAGGED" | "AUTO_FLAGGED";
export type DisputeReason = "QUALITY_ISSUE" | "NON_PAYMENT" | "CONTRACT_BREACH" | "NON_COMPLIANCE" | "OTHER";
export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";
export type DisputeResolution = "RELEASED_TO_CREATOR" | "REFUNDED_TO_BRAND";
export type EventType = "VIRTUAL" | "PHYSICAL";
export type EventSponsorshipStatus = "PENDING" | "COMPLETED";
export type NotificationType = "CAMPAIGN" | "PAYMENT" | "SYSTEM" | "CHAT";
export type ReferralStatus = "PENDING" | "COMPLETED";

export interface User {
  id: UUID;
  email: string;
  phoneNumber?: string | null;
  passwordHash?: string | null;
  userType: UserType;
  status: UserStatus;
  notificationPrefs: JsonString;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface CreatorProfile {
  userId: UUID;
  displayName: string;
  bio?: string | null;
  nicheCategories: JsonString;
  primaryPlatform?: Platform | null;
  targetBudgetMin?: number | null;
  targetBudgetMax?: number | null;
  audienceDemographics: JsonString;
  followerCount: number;
  engagementRate: number;
  kycStatus: KycStatus;
  kycDocuments: JsonString;
  referralCode: string;
  availableBalance: number;
  productReceiptConfirmed: boolean;
  shippingAddress?: JsonString | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface SocialAccount {
  id: UUID;
  creatorId: UUID;
  platform: Platform;
  accessToken?: string | null;
  followerCount: number;
  engagementRate: number;
  syncedAt: ISODateTime;
}

export interface Brand {
  userId: UUID;
  companyName: string;
  taxId: string;
  gstDocuments: JsonString;
  verificationStatus: BrandVerificationStatus;
  walletBalance: number;
  escrowAllocated: number;
  totalSpent: number;
  version: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface BrandTeamMember {
  id: UUID;
  brandId: UUID;
  userId?: UUID | null;
  email: string;
  role: BrandTeamRole;
  invitationStatus: InvitationStatus;
  createdAt: ISODateTime;
}

export interface Campaign {
  id: UUID;
  brandId: UUID;
  title: string;
  description: string;
  nicheCategories: JsonString;
  targetPlatforms: JsonString;
  deliverableRequirements: JsonString;
  slaTerms?: string | null;
  usageRights: JsonString;
  compensationType: CompensationType;
  totalBudget: number;
  creatorPayout: number;
  fixedServiceFee: number;
  negotiationEnabled: boolean;
  status: CampaignStatus;
  escrowLocked: boolean;
  inventoryItems: JsonString;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InventoryItem {
  id: UUID;
  brandId: UUID;
  productName: string;
  description?: string | null;
  value: number;
  stockCount: number;
  sku?: string | null;
  images: JsonString;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Application {
  id: UUID;
  campaignId: UUID;
  creatorId: UUID;
  pitchMessage: string;
  proposedPrice?: number | null;
  portfolioLinks: JsonString;
  status: ApplicationStatus;
  brandFeedback?: string | null;
  counterOfferAmount?: number | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Deliverable {
  id: UUID;
  applicationId: UUID;
  campaignId: UUID;
  creatorId: UUID;
  contentFiles: JsonString;
  captions?: string | null;
  hashtags: JsonString;
  postingInstructions?: string | null;
  submittedAt?: ISODateTime | null;
  status: DeliverableStatus;
  revisionNotes?: string | null;
  slaDeadline: ISODateTime;
  productReceiptConfirmed: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DigitalContract {
  id: UUID;
  campaignId: UUID;
  deliverableId: UUID;
  usageRightsSnapshot: JsonString;
  creatorSignature?: string | null;
  brandSignature?: string | null;
  creatorSignedAt?: ISODateTime | null;
  brandSignedAt?: ISODateTime | null;
  status: DigitalContractStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Transaction {
  id: UUID;
  type: TransactionType;
  fromUserId?: UUID | null;
  toUserId?: UUID | null;
  amount: number;
  platformFee: number;
  netAmount: number;
  idempotencyKey?: string | null;
  razorpayRef?: string | null;
  campaignId?: UUID | null;
  status: TransactionStatus;
  createdAt: ISODateTime;
}

export interface ChatThread {
  id: UUID;
  campaignId: UUID;
  creatorId: UUID;
  brandId: UUID;
  adminJoined: boolean;
  flagStatus: ChatFlagStatus;
  sentimentScore: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ChatMessage {
  id: UUID;
  threadId: UUID;
  senderId: UUID;
  content: string;
  isAdminMessage: boolean;
  attachments: JsonString;
  readAt?: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface DisputeCase {
  id: UUID;
  campaignId: UUID;
  raisedByUserId: UUID;
  reason: DisputeReason;
  evidence: JsonString;
  status: DisputeStatus;
  adminNotes?: string | null;
  resolution?: DisputeResolution | null;
  resolvedAt?: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface CommunityPost {
  id: UUID;
  authorId: UUID;
  content: string;
  mediaAttachments: JsonString;
  likeCount: number;
  commentCount: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Event {
  id: UUID;
  organizerId: UUID;
  title: string;
  description?: string | null;
  eventType: EventType;
  startAt: ISODateTime;
  location: string;
  capacity: number;
  registrationCount: number;
  sponsoredByBrandId?: UUID | null;
  createdAt: ISODateTime;
}

export interface EventRegistration {
  id: UUID;
  eventId: UUID;
  creatorId: UUID;
  registeredAt: ISODateTime;
  reminderSent: boolean;
}

export interface EventSponsorship {
  id: UUID;
  eventId: UUID;
  brandId: UUID;
  amount: number;
  tier?: string | null;
  razorpayRef?: string | null;
  status: EventSponsorshipStatus;
  createdAt: ISODateTime;
}

export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  message: string;
  deepLink?: string | null;
  isRead: boolean;
  createdAt: ISODateTime;
}

export interface ReferralRecord {
  id: UUID;
  referrerId: UUID;
  refereeId: UUID;
  status: ReferralStatus;
  rewardAmount: number;
  creditedAt?: ISODateTime | null;
  createdAt: ISODateTime;
}
