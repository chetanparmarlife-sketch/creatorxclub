# CreatorX — Implementation Plan
# Spec: Mowgli SPEC.md v16
# Backend: Java 21 + Spring Boot 3.x
# Last updated: 2026-05-22

---

## How Claude Code Should Use This File

1. Read IMPLEMENTATION_PLAN.md + SPEC.md at the start of every session
2. Find the next unchecked `[ ]` task — work top to bottom, never skip
3. Before implementing any screen, open its matching file in `screens/` as the
   pixel-perfect visual reference — match it exactly, then wire real data
4. Mark completed tasks `[x]` before moving on
5. SPEC.md is the source of truth for all behaviour; screen .tsx files are the
   source of truth for all visual design

---

## Project Overview

Three-sided influencer marketing marketplace.

| App | Framework | Users | Screen count |
|-----|-----------|-------|--------------|
| Creator mobile app | Expo (React Native) | Influencers | 20 screens |
| Brand web portal | Next.js 15 | Companies | 11 screens |
| Admin web dashboard | Next.js 15 | Platform staff | 8 screens |

All three clients talk to one Java Spring Boot backend.

Platform fee model: 10% added to Brand cost + 10% deducted from Creator payout.

---

## Monorepo Structure

```
creatorx/
├── apps/
│   ├── creator/              # Expo SDK 51 + Expo Router
│   ├── brand/                # Next.js 15 App Router
│   └── admin/                # Next.js 15 App Router
├── packages/
│   ├── api/                  # Java 21 Spring Boot 3.x
│   ├── types/                # Shared TypeScript interfaces (all 20 models)
│   └── ui/                   # Shared Shadcn/UI components (brand + admin)
├── supabase/
│   └── seed.sql              # Dev seed data
├── screens/                  # Mowgli design mockups — DO NOT MODIFY
├── SPEC.md                   # Source of truth for all behaviour
├── IMPLEMENTATION_PLAN.md    # This file
├── turbo.json
└── .env.example
```

---

## Full Tech Stack

### Creator App (apps/creator)
- Expo SDK 51 + Expo Router (file-based navigation)
- TypeScript + NativeWind (Tailwind for React Native)
- Zustand (global state) + TanStack Query (server state)
- expo-secure-store (JWT tokens) + AsyncStorage (preferences)
- expo-image-picker + expo-document-picker (file uploads to Supabase Storage)
- expo-notifications + Firebase Cloud Messaging (push)
- Native WebSocket API (real-time chat)
- Supabase Phone Auth via @supabase/supabase-js (OTP only)
- Expo EAS (build + deploy iOS + Android)

### Brand Portal (apps/brand)
- Next.js 15 App Router + TypeScript
- Tailwind CSS + Shadcn/UI component library
- TanStack Query + TanStack Table
- React Hook Form + Zod (all forms)
- Razorpay JS SDK (wallet top-up checkout)
- JWT in httpOnly cookie (auth)
- Vercel (deployment — separate project)

### Admin Dashboard (apps/admin)
- Next.js 15 App Router + TypeScript
- Tailwind CSS + Shadcn/UI
- TanStack Query + TanStack Table
- Recharts (platform health charts)
- JWT in httpOnly cookie (admin role guard)
- Vercel (deployment — separate project from brand)

### Backend (packages/api)
- **Java 21** (LTS — virtual threads via Project Loom)
- **Spring Boot 3.3**
- **Spring Web** — REST controllers
- **Spring WebSocket + STOMP** — real-time chat + admin oversight
- **Spring Security 6** — JWT filter chain, RBAC method security
- **Spring Data JPA + Hibernate 6** — ORM for all 20 entities
- **Flyway** — database migrations (versioned SQL files)
- **JJWT (io.jsonwebtoken)** — JWT creation and validation
- **Spring Data Redis + Lettuce** — cache, WebSocket session registry, pub/sub
- **Spring Scheduler** — SLA countdown jobs, referral crediting
- **Lombok** — boilerplate reduction
- **MapStruct** — entity ↔ DTO mapping
- **Razorpay Java SDK** — payouts + webhook verification
- **Firebase Admin SDK** — FCM push notifications
- **supabase-kt / REST calls** — Supabase Storage file operations
- **Jakarta Bean Validation** — request DTO validation
- **SpringDoc OpenAPI 3** — auto-generated API docs at /api/docs
- **Testcontainers + JUnit 5** — integration tests with real Postgres
- **Docker + Railway** — containerised deployment

### Infrastructure
- **Database**: Supabase (PostgreSQL 15) — managed, with connection pooling via PgBouncer
- **File storage**: Supabase Storage buckets (kyc-documents, deliverables, product-images, community-media)
- **Phone OTP auth**: Supabase Phone Auth (Creator only)
- **Cache + pub/sub**: Redis (Upstash or Railway Redis)
- **Payments**: Razorpay (Indian market — checkout + payouts API)
- **Push**: Firebase Cloud Messaging
- **AI match scoring**: Third-party API (abstracted behind AIMatchingService interface with mock fallback)
- **Monorepo runner**: Turborepo

---

## Backend Project Structure

```
packages/api/
└── src/main/java/com/creatorx/
    ├── CreatorXApplication.java
    ├── config/
    │   ├── SecurityConfig.java        # JWT filter chain, CORS, method security
    │   ├── WebSocketConfig.java       # STOMP endpoint, message broker
    │   ├── RedisConfig.java           # Lettuce connection factory
    │   ├── RazorpayConfig.java        # Razorpay client bean
    │   └── FirebaseConfig.java        # FCB Admin SDK init
    ├── auth/
    │   ├── JwtService.java            # generate / validate / refresh tokens
    │   ├── JwtAuthFilter.java         # OncePerRequestFilter
    │   ├── AuthController.java        # /api/auth/**
    │   └── AuthService.java
    ├── domain/
    │   ├── user/
    │   ├── creator/
    │   ├── brand/
    │   ├── campaign/
    │   ├── application/
    │   ├── deliverable/
    │   ├── contract/
    │   ├── payment/
    │   ├── chat/
    │   ├── dispute/
    │   ├── community/
    │   ├── event/
    │   └── notification/
    ├── shared/
    │   ├── exception/                 # GlobalExceptionHandler
    │   ├── pagination/                # PageRequest + PageResponse<T>
    │   └── idempotency/               # IdempotencyKey service
    └── websocket/
        ├── ChatWebSocketController.java
        └── WebSocketSessionRegistry.java  # Redis-backed presence

src/main/resources/
    ├── application.yml
    ├── application-dev.yml
    └── db/migration/
        ├── V1__initial_schema.sql
        ├── V2__seed_niches.sql
        └── ...

src/test/
    └── (Testcontainers integration tests per domain)
```

Each domain package follows this internal layout:
```
domain/campaign/
├── Campaign.java            # JPA @Entity
├── CampaignRepository.java  # JpaRepository + custom @Query
├── CampaignService.java     # business logic + @Transactional
├── CampaignController.java  # @RestController /api/campaigns
├── dto/
│   ├── CampaignCreateRequest.java
│   ├── CampaignResponse.java
│   └── CampaignSummaryResponse.java
└── CampaignMapper.java      # MapStruct interface
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=jdbc:postgresql://<supabase-host>:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=

# JWT
JWT_SECRET=<min-256-bit-random-string>
JWT_EXPIRY_MS=604800000
JWT_REFRESH_EXPIRY_MS=2592000000

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET_KYC=kyc-documents
SUPABASE_STORAGE_BUCKET_DELIVERABLES=deliverables
SUPABASE_STORAGE_BUCKET_PRODUCTS=product-images

# Redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_JSON=<base64-encoded JSON>

# AI Scoring
AI_SCORING_API_URL=
AI_SCORING_API_KEY=

# Platform
PLATFORM_FEE_PERCENT=10
BRAND_PORTAL_URL=https://brand.creatorx.in
ADMIN_DASHBOARD_URL=https://admin.creatorx.in
CREATOR_APP_SCHEME=creatorx://
```

---

## All 20 JPA Entities — Field Summary

| Entity | Key fields |
|--------|-----------|
| `User` | id, email, phoneNumber, passwordHash, userType (CREATOR/BRAND/ADMIN), status |
| `CreatorProfile` | userId, displayName, bio, nicheCategories, primaryPlatform, kycStatus, availableBalance, referralCode |
| `SocialAccount` | creatorId, platform, followerCount, engagementRate, syncedAt |
| `Brand` | userId, companyName, taxId, verificationStatus, walletBalance, escrowAllocated, totalSpent |
| `BrandTeamMember` | brandId, userId, email, role (OWNER/MANAGER/VIEWER), invitationStatus |
| `Campaign` | brandId, title, compensationType, totalBudget, creatorPayout, negotiationEnabled, status, escrowLocked, usageRights (JSON), inventoryItems (JSON) |
| `InventoryItem` | brandId, productName, value, stockCount, sku, images (JSON), isActive |
| `Application` | campaignId, creatorId, pitchMessage, proposedPrice, status, brandFeedback, counterOfferAmount |
| `Deliverable` | applicationId, campaignId, creatorId, contentFiles (JSON), status, revisionNotes, slaDeadline |
| `DigitalContract` | campaignId, deliverableId, usageRightsSnapshot (JSON), creatorSignature, brandSignature, status |
| `Transaction` | type, fromUserId, toUserId, amount, platformFee, netAmount, idempotencyKey, razorpayRef, status |
| `ChatThread` | campaignId, creatorId, brandId, adminJoined, flagStatus, sentimentScore |
| `ChatMessage` | threadId, senderId, content, isAdminMessage, attachments (JSON), readAt |
| `DisputeCase` | campaignId, raisedByUserId, reason, evidence (JSON), status, adminNotes, resolution |
| `CommunityPost` | authorId, content, mediaAttachments (JSON), likeCount, commentCount |
| `Event` | organizerId, title, eventType, startAt, location, capacity, registrationCount |
| `EventRegistration` | eventId, creatorId, registeredAt, reminderSent |
| `EventSponsorship` | eventId, brandId, amount, tier, razorpayRef, status |
| `Notification` | userId, type, title, message, deepLink, isRead |
| `ReferralRecord` | referrerId, refereeId, status (PENDING/COMPLETED), rewardAmount, creditedAt |

---

## Business Logic Rules (implement exactly per SPEC.md)

- **Platform fee**: 10% added to Brand cost + 10% deducted from Creator payout
- **KYC gate**: `kycStatus != APPROVED` → block all campaign applications
- **Escrow locking**: `SELECT FOR UPDATE` via `@Lock(LockModeType.PESSIMISTIC_WRITE)` on Brand.walletBalance when campaign publishes
- **Creator profile privacy**: only visible to `verificationStatus = APPROVED` Brands
- **Withdrawal idempotency**: generate UUID idempotency key, store in Transaction before calling Razorpay Payout API
- **Dispute flow**: raises DisputeCase → locks escrow immediately → only Admin can release or refund
- **Digital contract**: both parties must sign before escrow auto-releases
- **Brand RBAC**: VIEWER role → no financial data, no approvals (enforced at `@PreAuthorize` level)
- **Admin chat identity**: Admin messages set `isAdminMessage=true`, display name forced to "Team CreatorX" on all clients
- **Sentiment analysis**: Spring Scheduler scans ChatThread every 5 min, flags threads with negative keyword clusters
- **SLA countdown**: `@Scheduled` task checks Deliverable.slaDeadline, sends FCM push 24h before expiry
- **Physical gifting gate**: `productReceiptConfirmed=true` required before Deliverable upload unlocks
- **Non-cash campaigns**: charge Brand a fixed `fixedServiceFee` instead of percentage-based fee

---

## Phase 1 — Foundation & Monorepo Setup

### 1.1 Monorepo Scaffolding
- [x] `npx create-turbo@latest creatorx` — init Turborepo root
- [x] Create `apps/creator` — `npx create-expo-app creator --template blank-typescript`
- [x] Create `apps/brand` — `npx create-next-app@latest brand --ts --tailwind --app --src-dir`
- [x] Create `apps/admin` — `npx create-next-app@latest admin --ts --tailwind --app --src-dir`
- [x] Create `packages/types/` — `package.json` with name `@creatorx/types`, export `index.ts` with all 20 TypeScript interfaces
- [x] Create `packages/ui/` — Shadcn/UI shared components (Button, Card, Table, Badge, Dialog, Input, Form, Select, Tabs, DataTable)
- [x] Configure `turbo.json` — pipelines for `dev`, `build`, `lint`, `test`
- [x] Root `.env.example` — all env vars listed above
- [x] Root `README.md` — setup instructions, how to run all apps

