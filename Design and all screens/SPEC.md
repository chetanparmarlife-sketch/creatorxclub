# CreatorX - Mowgli Spec (v37)

## 

**CreatorX** - The premium three-sided influencer marketing marketplace.

CreatorX is a premium three-sided influencer marketing marketplace connecting Creators (via a mobile-first React Native app), Brands (via a desktop-optimized Next.js web portal), and Admins (via a web dashboard). The platform facilitates end-to-end campaign workflows—from AI-driven discovery and digital contracting to escrow payments and multi-format compensation—operating on a transparent 20% platform fee model (10% deducted from Creator payouts, 10% added to Brand costs).

The ecosystem supports cash payments, physical product gifting with full inventory tracking, and digital perks. Creators browse AI-matched campaigns (powered by third-party API scoring), apply with custom pitches, and manage deliverables through a glassmorphic dark mobile interface. Brands configure campaigns with granular usage rights, negotiate pricing when enabled, and manage teams through RBAC (Owner/Manager/Viewer). Admins oversee KYC verification, proactively mediate disputes via real-time chat intervention, and maintain platform health. The platform also features an integrated Community feed and Events system where Creators and Admins can host events that Brands sponsor.

## User Journeys

### 1. Creator Onboarding & Verification

#### 1.1 App Launch & Authentication

- 1.1.1. User launches CreatorX mobile app
- 1.1.2. System checks AsyncStorage for existing auth token; if present, redirects to Explore Feed
- 1.1.3. New users see value proposition and primary call-to-action to begin registration
- 1.1.4. User enters phone number; system validates format and region
- 1.1.5. System sends 6-digit OTP via Supabase Phone Auth
- 1.1.6. User enters OTP; on validation, account created with "Pending Onboarding" status

#### 1.2 Profile Configuration

- 1.2.1. User enters onboarding wizard showing progress indicator
- 1.2.2. User selects up to 3 niche categories from predefined taxonomy
- 1.2.3. User selects primary platform (Instagram, YouTube, or TikTok)
- 1.2.4. User specifies target budget range and audience demographics
- 1.2.5. System saves preferences and advances to social connection

#### 1.3 Social Account Connection

- 1.3.1. User initiates OAuth connection with selected platform
- 1.3.2. System retrieves real-time follower count, engagement rate, and content history via platform APIs and third-party providers
- 1.3.3. User reviews imported metrics and confirms accuracy
- 1.3.4. System stores social metrics in CreatorProfile
- 1.3.5. After onboarding, users can manage connections in Profile > Connected Accounts
- 1.3.6. System displays connected platforms with current metrics (followers, engagement rate)
- 1.3.7. User can unlink or reconnect accounts from the Connected Accounts section

#### 1.4 KYC Submission & Approval Gate

- 1.4.1. User enters KYC flow; system requests national ID front/back photos and live selfie
- 1.4.2. User uploads documents to Supabase Storage
- 1.4.3. System sets Creator status to "Pending Review" and locks application capabilities
- 1.4.4. User can browse Explore Feed in read-only mode but cannot apply to campaigns
- 1.4.5. Upon Admin approval, user receives Firebase Cloud Messaging push notification
- 1.4.6. System unlocks full application access; user sees confirmation and guidance to complete profile

### 2. Creator Campaign Discovery & Application

#### 2.1 Browse Explore Feed

