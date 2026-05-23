import React from "react";
import * as Icons from "lucide-react";

export interface AdminDashboardScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the queue summary cards, health metrics, and the recent audit log.
 */
const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ state }) => {
  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center justify-between p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
            <Icons.Hexagon className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
            CreatorX
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
          Admin
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: true },
          { icon: Icons.Shield, label: "KYC Queue", active: false, badge: 23 },
          { icon: Icons.Target, label: "Campaign Moderation", active: false, badge: 7 },
          { icon: Icons.AlertTriangle, label: "Disputes", active: false, badge: 4 },
          { icon: Icons.MessageSquare, label: "Chat Oversight", active: false, badge: 12 },
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
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                  item.label === "Disputes" ? "bg-[#FFB4A2]/[0.12] text-[#E07A5F]" : "bg-[#5B4FE9] text-white"
                }`}>
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
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">System Control Centre</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Platform health and operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#5B4FE9]/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-pulse" />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">All systems operational</span>
        </div>
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-white">A</span>
        </div>
      </div>
    </header>
  );

  const renderWorkQueues = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {[
        { label: "KYC Pending Review", count: 23, change: "+5 today", color: "#5B4FE9", icon: Icons.Shield, urgent: false },
        { label: "Active Disputes", count: 4, change: "2 critical", color: "#E07A5F", icon: Icons.AlertTriangle, urgent: true },
        { label: "Flagged Campaigns", count: 7, change: "Awaiting review", color: "#8B82F0", icon: Icons.Flag, urgent: false },
      ].map((queue) => {
        const Icon = queue.icon;
        return (
          <button
            key={queue.label}
            className={`p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border ${
              queue.urgent ? "border-[#FFB4A2]/[0.30] hover:shadow-[0_4px_12px_rgba(225,122,95,0.12)]" : "border-[#5B4FE9]/[0.06] hover:shadow-[0_4px_12px_rgba(91,79,233,0.12)]"
            } transition-shadow text-left`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${queue.color}10` }}>
                <Icon className="w-4 h-4" style={{ color: queue.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                {queue.label}
              </span>
            </div>
            <span className="block text-[28px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              {queue.count}
            </span>
            <span className={`text-[12px] font-['Plus_Jakarta_Sans'] font-medium ${queue.urgent ? "text-[#E07A5F]" : "text-[#9B96B0]"}`}>
              {queue.change}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderCareCenter = () => (
    <div className="mb-6">
      <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
        Care Center — Intervention Triggers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Sentiment Alerts", count: 8, desc: "Negative keyword detection", color: "#5B4FE9", bgColor: "#5B4FE9", icon: Icons.Frown },
          { label: "Manual Flags", count: 12, desc: "User-reported issues", color: "#E07A5F", bgColor: "#FFB4A2", icon: Icons.Hand },
          { label: "Proactive Monitor", count: 3, desc: "Admin-joined threads", color: "#6B6B7B", bgColor: "#E8E4F0", icon: Icons.Eye },
        ].map((trigger) => {
          const Icon = trigger.icon;
          return (
            <button
              key={trigger.label}
              className="p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] text-left hover:shadow-[0_2px_8px_rgba(91,79,233,0.08)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${trigger.color}10` }}>
                  <Icon className="w-5 h-5" style={{ color: trigger.color }} strokeWidth={1.5} />
                </div>
                <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold" style={{ color: trigger.color }}>
                  {trigger.count}
                </span>
              </div>
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-1">
                {trigger.label}
              </span>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                {trigger.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderHealthMetrics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Uptime", value: "99.97%", target: "99.9%", status: "good", icon: Icons.Activity },
        { label: "Redis Cache Hit", value: "94.2%", target: "90%", status: "good", icon: Icons.Database },
        { label: "WebSocket Conn", value: "2,847", target: "—", status: "good", icon: Icons.Radio },
        { label: "Total Users", value: "14,203", change: "+234 this week", status: "good", icon: Icons.Users },
      ].map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.label} className="p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-[#6B6B7B]" strokeWidth={1.5} />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider">
                {metric.label}
              </span>
            </div>
            <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              {metric.value}
            </span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
              {metric.target ? `Target: ${metric.target}` : metric.change}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderAuditLog = () => (
    <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
          Recent Audit Log
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
            <Icons.RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
            <Icons.Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { action: "KYC approved", actor: "Admin Alice", target: "Maya Chen", time: "2 min ago", type: "kyc" },
          { action: "Escrow released", actor: "System", target: "Campaign #1847", time: "5 min ago", type: "financial" },
          { action: "Campaign paused", actor: "Admin Bob", target: "Summer Travel", time: "12 min ago", type: "moderation" },
          { action: "Dispute resolved", actor: "Admin Alice", target: "DSP-2024-0042", time: "18 min ago", type: "dispute" },
          { action: "User data export", actor: "Admin Carol", target: "Alex Rivera", time: "25 min ago", type: "compliance" },
          { action: "Team role changed", actor: "Sarah Chen", target: "Emily Wong", time: "32 min ago", type: "team" },
          { action: "Deposit processed", actor: "Razorpay", target: "Glossier", time: "45 min ago", type: "financial" },
          { action: "Campaign flagged", actor: "Auto-moderation", target: "Quick Cash Offer", time: "1 hour ago", type: "moderation" },
        ].map((entry, index) => {
          const typeColors: Record<string, string> = {
            kyc: "#5B4FE9",
            financial: "#8B82F0",
            moderation: "#E07A5F",
            dispute: "#FFB4A2",
            compliance: "#6B6B7B",
            team: "#5B4FE9",
          };
          return (
            <div key={index} className="flex items-center gap-4 p-3 rounded-[10px] hover:bg-[#FBF9F6] transition-colors">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[entry.type] }} />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  {entry.action}
                </span>
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                  {" · "}{entry.target}
                </span>
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0 w-24 text-right hidden sm:block">
                {entry.actor}
              </span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] shrink-0 w-16 text-right">
                {entry.time}
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

      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderWorkQueues()}
          {renderCareCenter()}
          {renderHealthMetrics()}
          {renderAuditLog()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;