### 1.2 Spring Boot Project Init
- [x] Generate Spring Boot project at `packages/api/` via Spring Initializr with dependencies: Spring Web, Spring Security, Spring Data JPA, Spring Data Redis, Spring WebSocket, Flyway, Lombok, Validation, SpringDoc OpenAPI, Actuator
- [x] Add to `pom.xml`: JJWT (0.12+), MapStruct, Razorpay Java SDK, Firebase Admin SDK, Testcontainers
- [x] Configure `application.yml` — datasource, JPA (ddl-auto=validate), Redis, server port 8080
- [x] Configure `application-dev.yml` — local Postgres URL, debug logging, H2 or Testcontainers
- [x] `GET /api/health` — returns `{"status":"UP"}`, used by all three frontends to check connectivity
- [x] `GET /api/docs` — SpringDoc OpenAPI UI (dev only)

### 1.3 Database Migrations (Flyway)
- [x] `V1__create_users.sql` — users table with enum types
- [x] `V2__create_creator_profiles.sql` — creator_profiles + social_accounts tables
- [x] `V3__create_brands.sql` — brands + brand_team_members tables
- [x] `V4__create_campaigns.sql` — campaigns + inventory_items tables
- [x] `V5__create_applications.sql` — applications table
- [x] `V6__create_deliverables.sql` — deliverables + digital_contracts tables
- [x] `V7__create_transactions.sql` — transactions table with idempotency_key unique index
- [x] `V8__create_chat.sql` — chat_threads + chat_messages tables
- [x] `V9__create_disputes.sql` — dispute_cases table
- [x] `V10__create_community.sql` — community_posts table
- [x] `V11__create_events.sql` — events + event_registrations + event_sponsorships tables
- [x] `V12__create_notifications.sql` — notifications table
- [x] `V13__create_referrals.sql` — referral_records table
- [x] `V14__create_indexes.sql` — indexes on all FK columns + campaign.status + creator_profile.kyc_status
- [x] `V15__seed_dev.sql` — one admin user, one test creator (KYC approved), one test brand (verified)

### 1.4 All 20 JPA Entities
- [x] `User.java` — `@Entity`, `@Enumerated` for userType and status, `@CreationTimestamp` / `@UpdateTimestamp`
- [x] `CreatorProfile.java` — `@OneToOne(mappedBy="creatorProfile")` to User, `@Type` for JSON columns (nicheCategories, kycDocuments)
- [x] `SocialAccount.java` — `@ManyToOne` to CreatorProfile
- [x] `Brand.java` — `@OneToOne` to User, `@Column(precision=10, scale=2)` for all monetary fields
- [x] `BrandTeamMember.java` — `@ManyToOne` Brand + User, role enum
- [x] `Campaign.java` — `@ManyToOne` Brand, JSON columns for usageRights + deliverableRequirements + inventoryItems, all status and type enums
- [x] `InventoryItem.java` — `@ManyToOne` Brand, images as JSON
- [x] `Application.java` — `@ManyToOne` Campaign + CreatorProfile, status enum with COUNTERED state
- [x] `Deliverable.java` — `@ManyToOne` Application + Campaign + CreatorProfile, contentFiles as JSON, `@Column` slaDeadline as `Instant`
- [x] `DigitalContract.java` — `@OneToOne` Campaign + Deliverable, usageRightsSnapshot as JSON
- [x] `Transaction.java` — `@Column(unique=true)` on idempotencyKey, type enum, `@ManyToOne` fromUser + toUser + campaign
- [x] `ChatThread.java` — `@ManyToOne` Campaign + Creator + Brand, flagStatus enum, sentimentScore float
- [x] `ChatMessage.java` — `@ManyToOne` ChatThread + sender User, isAdminMessage boolean
- [x] `DisputeCase.java` — `@OneToOne` Campaign, `@ManyToOne` raisedByUser, evidence as JSON, resolution enum
- [x] `CommunityPost.java` — `@ManyToOne` author User, mediaAttachments as JSON
- [x] `Event.java` — `@ManyToOne` organizer User, `@ManyToOne` sponsoredByBrand (nullable)
- [x] `EventRegistration.java` — `@ManyToOne` Event + Creator, unique constraint (eventId, creatorId)
- [x] `EventSponsorship.java` — `@ManyToOne` Event + Brand, tier enum
- [x] `Notification.java` — `@ManyToOne` User, type enum (CAMPAIGN/PAYMENT/SYSTEM/CHAT), isRead boolean
- [x] `ReferralRecord.java` — `@ManyToOne` referrer User + referee User, status enum, creditedAt nullable

### 1.5 JWT Auth Layer
- [x] `JwtService.java` — `generateToken(userId, userType, brandRole)`, `validateToken()`, `extractClaims()` using JJWT 0.12
- [x] `JwtAuthFilter.java` — `OncePerRequestFilter`, reads `Authorization: Bearer` header, sets `SecurityContextHolder`
- [x] `SecurityConfig.java` — permit `/api/auth/**` and `/api/health`, require auth for all other routes, stateless session, add JwtAuthFilter
- [x] `AuthController.java` — `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/brand/register`, `POST /api/auth/brand/login`
- [x] `AuthService.java` — call Supabase Phone Auth REST API via `RestClient` (Spring 6.1), create User on first OTP verify, return access + refresh JWT pair
- [x] `packages/types/index.ts` — export all 20 TypeScript interfaces matching JPA entities exactly

---

## Phase 2 — Creator App: Onboarding Flow

> Design reference files (in `screens/`): LaunchScreen.tsx, PhoneEntryScreen.tsx, OTPVerificationScreen.tsx, OnboardingNicheSelectionScreen.tsx, OnboardingPlatformBudgetScreen.tsx, SocialAccountConnectionScreen.tsx, KYCDocumentUploadScreen.tsx
> Style: glassmorphic dark UI — deep blacks, violet/purple accents. Match mockups exactly.