- 2.1.1. User lands on Explore Feed showing AI-matched campaigns ranked by niche alignment, audience fit, and historical performance (via third-party API scoring)
- 2.1.2. User applies filters: category, budget range, platform, compensation type (cash/gifting/digital)
- 2.1.3. User performs full-text search across campaign titles and descriptions
- 2.1.4. Each campaign card displays match confidence score and fee-adjusted payout amount (showing Creator's net after 10% deduction)
- 2.1.5. User taps campaign to view detail

#### 2.2 Campaign Detail Review

- 2.2.1. System displays deliverable requirements, SLA terms, usage rights definitions (exclusivity, duration, territorial scope), and product gifting details if applicable
- 2.2.2. For physical gifting campaigns, system shows inventory availability status
- 2.2.3. User reviews Brand profile and past campaign ratings
- 2.2.4. User selects primary action to apply or save for later

#### 2.3 Application Submission

- 2.3.1. System verifies KYC status; if pending, blocks submission and prompts user to wait for verification
- 2.3.2. User composes pitch message explaining approach and value proposition
- 2.3.3. If Brand enabled negotiation, user interface presents custom pricing proposal input with current offer displayed as reference
- 2.3.4. User uploads portfolio samples or previous work references
- 2.3.5. User reviews application summary showing proposed payout and platform fee breakdown
- 2.3.6. User submits application; status set to "Pending Review"

### 3. Creator Active Campaign Management

#### 3.1 Pre-Delivery Confirmation

- 3.1.1. User receives push notification of application approval
- 3.1.2. User opens campaign to confirm shipping address for physical products or digital delivery method for perks
- 3.1.3. For physical gifting, Brand ships product; user confirms receipt in app to unlock deliverable submission
- 3.1.4. System displays SLA countdown timer showing deadline for content submission

#### 3.2 Deliverable Submission

- 3.2.1. User uploads content files (images/video) to Supabase Storage with progress indicators
- 3.2.2. User enters captions, required hashtags, and posting instructions
- 3.2.3. User reviews deliverable package and submits for Brand review
- 3.2.4. System sets status to "Pending Review" and notifies Brand

#### 3.3 Revision & Approval Cycle

- 3.3.1. User receives notification if Brand requests revisions with specific feedback
- 3.3.2. User uploads revised content or modifies captions
- 3.3.3. Upon Brand approval, system presents digital contract signing interface
- 3.3.4. User reviews usage rights contract and digitally signs to trigger escrow release

#### 3.4 Communication & Dispute

- 3.4.1. User accesses real-time chat thread with Brand via WebSocket connection
- 3.4.2. Chat accessible from top bar message icon showing thread list with unread badges
- 3.4.3. System displays "Team CreatorX" indicator when Admin joins thread for mediation
- 3.4.4. User can raise dispute via primary action in campaign detail, selecting reason: Quality Issue, Non-Payment, Contract Breach, or Other
- 3.4.5. User uploads evidence files; system locks escrow and notifies Admin for resolution

### 4. Creator Wallet & Financials

#### 4.1 Earnings Overview

- 4.1.1. User views Wallet dashboard showing total earnings, pending clearances, available balance, and amounts locked in escrow
- 4.1.2. Transaction history displays all movements with transparent 10% platform fee breakdowns per transaction
- 4.1.3. User filters history by date range and transaction type

#### 4.2 Withdrawal Processing

- 4.2.1. User initiates withdrawal and selects from verified bank accounts
- 4.2.2. User enters amount; system validates against available balance
- 4.2.3. System generates idempotency key and processes via Razorpay Payout API
- 4.2.4. User sees confirmation with 2–3 business day ETA and transaction reference

#### 4.3 Referral Program

- 4.3.1. User accesses referral section via Wallet dashboard "Refer & Earn" card or gift icon in Wallet top bar
- 4.3.2. User copies unique referral link to share
- 4.3.3. System tracks referee signups and displays pending and completed referrals
- 4.3.4. Upon referee KYC completion, system credits referrer wallet with reward amount and shows notification

#### 4.4 Notifications

- 4.4.1. User accesses Notifications from bell icon in top bar
- 4.4.2. System displays notification list with filter options: All, Campaigns, Payments, System
- 4.4.3. User can filter notifications by category to view specific types
- 4.4.4. User can mark all notifications as read with single action
- 4.4.5. Individual notifications show read/unread status and can be tapped to navigate to relevant content
- 4.4.6. System persists read status across sessions

### 5. Brand Onboarding & Setup

#### 5.1 Registration & Verification

- 5.1.1. Brand representative accesses web portal via desktop browser
- 5.1.2. User registers with work email and password
- 5.1.3. User enters company name, tax ID, and uploads corporate verification documents to Supabase Storage
- 5.1.4. System sets status to "Pending Admin Approval"

#### 5.2 Team Management (RBAC)

- 5.2.1. Upon approval, Owner accesses team management interface
- 5.2.2. Owner invites members by email and assigns role: Owner (full control), Manager (campaign + payment approval), or Viewer (read-only)
- 5.2.3. System enforces permissions at API and middleware layers; Viewers cannot see financial details or approve campaigns

#### 5.3 Wallet Funding

- 5.3.1. Brand navigates to Wallet dashboard showing Available Balance, Allocated to Escrows, and Total Spent
- 5.3.2. User initiates deposit via Razorpay; system updates balance upon confirmation
- 5.3.3. System displays pending allocations for draft campaigns

### 6. Brand Campaign Creation

#### 6.1 Campaign Wizard - Basics

- 6.1.1. Brand enters campaign creation wizard with step indicator
- 6.1.2. User inputs title, description, target niche categories, and platforms
- 6.1.3. User defines deliverable requirements: content type, quantity, deadlines, and SLA terms

#### 6.2 Usage Rights Configuration

- 6.2.1. Brand defines digital usage rights upfront: exclusivity period (category/brand restrictions), usage duration (6 months/1 year/perpetual), territorial scope (regional/global), and content restrictions
- 6.2.2. System generates contract template based on selections

#### 6.3 Compensation & Inventory

- 6.3.1. Brand selects compensation types: cash, physical gifting, digital perks, or combination
- 6.3.2. For cash components: Brand enters total budget; system calculates and displays Creator payout (net of fees) and total campaign cost (including 10% Brand fee)
- 6.3.3. For physical gifting: Brand selects from Inventory catalog with stock counts; system validates availability
- 6.3.4. For digital perks: Brand configures discount codes or software access details
- 6.3.5. For non-cash-only campaigns: system displays fixed service fee charge to Brand
- 6.3.6. Brand toggles "Allow Negotiation" to enable or disable custom pricing proposals from Creators

#### 6.4 Publishing & Escrow

- 6.4.1. Brand reviews campaign summary showing all terms, fees, and total budget impact
- 6.4.2. Upon publish, system validates Brand Wallet has sufficient funds
- 6.4.3. System allocates budget to escrow with pessimistic DB locking (SELECT FOR UPDATE)
- 6.4.4. Campaign status changes to "Live" and appears in Creator discovery feed

### 7. Brand Creator Management

#### 7.1 Application Review

- 7.1.1. Brand accesses Applications tab with filtering by campaign, metrics, and date
- 7.1.2. Brand views Creator profile showing AI match score, social metrics, and portfolio (profiles only visible to logged-in, verified Brands per privacy settings)
- 7.1.3. Brand shortlists candidates, approves, or rejects with explanatory feedback

#### 7.2 Negotiation & Direct Invite

- 7.2.1. If negotiation enabled, Brand reviews custom pricing proposals and counters with revised offers
- 7.2.2. Brand accesses AI-powered Creator Directory with filters for follower count, engagement rate, niche, location, and demographics (powered by third-party API)
- 7.2.3. Brand performs side-by-side comparison of up to 3 Creators
- 7.2.4. Brand sends direct invite to apply to specific Creators

### 8. Brand Deliverable Review

#### 8.1 Content Review Queue

- 8.1.1. Brand accesses Deliverables dashboard showing pending review queue
- 8.1.2. Brand views content files, captions, and posting requirements
- 8.1.3. System highlights SLA compliance status and flags potential breaches
- 8.1.4. Brand requests revisions or approves content

#### 8.2 Contract Execution & Payment

- 8.2.1. Upon approval, system presents digital contract interface with predefined usage rights
- 8.2.2. Brand reviews and digitally signs contract
- 8.2.3. System auto-releases escrow: Creator wallet credited (net of 10% fee), Brand receives invoice
- 8.2.4. System generates transaction records with audit logging

#### 8.3 Dispute Raising

- 8.3.1. If deliverables non-compliant, Brand raises dispute selecting reason: Quality Issue, Non-Compliance, Contract Breach, or Other
- 8.3.2. Brand uploads evidence; system locks escrow and notifies Admin

### 9. Admin Operations

#### 9.1 System Control Centre

- 9.1.1. Admin logs into dashboard showing System Control Centre
- 9.1.2. Dashboard displays work queues: KYC Pending, Active Disputes, Campaign Moderation
- 9.1.3. Platform health metrics visible: uptime percentage, Redis cache hit rates, active WebSocket connections
- 9.1.4. Audit logger shows recent system actions and user activity

#### 9.2 KYC Verification Queue

- 9.2.1. Admin views KYC queue with ID documents (front/back + selfie)
- 9.2.2. Admin cross-references documents with profile information
- 9.2.3. Admin approves or rejects with explanatory notes; user receives push notification of decision

#### 9.3 Campaign Moderation

- 9.3.1. Admin reviews flagged or pending campaigns against platform guidelines
- 9.3.2. Admin approves, pauses, or removes campaigns; Brand receives notification

#### 9.4 Proactive Chat Mediation

- 9.4.1. System monitors active chat threads via sentiment analysis detecting negative keywords or anger
- 9.4.2. Users (Brand or Creator) can flag threads via discrete "Request Help" button
- 9.4.3. Admin monitors active chats manually and joins any thread as "Team CreatorX" in real-time
- 9.4.4. Admin mediates conflicts before formal dispute escalation

#### 9.5 Dispute Resolution

- 9.5.1. Admin accesses dispute case queue showing open cases
- 9.5.2. Admin reviews case details: original campaign terms, deliverable files, chat history, and evidence
- 9.5.3. Admin evaluates SLA and contract compliance
- 9.5.4. Admin renders decision: release escrow to Creator or refund to Brand
- 9.5.5. System executes financial transaction with audit logging; both parties notified

#### 9.6 Financial Oversight

- 9.6.1. Admin views financial ledger of all platform transactions
- 9.6.2. Admin filters by date, type, and user; exports CSV for accounting
- 9.6.3. Admin monitors idempotency keys and Razorpay webhook delivery logs

#### 9.7 Compliance Management

- 9.7.1. Admin receives GDPR data export requests
- 9.7.2. Admin executes full user data package export
- 9.7.3. Admin executes account anonymization with cascading deletes maintaining DB integrity

### 10. Community & Events

#### 10.1 Community Feed Interaction

- 10.1.1. Creator accesses Community tab showing feed of posts from other Creators and Admin announcements
- 10.1.2. User creates post with text and media attachments
- 10.1.3. Users interact via likes and threaded comments
- 10.1.4. System notifies post authors of engagement

#### 10.2 Event Creation

- 10.2.1. Creator or Admin creates event entering title, description, type (virtual/physical), date, time, location, and capacity
- 10.2.2. Creator-hosted events show creator profile as organizer
- 10.2.3. System generates event page with registration link

#### 10.3 Event Sponsorship

- 10.3.1. Brand browses available events seeking sponsorship
- 10.3.2. Brand selects sponsorship tier or amount
- 10.3.3. System processes payment and marks event as sponsored by Brand
- 10.3.4. Event page updates showing Brand as sponsor

#### 10.4 Event Participation

- 10.4.1. Creator browses Event List filtering by date, type, and location
- 10.4.2. Creator views event details and registers attendance
- 10.4.3. System confirms registration and sends calendar integration details
- 10.4.4. Creator receives reminder notifications before event start

## Data Model

### User

Base entity for all platform users.

**Fields:**
* `id`: Unique identifier
* `email`: Contact email (unique)
* `phoneNumber`: Mobile number for Creators, optional for Brands
* `passwordHash`: Authentication credential
* `userType`: Enum [`creator`, `brand`, `admin`]
* `status`: Enum [`active`, `suspended`, `pending_deletion`]
* `notificationPreferences`: JSON configuration for push/email/SMS
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

**Relationships:**
* Has one `CreatorProfile` (if userType = creator)
* Has one `Brand` (if userType = brand)
* Has many `ChatMessage` entities
* Has many `Notification` entities

### CreatorProfile

Extended profile for influencer users.

**Fields:**
* `userId`: FK User (unique)
* `displayName`: Public profile name
* `bio`: Description text
* `nicheCategories`: Array of category strings (max 3)
* `primaryPlatform`: Enum [`instagram`, `youtube`, `tiktok`]
* `targetBudgetRange`: Min/max range
* `audienceDemographics`: JSON (age, gender, location data)
* `followerCount`: Number (synced via API)
* `engagementRate`: Percentage
* `kycStatus`: Enum [`pending`, `approved`, `rejected`]
* `kycDocuments`: JSON (URLs to ID front/back, selfie)
* `referralCode`: Unique string
* `availableBalance`: Decimal (cached wallet amount)

**Relationships:**
* Belongs to `User`
* Has many `SocialAccount` entities
* Has many `Application` entities
* Has many `Campaign` (as assignee)
* Has many `CommunityPost` entities
* Has many `EventRegistration` entities

### Brand

Company entity and wallet holder.

**Fields:**
* `userId`: FK User (unique)
* `companyName`: Legal business name
* `taxId`: Business registration number
* `gstDocuments`: JSON (verification file URLs)
* `verificationStatus`: Enum [`pending`, `approved`, `rejected`]
* `walletBalance`: Decimal (available funds)
* `escrowAllocated`: Decimal (locked in campaigns)
* `totalSpent`: Decimal (lifetime)

**Relationships:**
* Belongs to `User`
* Has many `BrandTeamMember` entities
* Has many `Campaign` entities
* Has many `InventoryItem` entities
* Has many `EventSponsorship` entities

### BrandTeamMember

RBAC assignments for Brand account access.

**Fields:**
* `id`: Unique identifier
* `brandId`: FK Brand
* `userId`: FK User (invited member)
* `email`: Invited email address
* `role`: Enum [`owner`, `manager`, `viewer`]
* `invitationStatus`: Enum [`pending`, `accepted`]
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `Brand`
* Belongs to `User`

### Campaign

Central entity for influencer marketing campaigns.

**Fields:**
* `id`: Unique identifier
* `brandId`: FK Brand
* `title`: Campaign name
* `description`: Detailed brief
* `nicheCategories`: Array of strings
* `targetPlatforms`: Array of enums
* `deliverableRequirements`: JSON (content type, quantity, deadlines)
* `slaTerms`: Text (service level agreement)
* `usageRights`: JSON (exclusivity, duration, territorial scope, restrictions)
* `compensationType`: Enum [`cash`, `gifting`, `digital`, `mixed`]
* `totalBudget`: Decimal (gross amount)
* `creatorPayout`: Decimal (net after fees)
* `fixedServiceFee`: Decimal (for non-cash campaigns)
* `negotiationEnabled`: Boolean
* `status`: Enum [`draft`, `pending_moderation`, `live`, `paused`, `completed`, `cancelled`]
* `escrowLocked`: Boolean
* `inventoryItems`: JSON (references to InventoryItem IDs and quantities)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

**Relationships:**
* Belongs to `Brand`
* Has many `Application` entities
* Has many `Deliverable` entities
* Has one `DigitalContract`
* Has many `ChatThread` entities

### InventoryItem

Physical products available for gifting.

**Fields:**
* `id`: Unique identifier
* `brandId`: FK Brand
* `productName`: Display name
* `description`: Product details
* `value`: Decimal (monetary value for reference)
* `stockCount`: Integer (current availability)
* `sku`: Optional stock keeping unit
* `images`: JSON (URLs)
* `isActive`: Boolean

**Relationships:**
* Belongs to `Brand`
* Referenced in `Campaign` configurations

### Application

Creator request to participate in campaign.

**Fields:**
* `id`: Unique identifier
* `campaignId`: FK Campaign
* `creatorId`: FK CreatorProfile
* `pitchMessage`: Text
* `proposedPrice`: Decimal (optional, if negotiation enabled)
* `portfolioLinks`: JSON (URLs)
* `status`: Enum [`pending`, `shortlisted`, `approved`, `rejected`, `countered`]
* `brandFeedback`: Text (if rejected)
* `counterOfferAmount`: Decimal (if brand counters)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

**Relationships:**
* Belongs to `Campaign`
* Belongs to `CreatorProfile`
* Has one `Deliverable` (upon approval)

### Deliverable

Submitted content for campaign fulfillment.

**Fields:**
* `id`: Unique identifier
* `applicationId`: FK Application
* `campaignId`: FK Campaign
* `creatorId`: FK CreatorProfile
* `contentFiles`: JSON (URLs to Supabase Storage)
* `captions`: Text
* `hashtags`: Array of strings
* `postingInstructions`: Text
* `submittedAt`: Timestamp
* `status`: Enum [`pending_review`, `revision_requested`, `approved`, `rejected`]
* `revisionNotes`: Text (from Brand)
* `slaDeadline`: Timestamp

**Relationships:**
* Belongs to `Application`
* Belongs to `Campaign`
* Belongs to `CreatorProfile`

### DigitalContract

Usage rights agreement signed before payment release.

**Fields:**
* `id`: Unique identifier
* `campaignId`: FK Campaign
* `deliverableId`: FK Deliverable
* `usageRightsSnapshot`: JSON (copy of campaign terms at signing)
* `creatorSignature`: Digital signature data
* `brandSignature`: Digital signature data
* `creatorSignedAt`: Timestamp
* `brandSignedAt`: Timestamp
* `status`: Enum [`pending`, `completed`]

**Relationships:**
* Belongs to `Campaign`
* Belongs to `Deliverable`

### Transaction

Financial movement record.

**Fields:**
* `id`: Unique identifier
* `userId`: FK User (party involved)
* `type`: Enum [`deposit`, `escrow_lock`, `escrow_release`, `withdrawal`, `fee`, `refund`, `referral_credit`]
* `amount`: Decimal
* `platformFee`: Decimal (10% where applicable)
* `currency`: String (default INR)
* `status`: Enum [`pending`, `completed`, `failed`, `reversed`]
* `razorpayId`: String (external reference)
* `idempotencyKey`: String (for payout deduplication)
* `metadata`: JSON (campaign reference, dispute reference)
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `User`

### ChatThread

Conversation container between Campaign participants.

**Fields:**
* `id`: Unique identifier
* `campaignId`: FK Campaign
* `participants`: Array of user IDs
* `createdAt`: Timestamp
* `lastMessageAt`: Timestamp
* `isEscalated`: Boolean (dispute raised)
* `adminJoined`: Boolean
* `sentimentAlert`: Boolean (auto-flagged)

**Relationships:**
* Belongs to `Campaign`
* Has many `ChatMessage` entities

### ChatMessage

Individual message within thread.

**Fields:**
* `id`: Unique identifier
* `threadId`: FK ChatThread
* `senderId`: FK User
* `content`: Text
* `attachments`: JSON (file URLs)
* `sentimentScore`: Decimal (AI analysis -1 to 1)
* `flagStatus`: Enum [`none`, `user_flagged`, `auto_flagged`]
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `ChatThread`
* Belongs to `User`

### DisputeCase

Formal escalation for conflict resolution.

**Fields:**
* `id`: Unique identifier
* `campaignId`: FK Campaign
* `deliverableId`: FK Deliverable
* `raisedById`: FK User
* `reason`: Enum [`quality_issue`, `non_payment`, `contract_breach`, `non_compliance`, `other`]
* `description`: Text
* `evidenceFiles`: JSON (URLs)
* `status`: Enum [`open`, `under_review`, `resolved_creator`, `resolved_brand`]
* `resolutionNotes`: Text
* `adminId`: FK User (resolver)
* `createdAt`: Timestamp
* `resolvedAt`: Timestamp

**Relationships:**
* Belongs to `Campaign`
* Belongs to `Deliverable`
* Belongs to `User` (raisedBy)
* Belongs to `User` (admin)

### CommunityPost

User-generated content in community feed.

**Fields:**
* `id`: Unique identifier
* `authorId`: FK CreatorProfile
* `content`: Text
* `mediaUrls`: JSON (image/video URLs)
* `likesCount`: Integer
* `commentsCount`: Integer
* `isPinned`: Boolean (Admin posts)
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `CreatorProfile`
* Has many `Comment` entities (implied, not detailed)

### Event

Gatherings organized by Creators or Admins.

**Fields:**
* `id`: Unique identifier
* `title`: Event name
* `description`: Details
* `organizerType`: Enum [`creator`, `admin`]
* `organizerId`: FK User
* `eventType`: Enum [`virtual`, `physical`]
* `location`: String (address or URL)
* `startDateTime`: Timestamp
* `endDateTime`: Timestamp
* `capacity`: Integer (max attendees)
* `registrationCount`: Integer (current)
* `sponsorshipStatus`: Enum [`unsponsored`, `pending`, `sponsored`]
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `User` (organizer)
* Has many `EventRegistration` entities
* Has many `EventSponsorship` entities

### EventRegistration

Creator attendance record.

**Fields:**
* `id`: Unique identifier
* `eventId`: FK Event
* `creatorId`: FK CreatorProfile
* `status`: Enum [`registered`, `attended`, `cancelled`]
* `registeredAt`: Timestamp

**Relationships:**
* Belongs to `Event`
* Belongs to `CreatorProfile`

### EventSponsorship

Brand funding for events.

**Fields:**
* `id`: Unique identifier
* `eventId`: FK Event
* `brandId`: FK Brand
* `amount`: Decimal
* `tier`: String (optional tier name)
* `status`: Enum [`pending`, `active`, `completed`]
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `Event`
* Belongs to `Brand`

### Notification

System alerts for users.

**Fields:**
* `id`: Unique identifier
* `userId`: FK User
* `type`: Enum [`kyc_status`, `application_status`, `deliverable_status`, `payment_received`, `chat_message`, `dispute_update`, `event_reminder`, `campaign_moderation`]
* `title`: Short text
* `body`: Detailed text
* `dataPayload`: JSON (deep link references)
* `isRead`: Boolean
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `User`

## Design

The CreatorX platform follows distinct design systems for each user type:

**Creator Mobile App:**
- Dark UI theme with glassmorphism effects
- Firebase Cloud Messaging for push notifications
- Optimized for thumb-friendly interactions and mobile gestures

**Brand Portal:**
- Desktop-optimized interface
- Deep charcoal palette background
- Violet-purple gradient accents for primary actions and highlights
- Inter typeface for all text elements

**Admin Dashboard:**
- Shares the same design system as the Brand Portal (deep charcoal, violet-purple gradients, Inter typeface)
- Data-dense layouts optimized for monitoring and queue management

## Frontend (Brand Portal)

### Common

#### Global Navigation

- Sidebar navigation with: Dashboard, Campaigns, Applications, Deliverables, Inventory, Events, Team, Wallet, Settings
- Top bar with user profile, notifications, and brand switcher
- Breadcrumb navigation for deep pages

#### System Status Indicators

- Wallet balance status in top bar
- Pending action badges on navigation items
- Verification status indicator

### BrandRegistration

New brand account creation.

**Content Hierarchy:**
- Work email input with validation
- Password input with strength indicator
- Confirm password field
- Company name input
- Tax ID/GST number input
- Document upload section for corporate verification (drag and drop)
- Terms of service and privacy policy checkboxes
- Registration button
- Success state with "Verification Pending" message

### BrandDashboard

Brand command center.

**Content Hierarchy:**
- Wallet overview cards: Available Balance, Allocated to Escrows, Total Spent
- Quick actions: Create Campaign, Deposit Funds, Invite Team Member
- Campaign performance metrics: Live campaigns, Active creators, Pending approvals
- Recent activity feed (applications, deliverables, transactions)
- Upcoming deadlines dashboard
- Verification status banner (if pending)

### TeamManagement

RBAC team configuration.

**Content Hierarchy:**
- Team members list with avatars, names, roles, and status
- Invite new member form (email input, role selector)
- Role permission matrix display (Owner, Manager, Viewer capabilities)
- Member management actions: remove member, change role, resend invite
- Invitation status tracking (pending, accepted, expired)

### CampaignWizard

Multi-step campaign creation flow.

**Content Hierarchy:**
- Progress stepper showing 4 steps: Basics, Requirements, Compensation, Review
- **Step 1 - Basics:** Title, description, niche categories (multi-select), target platforms
- **Step 2 - Requirements:** Deliverable type/count, deadlines, SLA terms, usage rights configuration (exclusivity, duration, territorial scope)
- **Step 3 - Compensation:** Cash budget input with fee calculator (shows Creator payout and total cost), inventory selector for gifting, digital perks configuration, negotiation toggle, fixed service fee display for non-cash campaigns
- **Step 4 - Review:** Complete campaign summary, fee breakdown, escrow amount, publish/draft buttons
- Draft auto-save functionality
- Back/next navigation controls

### ApplicationsDashboard

Creator application management.

**Content Hierarchy:**
- Filter bar: campaign dropdown, status filter, date range
- Search input for Creator names
- Application list cards showing: Creator thumbnail, name, AI match score, proposed price, status, apply date
- Application detail panel with: Creator full profile (private to verified brands), portfolio, pitch message, metrics (followers, engagement), shortlist/reject/counter actions
- Counter-offer modal with price input and message
- Bulk actions (shortlist all, reject all)
- Side-by-side comparison view (select up to 3 applications)

### DeliverablesDashboard

Content review and approval queue.

**Content Hierarchy:**
- Queue tabs: Pending Review, Revision Submitted, Approved, Rejected
- Deliverable cards showing: Creator name, campaign title, submission time, SLA status indicator
- Review panel with: Content file viewer (images/video), captions, hashtags, posting instructions
- SLA compliance checklist with pass/fail indicators
- Approval action with contract signing prompt
- Revision request modal with feedback text input
- Bulk approve action
- History timeline of all revisions

### DigitalContractSigning

Legal agreement execution.

**Content Hierarchy:**
- Contract header with campaign and Creator details
- Usage rights summary (exclusivity, duration, territorial scope, restrictions)
- Full contract terms display (scrollable)
- Creator signature display (timestamped)
- Brand signature canvas or checkbox acknowledgment
- Sign and release escrow button
- Cancel/dispute options
- Download PDF action

### InventoryManagement

Product gifting catalog.

**Content Hierarchy:**
- Inventory list with product images, names, SKUs, stock counts, values
- Add new product form: name, description, value, SKU, stock count, image upload
- Stock adjustment actions (add/remove)
- Product edit/delete actions
- Campaign assignment reference (shows which campaigns use each item)
- Low stock alerts

### EventDiscovery

Event sponsorship marketplace.

**Content Hierarchy:**
- Filter controls: date range, event type, sponsorship status
- Event cards showing: title, date, organizer, attendance count, sponsorship status
- Sponsorship action with tier/amount selection
- Payment modal with Razorpay integration
- Sponsored events list (active sponsorships)
- Analytics dashboard (views, clicks from sponsorship)

### WalletManagement

Financial operations.

**Content Hierarchy:**
- Balance cards: Available, Escrow Allocated, Total Spent
- Deposit action with amount input and Razorpay payment
- Transaction history table with filters and CSV export
- Invoice download section
- Tax document upload section
- Payout status tracking

---

## Frontend (Admin Dashboard)

### Common

#### Global Navigation

- Sidebar navigation: Dashboard, KYC Queue, Campaign Moderation, Disputes, Chat Oversight, Financial Ledger, Compliance
- Top bar with admin profile, notifications, platform health indicators
- Breadcrumb navigation

### AdminDashboard

System control center.

**Content Hierarchy:**
- Work queue summary cards: KYC Pending, Active Disputes, Flagged Campaigns
- Platform health metrics: Uptime %, Redis cache hit rate, Active WebSocket connections, Total users
- Recent audit log table (last 20 actions)
- Quick action buttons: Refresh queues, Export audit log
- Alert banner for critical system issues

### KYCVerificationQueue

Identity verification workflow.

**Content Hierarchy:**
- Queue list with Creator thumbnails, names, submission times
- Document viewer panel: ID front, ID back, Selfie (zoom/pan support)
- Profile cross-reference section: entered data vs. document data
- Action buttons: Approve, Reject (with mandatory notes)
- Search and filter controls
- Bulk action support
- Statistics dashboard (approved/rejected counts)

### CampaignModeration

Campaign review queue.

**Content Hierarchy:**
- Filtered list: Pending Review, Flagged, Live, Paused
- Campaign preview panel: brief, compensation, usage rights, deliverables
- Guidelines compliance checklist
- Moderation actions: Approve, Request Changes, Pause, Remove
- Note input for moderation decisions
- Brand notification preview

### ChatOversight

Real-time chat monitoring.

**Content Hierarchy:**
- Active threads list with participant names, last message time, sentiment alert indicator
- Thread view with full message history
- Flag status indicators (user_flagged, auto_flagged via sentiment analysis)
- Join chat action (appears as "Team CreatorX")
- Dispute escalation shortcut
- Manual monitoring controls (sort by time, filter by flag status)

### DisputeResolution

Conflict resolution interface.

**Content Hierarchy:**
- Case queue with dispute reasons, parties involved, open dates
- Case detail panel with tabs: Terms, Deliverables, Chat History, Evidence
- Original campaign terms snapshot
- SLA compliance evaluation checklist
- Contract breach analysis
- Decision actions: Release to Creator, Refund to Brand
- Resolution notes input (mandatory)
- Financial execution preview (amounts to move)
- Audit log for the case

### FinancialLedger

Platform financial oversight.

**Content Hierarchy:**
- Transaction table with comprehensive filters (date range, type, user, status)
- Amount summaries: Total volume, Platform fees collected, Refunds processed
- CSV export action
- Razorpay webhook logs with delivery status
- Idempotency key monitoring (duplicate detection alerts)
- Reconciliation status indicators

### ComplianceManagement

GDPR and data privacy tools.

**Content Hierarchy:**
- Data export request queue with user identifiers
- Export action with progress indicator
- Download generated data package (JSON/CSV format)
- Anonymization request queue
- Anonymization action with cascading delete preview
- Account deletion queue with orphaned record check
- Compliance audit log

## Frontend

#### Mobile Common
  - **Navigation:** Bottom tab bar with primary destinations: Explore, Community, Events, Wallet, Profile. Referrals accessible via Wallet screen.
  - **Status Indicators:** Persistent notification badge on Messages tab, KYC status banner at top of screen (if pending).
  - **Gestures:** Swipe gesture support for back navigation.

  ### Desktop Common
  - **Navigation:** Left-sidebar navigation with persistent branding and main menu links including Messages and Referrals.
  - **Top Bar:** Breadcrumb navigation, Global Search, Chat icon, Notifications Bell, and User Avatar with dropdown. Wallet screen includes Gift icon for Referrals.
  - **Layout:** Centered max-width containers for forms/wizards, full-width for tables/dashboards.
  - **Modals:** Centered overlays for critical actions (Delete, Confirm) and Slide-over Panels (Drawers) for details/edits to maintain parent context.
  - **Feedback:** Toast notifications slide in from top-right.

### LaunchScreen

Summary: The entry point of the mobile app, handling authentication checks and routing users appropriately.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the brand logo, tagline, and a loading indicator while the system checks for an existing auth token.

#### Contents

Initial entry point with brand identity and authentication routing.

**Content Hierarchy:**
- Brand logo and tagline (Centered on Desktop, Top on Mobile)
- Authentication state check (AsyncStorage/Token validation)
- Loading indicator during verification
- Automatic navigation to Explore Feed (if authenticated) or PhoneEntry (if new)

### PhoneEntryScreen

Summary: Collects the user's phone number to initiate the authentication process via OTP.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The form is displayed empty in a centered card, with the country code selector and phone input field ready for user entry.
ID: validationError | Validation Error | The phone number input is filled but invalid, displaying an inline error message indicating the incorrect format or unsupported region.

#### Contents

Phone number collection for Supabase Phone Auth initiation.

**Content Hierarchy:**
- Centered card layout on Desktop (max-width 400px).
- Country code selector with search
- Phone number input with validation formatting
- Primary action to request OTP
- Terms of service acknowledgment
- Error messaging for invalid formats or unsupported regions

### OTPVerificationScreen

Summary: Verifies the user's identity through a 6-digit one-time password sent to their phone.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the empty 6-digit input fields, the resend timer, and the edit phone number option.
ID: codeEntered | Code Entered | All 6 digits are filled in. The system indicates it is processing or automatically submitting the code.
ID: invalidCode | Invalid Code | Displays an error message stating the code is incorrect, clears the input, and allows the user to try again.

#### Contents

One-time password confirmation.

**Content Hierarchy:**
- Centered card layout on Desktop.
- 6-digit code input interface (horizontal inputs on Desktop, keypad numpad focus on Mobile)
- Resend timer countdown
- Edit phone number action
- Automatic submission on complete entry
- Error state for invalid codes

### OnboardingNicheSelectionScreen

Summary: The first step of the onboarding wizard where users select their content niche categories.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the grid of niche categories with no selections made.
ID: selectionsMade | Selections Made | The user has selected one or more niche categories, which are visually highlighted.
ID: limitReached | Limit Reached | The user has selected the maximum of 3 categories. The interface prevents further selection and highlights the limit.

#### Contents

Profile category selection (Step 1 of wizard).

**Content Hierarchy:**
- Progress indicator showing current step (Top of card on Desktop)
- Multi-select grid of niche categories (4-column grid on Desktop, 2-column on Mobile; limit 3)
- Selected state visualization
- Navigation to next step

### OnboardingPlatformBudgetScreen

Summary: The second step of onboarding where users define their primary platform, budget expectations, and audience demographics.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the platform options, budget slider, and demographics inputs in their default empty/unselected state.
ID: filled | Filled | All fields are filled: a platform is selected, the budget slider is set, and demographics are inputted. The "Next" button is active.

#### Contents

Platform and compensation preferences (Step 2).

**Content Hierarchy:**
- Centered card on Desktop.
- Single-select primary platform options (Horizontal list on Desktop, Vertical stack on Mobile)
- Budget range slider or selection interface
- Audience demographics input (age ranges, location)
- Navigation controls (back and next)

### SocialAccountConnectionScreen

Summary: Handles the connection of the user's social media account to import metrics via OAuth.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Shows the platform selection and a "Connect" button with permission scope explanations.
ID: metricsPreview | Metrics Preview | Upon successful connection, displays the imported metrics (follower count, engagement rate) for user review and confirmation.
ID: manualFallback | Manual Fallback | Displayed if the OAuth connection fails, allowing the user to manually enter their metrics or handle credentials.

#### Contents

OAuth integration for metrics import.

**Content Hierarchy:**
- Centered card on Desktop.
- Platform selection matching previous choice
- OAuth web view (popup on Desktop, in-app webview on Mobile)
- Permission scope explanation
- Metrics preview upon successful connection (follower count, engagement rate)
- Manual entry fallback for connection failures

### KYCDocumentUploadScreen

Summary: Collects identity documents and a selfie for Know Your Customer (KYC) verification.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the initial screen with document type guidance and upload zones/capture buttons.
ID: reviewImages | Review Images | All required images (ID front, ID back, Selfie) have been captured and are displayed in a review grid with retake options.
ID: uploading | Uploading | The submission process is active, showing a progress bar or compression status as files are uploaded to Supabase Storage.
ID: readOnly | Read-Only | The user's KYC is pending review. The screen is in a read-only state, indicating they cannot apply to campaigns yet.

#### Contents

Identity verification submission.

**Content Hierarchy:**
- Centered card on Desktop.
- Document type guidance (national ID)
- Upload zones with Drag-and-Drop support (Desktop) / Camera capture buttons (Mobile)
- Review grid for uploaded images (ID front, ID back, Selfie)
- Submission trigger with compression status
- Read-only mode indicator (browse only until approved)

### ExploreFeedScreen

Summary: The main discovery screen where Creators browse AI-matched campaigns.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the grid of campaign cards (Desktop) or vertical feed (Mobile) with the filter bar and search input visible.
ID: filterPanelOpen | Filter Panel Open | The filter bar is expanded or a modal is visible, showing the specific options for category, budget, platform, and compensation type.
ID: searchActive | Search Active | The search input is focused, displaying the keyboard (Mobile) or a dropdown history (Desktop).
ID: emptyState | Empty State | No campaigns match the current criteria or search query. Displays an empty state illustration and message.

#### Contents

AI-matched campaign discovery.

**Content Hierarchy:**
- **Desktop:** Top filter bar with category pills, budget range inputs, and compensation type toggles. Grid layout (3 columns) for campaign cards. Chat icon button in top bar next to notifications. Sidebar includes Messages with unread badge.
- **Mobile:** Filter bar expanding to modal. Vertical scroll feed of campaign cards. Chat icon button in header.
- Each card displays: Brand name, campaign title, match confidence score, fee-adjusted payout amount, compensation type indicators.
- Pull-to-refresh gesture (Mobile only).
- Empty state for no matches.

### CampaignDetailScreen

Summary: Detailed view of a specific campaign, allowing the Creator to review terms and apply.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the full campaign information in a split pane (Desktop) or scroll view (Mobile) with the primary "Apply" action.
ID: kycLocked | KYC Locked | The primary "Apply" action is disabled or replaced with a "Complete KYC" prompt because the user's verification is pending.

#### Contents

Full campaign information and application entry.

**Content Hierarchy:**
- **Desktop:** Split layout. Left column: Brand profile, Description, Deliverables, Usage Rights. Right column: Compensation summary, Gifting details, and sticky "Apply" action.
- **Mobile:** Single column scroll.
- Brand profile header with verification badge
- SLA terms display
- Usage rights summary (exclusivity, duration, territorial scope)
- Compensation breakdown showing Creator net amount (after 10% fee deduction)
- Physical gifting details with inventory availability status
- Primary application action (gated if KYC pending)

### ApplicationComposerScreen

Summary: The interface for Creators to compose and submit their pitch and application to a campaign.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The text composition area and portfolio upload section are visible. The pitch field is empty.
ID: pricingProposalVisible | Pricing Proposal Visible | If negotiation is enabled by the Brand, the pricing proposal input field is visible, showing the current offer as a reference.
ID: portfolioAdded | Portfolio Added | Portfolio files have been uploaded, showing thumbnails in the media slots.
ID: reviewSubmission | Review Submission | The user has clicked submit, showing a confirmation modal with the fee breakdown and terms acknowledgment before finalizing.

#### Contents

Campaign pitch and proposal submission.

**Content Hierarchy:**
- **Desktop:** Centered modal (approx 600px width) or split view form.
- Campaign reference header (sticky)
- Text composition area for pitch message
- Portfolio upload section (drag-drop zone on Desktop, media picker on Mobile)
- Conditional pricing proposal input (visible only if Brand enabled negotiation)
- Fee breakdown summary
- Character counters and validation
- Submission confirmation with terms acknowledgment

### ActiveCampaignsListScreen

Summary: Lists all campaigns the Creator is currently engaged in, segmented by status.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the table (Desktop) or segmented list (Mobile) of active campaigns.

#### Contents

Ongoing campaign management hub.

**Content Hierarchy:**
- **Desktop:** Data table with sortable columns (Brand, Campaign, Deadline, Status).
- **Mobile:** Segmented control tabs (Pending Delivery, In Progress, Pending Review, Completed) with list items below.
- Unread message indicators
- Quick action to enter chat

### ActiveCampaignDetailScreen

Summary: The main dashboard for managing an active campaign, including shipping, uploads, chat, and disputes.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the status timeline, current action items (e.g., shipping confirmation or upload interface), and access to chat.
ID: disputeModalOpen | Dispute Modal Open | A centered modal is visible allowing the user to select a dispute reason (Quality Issue, Non-Payment, etc.) and upload evidence.
ID: adminJoined | Admin Joined | The "Team CreatorX" presence indicator is visible in the chat section, signaling that an admin is monitoring the thread.

#### Contents

Specific campaign execution interface.

**Content Hierarchy:**
- **Desktop:** 3-column layout. Left: Status Timeline. Center: Active Task (Upload/Shipping form). Right: Chat Mini-view or collapsible panel.
- **Mobile:** Single column scroll with collapsible sections.
- Shipping confirmation section (address display, receipt confirmation action)
- Digital delivery confirmation (for non-physical perks)
- Deliverable upload interface with media picker and progress tracking
- Caption and hashtag input fields
- Submission history with revision requests
- Real-time chat access with Brand
- "Team CreatorX" presence indicator when Admin joins thread
- Dispute raising action (with reason selection and evidence upload)

### DeliverableUploadInterfaceScreen

Summary: A dedicated workflow for selecting media, adding captions, and submitting deliverables for review.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the media selection options (camera roll/camera) and empty caption/hashtag fields.
ID: mediaSelected | Media Selected | Media files are selected and displayed in a preview grid. The caption and hashtag fields are visible for entry.
ID: confirmationModal | Confirmation Modal | The user has clicked submit, triggering a confirmation modal that reviews the deliverables and SLA deadline before final submission.

#### Contents

Content submission workflow.

**Content Hierarchy:**
- **Desktop:** Split view. Left: Media Library/Selector. Right: Upload Queue  Metadata Entry.
- **Mobile:** Full screen media picker followed by form.
- File preview grid with reordering capability
- Caption composition area
- Hashtag input with suggestions
- Posting instructions review
- SLA deadline countdown
- Submit action with confirmation modal

### ChatInterfaceScreen

Summary: The real-time chat interface between Creator and Brand, with admin mediation features.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the message thread and the text input area. Normal conversation state.
ID: adminJoined | Admin Joined | A "Team CreatorX" system message is visible in the thread, and the admin avatar is present in the header.
ID: sentimentAlert | Sentiment Alert | A banner is visible at the top of the chat indicating that negative sentiment was detected, with an option to flag for help.
ID: escalationMenu | Escalation Menu | The "Flag for help" or "Escalate to dispute" menu/action is visible or active.

#### Contents

Real-time communication with mediation support.

**Content Hierarchy:**
- **Desktop:** Split-pane layout. Left: Thread list (if multiple campaigns) or Context header. Right: Message thread and Input area. Sidebar shows Messages as active.
- **Mobile:** Full screen message thread with back navigation.
- Message status indicators (sent, delivered, read)
- "Team CreatorX" system message when Admin joins
- Flag for help action (accessible via header menu)
- Sentiment alert banner (if system detects negative tone)
- Escalation to dispute action

### WalletDashboardScreen

Summary: Provides an overview of the Creator's earnings, balances, and transaction history.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the balance cards (Available, Pending, Escrow), Refer  Earn promo card, and the recent transaction history list/table.

#### Contents

Financial overview and management.

**Content Hierarchy:**
- **Desktop:** Card grid at top (Available, Pending, Escrow). Data table below for Transaction History. Gift icon in top bar linking to Referrals. Refer  Earn card showing referral promo.
- **Mobile:** Stacked cards for balance. Vertical list for history. Gift icon in header. Refer  Earn card.
- Fee transparency: each transaction shows gross amount, platform fee (10%), net amount
- Withdrawal initiation action
- Referral program access via Gift icon and promo card
- Bank account management

### WithdrawalFlowScreen

Summary: Guides the user through the process of requesting a withdrawal to their bank account.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: amountInput | Amount Input | The user selects a bank account and enters the withdrawal amount.
ID: confirmation | Confirmation | Displays a summary of the withdrawal, fees, and destination bank, asking for final confirmation.
ID: success | Success | Displays the success message, the transaction reference, and the estimated processing time (2-3 business days).

#### Contents

Payout request processing.

**Content Hierarchy:**
- **Desktop:** Centered Modal or Slide-over Panel.
- Bank account selector (verified accounts only)
- Amount input with available balance validation
- Fee summary (if any withdrawal fees apply)
- Confirmation screen with Razorpay reference generation
- Processing status with 2-3 business day ETA
- Idempotency key display (for support reference)

### ReferralSectionScreen

Summary: Allows users to invite others and track their referral rewards.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the unique referral code, copy button, and the list of referred users with their status.
ID: shareSheetOpen | Share Sheet Open | The native share sheet is visible, allowing the user to share their referral link via other apps.

#### Contents

Invitation and rewards tracking.

**Content Hierarchy:**
- **Desktop:** Split view. Left: Unique referral code and share buttons. Right: Referral status table/list. Sidebar shows Referrals as active.
- **Mobile:** Stacked sections.
- Unique referral code display with copy action
- Share sheet integration (native sharing)
- Referral status list: invited users, KYC completion status, reward earned
- Reward credit history

### CommunityFeedScreen

Summary: A social feed for Creators to interact with posts from peers and Admins.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the vertical scroll feed (Mobile) or Grid (Desktop) of community posts, including pinned admin announcements.
ID: createPost | Create Post | The post creation interface is active (Modal on Desktop, Full screen on Mobile), allowing text input and media attachment.

#### Contents

Social content discovery and interaction.

**Content Hierarchy:**
- **Desktop:** 3-column Masonry or Grid layout for posts. Left rail: Trending topics/Tags.
- **Mobile:** Vertical single-column feed.
- Post creation action (Floating action button on Mobile, Header button on Desktop)
- Interaction actions: like, comment, share
- Admin announcement indicators (pinned posts)
- Pull-to-refresh and infinite scroll

### EventListScreen

Summary: Lists upcoming events that Creators can browse and register for.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of event cards with default sorting and filters.
ID: filtersOpen | Filters Open | The filter controls (date, type, sponsorship) are expanded or visible for adjustment.

#### Contents

Gathering discovery and registration.

**Content Hierarchy:**
- **Desktop:** Grid of event cards. Sidebar filter for date, type, sponsorship.
- **Mobile:** Filter controls (collapsible), List of event cards.
- Event cards showing: title, date/time, organizer, sponsorship badge, capacity status
- Calendar integration action
- Registration status indicators

### EventDetailScreen

Summary: Detailed view of an event, providing information and registration options.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays all event details. The "Register" button is active.
ID: registered | Registered | The user is registered. The button changes to "Registered" or "Cancel", and attendee information is visible.
ID: sponsored | Sponsored View | The event is sponsored by a Brand, displaying the Sponsor's branding prominently.

#### Contents

Specific event information and actions.

**Content Hierarchy:**
- **Desktop:** Hero banner header. Two-column body (Details Left, Attendees/Sponsors Right).
- **Mobile:** Vertical scroll with hero image.
- Event header with title and description
- Organizer profile (Creator or Admin)
- Date, time, and location details with map integration (if physical)
- Sponsor Brand display (if sponsored)
- Registration action with capacity check
- Attendee count and profile previews
- Add to calendar action
- Cancellation option (if registered)

### EventCreationScreen

Summary: Allows Creators to create and manage their own events.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The event creation form is displayed empty, waiting for user input.
ID: preview | Preview | The user has filled the form and is viewing a preview of how the event listing will appear.

#### Contents

Creator event hosting interface.

**Content Hierarchy:**
- **Desktop:** Centered form container (max-width 800px) with 2-column input grid.
- **Mobile:** Single column form.
- Form fields: title, description, event type selector (virtual/physical)
- Location input (URL for virtual, address/map for physical)
- Date and time pickers with timezone support
- Capacity input with validation
- Cover image upload
- Preview of event listing
- Publish/draft options
- Edit capability for own events

### ProfileSettingsScreen

Summary: The settings screen for managing account details, connections, and app preferences.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of profile settings sections and account information.
ID: editing | Editing Profile | The profile information section is in edit mode, allowing text changes and image updates.
ID: socialAccounts | Connected Accounts | Shows connected social accounts with platform details, metrics, and connection management options.

#### Contents

Account and preference management.

**Content Hierarchy:**
- **Desktop:** 2-column layout. Left: Navigation menu for settings sections. Right: Form content for active section.
- **Mobile:** Single page with accordion or section headers.
- Profile information display and edit
- Social account connections management
- Notification preferences (push, email, SMS toggles)
- KYC status and document re-upload
- Bank account management
- Support and legal links
- Logout action

### BrandRegistrationScreen

Summary: The registration flow for new Brand users on the web portal.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The registration form is displayed with empty fields.
ID: validationError | Validation Error | The form is submitted but has validation errors (e.g., weak password, mismatched emails, missing fields), which are highlighted.
ID: success | Success | Registration is successful. Displays a confirmation message stating the account is pending admin verification.

#### Contents

New brand account creation.

**Content Hierarchy:**
- **Desktop:** Split screen layout. Left half: Brand Value Prop/Illustration. Right half: Centered Registration Form (max-width 450px).
- **Mobile:** Single column form.
- Work email input with validation
- Password input with strength indicator
- Confirm password field
- Company name input
- Tax ID/GST number input
- Document upload section for corporate verification (drag and drop)
- Terms of service and privacy policy checkboxes
- Registration button
- Success state with "Verification Pending" message

### BrandDashboardScreen

Summary: The main dashboard for Brands, providing an overview of finances, campaigns, and activities.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the full dashboard with wallet cards, metrics, and activity feed.
ID: verificationPending | Verification Pending | A banner is visible at the top indicating the Brand account is still pending verification.

#### Contents

Brand command center.

**Content Hierarchy:**
- **Desktop:** Grid layout (3 columns) for Wallet Overview Cards. Quick Actions bar. Below that: 2-column split for Campaign Performance Metrics (Charts) and Recent Activity Feed.
- **Mobile:** Vertical stack of cards and lists.
- Wallet overview cards: Available Balance, Allocated to Escrows, Total Spent
- Quick actions: Create Campaign, Deposit Funds, Invite Team Member
- Campaign performance metrics: Live campaigns, Active creators, Pending approvals
- Recent activity feed (applications, deliverables, transactions)
- Upcoming deadlines dashboard
- Verification status banner (if pending)

### TeamManagementScreen

Summary: Interface for managing Brand team members and their roles (RBAC).

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of current team members and the "Invite Member" button.
ID: inviteModal | Invite Modal | A modal/panel is active for inviting a new member, showing email input and role selection options.

#### Contents

RBAC team configuration.

**Content Hierarchy:**
- **Desktop:** Data table for Team Members. "Invite Member" button triggers a Slide-over Panel or Modal. Role Permission Matrix displayed as a grid below the list.
- **Mobile:** List view for members. Modal for invite.
- Team members list with avatars, names, roles, and status
- Invite new member form (email input, role selector)
- Role permission matrix display (Owner, Manager, Viewer capabilities)
- Member management actions: remove member, change role, resend invite
- Invitation status tracking (pending, accepted, expired)

### CampaignWizardScreen

Summary: A multi-step wizard for Brands to create and configure new campaigns.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: step1Basics | Step 1: Basics | The wizard is on Step 1, displaying inputs for title, description, niches, and platforms.
ID: step2Requirements | Step 2: Requirements | The wizard is on Step 2, displaying inputs for deliverables, deadlines, and usage rights.
ID: step3Compensation | Step 3: Compensation | The wizard is on Step 3, displaying inputs for budget, inventory, and negotiation settings.
ID: step4Review | Step 4: Review | The wizard is on Step 4, displaying a complete summary of the campaign and the Publish/Draft buttons.

#### Contents

Multi-step campaign creation flow.

**Content Hierarchy:**
- **Desktop:** Horizontal Stepper at top. Content area in a centered, constrained container (e.g., 800px).
- **Mobile:** Vertical stepper or top tabs. Full width content.
- Progress stepper showing 4 steps: Basics, Requirements, Compensation, Review
- **Step 1 - Basics:** Title, description, niche categories (multi-select), target platforms
- **Step 2 - Requirements:** Deliverable type/count, deadlines, SLA terms, usage rights configuration (exclusivity, duration, territorial scope)
- **Step 3 - Compensation:** Cash budget input with fee calculator (shows Creator payout and total cost), inventory selector for gifting, digital perks configuration, negotiation toggle, fixed service fee display for non-cash campaigns
- **Step 4 - Review:** Complete campaign summary, fee breakdown, escrow amount, publish/draft buttons
- Draft auto-save functionality
- Back/next navigation controls

### ApplicationsDashboardScreen

Summary: The dashboard for managing incoming Creator applications to campaigns.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of application cards (Mobile) or Table (Desktop) with filters and search visible.
ID: detailPanelOpen | Detail Panel Open | Clicking an application opens a side panel (Desktop) or full screen (Mobile) showing the Creator's full profile, pitch, and metrics.
ID: comparisonView | Comparison View | Multiple applications (up to 3) are selected and displayed side-by-side for comparison.
ID: counterOfferModal | Counter-Offer Modal | A modal is open allowing the Brand to input a counter-price and message for a negotiation-enabled campaign.

#### Contents

Creator application management.

**Content Hierarchy:**
- **Desktop:** Master-Detail view. Left pane: Searchable Data Table/List of applications. Right pane: Slide-over Panel showing Creator Profile, Pitch, and Action Buttons.
- **Mobile:** List of applications. Tapping opens full screen Detail View.
- Filter bar: campaign dropdown, status filter, date range
- Search input for Creator names
- Application list cards showing: Creator thumbnail, name, AI match score, proposed price, status, apply date
- Application detail panel with: Creator full profile (private to verified brands), portfolio, pitch message, metrics (followers, engagement), shortlist/reject/counter actions
- Counter-offer modal with price input and message
- Bulk actions (shortlist all, reject all)
- Side-by-side comparison view (select up to 3 applications)

### DeliverablesDashboardScreen

Summary: The queue interface for reviewing and approving Creator deliverables.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of deliverables in the "Pending Review" tab.
ID: reviewPanelOpen | Review Panel Open | A deliverable is selected, opening a panel with the content viewer, captions, and SLA checklist.
ID: revisionRequestModal | Revision Request Modal | A modal is visible for typing feedback to request revisions from the Creator.

#### Contents

Content review and approval queue.

**Content Hierarchy:**
- **Desktop:** Gallery Grid of deliverables. Clicking an item opens a detailed Review Modal/Panel with Media Viewer on Left and Approval Actions/Checklist on Right.
- **Mobile:** List of deliverable cards. Clicking opens full screen review.
- Queue tabs: Pending Review, Revision Submitted, Approved, Rejected
- Deliverable cards showing: Creator name, campaign title, submission time, SLA status indicator
- Review panel with: Content file viewer (images/video), captions, hashtags, posting instructions
- SLA compliance checklist with pass/fail indicators
- Approval action with contract signing prompt
- Revision request modal with feedback text input
- Bulk approve action
- History timeline of all revisions

### DigitalContractSigningScreen

Summary: The interface for Brands to review and sign digital contracts for approved deliverables.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: viewMode | View Mode | Displays the contract terms, Creator signature, and the "Sign" button for the Brand.
ID: signed | Signed | The Brand has signed. Displays the confirmation, the signed status, and confirmation of escrow release.

#### Contents

Legal agreement execution.

**Content Hierarchy:**
- **Desktop:** Centered Modal (Paper-like view) for contract reading. Sticky footer for Signing Action.
- **Mobile:** Full screen scroll view.
- Contract header with campaign and Creator details
- Usage rights summary (exclusivity, duration, territorial scope, restrictions)
- Full contract terms display (scrollable)
- Creator signature display (timestamped)
- Brand signature canvas or checkbox acknowledgment
- Sign and release escrow button
- Cancel/dispute options
- Download PDF action

### InventoryManagementScreen

Summary: Management interface for physical products used in gifting campaigns.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of inventory items with their details and stock levels.
ID: editModalOpen | Edit Modal Open | A modal is open for adding a new product or editing an existing one, showing the form fields.

#### Contents

Product gifting catalog.

**Content Hierarchy:**
- **Desktop:** Data Grid with inline editing or "Edit" button opening a Modal. Image thumbnails visible in grid.
- **Mobile:** List view with "Add" button opening form.
- Inventory list with product images, names, SKUs, stock counts, values
- Add new product form: name, description, value, SKU, stock count, image upload
- Stock adjustment actions (add/remove)
- Product edit/delete actions
- Campaign assignment reference (shows which campaigns use each item)
- Low stock alerts

### EventDiscoveryScreen

Summary: Allows Brands to discover events and sponsor them.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of available events for sponsorship.
ID: sponsorshipModal | Sponsorship Modal | A modal is open allowing the Brand to select a sponsorship tier/amount and proceed to payment.

#### Contents

Event sponsorship marketplace.

**Content Hierarchy:**
- **Desktop:** Grid of event cards with hover effects revealing Sponsorship button.
- **Mobile:** List of event cards with Sponsorship button always visible.
- Filter controls: date range, event type, sponsorship status
- Event cards showing: title, date, organizer, attendance count, sponsorship status
- Sponsorship action with tier/amount selection
- Payment modal with Razorpay integration
- Sponsored events list (active sponsorships)
- Analytics dashboard (views, clicks from sponsorship)

### WalletManagementScreen

Summary: Financial dashboard for Brands to manage funds, deposits, and transaction history.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays balance cards and the transaction history table.
ID: depositModal | Deposit Modal | A modal is open for entering a deposit amount and processing payment via Razorpay.

#### Contents

Financial operations.

**Content Hierarchy:**
- **Desktop:** Top row: Balance Cards. Main area: Transaction History Table with filters.
- **Mobile:** Stacked cards. Paginated list for history.
- Balance cards: Available, Escrow Allocated, Total Spent
- Deposit action with amount input and Razorpay payment (Modal)
- Transaction history table with filters and CSV export
- Invoice download section
- Tax document upload section
- Payout status tracking

### AdminDashboardScreen

Summary: The main command center for Admins to monitor system health and review queues.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the queue summary cards, health metrics, and the recent audit log.

#### Contents

System control center.

**Content Hierarchy:**
- **Desktop:** High-density dashboard. Top: Work Queue Summary Cards (Clickable). Middle: Platform Health Charts (Uptime, Redis). Bottom: Recent Audit Log Table.
- **Mobile:** Vertical scroll of cards and lists.
- Work queue summary cards: KYC Pending, Active Disputes, Flagged Campaigns
- Platform health metrics: Uptime %, Redis cache hit rate, Active WebSocket connections, Total users
- Recent audit log table (last 20 actions)
- Quick action buttons: Refresh queues, Export audit log
- Alert banner for critical system issues

### KYCVerificationQueueScreen

Summary: The queue for Admins to review and approve or reject Creator KYC documents.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of pending KYC requests.
ID: reviewPanelOpen | Review Panel Open | A specific request is selected, showing the document viewer and profile cross-reference section.
ID: rejectModal | Reject Modal | The Admin has clicked Reject, opening a modal to input mandatory explanatory notes.

#### Contents

Identity verification workflow.

**Content Hierarchy:**
- **Desktop:** 3-Column Layout. Left: Queue List. Center: Document Viewer (Zoom/Pan). Right: Profile Data Cross-reference  Action Buttons.
- **Mobile:** List view. Tapping opens full screen viewer.
- Queue list with Creator thumbnails, names, submission times
- Document viewer panel: ID front, ID back, Selfie (zoom/pan support)
- Profile cross-reference section: entered data vs. document data
- Action buttons: Approve, Reject (with mandatory notes)
- Search and filter controls
- Bulk action support
- Statistics dashboard (approved/rejected counts)

### CampaignModerationScreen

Summary: Allows Admins to moderate campaigns to ensure they comply with platform guidelines.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of campaigns requiring moderation attention.
ID: previewPanelOpen | Preview Panel Open | A campaign is selected, showing details and the compliance checklist.

#### Contents

Campaign review queue.

**Content Hierarchy:**
- **Desktop:** List on Left, Preview Panel on Right.
- **Mobile:** List view. Detail view on tap.
- Filtered list: Pending Review, Flagged, Live, Paused
- Campaign preview panel: brief, compensation, usage rights, deliverables
- Guidelines compliance checklist
- Moderation actions: Approve, Request Changes, Pause, Remove
- Note input for moderation decisions
- Brand notification preview

### ChatOversightScreen

Summary: Enables Admins to monitor active chat threads for sentiment and escalate if necessary.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the list of active chat threads with sentiment and flag indicators.
ID: joinedChat | Joined Chat | The Admin has joined a specific thread, appearing as "Team CreatorX" with full message history visible.

#### Contents

Real-time chat monitoring.

**Content Hierarchy:**
- **Desktop:** Split Pane. Left: Thread List (with sentiment sparklines). Right: Active Chat View.
- **Mobile:** List of threads. Tap to enter chat.
- Active threads list with participant names, last message time, sentiment alert indicator
- Thread view with full message history
- Flag status indicators (user_flagged, auto_flagged via sentiment analysis)
- Join chat action (appears as "Team CreatorX")
- Dispute escalation shortcut
- Manual monitoring controls (sort by time, filter by flag status)

### DisputeResolutionScreen

Summary: The interface for resolving escalated disputes between Creators and Brands.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the queue of open dispute cases.
ID: caseDetailTerms | Case Detail - Terms | A case is opened, showing the Terms tab with original campaign terms and SLA compliance checklist.
ID: caseDetailEvidence | Case Detail - Evidence | A case is opened, showing the Evidence tab with uploaded files and chat history.
ID: decisionModal | Decision Modal | The Admin is ready to render a decision. The modal shows the financial preview (release/refund amounts) and input for resolution notes.

#### Contents

Conflict resolution interface.

**Content Hierarchy:**
- **Desktop:** List of cases on Left. Case Detail Container on Right with internal Tabs (Terms, Deliverables, Chat, Evidence).
- **Mobile:** List of cases. Full screen detail view with top tabs.
- Case queue with dispute reasons, parties involved, open dates
- Case detail panel with tabs: Terms, Deliverables, Chat History, Evidence
- Original campaign terms snapshot
- SLA compliance evaluation checklist
- Contract breach analysis
- Decision actions: Release to Creator, Refund to Brand
- Resolution notes input (mandatory)
- Financial execution preview (amounts to move)
- Audit log for the case

### FinancialLedgerScreen

Summary: A comprehensive view of all financial transactions and system money movement.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the transaction table with default filters and summary cards.

#### Contents

Platform financial oversight.

**Content Hierarchy:**
- **Desktop:** Full-width Data Table with advanced filtering toolbar (Date pickers, Dropdowns).
- **Mobile:** Filter bar. Paginated list of transactions.
- Transaction table with comprehensive filters (date range, type, user, status)
- Amount summaries: Total volume, Platform fees collected, Refunds processed
- CSV export action
- Razorpay webhook logs with delivery status
- Idempotency key monitoring (duplicate detection alerts)
- Reconciliation status indicators

### ComplianceManagementScreen

Summary: Tools for managing GDPR requests, data exports, and account anonymization.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Displays the queues for data export and anonymization requests.
ID: exportProgress | Export Progress | A data export is in progress, showing a progress indicator.

#### Contents

GDPR and data privacy tools.

**Content Hierarchy:**
- **Desktop:** Dashboard layout. Cards for Queues (Export, Anonymization). Action buttons open Modals.
- **Mobile:** List of queues. Actions open modals.
- Data export request queue with user identifiers
- Export action with progress indicator
- Download generated data package (JSON/CSV format)
- Anonymization request queue
- Anonymization action with cascading delete preview
- Account deletion queue with orphaned record check
- Compliance audit log

### NotificationsScreen

Summary: Displays notifications for the Creator, including campaign invites, payments, system alerts, and chat messages.

Preview size: 390x844

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Shows notification list with mixed read/unread items across all categories.
ID: empty | Empty State | No notifications state with empty state illustration and message.
ID: filterActive | Filter Active | Filtered view showing only specific notification type (e.g., Campaigns only).

#### Contents

Notification center for Creators.

**Content Hierarchy:**
- **Desktop:** Left sidebar navigation, top bar with notification count and "Mark all as read" action. Filter tabs (All, Campaigns, Payments, System) below header. Vertical list of notification cards.
- **Mobile:** Header with title and "Mark all as read" button. Horizontal scrollable filter tabs. Vertical list of notification cards with swipe-to-dismiss visual indicator. Bottom navigation bar.
- Each notification displays: Icon or avatar (for chat), title, message preview, timestamp, unread indicator (blue dot).
- Color-coded accents: Blue for campaigns, Green for payments, Purple for system alerts.
- Empty state with illustration when no notifications exist.