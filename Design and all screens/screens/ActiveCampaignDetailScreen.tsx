import React from "react";
import * as Icons from "lucide-react";

export interface ActiveCampaignDetailScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the status timeline, current action items (shipping confirmation or upload interface), and access to chat.
 * - disputeModalOpen: A modal is visible allowing the user to select a dispute reason (Quality Issue, Non-Payment, etc.) and upload evidence.
 * - adminJoined: The "Team CreatorX" presence indicator is visible in the chat section, signaling that an admin is monitoring the thread.
 */
const ActiveCampaignDetailScreen: React.FC<ActiveCampaignDetailScreenProps> = ({ state }) => {
  const campaign = {
    brandName: "Glossier",
    brandLogo: "./images/glossier-logo.png",
    campaignTitle: "Spring Glow Collection Launch",
    status: "product_shipped",
    statusLabel: "Product Shipped",
    statusColor: "#8B82F0",
    productName: "Glossier You Perfume + Balm Dotcom Set",
    productValue: "$48.00",
    shippingEta: "Mar 12 - Mar 15",
    trackingNumber: "1Z999AA10123456784",
    slaDeadline: "Mar 25, 2024",
    daysRemaining: 8,
    compensation: "$350.00",
    netPayout: "$315.00",
    platformFee: "$35.00",
    deliverables: [
      { type: "Instagram Reel", count: 1, duration: "30-60 sec" },
      { type: "Instagram Story", count: 3, duration: "15 sec each" },
    ],
    chatMessages: [
      {
        id: 1,
        sender: "brand",
        name: "Sarah from Glossier",
        avatar: "./images/brand-rep-avatar.png",
        message: "Hi! We're so excited to work with you on this campaign. The package should arrive by Thursday.",
        time: "2:30 PM",
      },
      {
        id: 2,
        sender: "creator",
        name: "You",
        avatar: "./images/creator-avatar.png",
        message: "Thank you! Can't wait to try the new collection. Will share unboxing stories too!",
        time: "2:45 PM",
      },
      {
        id: 3,
        sender: "brand",
        name: "Sarah from Glossier",
        avatar: "./images/brand-rep-avatar.png",
        message: "That sounds perfect! Just remember to tag @glossier and use #GlossierYou #SpringGlow2024",
        time: "3:00 PM",
      },
    ],
  };

  const disputeReasons = [
    { id: "quality", label: "Quality Issue", icon: Icons.AlertTriangle, description: "Product damaged or not as described" },
    { id: "non-payment", label: "Non-Payment", icon: Icons.CreditCard, description: "Payment not received after completion" },
    { id: "contract", label: "Contract Breach", icon: Icons.FileText, description: "Terms violated by either party" },
    { id: "other", label: "Other", icon: Icons.HelpCircle, description: "Something else not covered above" },
  ];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-6">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.Compass, label: "Explore", active: false },
          { icon: Icons.Users, label: "Community", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: true, badge: 3 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-colors ${
                item.active
                  ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                  : "text-[#6B6B7B] hover:bg-[#FBF9F6]"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#E07A5F] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#E8E4F0]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden">
             <img
              src="./images/creator-avatar.png"
              alt="Creator profile avatar"
              data-context="Sidebar user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">Alex Rivera</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">@alexcreates</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderDesktopTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[#9B96B0]">Campaigns</span>
        <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        <span className="text-[#9B96B0]">Glossier</span>
        <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        <span className="text-[#1A1A2E] font-medium">Spring Glow Collection</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#FBF9F6] overflow-hidden border border-[#E8E4F0]">
           <img
            src="./images/creator-avatar.png"
            alt="Creator profile avatar"
            data-context="Top bar user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );

  const renderStatusTimelineDesktop = () => {
    const steps = [
      { id: "applied", label: "Applied", completed: true, icon: Icons.Send },
      { id: "approved", label: "Approved", completed: true, icon: Icons.CheckCircle2 },
      { id: "shipped", label: "Shipped", completed: true, icon: Icons.Package, active: true },
      { id: "received", label: "Received", completed: false, icon: Icons.Box },
      { id: "submitted", label: "Submitted", completed: false, icon: Icons.Upload },
      { id: "approved_final", label: "Approved", completed: false, icon: Icons.Award },
    ];

    return (
      <div className="hidden md:flex flex-col gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.completed;
          const isActive = step.active;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start gap-3 relative">
              {/* Vertical line for non-last steps */}
              {!isLast && (
                <div className="absolute left-[14px] top-[28px] bottom-[-16px] w-[2px] bg-[#E8E4F0]" />
              )}
              {isCompleted && !isLast && (
                <div className="absolute left-[14px] top-[28px] h-[calc(100%+16px-28px)] w-[2px] bg-[#5B4FE9]" />
              )}
              
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? isActive
                      ? "bg-[#5B4FE9] shadow-[0_0_0_3px_rgba(91,79,233,0.12)]"
                      : "bg-[#5B4FE9]"
                    : "bg-[#FBF9F6] border-2 border-[#E8E4F0]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isCompleted ? "text-white" : "text-[#C4C0D4]"
                  }`}
                />
              </div>
              <span className={`text-[12px] font-['Plus_Jakarta_Sans'] font-medium ${
                  step.completed || step.active ? "text-[#1A1A2E]" : "text-[#9B96B0]"
               }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatusTimelineMobile = () => {
    const steps = [
      { id: "applied", label: "Applied", completed: true, icon: Icons.Send },
      { id: "approved", label: "Approved", completed: true, icon: Icons.CheckCircle2 },
      { id: "shipped", label: "Shipped", completed: true, icon: Icons.Package, active: true },
      { id: "received", label: "Received", completed: false, icon: Icons.Box },
      { id: "submitted", label: "Submitted", completed: false, icon: Icons.Upload },
      { id: "approved_final", label: "Approved", completed: false, icon: Icons.Award },
    ];

    return (
      <div className="px-5 pt-6 pb-2 md:hidden">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-[14px] left-[28px] right-[28px] h-[2px] bg-[#E8E4F0]" />
          <div
            className="absolute top-[14px] left-[28px] h-[2px] bg-[#5B4FE9]"
            style={{ width: "calc(50% - 28px)" }}
          />
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.completed;
            const isActive = step.active;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? isActive
                        ? "bg-[#5B4FE9] shadow-[0_0_0_4px_rgba(91,79,233,0.12)]"
                        : "bg-[#5B4FE9]"
                      : "bg-[#FBF9F6] border-2 border-[#E8E4F0]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCompleted ? "text-white" : "text-[#C4C0D4]"}`} />
                </div>
                <span className={`mt-2 text-[9px] font-['Plus_Jakarta_Sans'] font-medium ${isCompleted || isActive ? "text-[#1A1A2E]" : "text-[#9B96B0]"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCampaignHeaderMobile = () => (
    <div className="px-5 pt-4 pb-3 md:hidden">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-[14px] bg-[#FBF9F6] border border-[#5B4FE9]/[0.08] overflow-hidden shrink-0">
          <img src="./images/glossier-brand-logo.png" alt="Glossier logo" data-context="Brand logo mobile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
              {campaign.brandName}
            </span>
            <span className="px-1.5 py-0.5 rounded-[4px] bg-[#8B82F0]/[0.10] text-[9px] font-['Plus_Jakarta_Sans'] font-bold text-[#8B82F0]">
              {campaign.statusLabel}
            </span>
          </div>
          <h1 className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight">
            {campaign.campaignTitle}
          </h1>
        </div>
      </div>
    </div>
  );

  const renderActionCard = () => (
    <div className="p-5 md:p-0">
      <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
        <div className="p-4 md:p-6 flex gap-3 md:gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[12px] md:rounded-[16px] bg-[#FBF9F6] overflow-hidden shrink-0">
            <img
              src="./images/glossier-product-set.png"
              alt="Product set"
              data-context="Product image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] md:text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight">
              {campaign.productName}
            </h3>
            <p className="mt-1 text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              Value: {campaign.productValue}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <Icons.Truck className="w-3 h-3 md:w-4 md:h-4 text-[#8B82F0]" />
              <span className="text-[10px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#8B82F0]">
                ETA: {campaign.shippingEta}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 bg-[#FBF9F6] border-t border-[#E8E4F0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.MapPin className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <span className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                Tracking: {campaign.trackingNumber}
              </span>
            </div>
            <button className="px-3 py-1.5 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[10px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              Copy
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <button className="w-full py-3 md:py-4 rounded-[12px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
            <Icons.CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Confirm Product Received
            </span>
          </button>
          <p className="mt-2 text-center text-[10px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
            Confirming unlocks content submission
          </p>
        </div>
      </div>
    </div>
  );

  const renderSLACountdown = () => (
    <div className="px-5 py-2 md:p-0 md:mb-4">
      <div className="rounded-[14px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.12] p-3.5 flex items-center gap-3 md:gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#FFB4A2]/[0.12] flex items-center justify-center shrink-0">
          <Icons.Clock className="w-4 h-4 text-[#E07A5F]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] md:text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">
              {campaign.daysRemaining}
            </span>
            <span className="text-[11px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
              days remaining
            </span>
          </div>
          <p className="text-[10px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
            Submit by {campaign.slaDeadline} to maintain SLA compliance
          </p>
        </div>
        <div className="w-11 h-11 rounded-full border-[3px] border-[#FFB4A2]/[0.20] flex items-center justify-center shrink-0 hidden md:flex ml-2">
           <svg className="w-11 h-11 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E8E4F0" strokeWidth="3"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E07A5F" strokeWidth="3" strokeDasharray={`${(campaign.daysRemaining / 14) * 125.6} 125.6`} strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );

  const renderCompensationBreakdown = () => (
    <div className="px-5 py-3 md:p-0 md:mb-5">
      <h2 className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3">
        Compensation
      </h2>
      <div className="rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
            Campaign Budget
          </span>
          <span className="text-[15px] md:text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
            {campaign.compensation}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
            Platform Fee (10%)
          </span>
          <span className="text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">
            -{campaign.platformFee}
          </span>
        </div>
        <div className="h-[1px] bg-[#E8E4F0] my-3" />
        <div className="flex items-center justify-between">
          <span className="text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
            Your Net Payout
          </span>
          <span className="text-[18px] md:text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
            {campaign.netPayout}
          </span>
        </div>
      </div>
    </div>
  );

  const renderDeliverablesList = () => (
    <div className="px-5 py-3 md:p-0 md:mb-5">
      <h2 className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3">
        Deliverables
      </h2>
      <div className="space-y-2.5">
        {campaign.deliverables.map((d, i) => (
          <div
            key={i}
            className="rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-3.5 md:p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
              {d.type.includes("Reel") ? (
                <Icons.Film className="w-4 h-4 text-[#5B4FE9]" />
              ) : (
                <Icons.Image className="w-4 h-4 text-[#5B4FE9]" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                  {d.count}x {d.type}
                </span>
              </div>
              <span className="text-[10px] md:text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                {d.duration}
              </span>
            </div>
            <div className="px-2 py-1 rounded-[6px] bg-[#E8E4F0]">
              <span className="text-[9px] md:text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                Pending
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatSection = (showAdminJoined: boolean) => (
    <div className="px-5 py-3 md:p-0 md:bg-white md:border md:border-[#E8E4F0] md:rounded-[16px] md:shadow-[0_1px_3px_rgba(91,79,233,0.06)] md:h-fit md:sticky md:top-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider">
          Chat with Brand
        </h2>
        {showAdminJoined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5B4FE9]/[0.08]">
            <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-pulse" />
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              Team CreatorX
            </span>
          </div>
        )}
      </div>

      <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden md:shadow-none md:border-none md:bg-transparent">
        <div className="p-4 space-y-4 max-h-[280px] md:max-h-[400px] overflow-y-auto">
          {campaign.chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.sender === "creator" ? "flex-row-reverse" : ""}`}>
              <div className="w-7 h-7 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                <img
                  src={msg.avatar}
                  alt={msg.sender === "brand" ? "Brand rep" : "Creator"}
                  data-context="Chat avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`max-w-[70%] rounded-[14px] px-3.5 py-2.5 ${
                  msg.sender === "creator"
                    ? "bg-[#5B4FE9] text-white rounded-tr-[4px]"
                    : "bg-[#FBF9F6] text-[#1A1A2E] rounded-tl-[4px]"
                }`}
              >
                <p className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-medium leading-[1.5]">
                  {msg.message}
                </p>
                <span className={`mt-1 block text-[9px] font-['Plus_Jakarta_Sans'] font-light ${msg.sender === "creator" ? "text-[#C4C0D4]" : "text-[#9B96B0]"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {showAdminJoined && (
            <div className="flex justify-center py-2">
              <div className="px-4 py-2 rounded-full bg-[#5B4FE9]/[0.06] flex items-center gap-2">
                <Icons.Shield className="w-3.5 h-3.5 text-[#5B4FE9]" />
                <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                  Team CreatorX joined the conversation
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#E8E4F0] flex items-center gap-2 bg-white md:bg-transparent">
          <button className="w-8 h-8 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center shrink-0">
            <Icons.Paperclip className="w-4 h-4 text-[#6B6B7B]" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 min-w-0 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#9B96B0] bg-transparent outline-none"
          />
          <button className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center shrink-0">
            <Icons.Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDisputeButton = () => (
    <div className="px-5 py-3 md:p-0 md:mt-auto">
      <button className="w-full py-3 rounded-[12px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] flex items-center justify-center gap-2">
        <Icons.AlertTriangle className="w-4 h-4 text-[#E07A5F]" />
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
          Raise a Dispute
        </span>
      </button>
    </div>
  );

  const renderDisputeModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center md:items-center justify-end md:justify-center">
      <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm" />
      
      <div className="relative w-full md:w-[500px] bg-white md:rounded-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.3s_ease-out] h-[85vh] md:h-auto overflow-y-auto">
        <div className="md:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
        </div>

        <div className="px-5 pt-4 pb-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] md:text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Raise a Dispute
              </h2>
              <p className="mt-1 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                We'll help resolve this with our mediation team
              </p>
            </div>
            <button className="w-8 h-8 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <label className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Select a reason
          </label>
          <div className="space-y-2.5 mb-6">
            {disputeReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <button key={reason.id} className="w-full p-3.5 rounded-[14px] bg-[#FBF9F6] border border-[#E8E4F0] flex items-center gap-3 text-left hover:border-[#5B4FE9]/[0.20] transition-colors">
                  <div className="w-10 h-10 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#5B4FE9]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{reason.label}</div>
                    <div className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{reason.description}</div>
                  </div>
                  <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
                </button>
              );
            })}
          </div>

          <label className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Upload evidence
          </label>
          <div className="rounded-[14px] bg-[#FBF9F6] border-2 border-dashed border-[#E8E4F0] p-6 flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.UploadCloud className="w-5 h-5 text-[#5B4FE9]" />
            </div>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
              Tap to upload photos or documents
            </span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
              PNG, JPG, PDF up to 10MB
            </span>
          </div>

          <div className="space-y-2.5">
            <button className="w-full py-3.5 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              <Icons.ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Submit Dispute</span>
            </button>
            <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center">
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Cancel</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  const renderBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40">
      <div className="flex items-center justify-around py-2 pb-6">
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Compass className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Users className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Calendar className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Wallet className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1 relative">
          <Icons.User className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Profile</span>
          <div className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
        </button>
      </div>
    </nav>
  );

  const renderScreenContent = (showAdminJoined: boolean) => {
    const isDefault = state === "default";
    const isAdminJoined = state === "adminJoined";

    return (
      <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#8B82F0] opacity-[0.06] blur-[80px]" />
          <div className="absolute bottom-[200px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[#FFB4A2] opacity-[0.04] blur-[60px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #5B4FE9 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Mobile Header */}
        <div className="md:hidden relative z-10">
          <div className="px-5 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
            <div className="flex items-center gap-1">
              <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
              <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
            </div>
          </div>
          <div className="px-5 py-3 flex items-center gap-3">
            <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
            </button>
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
              Campaign Details
            </span>
            <button className="ml-auto w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.MoreHorizontal className="w-4 h-4 text-[#1A1A2E]" />
            </button>
          </div>
          <div className="mx-5 mb-2 rounded-[12px] bg-[#5B4FE9]/[0.06] border border-[#5B4FE9]/[0.08] p-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#5B4FE9]/[0.08] flex items-center justify-center shrink-0">
              <Icons.ShieldCheck className="w-3.5 h-3.5 text-[#5B4FE9]" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">KYC Verified</span>
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#8B82F0] ml-1">Full access unlocked</span>
            </div>
            <Icons.X className="w-3.5 h-3.5 text-[#8B82F0]" />
          </div>
        </div>

        {/* Mobile Main Content */}
        <main className="md:hidden relative z-10 pb-28">
          {renderStatusTimelineMobile()}
          {renderCampaignHeaderMobile()}
          {renderActionCard()}
          {renderSLACountdown()}
          {renderCompensationBreakdown()}
          {renderDeliverablesList()}
          {renderChatSection(showAdminJoined)}
          {renderDisputeButton()}
        </main>

        {/* Desktop Layout */}
        <div className="hidden md:flex min-h-screen">
          {renderSidebar()}
          <div className="flex-1 flex flex-col ml-64">
            {renderDesktopTopBar()}
            <div className="flex-1 p-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Timeline */}
                <div className="col-span-3">
                  {renderStatusTimelineDesktop()}
                </div>
                
                {/* Center Column: Main Content */}
                <div className="col-span-6 space-y-4">
                  <div className="bg-white p-6 rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-[14px] bg-[#FBF9F6] border border-[#5B4FE9]/[0.08] overflow-hidden">
                        <img src="./images/glossier-brand-logo.png" alt="Glossier" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
                            {campaign.brandName}
                          </span>
                          <span className="px-2 py-0.5 rounded-[4px] bg-[#8B82F0]/[0.10] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#8B82F0]">
                            {campaign.statusLabel}
                          </span>
                        </div>
                        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                          {campaign.campaignTitle}
                        </h1>
                      </div>
                    </div>
                    {renderActionCard()}
                    {renderSLACountdown()}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>{renderCompensationBreakdown()}</div>
                    <div>{renderDeliverablesList()}</div>
                  </div>
                </div>

                {/* Right Column: Chat */}
                <div className="col-span-3">
                  {renderChatSection(showAdminJoined)}
                  {renderDisputeButton()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {state !== "disputeModalOpen" && renderBottomNav()}
      </div>
    );
  };

  if (state === "disputeModalOpen") {
    return renderDisputeModal();
  }

  return renderScreenContent(state === "adminJoined");
};

export default ActiveCampaignDetailScreen;