### 2.1 App Shell & Navigation
- [x] Expo Router layout: `app/(auth)/`, `app/(onboarding)/`, `app/(tabs)/` groups
- [x] NativeWind dark theme config — extract exact color palette from screen mockups
- [x] `lib/api.ts` — Axios instance pointing to Spring Boot API, JWT interceptor with auto-refresh on 401
- [x] `lib/supabase.ts` — Supabase client for phone OTP only (not used for data)
- [x] `store/auth.ts` — Zustand: `{ user, token, kycStatus, setAuth, clearAuth }`
- [x] Root `_layout.tsx` — on mount, read token from expo-secure-store → redirect to `(tabs)` or `(auth)/launch`

### 2.2 Auth Screens
- [x] **LaunchScreen** — value proposition copy + "Get Started" CTA. Ref: `screens/LaunchScreen.tsx`
- [x] **PhoneEntryScreen** — country code picker, phone number input, validate E.164 format, call `POST /api/auth/send-otp`, navigate to OTP screen. Ref: `screens/PhoneEntryScreen.tsx`
- [x] **OTPVerificationScreen** — 6-box OTP input, auto-submit on last digit, 60s resend countdown, call `POST /api/auth/verify-otp`, store JWT in expo-secure-store, route to onboarding or tabs. Ref: `screens/OTPVerificationScreen.tsx`

### 2.3 Onboarding Wizard
- [x] Progress indicator component — step dots shown across all onboarding screens
- [x] **OnboardingNicheSelectionScreen** — grid of niche category pills, max 3 selectable, call `PUT /api/creators/profile`. Ref: `screens/OnboardingNicheSelectionScreen.tsx`
- [x] **OnboardingPlatformBudgetScreen** — platform selector (Instagram/YouTube/TikTok), budget range slider, audience demographics inputs. Ref: `screens/OnboardingPlatformBudgetScreen.tsx`
- [x] **SocialAccountConnectionScreen** — OAuth buttons per platform, after OAuth show imported follower count + engagement rate, confirm + store. Ref: `screens/SocialAccountConnectionScreen.tsx`
- [x] **KYCDocumentUploadScreen** — ID front upload, ID back upload, live selfie capture (expo-camera), upload all to Supabase Storage, call `POST /api/creators/kyc`, set status to pending, show locked state. Ref: `screens/KYCDocumentUploadScreen.tsx`

### 2.4 Backend — Onboarding Endpoints
- [x] `PUT /api/creators/profile` — update niche, platform, budget, demographics
- [x] `GET /api/creators/me` — full creator profile with kycStatus, social accounts
- [x] `POST /api/creators/social-accounts` — store OAuth token + synced metrics
- [x] `DELETE /api/creators/social-accounts/{platform}` — unlink account
- [x] `POST /api/creators/kyc` — accept { idFrontUrl, idBackUrl, selfieUrl }, set kycStatus=PENDING, create Notification for admin queue

---

## Phase 3 — Creator App: Campaign Discovery & Application

> Design reference: ExploreFeedScreen.tsx, CampaignDetailScreen.tsx, ApplicationComposerScreen.tsx

### 3.1 Explore Feed
- [x] **ExploreFeedScreen** — paginated campaign cards sorted by AI match score. Each card: campaign title, Brand name, match % badge, net payout (post 10% fee), compensation type tag, platform tag. Filter bottom sheet: category, budget range, platform, compensation type. Search bar. KYC-pending banner with read-only lock. Pull-to-refresh. Ref: `screens/ExploreFeedScreen.tsx`
- [x] Backend: `GET /api/campaigns` — paginated, filter params: `category`, `budgetMin`, `budgetMax`, `platform`, `compensationType`, `search`. Inject AI match score per campaign for the requesting creator. Return `creatorNetPayout` = `creatorPayout` (already net of 10%).
- [x] Backend: `AIMatchingService.java` interface — `getMatchScore(creatorId, campaignId)`. Default implementation calls third-party API, fallback returns deterministic score from niche overlap calculation.

### 3.2 Campaign Detail
- [x] **CampaignDetailScreen** — full brief, deliverable list, SLA terms, usage rights panel (exclusivity period + duration + territorial scope), gifting product details + stock status, Brand profile card + past campaign rating, Save / Apply CTA (Apply blocked with modal if KYC pending). Ref: `screens/CampaignDetailScreen.tsx`
- [x] Backend: `GET /api/campaigns/{id}` — full detail, include Brand public profile + aggregated past campaign rating + inventory stock levels

