import React from "react";
import * as Icons from "lucide-react";

export interface ComplianceManagementScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the queues for data export and anonymization requests.
 * - exportProgress: A data export is in progress, showing a progress indicator.
 */
const ComplianceManagementScreen: React.FC<ComplianceManagementScreenProps> = ({ state }) => {
  
  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30 shrink-0">
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
          { icon: Icons.Target, label: "Campaign Moderation", active: false },
          { icon: Icons.AlertTriangle, label: "Disputes", active: false },
          { icon: Icons.MessageSquare, label: "Chat Oversight", active: false },
          { icon: Icons.Wallet, label: "Financial Ledger", active: false },
          { icon: Icons.Database, label: "Compliance", active: true },
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
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Super Admin</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] shrink-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
          <Icons.Menu className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Compliance</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">GDPR requests and data privacy</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
          <Icons.Filter className="w-4 h-4" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Log</span>
        </button>
      </div>
    </header>
  );

  const renderStatsCards = () => {
    const isProgress = state === "exportProgress";
    
    return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      {[
        { 
          label: "Pending Exports", 
          value: "12", 
          change: isProgress ? "1 Processing..." : "+3 this week", 
          icon: isProgress ? Icons.Loader2 : Icons.FileDown, 
          color: "#5B4FE9",
          spin: isProgress
        },
        { label: "Pending Anonymizations", value: "8", change: "+1 this week", icon: Icons.UserX, color: "#E07A5F" },
        { label: "Completed (30d)", value: "47", change: "+12%", icon: Icons.CheckCircle2, color: "#8B82F0" },
        { label: "Avg. Processing Time", value: "18h", change: "-2h vs last month", icon: Icons.Clock, color: "#6B6B7B" },
      ].map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="p-4 md:p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                <Icon className={`w-4 h-4 ${stat.spin ? 'animate-spin' : ''}`} style={{ color: stat.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <span className="block text-[20px] md:text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              {stat.value}
            </span>
            <span className={`text-[11px] font-['Plus_Jakarta_Sans'] font-medium ${
              stat.change.startsWith("+") && !stat.change.includes("Processing") ? "text-[#5B4FE9]" : 
              stat.change.startsWith("-") ? "text-[#5B4FE9]" : 
              stat.change.includes("Processing") ? "text-[#E07A5F]" :
              "text-[#9B96B0]"
            }`}>
              {stat.change}
            </span>
          </div>
        );
      })}
    </div>
  )};

  const renderStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-[#FFB4A2]/[0.08]", text: "text-[#E07A5F]", label: "Pending" },
      processing: { bg: "bg-[#5B4FE9]/[0.06]", text: "text-[#5B4FE9]", label: "Processing" },
      completed: { bg: "bg-[#5B4FE9]/[0.06]", text: "text-[#5B4FE9]", label: "Completed" },
      failed: { bg: "bg-[#FFB4A2]/[0.08]", text: "text-[#E07A5F]", label: "Failed" },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`px-2 py-0.5 rounded-full ${config.bg} text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderExportRequests = () => {
    const isExportProgress = state === "exportProgress";
    const exportRequests = isExportProgress ? [
      { id: "EXP-2024-0089", user: "Alex Rivera", email: "alex@email.com", requestedAt: "Mar 22, 2024", status: "processing", progress: 68, size: "2.4 GB" },
      { id: "EXP-2024-0088", user: "Jordan Park", email: "jordan@email.com", requestedAt: "Mar 20, 2024", status: "completed", completedAt: "Mar 21, 2024", size: "1.8 GB" },
    ] : [
      { id: "EXP-2024-0089", user: "Alex Rivera", email: "alex@email.com", requestedAt: "Mar 22, 2024", status: "pending" },
      { id: "EXP-2024-0088", user: "Jordan Park", email: "jordan@email.com", requestedAt: "Mar 20, 2024", status: "pending" },
      { id: "EXP-2024-0087", user: "Sam Taylor", email: "sam@email.com", requestedAt: "Mar 18, 2024", status: "completed", completedAt: "Mar 19, 2024" },
    ];

    return (
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
          <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider">
            Data Export Requests
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button className="px-3 py-1.5 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] shrink-0">
              All
            </button>
            <button className="px-3 py-1.5 rounded-[8px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] shrink-0">
              Pending
            </button>
            <button className="px-3 py-1.5 rounded-[8px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] shrink-0">
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {exportRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] hover:shadow-[0_4px_12px_rgba(91,79,233,0.08)] transition-all"
            >
              {/* Icon & Info */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
                  <Icons.FileDown className="w-5 h-5 text-[#5B4FE9]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-mono font-medium text-[#5B4FE9]">
                      {req.id}
                    </span>
                    {renderStatusBadge(req.status)}
                  </div>
                  <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] block truncate">
                    {req.user}
                  </span>
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                    {req.email}
                  </span>
                </div>
              </div>

              {/* Status/Progress Info - Desktop Centered */}
              <div className="w-full md:w-auto md:min-w-[200px]">
                {req.status === "processing" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                        Generating...
                      </span>
                      <span className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                        {req.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5B4FE9] rounded-full transition-all"
                        style={{ width: `${req.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Icons.HardDrive className="w-3 h-3 text-[#9B96B0]" />
                      <span className="text-[10px] md:text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                        Est: {req.size}
                      </span>
                    </div>
                  </div>
                )}
                
                {req.status === "completed" && req.size && (
                  <div className="flex items-center gap-2 p-2 rounded-[8px] bg-[#5B4FE9]/[0.04]">
                    <Icons.HardDrive className="w-3.5 h-3.5 text-[#5B4FE9]" />
                    <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                      {req.size}
                    </span>
                  </div>
                )}

                {req.status === "pending" && (
                  <div className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                    Awaiting review
                  </div>
                )}
              </div>

              {/* Metadata - Desktop Right */}
              <div className="w-full md:w-32 text-right shrink-0 hidden md:block">
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  Requested {req.requestedAt}
                </span>
                {req.completedAt && (
                  <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    Completed {req.completedAt}
                  </span>
                )}
              </div>

              {/* Actions - Mobile Right or Desktop Far Right */}
              <div className="flex md:flex-col items-center gap-2 w-full md:w-[140px] mt-2 md:mt-0 shrink-0">
                {req.status === "pending" && (
                  <>
                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] flex-1 md:w-full">
                      <Icons.Play className="w-3.5 h-3.5" />
                      Process
                    </button>
                    <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] flex-1 md:w-full">
                      Reject
                    </button>
                  </>
                )}
                {req.status === "processing" && (
                  <>
                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] flex-1 md:w-full">
                      <Icons.Eye className="w-3.5 h-3.5" />
                      Monitor
                    </button>
                    <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] flex-1 md:w-full">
                      Cancel
                    </button>
                  </>
                )}
                {req.status === "completed" && (
                  <>
                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] flex-1 md:w-full">
                      <Icons.Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] flex-1 md:w-full">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnonymizationRequests = () => {
    const anonymizationRequests = [
      { id: "ANON-2024-0042", user: "Maya Chen", email: "maya@email.com", requestedAt: "Mar 21, 2024", status: "pending", records: 2347 },
      { id: "ANON-2024-0041", user: "David Kim", email: "david@email.com", requestedAt: "Mar 15, 2024", status: "completed", completedAt: "Mar 17, 2024", records: 1892 },
    ];

    return (
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
          <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider">
            Anonymization Requests
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
              All
            </button>
            <button className="px-3 py-1.5 rounded-[8px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
              Pending
            </button>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {anonymizationRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] hover:shadow-[0_4px_12px_rgba(91,79,233,0.08)] transition-all"
            >
              {/* Icon & Info */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[10px] bg-[#FFB4A2]/[0.08] flex items-center justify-center shrink-0">
                  <Icons.UserX className="w-5 h-5 text-[#E07A5F]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-mono font-medium text-[#5B4FE9]">
                      {req.id}
                    </span>
                    {renderStatusBadge(req.status)}
                  </div>
                  <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] block truncate">
                    {req.user}
                  </span>
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                    {req.email}
                  </span>
                </div>
              </div>

              {/* Metrics Info */}
              <div className="w-full md:w-auto md:min-w-[220px] p-3 rounded-[10px] bg-[#FBF9F6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icons.Database className="w-4 h-4 text-[#6B6B7B]" />
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                    {req.records.toLocaleString()} records
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                  <span className="flex items-center gap-1">
                    <Icons.Shield className="w-3 h-3" /> Cascading
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.Lock className="w-3 h-3" /> Integrity
                  </span>
                </div>
              </div>

              {/* Metadata - Desktop Right */}
              <div className="w-full md:w-32 text-right shrink-0 hidden md:block">
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  Requested {req.requestedAt}
                </span>
                {req.completedAt && (
                  <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    Completed {req.completedAt}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center gap-2 w-full md:w-[140px] mt-2 md:mt-0 shrink-0">
                {req.status === "pending" && (
                  <>
                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#E07A5F] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(224,122,95,0.16)] flex-1 md:w-full">
                      <Icons.AlertTriangle className="w-3.5 h-3.5" />
                      Execute
                    </button>
                    <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] flex-1 md:w-full">
                      More Info
                    </button>
                  </>
                )}
                {req.status === "completed" && (
                  <>
                    <div className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] flex-1 md:w-full">
                      <Icons.Check className="w-3.5 h-3.5" strokeWidth={3} />
                      Verified
                    </div>
                    <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] flex-1 md:w-full">
                      Audit Log
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComplianceAuditLog = () => (
    <div className="p-5 md:p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
          Compliance Audit Log
        </h2>
        <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] w-fit">
          <Icons.Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <div className="space-y-1">
        {[
          { action: "Data export completed", actor: "Admin Alice", target: "Alex Rivera", time: "2 min ago", type: "export" },
          { action: "Anonymization executed", actor: "System", target: "David Kim", time: "15 min ago", type: "anonymization" },
          { action: "Export request approved", actor: "Admin Bob", target: "Jordan Park", time: "1 hour ago", type: "export" },
          { action: "Retention policy applied", actor: "System", target: "Batch #2847", time: "3 hours ago", type: "policy" },
          { action: "Anonymization reviewed", actor: "Admin Alice", target: "Maya Chen", time: "5 hours ago", type: "anonymization" },
        ].map((entry, index) => {
          const typeColors: Record<string, string> = {
            export: "#5B4FE9",
            anonymization: "#E07A5F",
            policy: "#6B6B7B",
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
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0 hidden sm:block w-24 text-right">
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
    <div className="h-screen w-full bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col overflow-hidden">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">
        {renderTopBar()}

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderStatsCards()}
          {renderExportRequests()}
          {renderAnonymizationRequests()}
          {renderComplianceAuditLog()}
        </main>
      </div>
    </div>
  );
};

export default ComplianceManagementScreen;