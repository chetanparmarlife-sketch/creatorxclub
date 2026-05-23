import React from "react";
import * as Icons from "lucide-react";

export interface DeliverablesDashboardScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of deliverables in the "Pending Review" tab.
 * - reviewPanelOpen: A deliverable is selected, opening a panel with the content viewer, captions, and SLA checklist.
 * - revisionRequestModal: A modal is visible for typing feedback to request revisions from the Creator.
 */
const DeliverablesDashboardScreen: React.FC<DeliverablesDashboardScreenProps> = ({ state }) => {
  const isReviewOpen = state === "reviewPanelOpen";
  const isRevisionModal = state === "revisionRequestModal";

  const tabs = ["Pending Review", "Revision Submitted", "Approved", "Rejected"];
  const activeTab = "Pending Review";

  const deliverables = [
    { id: 1, creator: "Maya Chen", campaign: "Spring Glow Collection", type: "Reel", submittedAt: "2 hours ago", slaStatus: "on_track", thumbnail: "./images/deliverable-1.png" },
    { id: 2, creator: "Jordan Park", campaign: "Spring Glow Collection", type: "Stories", submittedAt: "5 hours ago", slaStatus: "on_track", thumbnail: "./images/deliverable-2.png" },
    { id: 3, creator: "Alex Rivera", campaign: "Soft Pinch Blush", type: "Reel", submittedAt: "1 day ago", slaStatus: "at_risk", thumbnail: "./images/deliverable-3.png" },
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
          { icon: Icons.Inbox, label: "Applications", active: false },
          { icon: Icons.CheckSquare, label: "Deliverables", active: true, badge: 5 },
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
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Deliverables</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Review and approve creator content</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
          <Icons.CheckSquare className="w-4 h-4" />
          Bulk approve
        </button>
      </div>
    </header>
  );

  const renderTabs = () => (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2.5 rounded-[10px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 ${
            tab === activeTab
              ? "bg-[#5B4FE9] text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]"
              : "bg-white text-[#6B6B7B] border border-[#E8E4F0]"
          }`}
        >
          {tab}
          {tab === "Pending Review" && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">3</span>
          )}
        </button>
      ))}
    </div>
  );

  const renderDeliverableGrid = () => (
    <div className={`grid grid-cols-1 ${!isReviewOpen ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-4 ${isReviewOpen ? "md:w-[480px] shrink-0" : ""}`}>
      {deliverables.map((del) => (
        <div
          key={del.id}
          className={`flex flex-col gap-4 p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer group relative ${
            isReviewOpen && del.id === 1
              ? "border-[#5B4FE9] shadow-[0_2px_12px_rgba(91,79,233,0.15)] bg-[#FBF9F6]"
              : "border-[#5B4FE9]/[0.06]"
          }`}
        >
          {isReviewOpen && del.id === 1 && (
            <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-[#5B4FE9] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white flex items-center gap-1 shadow-sm">
              <Icons.Eye className="w-2.5 h-2.5" />
              Reviewing
            </div>
          )}
          <div className="aspect-video rounded-[10px] bg-[#FBF9F6] overflow-hidden relative">
            <img
              src={del.thumbnail}
              alt={`Creator content thumbnail, ${del.type} format with beauty product photography`}
              data-context="Deliverable content thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
               <Icons.Film className="w-3 h-3 text-[#1A1A2E]" />
               <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{del.type}</span>
            </div>
          </div>

          <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{del.creator}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                del.slaStatus === "on_track"
                  ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                  : "bg-[#FFB4A2]/[0.10] text-[#E07A5F]"
              }`}>
                {del.slaStatus === "on_track" ? "On track" : "At risk"}
              </span>
            </div>
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-2">{del.campaign}</span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{del.submittedAt}</span>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#E8E4F0]">
             <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] hover:bg-[#5B4FE9] hover:text-white transition-colors">
               <Icons.Check className="w-3.5 h-3.5" />
               Approve
            </button>
            <button className="w-8 h-8 rounded-[8px] bg-[#FFB4A2]/[0.08] flex items-center justify-center hover:bg-[#FFB4A2]/[0.15] transition-colors">
              <Icons.X className="w-3.5 h-3.5 text-[#E07A5F]" strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviewPanel = () => (
    isReviewOpen && (
      <div className="hidden md:flex flex-1 p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-y-auto h-fit sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Review content</h2>
          <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
            <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
             {/* Left: Content Viewer */}
             <div className="w-full md:w-1/2 shrink-0">
               <div className="aspect-[9/16] rounded-[12px] bg-[#1A1A2E] overflow-hidden mb-4 relative">
                  <img
                    src="./images/deliverable-1.png"
                    alt="Full resolution creator content, Instagram Reel showing beauty product application with soft natural lighting"
                    data-context="Deliverable full content viewer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icons.Play className="w-5 h-5 text-white" fill="white" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                    <img
                      src="./images/creator-avatar.png"
                      alt="Maya Chen avatar"
                      data-context="Deliverable creator avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Maya Chen</span>
                    <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Submitted 2 hours ago</span>
                  </div>
                </div>
             </div>

             {/* Right: Checklist & Actions */}
             <div className="flex-1 min-w-0">
                {/* Caption */}
                <div className="p-4 rounded-[10px] bg-[#FBF9F6] mb-5">
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-2">Caption</span>
                  <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.6]">
                    The glow is REAL with @glossier's new Spring Collection ✨ This dewy routine has become my everyday essential #GlossierYou #SpringGlow2024 #GlossierPartner
                  </p>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {["#GlossierYou", "#SpringGlow2024", "#GlossierPartner", "#DewySkin", "#CleanBeauty"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* SLA Checklist */}
                <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3">SLA Compliance</span>
                <div className="space-y-2 mb-5">
                  {[
                    { label: "Required hashtags included", pass: true },
                    { label: "Brand tag @glossier present", pass: true },
                    { label: "Content duration 30-60 seconds", pass: true },
                    { label: "Product clearly visible", pass: true },
                    { label: "Submitted within SLA deadline", pass: true },
                  ].map((check) => (
                    <div key={check.label} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6]">
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

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E8E4F0]">
                  <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                    Approve & release
                  </button>
                  <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                    Request revision
                  </button>
                </div>
             </div>
        </div>
      </div>
    )
  );

  const renderRevisionModal = () => (
    isRevisionModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Request revision
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                From Maya Chen · Spring Glow Collection
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
              What needs to change?
            </label>
            <div className="space-y-2">
              {[
                "Product not clearly visible",
                "Missing required hashtag",
                "Caption needs brand mention",
                "Content quality below standard",
                "Other (specify below)",
              ].map((reason) => (
                <button
                  key={reason}
                  className="w-full flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-left hover:border-[#5B4FE9]/[0.20] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#E8E4F0] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5B4FE9] opacity-0 transition-opacity" />
                  </div>
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{reason}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Detailed feedback
            </label>
            <textarea
              placeholder="Be specific about what you'd like changed..."
              className="w-full px-4 py-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none resize-none h-28 leading-[1.6]"
            />
          </div>

          <div className="p-4 rounded-[10px] bg-[#FFB4A2]/[0.04] border border-[#FFB4A2]/[0.08] mb-5">
            <div className="flex items-start gap-2">
              <Icons.Clock className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#4A4559] leading-[1.5]">
                Creator will have 48 hours to submit revised content. SLA deadline extends accordingly.
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#FFB4A2]/[0.12] border border-[#FFB4A2]/[0.20] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
              Send revision request
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
          {renderTabs()}

          <div className="flex flex-col md:flex-row gap-6">
            {renderDeliverableGrid()}
            {renderReviewPanel()}
          </div>
        </main>
      </div>

      {renderRevisionModal()}
    </div>
  );
};

export default DeliverablesDashboardScreen;