### 3.3 Application Submission
- [x] **ApplicationComposerScreen** — pitch textarea, portfolio upload (images/links), negotiation price input (shown only if `campaign.negotiationEnabled=true`, displays Brand's offered amount as reference), payout breakdown summary card (gross / platform fee 10% / your net), submit. Ref: `screens/ApplicationComposerScreen.tsx`
- [x] Backend: `POST /api/campaigns/{id}/applications` — validate KYC approved, create Application with status PENDING, notify Brand via FCM
- [x] Backend: `GET /api/creators/applications` — list creator's own applications with status

---

## Phase 4 — Creator App: Active Campaign Management

> Design reference: ActiveCampaignsListScreen.tsx, ActiveCampaignDetailScreen.tsx, DeliverableUploadInterfaceScreen.tsx

### 4.1 Active Campaigns
- [ ] **ActiveCampaignsListScreen** — tabs: In Progress / Completed. Campaign cards with status badge, SLA countdown timer for in-progress. Ref: `screens/ActiveCampaignsListScreen.tsx`
- [ ] **ActiveCampaignDetailScreen** — shipping address confirmation (physical gifting), product receipt confirmation button (unlocks deliverable upload), SLA countdown, campaign brief, deliverable status stepper, raise dispute CTA. Ref: `screens/ActiveCampaignDetailScreen.tsx`
- [ ] Backend: `GET /api/creators/active-campaigns` — campaigns where application.status = APPROVED
- [ ] Backend: `POST /api/deliverables/{id}/confirm-receipt` — set productReceiptConfirmed=true, unlock deliverable submission
- [ ] Backend: `PUT /api/creators/shipping-address` — store address for physical deliveries

### 4.2 Deliverable Upload
- [ ] **DeliverableUploadInterfaceScreen** — multi-file upload (images/video) to Supabase Storage via presigned URL, caption input, hashtags input, posting instructions, submission preview, submit for review. Blocked until product receipt confirmed (physical campaigns). Ref: `screens/DeliverableUploadInterfaceScreen.tsx`
- [ ] Backend: `POST /api/deliverables` — create Deliverable with status PENDING_REVIEW, upload contentFiles to Supabase Storage, notify Brand via FCM, set slaDeadline from campaign.slaTerms
- [ ] Backend: `PUT /api/deliverables/{id}` — update content for revisions

### 4.3 Digital Contract Signing (Creator side)
- [ ] Contract review screen — display usageRightsSnapshot (exclusivity, duration, territorial, restrictions), digital signature capture input, sign CTA
- [ ] Backend: `POST /api/contracts/{id}/sign/creator` — store creatorSignature, if both parties signed set status=COMPLETED and trigger escrow release

### 4.4 Dispute Raising (Creator side)
- [ ] Dispute modal — reason selector (QUALITY_ISSUE / NON_PAYMENT / CONTRACT_BREACH / OTHER), evidence file upload, submit
- [ ] Backend: `POST /api/disputes` — create DisputeCase, immediately set campaign escrowLocked=true via `@Transactional` + `@Lock(PESSIMISTIC_WRITE)`, notify Admin via FCM

---

## Phase 5 — Creator App: Wallet, Chat & Community

> Design reference: WalletDashboardScreen.tsx, WithdrawalFlowScreen.tsx, ReferralSectionScreen.tsx, ChatInterfaceScreen.tsx, CommunityFeedScreen.tsx, EventListScreen.tsx, EventDetailScreen.tsx, EventCreationScreen.tsx, NotificationsScreen.tsx, ProfileSettingsScreen.tsx

### 5.1 Wallet
- [ ] **WalletDashboardScreen** — total earnings card, pending clearance, available balance, locked in escrow. Transaction history list with transparent 10% fee breakdown per row. Filter by date range + type. "Refer & Earn" card. Ref: `screens/WalletDashboardScreen.tsx`
- [ ] **WithdrawalFlowScreen** — select verified bank account, enter amount (validate against available balance), confirm, show 2–3 business day ETA + transaction reference. Ref: `screens/WithdrawalFlowScreen.tsx`
- [ ] **ReferralSectionScreen** — unique referral link, copy button, referral list (pending / completed), credited rewards. Ref: `screens/ReferralSectionScreen.tsx`
- [ ] Backend: `GET /api/creators/wallet` — balance breakdown, recent transactions
- [ ] Backend: `GET /api/creators/transactions` — paginated transaction history with filters
- [ ] Backend: `POST /api/creators/withdrawals` — generate idempotencyKey UUID, call Razorpay Payout API, record Transaction, return reference
- [ ] Backend: `GET /api/creators/referrals` — referral records with status

### 5.2 Real-time Chat
- [ ] WebSocket connection setup in Expo app — connect to `ws://api/ws` with JWT in handshake header
- [ ] **ChatInterfaceScreen** — message list (creator messages right-aligned, brand left-aligned, admin "Team CreatorX" messages in distinct style), text input, attachment button, "Request Help" button sends flag to backend. Ref: `screens/ChatInterfaceScreen.tsx`
- [ ] Backend: `WebSocketConfig.java` — STOMP endpoint `/ws`, message broker `/topic`, app prefix `/app`
- [ ] Backend: `ChatWebSocketController.java` — `@MessageMapping("/chat/{threadId}/send")`, broadcast to `/topic/chat/{threadId}`, persist ChatMessage
- [ ] Backend: `WebSocketSessionRegistry.java` — Redis-backed map of userId → sessionId for presence tracking
- [ ] Backend: `GET /api/chat/threads` — list creator's chat threads with unread count
- [ ] Backend: `GET /api/chat/threads/{id}/messages` — paginated message history
- [ ] Backend: `POST /api/chat/threads/{id}/flag` — set flagStatus=USER_FLAGGED, notify Admin

### 5.3 Community & Events
- [ ] **CommunityFeedScreen** — feed of posts (text + media), like button, comment thread, create post FAB. Ref: `screens/CommunityFeedScreen.tsx`
- [ ] **EventListScreen** — upcoming events list, filter by date/type/location. Ref: `screens/EventListScreen.tsx`
- [ ] **EventDetailScreen** — event info, organizer, capacity, register CTA, add to calendar. Ref: `screens/EventDetailScreen.tsx`
- [ ] **EventCreationScreen** — title, description, type (virtual/physical), date/time, location, capacity. Ref: `screens/EventCreationScreen.tsx`
- [ ] Backend: `GET /api/community/posts`, `POST /api/community/posts`, `POST /api/community/posts/{id}/like`
- [ ] Backend: `GET /api/events`, `POST /api/events`, `GET /api/events/{id}`, `POST /api/events/{id}/register`

### 5.4 Notifications & Profile
- [ ] **NotificationsScreen** — filter tabs (All / Campaigns / Payments / System), unread blue dot, "Mark all read" button, tap navigates to deep link. Ref: `screens/NotificationsScreen.tsx`
- [ ] **ProfileSettingsScreen** — edit bio/display name, manage connected social accounts, notification preferences, KYC status badge. Ref: `screens/ProfileSettingsScreen.tsx`
- [ ] Backend: `GET /api/notifications` — paginated, filter by type, `isRead` flag
- [ ] Backend: `PUT /api/notifications/mark-all-read`
- [ ] Backend: `PUT /api/creators/profile` — update bio, displayName, notificationPreferences

### 5.5 Background Jobs (Spring Scheduler)
- [ ] `SlaReminderJob.java` — `@Scheduled(cron="0 0 * * * *")` — check all Deliverables with slaDeadline within 24h, send FCM push to Creator
- [ ] `ReferralCreditJob.java` — triggered on KYC approval event — check if referee has a referrer, credit rewardAmount to referrer wallet, create Transaction, send Notification
- [ ] `SentimentAnalysisJob.java` — `@Scheduled(fixedDelay=300000)` — scan recent ChatMessages in active threads, flag thread if negative keyword threshold exceeded

---

## Phase 6 — Brand Portal (Next.js)

> Design reference: screens/BrandRegistrationScreen.tsx, BrandDashboardScreen.tsx, TeamManagementScreen.tsx, CampaignWizardScreen.tsx, ApplicationsDashboardScreen.tsx, DeliverablesDashboardScreen.tsx, DigitalContractSigningScreen.tsx, InventoryManagementScreen.tsx, EventDiscoveryScreen.tsx, WalletManagementScreen.tsx

### 6.1 Auth & Shell
- [ ] Brand portal Next.js app shell — sidebar navigation: Dashboard, Campaigns, Applications, Deliverables, Inventory, Events, Team, Wallet, Settings
- [ ] Middleware — read JWT from httpOnly cookie, redirect unauthenticated to `/login`, check `userType=BRAND`
- [ ] RBAC client hook — `useBrandRole()` returns current user's role, used to hide financial sections from VIEWER
- [ ] **BrandRegistrationScreen** — company name, work email, password, tax ID, GST document upload to Supabase Storage, submit for Admin approval. Ref: `screens/BrandRegistrationScreen.tsx`
- [ ] Login page — email + password, call `POST /api/auth/brand/login`, store JWT in httpOnly cookie

### 6.2 Brand Dashboard & Team
- [ ] **BrandDashboardScreen** — stats: active campaigns, pending applications, pending deliverables, wallet balance. Quick action cards. Recent activity feed. Ref: `screens/BrandDashboardScreen.tsx`
- [ ] **TeamManagementScreen** — member list with role badges, invite by email (role selector: OWNER/MANAGER/VIEWER), pending invitations, remove member. Ref: `screens/TeamManagementScreen.tsx`
- [ ] Backend: `GET /api/brands/dashboard-stats`
- [ ] Backend: `GET /api/brands/team`, `POST /api/brands/team/invite`, `DELETE /api/brands/team/{memberId}`
- [ ] Backend: `POST /api/auth/brand/accept-invite` — invited member sets password, accepts role

### 6.3 Campaign Wizard
- [ ] **CampaignWizardScreen** — 5-step wizard with step indicator. Ref: `screens/CampaignWizardScreen.tsx`
  - Step 1 — Basics: title, description, niche categories (multi-select), target platforms
  - Step 2 — Deliverables: content type, quantity, deadline, SLA terms
  - Step 3 — Usage rights: exclusivity period, usage duration (6mo/1yr/perpetual), territorial scope (regional/global), content restrictions. Auto-generate contract template.
  - Step 4 — Compensation: cash / physical gifting / digital perks / mixed selector. Cash: enter budget → display creator net payout and brand total cost (both with 10% fee shown). Physical: pick from inventory catalog with stock counts. Digital: configure discount codes. Toggle "Allow Negotiation".
  - Step 5 — Review & publish: full summary. On publish: validate Brand wallet balance ≥ totalBudget + 10% fee. Lock escrow via `POST /api/campaigns/{id}/publish`.
- [ ] Backend: `POST /api/campaigns` (draft), `PUT /api/campaigns/{id}` (update), `POST /api/campaigns/{id}/publish` (validate + escrow lock with `@Lock(PESSIMISTIC_WRITE)`)

### 6.4 Applications Dashboard
- [ ] **ApplicationsDashboardScreen** — table of applications with filters: campaign, status, metrics. Creator profile card in side panel: match score, social metrics, portfolio. Shortlist / Approve / Reject with feedback / Counter-offer actions. Direct invite flow. Ref: `screens/ApplicationsDashboardScreen.tsx`
- [ ] Backend: `GET /api/brands/applications` — filter by campaignId, status, creatorMetrics
- [ ] Backend: `PUT /api/applications/{id}/approve` — set status=APPROVED, notify Creator via FCM
- [ ] Backend: `PUT /api/applications/{id}/reject` — set status=REJECTED with feedback
- [ ] Backend: `PUT /api/applications/{id}/counter` — set status=COUNTERED with counterOfferAmount
- [ ] Backend: `POST /api/campaigns/{id}/invite/{creatorId}` — direct invite

### 6.5 Deliverables Dashboard
- [ ] **DeliverablesDashboardScreen** — pending review queue. Content file viewer (images/video). SLA compliance badge (on-track / at-risk / breached). Request revisions (with notes) / Approve actions. Ref: `screens/DeliverablesDashboardScreen.tsx`
- [ ] **DigitalContractSigningScreen** — display usage rights snapshot, Brand digital signature input, sign CTA. Ref: `screens/DigitalContractSigningScreen.tsx`
- [ ] Backend: `GET /api/brands/deliverables` — filter by status, campaignId
- [ ] Backend: `PUT /api/deliverables/{id}/request-revision` — set status=REVISION_REQUESTED, store revisionNotes, notify Creator
- [ ] Backend: `PUT /api/deliverables/{id}/approve` — set status=APPROVED, generate DigitalContract, notify Creator to sign
- [ ] Backend: `POST /api/contracts/{id}/sign/brand` — store brandSignature, if both signed trigger escrow release: `@Transactional` credit Creator wallet (net -10%), debit Brand escrow, create Transaction records with audit log

### 6.6 Inventory, Events & Wallet
- [ ] **InventoryManagementScreen** — product list (image, name, SKU, stock count). Add product modal: name, description, value, SKU, stock count, image upload. Stock adjustment (add/remove). Edit/delete. Low stock alerts. Ref: `screens/InventoryManagementScreen.tsx`
- [ ] **EventDiscoveryScreen** — grid of events available for sponsorship. Sponsorship modal: tier/amount selector, Razorpay checkout. Sponsored events list with analytics (views, clicks). Ref: `screens/EventDiscoveryScreen.tsx`
- [ ] **WalletManagementScreen** — balance cards (available / escrow allocated / total spent). Deposit via Razorpay checkout modal. Transaction history table with CSV export. Invoice download. Ref: `screens/WalletManagementScreen.tsx`
- [ ] Backend: Full CRUD `GET/POST/PUT/DELETE /api/brands/inventory`
- [ ] Backend: `GET /api/events?sponsorable=true`, `POST /api/events/{id}/sponsor` + Razorpay payment
- [ ] Backend: `GET /api/brands/wallet`, `POST /api/brands/wallet/deposit` (Razorpay order), `POST /api/razorpay/webhook` (verify signature, credit wallet)

---

## Phase 7 — Admin Dashboard (Next.js)

> Design reference: AdminDashboardScreen.tsx, KYCVerificationQueueScreen.tsx, CampaignModerationScreen.tsx, ChatOversightScreen.tsx, DisputeResolutionScreen.tsx, FinancialLedgerScreen.tsx, ComplianceManagementScreen.tsx

### 7.1 Admin Shell & Auth
- [ ] Admin Next.js app shell — sidebar: Dashboard, KYC Queue, Campaigns, Disputes, Chat, Ledger, Compliance
- [ ] Middleware — JWT httpOnly cookie, `userType=ADMIN` guard only (hard redirect otherwise)
- [ ] Admin login page — email + password

### 7.2 System Control Centre
- [ ] **AdminDashboardScreen** — work queue summary cards (KYC Pending count, Active Disputes, Flagged Campaigns — all clickable → deep link to queue). Platform health metrics: uptime %, Redis cache hit rate, active WebSocket connections, total users. Recent audit log table (last 20 actions). Alert banner for critical issues. Ref: `screens/AdminDashboardScreen.tsx`
- [ ] Backend: `GET /api/admin/dashboard-stats` — all queue counts + health metrics (query Redis INFO for cache stats, count active WS sessions from registry)
- [ ] Backend: `GET /api/admin/audit-log` — paginated audit events (Spring AOP aspect logs all state-changing Admin actions)

### 7.3 KYC Verification Queue
- [ ] **KYCVerificationQueueScreen** — 3-column desktop layout: left queue list, center document viewer (zoom/pan ID front/back/selfie), right profile cross-reference + action buttons. Approve / Reject (mandatory notes modal). Search + filter. Bulk approve. Ref: `screens/KYCVerificationQueueScreen.tsx`
- [ ] Backend: `GET /api/admin/kyc-queue` — all creators with kycStatus=PENDING
- [ ] Backend: `PUT /api/admin/kyc/{creatorId}/approve` — set kycStatus=APPROVED, send FCM push to Creator, trigger ReferralCreditJob
- [ ] Backend: `PUT /api/admin/kyc/{creatorId}/reject` — set kycStatus=REJECTED with notes, send FCM push

### 7.4 Campaign Moderation
- [ ] **CampaignModerationScreen** — list (Pending/Flagged/Live/Paused) + preview panel. Compliance checklist. Actions: Approve / Request Changes / Pause / Remove + note input. Ref: `screens/CampaignModerationScreen.tsx`
- [ ] Backend: `GET /api/admin/campaigns?status=PENDING_MODERATION`
- [ ] Backend: `PUT /api/admin/campaigns/{id}/approve` — set status=LIVE, notify Brand
- [ ] Backend: `PUT /api/admin/campaigns/{id}/pause`, `/remove` — with mandatory note, notify Brand

### 7.5 Chat Oversight
- [ ] **ChatOversightScreen** — split pane: left thread list with sentiment sparklines + flag indicators, right live chat view. Join as "Team CreatorX" button. Dispute escalation shortcut. Sort by time / filter by flag status. Ref: `screens/ChatOversightScreen.tsx`
- [ ] Backend: `GET /api/admin/chat/threads` — all active threads sorted by sentimentScore, with flag status
- [ ] Backend: `POST /api/admin/chat/threads/{id}/join` — mark adminJoined=true, Admin's messages in this thread auto-set isAdminMessage=true, display name forced to "Team CreatorX"
- [ ] Real-time: Admin subscribes to `/topic/admin/chat-flags` — receives push when new thread is auto-flagged by SentimentAnalysisJob

### 7.6 Dispute Resolution
- [ ] **DisputeResolutionScreen** — case queue left, case detail right with 4 tabs: Terms (usage rights snapshot + SLA compliance checklist), Deliverables (content files), Chat History (full thread), Evidence (uploaded files). Decision modal: Release to Creator / Refund to Brand, mandatory resolution notes, financial execution preview. Ref: `screens/DisputeResolutionScreen.tsx`
- [ ] Backend: `GET /api/admin/disputes` — all OPEN cases
- [ ] Backend: `GET /api/admin/disputes/{id}` — full case detail with campaign terms, deliverables, chat history, evidence
- [ ] Backend: `POST /api/admin/disputes/{id}/resolve` — body: `{ resolution: "RELEASE_TO_CREATOR" | "REFUND_TO_BRAND", notes: "..." }`. Execute in `@Transactional`: update DisputeCase, move escrow funds, create Transaction records, send FCM to both parties, write audit log entry.

### 7.7 Financial Ledger
- [ ] **FinancialLedgerScreen** — full-width transaction table: date range picker, type filter, user filter, status filter. Summary cards: total volume, platform fees collected, refunds processed. CSV export. Razorpay webhook log table with delivery status. Idempotency key duplicate detection alerts. Ref: `screens/FinancialLedgerScreen.tsx`
- [ ] Backend: `GET /api/admin/transactions` — paginated, all filters as query params
- [ ] Backend: `GET /api/admin/transactions/export` — stream CSV response with `Content-Disposition: attachment`
- [ ] Backend: `GET /api/admin/razorpay-webhooks` — log of all received webhook events with status

### 7.8 Compliance Management
- [ ] **ComplianceManagementScreen** — data export request queue + anonymization request queue. Export action with progress indicator. Download generated data package. Anonymization with cascading delete preview. Compliance audit log. Ref: `screens/ComplianceManagementScreen.tsx`
- [ ] Backend: `POST /api/admin/compliance/export/{userId}` — async job: collect all user data across all 20 tables, generate JSON + CSV package, upload to Supabase Storage, return download URL
- [ ] Backend: `POST /api/admin/compliance/anonymize/{userId}` — `@Transactional`: replace all PII fields with anonymized placeholders, cascade to related records, maintain referential integrity, write audit log

---

## Phase 8 — Cross-cutting Concerns

### 8.1 Error Handling
- [ ] `GlobalExceptionHandler.java` — `@RestControllerAdvice` handling: `NotFoundException` (404), `ForbiddenException` (403), `ValidationException` (400), `InsufficientFundsException` (422), `EscrowLockException` (409), generic Exception (500)
- [ ] Consistent error response shape: `{ "error": "...", "message": "...", "timestamp": "..." }`
- [ ] All frontend clients handle these error shapes uniformly

### 8.2 Idempotency
- [ ] `IdempotencyService.java` — check Redis for key before processing, store result after success, return cached result on duplicate
- [ ] Apply to: all Razorpay Payout calls, all escrow lock/release operations, all wallet credit/debit

### 8.3 Push Notifications
- [ ] `NotificationService.java` — `sendToUser(userId, title, body, data)`: look up user's FCM token, call Firebase Admin SDK, create Notification record in DB
- [ ] FCM events to implement: KYC approved/rejected, application approved/rejected, deliverable revision requested, deliverable approved, contract ready to sign, dispute opened/resolved, referral reward credited, SLA deadline approaching, chat message received

### 8.4 File Storage
- [ ] `StorageService.java` — `uploadFile(bucket, path, bytes)`, `getSignedUrl(bucket, path, expirySeconds)`, `deleteFile(bucket, path)` — wraps Supabase Storage REST API
- [ ] Buckets: `kyc-documents` (private), `deliverables` (private), `product-images` (public), `community-media` (public), `compliance-exports` (private)

### 8.5 Razorpay Webhook
- [ ] `POST /api/razorpay/webhook` — verify signature using `RAZORPAY_WEBHOOK_SECRET`, handle events: `payment.captured` (credit Brand wallet), `payout.processed` (mark Creator withdrawal complete), `payout.failed` (mark failed, notify Creator)

### 8.6 API Documentation
- [ ] SpringDoc: all controllers annotated with `@Tag`, all endpoints with `@Operation`, all DTOs with `@Schema`
- [ ] Export OpenAPI JSON → use as reference when building frontend API clients

---

## Phase 9 — Testing

- [ ] Unit tests — `CampaignService`, `PaymentService`, `EscrowService`, `JwtService` (JUnit 5 + Mockito)
- [ ] Integration tests — Testcontainers (real Postgres): full escrow lock/release flow, dispute resolution financial transactions, KYC approval + referral credit chain
- [ ] API tests — `MockMvc` for all controller endpoints: auth, RBAC enforcement (VIEWER cannot approve), KYC gate
- [ ] Frontend — React Testing Library for key Brand portal flows (campaign wizard, application approval)
- [ ] E2E — Detox for Creator app critical paths (OTP → KYC → apply → upload deliverable → receive payment)

---

## Phase 10 — Deployment

### Backend
- [ ] `Dockerfile` — multi-stage: `maven:3.9-eclipse-temurin-21` build stage + `eclipse-temurin:21-jre-alpine` runtime
- [ ] Deploy to Railway — set all env vars, connect to Supabase DB
- [ ] Configure Razorpay webhook URL → `https://api.creatorx.in/api/razorpay/webhook`
- [ ] Configure Firebase Cloud Messaging

### Brand Portal
- [ ] Vercel project: `apps/brand` — set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] Custom domain: `brand.creatorx.in`

