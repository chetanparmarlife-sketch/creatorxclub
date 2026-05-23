import React from "react";
import * as Icons from "lucide-react";

export interface KYCVerificationQueueScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of pending KYC requests.
 * - reviewPanelOpen: A specific request is selected, showing the document viewer and profile cross-reference section.
 * - rejectModal: The Admin has clicked Reject, opening a modal to input mandatory explanatory notes.
 */
const KYCVerificationQueueScreen: React.FC<KYCVerificationQueueScreenProps> = ({ state }) => {
  const isReviewOpen = state === "reviewPanelOpen" || state === "rejectModal";
  const isRejectModal = state === "rejectModal";

  const queue = [
    { id: 1, name: "Maya Chen", submittedAt: "10 min ago", avatar: "./images/creator-avatar.png", status: "pending", urgency: "normal" },
    { id: 2, name: "Jordan Park", submittedAt: "25 min ago", avatar: "./images/team-member-2.png", status: "pending", urgency: "high" },
    { id: 3, name: "Alex Rivera", submittedAt: "1 hour ago", avatar: "./images/team-member-3.png", status: "pending", urgency: "normal" },
    { id: 4, name: "Sam Taylor", submittedAt: "2 hours ago", avatar: "./images/referral-3.png", status: "pending", urgency: "normal" },
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
        <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
          Admin
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Shield, label: "KYC Queue", active: true, badge: 23 },
          { icon: Icons.Target, label: "Campaign Moderation", active: false },
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
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">KYC Verification Queue</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Review and approve identity documents</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06]">
          <Icons.Users className="w-4 h-4 text-[#5B4FE9]" />
          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">1,247</span>
              <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Approved</span>
            </div>
            <div className="w-[1px] h-6 bg-[#E8E4F0]" />
            <div className="text-center">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">89</span>
              <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Rejected</span>
            </div>
          </div>
        </div>

        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        
        <div className="w-9 h-9 rounded-full bg-[#FBF9F6] overflow-hidden border border-[#E8E4F0]">
           <img
            src="./images/admin-avatar.png"
            alt="Admin user avatar"
            data-context="Top bar user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );

  const renderQueueList = () => (
    <div className={`flex flex-col gap-2 ${isReviewOpen ? "hidden md:flex md:w-[360px] shrink-0" : "w-full max-w-4xl mx-auto"}`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Pending Queue</h2>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">4 pending</span>
      </div>
      {queue.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 p-3 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer ${
            isReviewOpen && item.id === 1
              ? "border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)] ring-1 ring-[#5B4FE9]/[0.10]"
              : "border-[#5B4FE9]/[0.06] hover:border-[#5B4FE9]/[0.12]"
          }`}
        >
          <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
            <img
              src={item.avatar}
              alt={`${item.name} profile photo`}
              data-context="KYC queue avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">{item.name}</span>
              {item.urgency === "high" && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FFB4A2]/[0.10] text-[9px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">
                  URGENT
                </span>
              )}
            </div>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{item.submittedAt}</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#5B4FE9] shrink-0" />
        </div>
      ))}
    </div>
  );

  const renderCenterPanel = () => (
    <div className={`flex-1 ${isReviewOpen ? "hidden md:block" : "hidden"}`}>
       <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Documents</h2>
            <span className="px-3 py-1 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              ID: KYC-2024-1847
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4 flex-1">
            {/* ID Front - Landscape */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-[10px] bg-[#1A1A2E] overflow-hidden relative border border-[#E8E4F0]">
                <img
                  src="./images/kyc-id-front-document.png"
                  alt="Identity card front side showing name, photo, and identification number"
                  data-context="KYC ID front document"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40 rounded-tl-[4px]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/40 rounded-tr-[4px]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/40 rounded-bl-[4px]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40 rounded-br-[4px]" />
                <div className="absolute inset-0 bg-[#1A1A2E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Icons.Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="block text-center text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] mt-2">ID Front</span>
            </div>
            
            {/* ID Back - Landscape */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-[10px] bg-[#1A1A2E] overflow-hidden relative border border-[#E8E4F0]">
                <img
                  src="./images/kyc-id-back-document.png"
                  alt="Identity card back side showing security features and barcode"
                  data-context="KYC ID back document"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40 rounded-tl-[4px]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/40 rounded-tr-[4px]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/40 rounded-bl-[4px]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40 rounded-br-[4px]" />
                <div className="absolute inset-0 bg-[#1A1A2E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Icons.Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="block text-center text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] mt-2">ID Back</span>
            </div>
            
            {/* Selfie - Portrait */}
            <div className="relative group lg:col-span-1">
              <div className="aspect-[3/4] rounded-[10px] bg-[#1A1A2E] overflow-hidden relative border border-[#E8E4F0]">
                <img
                  src="./images/kyc-selfie-verification.png"
                  alt="Selfie portrait photograph for identity verification"
                  data-context="KYC selfie verification"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40 rounded-tl-[4px]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/40 rounded-tr-[4px]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/40 rounded-bl-[4px]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40 rounded-br-[4px]" />
                <div className="absolute inset-0 bg-[#1A1A2E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Icons.Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="block text-center text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] mt-2">Selfie</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-[8px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08]">
            <Icons.ShieldCheck className="w-4 h-4 text-[#5B4FE9]" />
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
              Document authenticity check passed
            </span>
          </div>
        </div>
    </div>
  );

  const renderRightPanel = () => (
    <div className={`${isReviewOpen ? "hidden md:block md:w-[320px] shrink-0" : "hidden"} space-y-4`}>
        {/* Cross-reference */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
            Profile Cross-Reference
          </h2>
          <div className="space-y-2">
            {[
              { field: "Full name", profile: "Maya Chen", document: "Maya Chen", match: true },
              { field: "Date of birth", profile: "Mar 15, 1998", document: "03/15/1998", match: true },
              { field: "Nationality", profile: "United States", document: "USA", match: true },
              { field: "ID number", profile: "••••••••4521", document: "SSN ***-**-4521", match: true },
            ].map((row, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#5B4FE9]/[0.06]">
                   <Icons.Check className="w-3 h-3 text-[#5B4FE9]" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase">{row.field}</span>
                  <div className="flex items-center gap-2 text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                    <span>{row.profile}</span>
                    <Icons.ArrowRight className="w-3 h-3 text-[#9B96B0]" />
                    <span className="text-[#5B4FE9]">{row.document}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] bg-[#5B4FE9] text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4a41d6] transition-colors">
            <Icons.Check className="w-5 h-5" strokeWidth={3} />
            Approve verification
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] hover:bg-[#FFB4A2]/[0.12] transition-colors">
            <Icons.X className="w-5 h-5" strokeWidth={2} />
            Reject with notes
          </button>
        </div>
      </div>
  );

  const renderRejectModal = () => (
    isRejectModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm" />
        <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Reject verification
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                Maya Chen · KYC-2024-1847
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="p-4 rounded-[12px] bg-[#FFB4A2]/[0.04] border border-[#FFB4A2]/[0.08] mb-5">
            <div className="flex items-start gap-3">
              <Icons.AlertTriangle className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-0.5">
                  This action cannot be undone
                </span>
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                  The user will be notified and must resubmit documents. Please provide clear feedback.
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Rejection reason *
            </label>
            <div className="space-y-2 mb-3">
              {[
                "Document unclear or unreadable",
                "Information mismatch with profile",
                "Document appears altered",
                "Selfie does not match ID photo",
                "Expired document",
              ].map((reason) => (
                <button
                  key={reason}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-left hover:border-[#5B4FE9]/[0.20] transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#E8E4F0] group-hover:border-[#5B4FE9]" />
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{reason}</span>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Additional details for the user..."
              className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)] resize-none h-24 leading-[1.6]"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:bg-[#FBF9F6]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#FFB4A2]/[0.12] border border-[#FFB4A2]/[0.20] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] hover:bg-[#FFB4A2]/[0.20]">
              Confirm rejection
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
          <div className="flex gap-6 h-full">
            {renderQueueList()}
            {renderCenterPanel()}
            {renderRightPanel()}
          </div>
        </main>
      </div>

      {renderRejectModal()}
    </div>
  );
};

export default KYCVerificationQueueScreen;