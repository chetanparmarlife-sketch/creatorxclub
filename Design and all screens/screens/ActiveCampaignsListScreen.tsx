import React from "react";
import * as Icons from "lucide-react";

export interface ActiveCampaignsListScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of campaigns with the "Pending Delivery" segment active by default.
 */
const ActiveCampaignsListScreen: React.FC<ActiveCampaignsListScreenProps> = ({ state }) => {
  const segments = ["Pending Delivery", "In Review", "Completed"];
  const activeSegment = "Pending Delivery";

  const campaigns = [
    {
      id: 1,
      brand: "Glossier",
      logo: "./images/glossier-logo.png",
      title: "Spring Glow Collection Launch",
      status: "product_received",
      statusLabel: "Upload content",
      statusColor: "#5B4FE9",
      deadline: "Due in 6 days",
      urgency: "normal",
      nextAction: "Submit Reel + 3 Stories",
    },
    {
      id: 2,
      brand: "Rare Beauty",
      logo: "./images/rare-beauty-logo.png",
      title: "Soft Pinch Liquid Blush",
      status: "product_shipped",
      statusLabel: "Confirm receipt",
      statusColor: "#E07A5F",
      deadline: "Due in 12 days",
      urgency: "urgent",
      nextAction: "Confirm shipping address",
    },
  ];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
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
          { icon: Icons.User, label: "Profile", active: true },
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
    <header className="hidden md:flex items-center justify-between px-8 py-3 bg-white border-b border-[#E8E4F0] ml-64">
      <div>
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">My campaigns</h1>
        <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Track your active collaborations</p>
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

  const renderMobileHeader = () => (
    <div className="md:hidden px-5 py-3">
      <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-1">
        My campaigns
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
        Track your active collaborations
      </p>
    </div>
  );

  const renderSearchBar = () => (
    <div className="px-5 md:px-0 mb-4">
      <div className="relative w-full md:w-80">
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
        <input
          type="text"
          placeholder="Search campaigns or brands..."
          className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-white border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] text-[#1A1A2E] placeholder:text-[#9B96B0] focus:outline-none focus:border-[#5B4FE9]/30 focus:ring-2 focus:ring-[#5B4FE9]/5"
        />
      </div>
    </div>
  );

  const renderSegmentControl = () => (
    <div className="px-5 md:px-0 mb-4 md:mb-4">
      <div className="flex gap-2 p-1 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] w-fit">
        {segments.map((segment) => {
          const isActive = segment === activeSegment;
          return (
            <button
              key={segment}
              className={`px-4 py-2 rounded-[10px] text-[12px] font-['Plus_Jakarta_Sans'] font-medium transition-all ${
                isActive
                  ? "bg-[#5B4FE9] text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)]"
                  : "bg-transparent text-[#6B6B7B]"
              }`}
            >
              {segment}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCampaignCard = (campaign: any) => (
    <div key={campaign.id} className="mx-5 md:mx-0 mb-3 md:mb-0 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
      <div className={`h-1 bg-[${campaign.statusColor}]`} style={{ backgroundColor: campaign.statusColor }} />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
            <img
              src={campaign.logo}
              alt={`${campaign.brand} brand logo`}
              data-context="Brand logo in active campaign list"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
              {campaign.brand}
            </span>
            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight mt-0.5 truncate">
              {campaign.title}
            </h3>
          </div>
          <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${
            campaign.urgency === "urgent" ? "bg-[#FFB4A2]/[0.10]" : "bg-[#5B4FE9]/[0.06]"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              campaign.urgency === "urgent" ? "bg-[#E07A5F]" : "bg-[#5B4FE9]"
            }`} />
            <span className={`text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
              campaign.urgency === "urgent" ? "text-[#E07A5F]" : "text-[#5B4FE9]"
            }`}>
              {campaign.statusLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[6px] bg-[#FBF9F6] flex items-center justify-center">
              <Icons.ArrowRight className="w-3.5 h-3.5 text-[#6B6B7B]" />
            </div>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
              {campaign.nextAction}
            </span>
          </div>
          <span className={`text-[11px] font-['Plus_Jakarta_Sans'] font-medium ${
            campaign.urgency === "urgent" ? "text-[#E07A5F]" : "text-[#6B6B7B]"
          }`}>
            {campaign.deadline}
          </span>
        </div>
      </div>
    </div>
  );

  const renderDesktopTable = () => (
    <div className="hidden md:block bg-white rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E8E4F0] bg-[#FBF9F6]/[0.5]">
            <th className="p-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider w-auto">Campaign</th>
            <th className="p-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider w-[140px]">Status</th>
            <th className="p-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider w-[110px]">Deadline</th>
            <th className="p-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider text-right w-[180px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-[#E8E4F0] last:border-0 hover:bg-[#FBF9F6]/[0.5] transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                    <img
                      src={campaign.logo}
                      alt={`${campaign.brand} brand logo`}
                      data-context="Brand logo in desktop table"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
                      {campaign.brand}
                    </span>
                    <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight">
                      {campaign.title}
                    </h3>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                  campaign.urgency === "urgent" ? "bg-[#FFB4A2]/[0.10]" : "bg-[#5B4FE9]/[0.06]"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    campaign.urgency === "urgent" ? "bg-[#E07A5F]" : "bg-[#5B4FE9]"
                  }`} />
                  <span className={`text-[11px] font-['Plus_Jakarta_Sans'] font-bold ${
                    campaign.urgency === "urgent" ? "text-[#E07A5F]" : "text-[#5B4FE9]"
                  }`}>
                    {campaign.statusLabel}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <span className={`text-[12px] font-['Plus_Jakarta_Sans'] font-medium ${
                  campaign.urgency === "urgent" ? "text-[#E07A5F]" : "text-[#6B6B7B]"
                }`}>
                  {campaign.deadline}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] hover:bg-[#5B4FE9]/[0.10] transition-colors max-w-[160px]">
                  <span className="truncate">{campaign.nextAction}</span>
                  <Icons.ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <div className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative">
      {/* Sidebar (Desktop) */}
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) */}
        {renderDesktopTopBar()}
        
        {/* Mobile Header */}
        {renderMobileHeader()}

        {/* Main Content */}
        <main className="flex-1 p-5 md:p-8 pt-3 md:pt-6">
          {renderSearchBar()}
          {renderSegmentControl()}

          {/* Mobile List */}
          <div className="md:hidden">
            {campaigns.length > 0 ? (
              campaigns.map(renderCampaignCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-5">
                <div className="w-16 h-16 rounded-full bg-[#FBF9F6] flex items-center justify-center mb-4">
                  <Icons.Inbox className="w-8 h-8 text-[#9B96B0]" />
                </div>
                <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-2">
                  No campaigns yet
                </h3>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] text-[#6B6B7B] text-center max-w-[240px]">
                  You don't have any campaigns in this segment. Check back later!
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            {campaigns.length > 0 ? (
              renderDesktopTable()
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
                <div className="w-16 h-16 rounded-full bg-[#FBF9F6] flex items-center justify-center mb-4">
                  <Icons.Inbox className="w-8 h-8 text-[#9B96B0]" />
                </div>
                <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-2">
                  No campaigns yet
                </h3>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] text-[#6B6B7B] text-center max-w-[280px]">
                  You don't have any campaigns in this segment. Check back later!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        {renderBottomNav()}
      </div>
    </div>
  );
};

export default ActiveCampaignsListScreen;