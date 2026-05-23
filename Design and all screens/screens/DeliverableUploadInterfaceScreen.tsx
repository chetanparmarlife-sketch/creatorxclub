import React from "react";
import * as Icons from "lucide-react";

export interface DeliverableUploadInterfaceScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the media selection options (camera roll/camera) and empty caption/hashtag fields.
 * - mediaSelected: Media files are selected and displayed in a preview grid. The caption and hashtag fields are visible for entry.
 * - confirmationModal: The user has clicked submit, triggering a confirmation modal that reviews the deliverables and SLA deadline before final submission.
 */
const DeliverableUploadInterfaceScreen: React.FC<DeliverableUploadInterfaceScreenProps> = ({ state }) => {
  const selectedMedia = state === "mediaSelected" || state === "confirmationModal" ? [
    "./images/deliverable-1.png",
    "./images/deliverable-2.png",
    "./images/deliverable-3.png",
  ] : [];

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
          { icon: Icons.Compass, label: "Explore", active: false },
          { icon: Icons.Users, label: "Community", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: true, badge: 3 },
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
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[#9B96B0]">Profile</span>
        <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        <span className="text-[#9B96B0]">Active Campaigns</span>
        <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        <span className="text-[#1A1A2E] font-medium">Submit Deliverables</span>
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
    <div className="md:hidden relative z-10">
      <div className="px-5 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
        <div className="flex items-center gap-1">
          <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </div>
      </div>
      <div className="px-5 py-3 flex items-center gap-3">
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
            Submit deliverables
          </span>
          <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">
            Glossier · Spring Glow Collection
          </span>
        </div>
      </div>
    </div>
  );

  const renderSLABanner = () => (
    <div className="mx-5 md:mx-0 md:mb-6 p-3.5 md:p-4 rounded-[12px] md:rounded-[14px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10] flex items-center gap-3 md:gap-4">
      <div className="w-10 h-10 rounded-[10px] bg-[#FFB4A2]/[0.12] flex items-center justify-center shrink-0">
        <Icons.Clock className="w-4 h-4 text-[#E07A5F]" />
      </div>
      <div className="flex-1">
        <span className="block text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Due in 6 days</span>
        <span className="block text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Submit by Mar 25 to maintain SLA</span>
      </div>
      <div className="flex flex-col items-center gap-1 hidden md:block">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E8E4F0" strokeWidth="3" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="#E07A5F" strokeWidth="3" strokeDasharray="60 100" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F]">6d</span>
      </div>
    </div>
  );

  const renderMediaSelection = () => (
    <div className="px-5 md:px-0 mb-5 md:mb-6">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Media
      </label>
      
      {selectedMedia.length === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <button className="aspect-square rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.Image className="w-6 h-6 text-[#5B4FE9]" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Camera roll</span>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Select photos & videos</span>
            </div>
          </button>
          <button className="aspect-square rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.Camera className="w-6 h-6 text-[#5B4FE9]" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Take photo</span>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Capture new content</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {selectedMedia.map((media, index) => (
            <div key={index} className="aspect-[3/4] rounded-[12px] bg-[#FBF9F6] overflow-hidden relative group">
              <img
                src={media}
                alt={`Selected media ${index + 1}`}
                data-context="Selected deliverable media preview"
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <Icons.X className="w-3 h-3 text-[#1A1A2E]" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-[4px] bg-[#5B4FE9] text-[9px] font-['Plus_Jakarta_Sans'] font-bold text-white">
                  REEL
                </div>
              )}
            </div>
          ))}
          <button className="aspect-[3/4] rounded-[12px] bg-[#FBF9F6] border-2 border-dashed border-[#E8E4F0] flex flex-col items-center justify-center gap-2">
            <Icons.Plus className="w-5 h-5 text-[#C4C0D4]" />
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Add more</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderCaptionArea = () => (
    <div className="px-5 md:px-0 mb-5 md:mb-6">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Caption & hashtags
      </label>
      <div className="rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-4 md:p-5">
        <textarea
          placeholder="Write your caption here..."
          className="w-full h-24 md:h-32 text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none resize-none leading-[1.6]"
          readOnly
          value={state !== "default" ? "The glow is REAL with @glossier's new Spring Collection ✨ This dewy routine has become my everyday essential — skin looks like I drink 8 glasses of water (I don't lol) #GlossierYou #SpringGlow2024 #GlossierPartner" : ""}
        />
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E4F0] flex-wrap">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0">Required:</span>
          {["#GlossierYou", "#SpringGlow2024", "#GlossierPartner"].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] shrink-0">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPostingInstructions = () => (
    <div className="px-5 md:px-0 mb-5 md:mb-6">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Posting instructions
      </label>
      <div className="space-y-2.5">
        {[
          { icon: Icons.AtSign, label: "Tag @glossier in caption", checked: true },
          { icon: Icons.Hash, label: "Include all 3 required hashtags", checked: true },
          { icon: Icons.Link, label: "Link to glossier.com/spring-glow", checked: false },
          { icon: Icons.Calendar, label: "Post between Mar 20-25", checked: false },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-[10px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
              <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${item.checked ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"}`}>
                <Icons.Check className={`w-3.5 h-3.5 ${item.checked ? "text-white" : "text-[#C4C0D4]"}`} strokeWidth={3} />
              </div>
              <div className="w-8 h-8 rounded-[6px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#5B4FE9]" strokeWidth={1.5} />
              </div>
              <span className={`text-[13px] font-['Plus_Jakarta_Sans'] font-medium ${item.checked ? "text-[#1A1A2E]" : "text-[#6B6B7B]"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderConfirmationModal = () => {
    if (state !== "confirmationModal") return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm" />
        <div className="relative w-full md:w-[500px] bg-white md:rounded-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
          </div>

          <div className="px-5 pt-2 pb-8 md:p-8">
            <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              Ready to submit?
            </h2>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-5">
              Review your deliverables before sending to Glossier for approval.
            </p>

            <div className="flex gap-3 mb-5 overflow-x-auto scrollbar-hide">
              {selectedMedia.map((media, index) => (
                <div key={index} className="w-24 h-32 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                  <img
                    src={media}
                    alt={`Deliverable preview ${index + 1}`}
                    data-context="Deliverable preview in confirmation modal"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] mb-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icons.Check className="w-4 h-4 text-[#5B4FE9]" strokeWidth={3} />
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">3 media files attached</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Check className="w-4 h-4 text-[#5B4FE9]" strokeWidth={3} />
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Caption with required hashtags</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Clock className="w-4 h-4 text-[#E07A5F]" />
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F]">Due: Mar 25 (6 days remaining)</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] mb-3">
              <Icons.UploadCloud className="w-4 h-4 text-white" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Submit for review
              </span>
            </button>
            <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                Go back and edit
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStickyCTA = () => {
    if (state === "confirmationModal") return null;
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40 px-5 pt-4 pb-8">
        <button className={`w-full py-4 rounded-[14px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] ${
          selectedMedia.length > 0 ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"
        }`}>
          <span className={`text-[15px] font-['Plus_Jakarta_Sans'] font-semibold ${
            selectedMedia.length > 0 ? "text-white" : "text-[#9B96B0]"
          }`}>
            {selectedMedia.length > 0 ? "Review & submit" : "Add media to continue"}
          </span>
          {selectedMedia.length > 0 && <Icons.ArrowRight className="w-4 h-4 text-white" />}
        </button>
      </div>
    );
  };

  const renderDesktopContent = () => {
    const hasMedia = selectedMedia.length > 0;
    return (
      <div className="flex-1 flex flex-col ml-64">
        {renderDesktopTopBar()}
        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Media Selector */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
                {renderSLABanner()}
                {renderMediaSelection()}
              </div>
            </div>

            {/* Right: Metadata Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] lg:sticky lg:top-24">
                {renderCaptionArea()}
                {renderPostingInstructions()}
                
                <button className={`w-full py-4 rounded-[14px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] ${
                  hasMedia ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"
                }`}>
                  <span className={`text-[15px] font-['Plus_Jakarta_Sans'] font-semibold ${
                    hasMedia ? "text-white" : "text-[#9B96B0]"
                  }`}>
                    {hasMedia ? "Review & submit" : "Add media to continue"}
                  </span>
                  {hasMedia && <Icons.ArrowRight className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileContent = () => (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden pb-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[-30px] w-[150px] h-[150px] rounded-full bg-[#8B82F0] opacity-[0.04] blur-[40px]" />
      </div>
      {renderMobileHeader()}
      {renderSLABanner()}
      {renderMediaSelection()}
      {renderCaptionArea()}
      {renderPostingInstructions()}
      {renderStickyCTA()}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans']">
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {renderSidebar()}
        {renderDesktopContent()}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {renderMobileContent()}
      </div>

      {/* Modals */}
      {renderConfirmationModal()}
    </div>
  );
};

export default DeliverableUploadInterfaceScreen;