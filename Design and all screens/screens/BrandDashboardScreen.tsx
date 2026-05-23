import React from "react";
import * as Icons from "lucide-react";

export interface BrandDashboardScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the full dashboard with wallet cards, metrics, and activity feed.
 * - verificationPending: A banner is visible at the top indicating the Brand account is still pending verification.
 */
const BrandDashboardScreen: React.FC<BrandDashboardScreenProps> = ({ state }) => {
  const isVerificationPending = state === "verificationPending";

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
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: true },
          { icon: Icons.Target, label: "Campaigns", active: false, badge: 3 },
          { icon: Icons.Inbox, label: "Applications", active: false, badge: 12 },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false, badge: 5 },
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

      <div className="pt-6 border-t border-[#E8E4F0] px-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#6B6B7B] hover:bg-[#FBF9F6] text-left">
          <Icons.Settings className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Dashboard</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Welcome back, Glossier</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Wallet balance */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06]">
          <Icons.Wallet className="w-4 h-4 text-[#5B4FE9]" />
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">$24,500.00</span>
        </div>

        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-[#E8E4F0]">
          <div className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
            <img
              src="./images/brand-rep-avatar.png"
              alt="Professional headshot of female brand representative in her 30s, warm smile, business casual attire, soft studio lighting"
              data-context="Brand user avatar in top bar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:block">
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Sarah Chen</span>
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Owner</span>
          </div>
        </div>
      </div>
    </header>
  );

  const renderVerificationBanner = () => (
    isVerificationPending && (
      <div className="mx-6 md:mx-8 mt-6 p-4 rounded-[14px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.12] flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div className="w-10 h-10 rounded-[10px] bg-[#FFB4A2]/[0.12] flex items-center justify-center shrink-0">
          <Icons.Clock className="w-5 h-5 text-[#E07A5F]" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-0.5">
            Account verification in progress
          </span>
          <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
            Your business documents are being reviewed. Some features are limited until verification is complete. Estimated time: 18 hours.
          </span>
        </div>
        <button className="w-full md:w-auto px-4 py-2 rounded-[10px] bg-[#E07A5F] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white shrink-0">
          Check status
        </button>
      </div>
    )
  );

  const renderWalletCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {[
        { label: "Available Balance", amount: "$24,500.00", change: "+$2,400 this month", color: "#5B4FE9", icon: Icons.Wallet },
        { label: "Allocated to Escrows", amount: "$8,750.00", change: "3 active campaigns", color: "#8B82F0", icon: Icons.Lock },
        { label: "Total Spent", amount: "$142,300.00", change: "Lifetime spend", color: "#6B6B7B", icon: Icons.BarChart3 },
      ].map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${card.color}10` }}>
                <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                {card.label}
              </span>
            </div>
            <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              {card.amount}
            </span>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
              {card.change}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderQuickActions = () => (
    <div className="flex flex-wrap gap-3 mb-6">
      {[
        { icon: Icons.Plus, label: "Create Campaign", color: "#5B4FE9", bgColor: "#5B4FE9" },
        { icon: Icons.ArrowDownLeft, label: "Deposit Funds", color: "#5B4FE9", bgColor: "transparent" },
        { icon: Icons.UserPlus, label: "Invite Team", color: "#6B6B7B", bgColor: "transparent" },
      ].map((action, index) => {
        const Icon = action.icon;
        const isPrimary = index === 0;
        return (
          <button
            key={action.label}
            className={`flex items-center gap-2 px-5 py-3 rounded-[12px] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold transition-all ${
              isPrimary
                ? "bg-[#5B4FE9] text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]"
                : "bg-white text-[#1A1A2E] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08]"
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
            {action.label}
          </button>
        );
      })}
    </div>
  );

  const renderCampaignMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Main metrics */}
      <div className="lg:col-span-2 p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
            Campaign Performance
          </h2>
          <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
            View all
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Live campaigns", value: "3", sublabel: "2 ending soon" },
            { label: "Active creators", value: "12", sublabel: "4 pending approval" },
            { label: "Pending approvals", value: "7", sublabel: "Applications" },
          ].map((metric) => (
            <div key={metric.label} className="text-center p-4 rounded-[12px] bg-[#FBF9F6]">
              <span className="block text-[28px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] mb-1">
                {metric.value}
              </span>
              <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] mb-0.5">
                {metric.label}
              </span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                {metric.sublabel}
              </span>
            </div>
          ))}
        </div>

        {/* Mini chart placeholder */}
        <div className="h-32 rounded-[12px] bg-[#FBF9F6] flex items-end justify-around px-4 pb-4 gap-2" title="Monthly campaign performance data">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[4px] bg-[#5B4FE9]/[0.12] hover:bg-[#5B4FE9]/[0.30] hover:scale-105 transition-all cursor-pointer"
              style={{ height: `${height}%` }}
              title={`${height}% performance`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
            <span key={month} className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
              {month}
            </span>
          ))}
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
          Upcoming Deadlines
        </h2>
        <div className="space-y-3">
          {[
            { title: "Spring Glow content due", date: "Mar 25", brand: "Glossier", urgent: true },
            { title: "Blush campaign review", date: "Mar 28", brand: "Rare Beauty", urgent: false },
            { title: "Travel kit submissions", date: "Apr 02", brand: "Away", urgent: false },
          ].map((deadline, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-[10px] bg-[#FBF9F6]"
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${deadline.urgent ? "bg-[#E07A5F]" : "bg-[#8B82F0]"}`} />
              <div className="flex-1">
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  {deadline.title}
                </span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                  {deadline.brand} · {deadline.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
          Recent Activity
        </h2>
        <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {[
          { icon: Icons.Send, title: "New application received", desc: "Maya Chen applied to Spring Glow", time: "2 min ago", color: "#5B4FE9" },
          { icon: Icons.UploadCloud, title: "Deliverable submitted", desc: "Jordan Park uploaded 3 assets", time: "15 min ago", color: "#8B82F0" },
          { icon: Icons.CreditCard, title: "Escrow released", desc: "$450 paid to Alex Rivera", time: "1 hour ago", color: "#5B4FE9" },
          { icon: Icons.UserPlus, title: "Team member added", desc: "Emily Wong joined as Manager", time: "3 hours ago", color: "#6B6B7B" },
        ].map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-[10px] hover:bg-[#FBF9F6] transition-colors">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${activity.color}10` }}>
                <Icon className="w-4 h-4" style={{ color: activity.color }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  {activity.title}
                </span>
                <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                  {activity.desc}
                </span>
              </div>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto ml-0 md:ml-64">
          {renderVerificationBanner()}

          <div className={isVerificationPending ? "" : "mt-6"}>
            {renderWalletCards()}
            {renderQuickActions()}
            {renderCampaignMetrics()}
            {renderRecentActivity()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandDashboardScreen;