import React from "react";
import * as Icons from "lucide-react";

export interface ApplicationsDashboardScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of application cards with filters and search visible.
 * - detailPanelOpen: Clicking an application opens a side panel showing the Creator's full profile, pitch, and metrics.
 * - comparisonView: Multiple applications (up to 3) are selected and displayed side-by-side for comparison.
 * - counterOfferModal: A modal is open allowing the Brand to input a counter-price and message for a negotiation-enabled campaign.
 */
const ApplicationsDashboardScreen: React.FC<ApplicationsDashboardScreenProps> = ({ state }) => {
  const isDetailOpen = state === "detailPanelOpen";
  const isComparison = state === "comparisonView";
  const isCounterOffer = state === "counterOfferModal";

  const applications = [
    { id: 1, name: "Maya Chen", handle: "@mayachencreates", avatar: "./images/creator-avatar.png", matchScore: 94, proposedPrice: "$400", originalBudget: "$350", status: "pending", followers: "142K", engagement: "4.8%", niche: "Beauty" },
    { id: 2, name: "Jordan Park", handle: "@jordanpark", avatar: "./images/team-member-2.png", matchScore: 89, proposedPrice: "$350", originalBudget: "$350", status: "pending", followers: "89K", engagement: "5.2%", niche: "Lifestyle" },
    { id: 3, name: "Alex Rivera", handle: "@alexrivera", avatar: "./images/team-member-3.png", matchScore: 82, proposedPrice: "$320", originalBudget: "$350", status: "shortlisted", followers: "210K", engagement: "3.9%", niche: "Fashion" },
    { id: 4, name: "Sam Taylor", handle: "@samtaylor", avatar: "./images/referral-3.png", matchScore: 78, proposedPrice: "$350", originalBudget: "$350", status: "pending", followers: "67K", engagement: "6.1%", niche: "Beauty" },
  ];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Target, label: "Campaigns", active: false },
          { icon: Icons.Inbox, label: "Applications", active: true, badge: 12 },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false },
          { icon: Icons.Package, label: "Inventory", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Users, label: "Team", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
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
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E4F0]">
      <div className="flex items-center gap-4">
        <button className="md:hidden w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
          <Icons.Menu className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Applications</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Spring Glow Collection Launch</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06]">
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">12 pending</span>
        </div>
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
          <Icons.SlidersHorizontal className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );

  const renderFilterBar = () => (
    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white border border-[#E8E4F0] shadow-[0_1px_3px_rgba(91,79,233,0.04)]">
        <Icons.Search className="w-4 h-4 text-[#9B96B0]" />
        <input
          type="text"
          placeholder="Search creators..."
          className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none w-40"
        />
      </div>

      {["All", "Pending", "Shortlisted", "Approved", "Rejected"].map((filter, index) => (
        <button
          key={filter}
          className={`px-4 py-2.5 rounded-[10px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 ${
            index === 0
              ? "bg-[#5B4FE9] text-white"
              : "bg-white text-[#6B6B7B] border border-[#E8E4F0]"
          }`}
        >
          {filter}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
          {isComparison ? "3 selected" : "Select up to 3 to compare"}
        </span>
      </div>
    </div>
  );

  const renderApplicationList = () => (
    <div className={`space-y-3 flex flex-col ${isDetailOpen ? "w-full md:w-[400px] shrink-0" : "w-full"}`}>
      {applications.map((app) => (
        <div
          key={app.id}
          className={`flex items-center gap-4 p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer ${
            isDetailOpen && app.id === 1
              ? "border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)] bg-[#FBF9F6]"
              : "border-[#5B4FE9]/[0.06]"
          }`}
        >
          <div className="w-12 h-12 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
            <img
              src={app.avatar}
              alt={`Professional headshot of ${app.name}, content creator with warm friendly expression`}
              data-context="Creator application avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">
                {app.name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                app.matchScore >= 90
                  ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                  : app.matchScore >= 80
                  ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]"
                  : "bg-[#FBF9F6] text-[#9B96B0]"
              }`}>
                {app.matchScore}% match
              </span>
            </div>
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              {app.handle} · {app.niche}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
              {app.proposedPrice}
            </span>
            <span className={`text-[11px] font-['Plus_Jakarta_Sans'] font-medium ${
              app.proposedPrice !== app.originalBudget ? "text-[#E07A5F]" : "text-[#9B96B0]"
            }`}>
              {app.proposedPrice !== app.originalBudget ? "Negotiated" : "As budgeted"}
            </span>
          </div>

          {isComparison && app.id <= 3 && (
            <div className="w-5 h-5 rounded-full bg-[#5B4FE9] flex items-center justify-center shrink-0">
              <Icons.Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDetailPanel = () => (
    isDetailOpen && (
      <div className="hidden md:flex flex-col flex-1 p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-y-auto sticky top-24">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
              <img
                src="./images/creator-avatar.png"
                alt="Maya Chen professional headshot, young female creator with warm skin tone, soft natural lighting"
                data-context="Creator detail panel avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">Maya Chen</h2>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">@mayachencreates</span>
                <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                  94% match
                </span>
              </div>
            </div>
          </div>
          <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
            <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Followers", value: "142K" },
            { label: "Engagement", value: "4.8%" },
            { label: "Avg. likes", value: "6.8K" },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-[10px] bg-[#FBF9F6] text-center min-w-0">
              <span className="block text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">{metric.value}</span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Portfolio */}
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Portfolio
        </span>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-[10px] bg-[#FBF9F6] overflow-hidden">
              <img
                src={`./images/portfolio-${i}.png`}
                alt={`Portfolio sample ${i}, creator content showing beauty product photography with warm natural lighting`}
                data-context="Creator portfolio thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Pitch */}
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Pitch
        </span>
        <div className="p-4 rounded-[12px] bg-[#FBF9F6] mb-6">
          <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.6]">
            I'm obsessed with the dewy, natural makeup look and my audience constantly asks about my skincare routine. I think a "get ready with me" Reel showing how I achieve that Glossier glow would resonate perfectly with my followers.
          </p>
        </div>

        {/* Proposal */}
        <div className="p-4 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Proposed price</span>
            <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$400</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Your budget</span>
            <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] line-through">$350</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 shrink-0">
          <button className="flex-1 py-3 px-4 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
            Approve
          </button>
          <button className="flex-1 py-3 px-4 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
            Counter offer
          </button>
          <button className="py-3 px-4 rounded-[12px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] shrink-0">
            Reject
          </button>
        </div>
      </div>
    )
  );

  const renderComparisonView = () => (
    isComparison && (
      <div className="hidden md:grid grid-cols-3 gap-4">
        {applications.slice(0, 3).map((app) => (
          <div key={app.id} className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="w-16 h-16 rounded-[12px] bg-[#FBF9F6] overflow-hidden mx-auto mb-4">
              <img
                src={app.avatar}
                alt={`${app.name} professional headshot`}
                data-context="Comparison view creator avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] text-center mb-1">{app.name}</h3>
            <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] text-center mb-4">{app.handle}</p>

            <div className={`text-center p-3 rounded-[10px] mb-4 ${app.matchScore >= 90 ? "bg-[#5B4FE9]/[0.06]" : "bg-[#FBF9F6]"}`}>
              <span className={`block text-[24px] font-['Plus_Jakarta_Sans'] font-bold ${app.matchScore >= 90 ? "text-[#5B4FE9]" : "text-[#8B82F0]"}`}>
                {app.matchScore}%
              </span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">AI match</span>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { label: "Followers", value: app.followers },
                { label: "Engagement", value: app.engagement },
                { label: "Niche", value: app.niche },
                { label: "Proposed", value: app.proposedPrice },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#E8E4F0] last:border-0">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{item.label}</span>
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.value}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-[12px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Select
            </button>
          </div>
        ))}
      </div>
    )
  );

  const renderCounterOfferModal = () => (
    isCounterOffer && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Counter offer
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                Maya Chen proposed $400 (your budget: $350)
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="p-4 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Creator asked for</span>
              <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$400</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Your original budget</span>
              <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0] line-through">$350</span>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Your counter offer
            </label>
            <div className="flex items-center gap-2 p-4 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0]">
              <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#6B6B7B]">$</span>
              <input
                type="text"
                defaultValue="375"
                className="flex-1 text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] bg-transparent outline-none"
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Icons.Info className="w-3.5 h-3.5 text-[#8B82F0]" />
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#8B82F0]">
                Total cost: $412.50 (includes 10% platform fee)
              </span>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Message (optional)
            </label>
            <textarea
              placeholder="Explain your offer..."
              className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none resize-none h-24 leading-[1.6]"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Send counter offer
            </button>
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

        <main className="flex-1 p-6 overflow-y-auto">
          {renderFilterBar()}

          <div className="flex flex-col md:flex-row gap-6">
            {renderApplicationList()}
            {isComparison ? renderComparisonView() : renderDetailPanel()}
          </div>
        </main>
      </div>

      {renderCounterOfferModal()}
    </div>
  );
};

export default ApplicationsDashboardScreen;