import React from "react";
import * as Icons from "lucide-react";

export interface ApplicationComposerScreenProps {
  state: string;
}

/**
 * States:
 * - default: The text composition area and portfolio upload section are visible. The pitch field is empty.
 * - pricingProposalVisible: If negotiation is enabled by the Brand, the pricing proposal input field is visible, showing the current offer as a reference.
 * - portfolioAdded: Portfolio files have been uploaded, showing thumbnails in the media slots.
 * - reviewSubmission: The user has clicked submit, showing a confirmation modal with the fee breakdown and terms acknowledgment before finalizing.
 */
const ApplicationComposerScreen: React.FC<ApplicationComposerScreenProps> = ({ state }) => {
  const portfolioItems = state === "portfolioAdded" || state === "reviewSubmission" ? [
    "./images/portfolio-1.png",
    "./images/portfolio-2.png",
  ] : [];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] tracking-[-0.01em]">
          CreatorX
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.Compass, label: "Explore", active: true },
          { icon: Icons.Users, label: "Community", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: false },
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
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-[12px] bg-[#FBF9F6] hover:bg-[#E8E4F0] flex items-center justify-center transition-colors">
          <Icons.ArrowLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Explore</span>
          <h1 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Apply to Campaign</h1>
        </div>
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

  const renderCampaignContext = () => (
    <div className="mb-6 p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04] flex items-center gap-3">
      <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
        <img
          src="./images/glossier-logo.png"
          alt="Glossier brand logo"
          data-context="Brand logo in application composer"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">$315 net payout</span>
        <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Due Mar 25 · 1 Reel + 3 Stories</span>
      </div>
      <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
    </div>
  );

  const renderPitchArea = () => (
    <div className="mb-6">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Your pitch
      </label>
      <div className="rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-4">
        <textarea
          placeholder="Tell Glossier why you're perfect for this campaign. Share your creative vision, audience insights, and what makes your content unique..."
          className="w-full h-32 md:h-40 text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none resize-none leading-[1.6]"
          readOnly
          value={state === "reviewSubmission" ? "I'm obsessed with the dewy, natural makeup look and my audience constantly asks about my skincare routine. I think a 'get ready with me' Reel showing how I achieve that Glossier glow would resonate perfectly with my followers who love authentic, unfiltered beauty content. My engagement rate on beauty content is 6.2% — well above my average." : ""}
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E4F0]">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
            Be specific about your approach
          </span>
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">
            {state === "reviewSubmission" ? "342" : "0"}/500
          </span>
        </div>
      </div>
    </div>
  );

  const renderPortfolioUpload = () => (
    <div className="mb-6">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Portfolio samples
      </label>
      <div className="grid grid-cols-3 gap-3">
        {portfolioItems.map((item, index) => (
          <div key={index} className="aspect-square rounded-[12px] bg-[#FBF9F6] overflow-hidden relative group">
            <img
              src={item}
              alt={`Portfolio sample ${index + 1}, creator content showing beauty product photography or lifestyle content with warm natural lighting`}
              data-context="Portfolio thumbnail in application upload grid"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-white">
              <Icons.X className="w-3 h-3 text-[#1A1A2E]" />
            </button>
          </div>
        ))}
        {[...Array(3 - portfolioItems.length)].map((_, index) => (
          <button key={`empty-${index}`} className="aspect-square rounded-[12px] bg-[#FBF9F6] border-2 border-dashed border-[#E8E4F0] flex flex-col items-center justify-center gap-2 hover:border-[#5B4FE9]/[0.30] transition-colors">
            <Icons.Plus className="w-5 h-5 text-[#C4C0D4]" />
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Add photo</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPricingProposal = () => (
    (state === "pricingProposalVisible" || state === "portfolioAdded" || state === "reviewSubmission") && (
      <div className="mb-6">
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Your proposal
        </label>
        <div className="p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Brand's offer</span>
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">$350 ($315 net)</span>
          </div>
          <div className="h-[1px] bg-[#E8E4F0] mb-3" />
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">$</span>
            <input
              type="text"
              placeholder="Your proposed amount"
              className={`flex-1 text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] placeholder-[#C4C0D4] bg-transparent outline-none ${state === "pricingProposalVisible" ? "ring-2 ring-[#5B4FE9]/[0.20] rounded-lg px-2 -ml-2" : ""}`}
              readOnly
              value={(state === "pricingProposalVisible" || state === "portfolioAdded" || state === "reviewSubmission") ? "400" : ""}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Icons.Info className="w-3 h-3 text-[#8B82F0]" />
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#8B82F0]">
              Proposed net: $360 after 10% fee
            </span>
          </div>
        </div>
      </div>
    )
  );

  const renderReviewModal = () => (
    state === "reviewSubmission" && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm" />
        <div className="relative bg-white rounded-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] w-full max-w-[500px] max-h-[90vh] flex flex-col">
          <div className="flex justify-center pt-4 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
          </div>

          <div className="px-6 pt-2 overflow-y-auto flex-1">
            <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              Review your application
            </h2>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-6">
              Double-check everything before submitting to Glossier.
            </p>

            {/* Summary card */}
            <div className="p-4 rounded-[14px] bg-[#FBF9F6] border border-[#E8E4F0] mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-[10px] bg-white overflow-hidden">
                  <img
                    src="./images/glossier-logo.png"
                    alt="Glossier brand logo"
                    data-context="Brand logo in review modal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Spring Glow Collection Launch</span>
                  <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Glossier</span>
                </div>
              </div>
              <div className="h-[1px] bg-[#E8E4F0] mb-3" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Your proposal</span>
                  <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Platform fee (10%)</span>
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">-$40</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8E4F0]">
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">You'll receive</span>
                  <span className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$360</span>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 mb-6 p-3 rounded-[10px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.06]">
              <div className="w-5 h-5 rounded-[6px] bg-[#5B4FE9] flex items-center justify-center shrink-0 mt-0.5">
                <Icons.Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                I agree to the campaign terms, usage rights, and SLA requirements. I understand that payment will be held in escrow until deliverables are approved.
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 shrink-0">
            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] mb-3 hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
              <Icons.Send className="w-4 h-4 text-white" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Submit application
              </span>
            </button>
            <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center hover:bg-[#FBF9F6] transition-colors">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                Go back and edit
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderStickyCTA = () => (
    state !== "reviewSubmission" && (
      <div className="mt-8 md:hidden">
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Eye className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Review application
          </span>
        </button>
      </div>
    )
  );

  const renderDesktopCTA = () => (
    state !== "reviewSubmission" && (
      <div className="mt-8 hidden md:flex justify-end">
        <button className="px-8 py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
          <Icons.Eye className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Review application
          </span>
        </button>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative">
      {/* Sidebar (Desktop) */}
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) */}
        {renderDesktopTopBar()}

        {/* Main Content */}
        <main className="flex-1 p-5 md:p-8 flex items-start justify-center">
          {/* Centered Form Container */}
          <div className="w-full max-w-[600px] bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E8E4F0] p-6 md:p-10">
            {renderCampaignContext()}
            {renderPitchArea()}
            {renderPortfolioUpload()}
            {renderPricingProposal()}
            {renderStickyCTA()}
            {renderDesktopCTA()}
          </div>
        </main>
      </div>

      {/* Overlays */}
      {renderReviewModal()}
    </div>
  );
};

export default ApplicationComposerScreen;