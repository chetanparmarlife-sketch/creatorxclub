

import React from "react";
import * as Icons from "lucide-react";

export interface CampaignModerationScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of campaigns requiring moderation attention.
 * - previewPanelOpen: A campaign is selected, showing details and the compliance checklist.
 */
const CampaignModerationScreen: React.FC<CampaignModerationScreenProps> = ({ state }) => {
  const isPreviewOpen = state === "previewPanelOpen";

  const campaigns = [
    { id: 1, title: "Spring Glow Collection Launch", brand: "Glossier", status: "pending", flagReason: null, submittedAt: "30 min ago", image: "./images/campaign-glossier.png" },
    { id: 2, title: "Quick Cash Offer $500", brand: "Unknown Brand", status: "flagged", flagReason: "Suspicious compensation", submittedAt: "1 hour ago", image: "./images/campaign-suspicious.png" },
    { id: 3, title: "Summer Travel Essentials", brand: "Away", status: "pending", flagReason: null, submittedAt: "2 hours ago", image: "./images/campaign-away.png" },
  ];

  const statusConfig: Record<string, { color: string; bgColor: string; label: string }> = {
    pending: { color: "#5B4FE9", bgColor: "#5B4FE9", label: "Pending Review" },
    flagged: { color: "#E07A5F", bgColor: "#FFB4A2", label: "Flagged" },
    live: { color: "#6B6B7B", bgColor: "#E8E4F0", label: "Live" },
    paused: { color: "#8B82F0", bgColor: "#8B82F0", label: "Paused" },
  };

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-6">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
          Admin
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Shield, label: "KYC Queue", active: false },
          { icon: Icons.Target, label: "Campaign Moderation", active: true, badge: 7 },
          { icon: Icons.AlertTriangle, label: "Disputes", active: false },
          { icon: Icons.MessageSquare, label: "Chat Oversight", active: false },
          { icon: Icons.Wallet, label: "Financial Ledger", active: false },
          { icon: Icons.Database, label: "Compliance", active: false },
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
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#5B4FE9] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white">
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
              src="./images/admin-avatar.png"
              alt="Admin profile avatar"
              data-context="Sidebar user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">Admin User</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">System Admin</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Campaign Moderation</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Review against platform guidelines</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {["Pending", "Flagged", "Live", "Paused"].map((filter, index) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-['Plus_Jakarta_Sans'] font-medium transition-colors whitespace-nowrap ${
              index === 0 ? "bg-[#5B4FE9] text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)]" : "bg-[#FBF9F6] text-[#6B6B7B] hover:bg-[#E8E4F0]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </header>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-[#FBF9F6] flex items-center justify-center mb-4">
        <Icons.Inbox className="w-8 h-8 text-[#6B6B7B]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-2">No campaigns found</h3>
      <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] text-center max-w-[200px]">
        There are no campaigns matching the current filter criteria.
      </p>
    </div>
  );

  const renderCampaignList = () => (
    <div className={`flex flex-col gap-3 overflow-y-auto ${isPreviewOpen ? "hidden md:flex md:w-[380px] shrink-0 min-h-0" : "w-full"}`}>
      <div className="flex items-center justify-between mb-2 px-1 shrink-0">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Review Queue</h2>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">{campaigns.length} campaigns</span>
      </div>
      {campaigns.length === 0 ? (
        renderEmptyState()
      ) : (
        campaigns.map((campaign) => {
          const status = statusConfig[campaign.status];
          return (
            <div
              key={campaign.id}
              className={`p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer overflow-hidden shrink-0 ${
                isPreviewOpen && campaign.id === 1
                  ? "border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)] ring-1 ring-[#5B4FE9]/[0.10]"
                  : "border-[#5B4FE9]/[0.06] hover:border-[#5B4FE9]/[0.12]"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0 flex-shrink-0">
                  <img
                    src={campaign.image}
                    alt={`${campaign.title} campaign promotional image`}
                    data-context="Campaign moderation thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">
                      {campaign.title}
                    </h3>
                  </div>
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-1 truncate">
                    {campaign.brand}
                  </span>
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                    {campaign.submittedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold"
                  style={{
                    backgroundColor: `${status.color}10`,
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
                {campaign.flagReason && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFB4A2]/[0.08] text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F]">
                    {campaign.flagReason}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderPreviewPanel = () => (
    isPreviewOpen && (
      <div className="hidden md:block flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-4 pr-2">
          {/* Campaign preview */}
          <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-[12px] bg-[#FBF9F6] overflow-hidden shrink-0">
                <img
                  src="./images/campaign-glossier.png"
                  alt="Spring Glow Collection campaign hero image"
                  data-context="Campaign moderation preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1 truncate">
                  Spring Glow Collection Launch
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
                    Pending Review
                  </span>
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                    Glossier · Campaign #CX-2024-1847
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Budget", value: "$3,500" },
                { label: "Compensation", value: "Cash" },
                { label: "Duration", value: "6 months" },
                { label: "Platform", value: "Instagram" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-[10px] bg-[#FBF9F6]">
                  <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">{item.label}</span>
                  <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.value}</span>
                </div>
              ))}
            </div>

            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.6] mb-5">
              We're looking for creators who love natural, dewy makeup to showcase our new Spring Glow collection. Share your authentic glow-up routine with products that enhance your natural beauty.
            </p>
          </div>

          {/* Compliance checklist */}
          <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
              Guidelines Compliance Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { label: "Compensation clearly stated", pass: true },
                { label: "No prohibited products", pass: true },
                { label: "Realistic expectations", pass: true },
                { label: "FTC disclosure mentioned", pass: true },
                { label: "No discriminatory language", pass: true },
                { label: "Specific achievable requirements", pass: true },
                { label: "Usage rights defined", pass: true },
                { label: "Brand identity verified", pass: true },
              ].map((check, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6]"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${check.pass ? "bg-[#5B4FE9]" : "bg-[#FFB4A2]/[0.12]"}`}>
                    {check.pass ? (
                      <Icons.Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    ) : (
                      <Icons.X className="w-3.5 h-3.5 text-[#E07A5F]" strokeWidth={2} />
                    )}
                  </div>
                  <span className={`text-[13px] font-['Plus_Jakarta_Sans'] font-medium ${check.pass ? "text-[#1A1A2E]" : "text-[#E07A5F]"}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Moderation actions */}
          <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
              Moderation Decision
            </h2>

            <div className="mb-4">
              <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
                Notes for brand (optional)
              </label>
              <textarea
                placeholder="Any feedback or required changes..."
                className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none resize-none h-20 leading-[1.6]"
              />
            </div>

            <div className="p-3 rounded-[10px] bg-[#5B4FE9]/[0.04] mb-4">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                Brand notification preview: "Your campaign 'Spring Glow Collection Launch' has been approved and is now live."
              </span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                <Icons.Check className="w-4 h-4" strokeWidth={3} />
                Approve
              </button>
              <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                Request changes
              </button>
              <button className="px-4 py-3 rounded-[12px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 overflow-hidden">
          <div className="flex gap-6 h-full min-h-0">
            {renderCampaignList()}
            {renderPreviewPanel()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignModerationScreen;