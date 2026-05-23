import React from "react";
import * as Icons from "lucide-react";

export interface DisputeResolutionScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the queue of open dispute cases.
 * - caseDetailTerms: A case is opened, showing the Terms tab with original campaign terms and SLA compliance checklist.
 * - caseDetailEvidence: A case is opened, showing the Evidence tab with uploaded files and chat history.
 * - decisionModal: The Admin is ready to render a decision. The modal shows the financial preview (release/refund amounts) and input for resolution notes.
 */
const DisputeResolutionScreen: React.FC<DisputeResolutionScreenProps> = ({ state }) => {
  const isCaseOpen = state === "caseDetailTerms" || state === "caseDetailEvidence";
  const isTermsTab = state === "caseDetailTerms";
  const isEvidenceTab = state === "caseDetailEvidence";
  const isDecisionModal = state === "decisionModal";

  const cases = [
    { id: "DSP-2024-0042", creator: "Maya Chen", brand: "Glossier", reason: "Non-Payment", openedAt: "Mar 20, 2024", status: "open", amount: "$450" },
    { id: "DSP-2024-0041", creator: "Jordan Park", brand: "Rare Beauty", reason: "Quality Issue", openedAt: "Mar 18, 2024", status: "open", amount: "$500" },
    { id: "DSP-2024-0040", creator: "Alex Rivera", brand: "Away", reason: "Contract Breach", openedAt: "Mar 15, 2024", status: "resolved", amount: "$200" },
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
          { icon: Icons.Shield, label: "KYC Queue", active: false },
          { icon: Icons.Target, label: "Campaign Moderation", active: false },
          { icon: Icons.AlertTriangle, label: "Disputes", active: true, badge: 4 },
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
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Dispute Resolution</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Evaluate and resolve escalated cases</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06]">
          <Icons.AlertTriangle className="w-4 h-4 text-[#E07A5F]" />
          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">4</span>
              <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Open</span>
            </div>
            <div className="w-[1px] h-6 bg-[#E8E4F0]" />
            <div className="text-center">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">127</span>
              <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const renderCaseList = () => (
    <div className={`flex flex-col gap-3 w-full md:w-[320px] md:shrink-0 ${isCaseOpen ? "hidden md:flex" : "flex"}`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Active Cases</h2>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F]">2 open</span>
      </div>
      <div className="flex flex-col gap-3">
        {cases.map((c) => (
          <div
            key={c.id}
            className={`p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer overflow-hidden ${
              isCaseOpen && c.id === "DSP-2024-0042"
                ? "border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)] ring-1 ring-[#5B4FE9]/[0.10]"
                : "border-[#5B4FE9]/[0.06] hover:border-[#5B4FE9]/[0.12]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-mono font-medium text-[#5B4FE9] whitespace-nowrap">
                {c.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap ${
                c.status === "open" ? "bg-[#FFB4A2]/[0.10] text-[#E07A5F]" : "bg-[#5B4FE9]/[0.12] text-[#5B4FE9]"
              }`}>
                {c.status}
              </span>
            </div>

            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-3 truncate">
              {c.reason}
            </h3>

            <div className="flex items-center gap-3 mb-3 overflow-hidden">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#FBF9F6] overflow-hidden">
                  <img
                    src="./images/creator-avatar.png"
                    alt="Creator avatar"
                    data-context="Dispute case creator avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] truncate">{c.creator}</span>
              </div>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] shrink-0">vs</span>
              <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#FBF9F6] overflow-hidden">
                  <img
                    src="./images/glossier-logo.png"
                    alt="Brand logo"
                    data-context="Dispute case brand avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] truncate">{c.brand}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8E4F0]/[0.5]">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{c.openedAt}</span>
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">{c.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCaseDetail = () => {
    if (!isCaseOpen) {
      return (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center max-w-sm px-4">
            <Icons.FileText className="w-16 h-16 text-[#E8E4F0] mx-auto mb-4" />
            <h3 className="text-[18px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-2">
              Select a case to view details
            </h3>
            <p className="text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
              Choose a dispute from the list to review terms, evidence, and render a decision.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Case header */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-mono font-medium text-[#5B4FE9]">
                  DSP-2024-0042
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFB4A2]/[0.10] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">
                  Open · 5 days
                </span>
              </div>
              <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
                Non-Payment Dispute
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                Maya Chen claims Glossier has not released escrow payment despite approved deliverables
              </p>
            </div>
            <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] shrink-0">$450</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-[10px] bg-[#FBF9F6]">
            <button className={`flex-1 py-2 rounded-[8px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium transition-colors ${isTermsTab ? "bg-white text-[#5B4FE9] shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "text-[#6B6B7B] hover:text-[#1A1A2E]"}`}>
              Terms & SLA
            </button>
            <button className={`flex-1 py-2 rounded-[8px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium transition-colors ${isEvidenceTab ? "bg-white text-[#5B4FE9] shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "text-[#6B6B7B] hover:text-[#1A1A2E]"}`}>
              Evidence & Chat
            </button>
          </div>
        </div>

        {isTermsTab && (
          <>
            {/* Original terms */}
            <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
              <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
                Original Campaign Terms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Campaign", value: "Spring Glow Collection Launch" },
                  { label: "Deliverables", value: "1 Reel + 3 Stories" },
                  { label: "Payment", value: "$450 (net $405 to creator)" },
                  { label: "SLA Deadline", value: "Mar 25, 2024" },
                  { label: "Content Approved", value: "Mar 22, 2024" },
                  { label: "Contract Signed", value: "Mar 22, 2024" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-[10px] bg-[#FBF9F6]">
                    <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">{item.label}</span>
                    <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA compliance */}
            <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
              <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
                SLA Compliance Evaluation
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Content submitted within SLA deadline", creator: true, brand: true },
                  { label: "Content met all deliverable requirements", creator: true, brand: true },
                  { label: "Brand provided feedback within 48 hours", creator: null, brand: false },
                  { label: "Brand approved content for release", creator: true, brand: true },
                  { label: "Escrow released within 2 business days of approval", creator: true, brand: false },
                ].map((check, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6]">
                    <span className="flex-1 text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{check.label}</span>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Creator</span>
                        {check.creator === true ? (
                          <Icons.Check className="w-4 h-4 text-[#5B4FE9]" strokeWidth={3} />
                        ) : check.creator === false ? (
                          <Icons.X className="w-4 h-4 text-[#E07A5F]" strokeWidth={2} />
                        ) : (
                          <span className="text-[11px] text-[#9B96B0]">—</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Brand</span>
                        {check.brand === true ? (
                          <Icons.Check className="w-4 h-4 text-[#5B4FE9]" strokeWidth={3} />
                        ) : check.brand === false ? (
                          <Icons.X className="w-4 h-4 text-[#E07A5F]" strokeWidth={2} />
                        ) : (
                          <span className="text-[11px] text-[#9B96B0]">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isEvidenceTab && (
          <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
              Evidence Files
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                { name: "deliverable-reel.mp4", type: "video", size: "24.5 MB" },
                { name: "approval-screenshot.png", type: "image", size: "1.2 MB" },
                { name: "chat-export.pdf", type: "document", size: "245 KB" },
                { name: "contract-signed.pdf", type: "document", size: "198 KB" },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6] hover:bg-[#E8E4F0] transition-colors cursor-pointer overflow-hidden">
                  <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center shrink-0">
                    {file.type === "video" ? <Icons.Film className="w-5 h-5 text-[#5B4FE9]" /> :
                     file.type === "image" ? <Icons.Image className="w-5 h-5 text-[#8B82F0]" /> :
                     <Icons.FileText className="w-5 h-5 text-[#6B6B7B]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">{file.name}</span>
                    <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{file.size}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
              Relevant Chat History
            </h3>
            <div className="space-y-3 p-4 rounded-[12px] bg-[#FBF9F6]">
              {[
                { sender: "Maya Chen", text: "Hi! I've submitted all the deliverables. When can I expect payment?", time: "Mar 22, 3:00 PM", side: "creator" },
                { sender: "Sarah from Glossier", text: "We're reviewing now. Should be released by end of week.", time: "Mar 22, 4:15 PM", side: "brand" },
                { sender: "Maya Chen", text: "It's been 5 days now and I still haven't received anything. This is not acceptable.", time: "Mar 27, 10:30 AM", side: "creator" },
              ].map((msg, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${msg.side === "creator" ? "bg-[#5B4FE9]" : "bg-[#8B82F0]"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{msg.sender}</span>
                      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{msg.time}</span>
                    </div>
                    <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.5]">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decision button */}
        <button className="w-full py-3 rounded-[14px] bg-[#5B4FE9] text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4a41d6] transition-colors">
          Render Decision
        </button>
      </div>
    );
  };

  const renderDecisionModal = () => (
    isDecisionModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm" />
        <div className="relative w-full max-w-[560px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Render Decision
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                DSP-2024-0042 · Maya Chen vs Glossier
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          {/* Financial preview */}
          <div className="p-5 rounded-[14px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-5">
            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
              Financial Preview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 rounded-[12px] bg-white border-2 border-[#5B4FE9] text-center hover:bg-[#5B4FE9]/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#5B4FE9]/[0.06] flex items-center justify-center mx-auto mb-2">
                  <Icons.ArrowDownLeft className="w-5 h-5 text-[#5B4FE9]" />
                </div>
                <span className="block text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] mb-1">Release to Creator</span>
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">$405.00 to Maya Chen</span>
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1">Platform fee: $45.00</span>
              </button>
              <button className="p-4 rounded-[12px] bg-white border-2 border-[#E8E4F0] text-center hover:border-[#E07A5F]/[0.30] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FFB4A2]/[0.08] flex items-center justify-center mx-auto mb-2">
                  <Icons.ArrowUpRight className="w-5 h-5 text-[#E07A5F]" />
                </div>
                <span className="block text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F] mb-1">Refund to Brand</span>
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">$450.00 to Glossier</span>
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1">Platform fee reversed</span>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Resolution notes *
            </label>
            <textarea
              placeholder="Explain your decision. This will be visible to both parties..."
              className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)] resize-none h-28 leading-[1.6]"
            />
          </div>

          <div className="p-4 rounded-[10px] bg-[#FFB4A2]/[0.04] border border-[#FFB4A2]/[0.08] mb-5">
            <div className="flex items-start gap-3">
              <Icons.AlertTriangle className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-0.5">
                  This decision is binding
                </span>
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                  Funds will be moved immediately. Both parties will be notified. This action will be logged in the audit trail.
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:bg-[#FBF9F6]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4a41d6]">
              Confirm decision
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">
        {renderTopBar()}

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex gap-6 h-full flex-col md:flex-row">
            {renderCaseList()}
            {renderCaseDetail()}
          </div>
        </main>
      </div>

      {renderDecisionModal()}
    </div>
  );
};

export default DisputeResolutionScreen;