### Admin Dashboard
- [ ] Vercel project: `apps/admin` — set `NEXT_PUBLIC_API_URL` (same API, different role)
- [ ] Custom domain: `admin.creatorx.in`

### Creator App
- [ ] Expo EAS — configure `eas.json` for dev/preview/production profiles
- [ ] `eas build --platform all --profile production`
- [ ] Submit to App Store + Google Play via `eas submit`

---

## Screen → File Reference Map

| Screen | File in screens/ | App |
|--------|-----------------|-----|
| LaunchScreen | LaunchScreen.tsx | Creator |
| PhoneEntryScreen | PhoneEntryScreen.tsx | Creator |
| OTPVerification | OTPVerificationScreen.tsx | Creator |
| OnboardingNicheSelection | OnboardingNicheSelectionScreen.tsx | Creator |
| OnboardingPlatformBudget | OnboardingPlatformBudgetScreen.tsx | Creator |
| SocialAccountConnection | SocialAccountConnectionScreen.tsx | Creator |
| KYCDocumentUpload | KYCDocumentUploadScreen.tsx | Creator |
| ExploreFeed | ExploreFeedScreen.tsx | Creator |
| CampaignDetail | CampaignDetailScreen.tsx | Creator |
| ApplicationComposer | ApplicationComposerScreen.tsx | Creator |
| ActiveCampaignsList | ActiveCampaignsListScreen.tsx | Creator |
| ActiveCampaignDetail | ActiveCampaignDetailScreen.tsx | Creator |
| DeliverableUploadInterface | DeliverableUploadInterfaceScreen.tsx | Creator |
| ChatInterface | ChatInterfaceScreen.tsx | Creator |
| WalletDashboard | WalletDashboardScreen.tsx | Creator |
| WithdrawalFlow | WithdrawalFlowScreen.tsx | Creator |
| ReferralSection | ReferralSectionScreen.tsx | Creator |
| CommunityFeed | CommunityFeedScreen.tsx | Creator |
| EventList | EventListScreen.tsx | Creator |
| EventDetail | EventDetailScreen.tsx | Creator |
| EventCreation | EventCreationScreen.tsx | Creator |
| ProfileSettings | ProfileSettingsScreen.tsx | Creator |
| Notifications | NotificationsScreen.tsx | Creator |
| BrandRegistration | BrandRegistrationScreen.tsx | Brand |
| BrandDashboard | BrandDashboardScreen.tsx | Brand |
| TeamManagement | TeamManagementScreen.tsx | Brand |
| CampaignWizard | CampaignWizardScreen.tsx | Brand |
| ApplicationsDashboard | ApplicationsDashboardScreen.tsx | Brand |
| DeliverablesDashboard | DeliverablesDashboardScreen.tsx | Brand |
| DigitalContractSigning | DigitalContractSigningScreen.tsx | Brand |
| InventoryManagement | InventoryManagementScreen.tsx | Brand |
| EventDiscovery | EventDiscoveryScreen.tsx | Brand |
| WalletManagement | WalletManagementScreen.tsx | Brand |
| AdminDashboard | AdminDashboardScreen.tsx | Admin |
| KYCVerificationQueue | KYCVerificationQueueScreen.tsx | Admin |
| CampaignModeration | CampaignModerationScreen.tsx | Admin |
| ChatOversight | ChatOversightScreen.tsx | Admin |
| DisputeResolution | DisputeResolutionScreen.tsx | Admin |
| FinancialLedger | FinancialLedgerScreen.tsx | Admin |
| ComplianceManagement | ComplianceManagementScreen.tsx | Admin |
