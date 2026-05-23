import React from "react";
import * as Icons from "lucide-react";

export interface SocialAccountConnectionScreenProps {
  state: string;
}

/**
 * States:
 * - default: Shows the platform selection and a "Connect" button with permission scope explanations.
 * - metricsPreview: Upon successful connection, displays the imported metrics (follower count, engagement rate) for user review and confirmation.
 * - manualFallback: Displayed if the OAuth connection fails, allowing the user to manually enter their metrics or handle credentials.
 */
const SocialAccountConnectionScreen: React.FC<SocialAccountConnectionScreenProps> = ({ state }) => {
  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-4">
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
          { icon: Icons.User, label: "Profile", active: true },
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
      <div className="relative">
        <div className="flex items-center gap-3 w-96 px-4 py-2.5 rounded-[12px] bg-[#FBF9F6] border-transparent">
          <Icons.Search className="w-4 h-4 text-[#9B96B0]" />
          <input
            type="text"
            placeholder="Search campaigns, brands..."
            className="flex-1 w-full text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
            readOnly
          />
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

  const renderProgressHeader = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
          Step 3 of 3
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1.5 rounded-full bg-[#5B4FE9]" />
          <div className="w-6 h-1.5 rounded-full bg-[#5B4FE9]" />
          <div className="w-6 h-1.5 rounded-full bg-[#5B4FE9]" />
        </div>
      </div>
      <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] md:text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-2">
        {state === "metricsPreview" ? "Looking good!" : state === "manualFallback" ? "Let's do this manually" : "Connect your account"}
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-light leading-[1.5] text-[#6B6B7B]">
        {state === "metricsPreview"
          ? "We found your profile. Review the details below and confirm they're accurate."
          : state === "manualFallback"
          ? "We couldn't connect automatically. Enter your metrics below to continue."
          : "Link your Instagram to import followers, engagement rate, and content history."}
      </p>
    </div>
  );

  const renderPlatformCard = () => (
    <div className="mb-6">
      <div className={`rounded-[16px] p-5 shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] ${
        state === "metricsPreview" ? "bg-[#5B4FE9]" : "bg-white"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${
            state === "metricsPreview" ? "bg-white/[0.15]" : "bg-[#FBF9F6]"
          }`}>
            <Icons.Camera className={`w-6 h-6 ${state === "metricsPreview" ? "text-white" : "text-[#5B4FE9]"}`} strokeWidth={1.5} />
          </div>
          <div>
            <span className={`block text-[15px] font-['Plus_Jakarta_Sans'] font-bold ${
              state === "metricsPreview" ? "text-white" : "text-[#1A1A2E]"
            }`}>
              Instagram
            </span>
            <span className={`block text-[12px] font-['Plus_Jakarta_Sans'] font-light ${
              state === "metricsPreview" ? "text-[#C4C0D4]" : "text-[#9B96B0]"
            }`}>
              @mayachencreates
            </span>
          </div>
          {state === "metricsPreview" && (
            <div className="ml-auto w-8 h-8 rounded-full bg-white/[0.15] flex items-center justify-center">
              <Icons.Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {state === "metricsPreview" && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-white">142K</span>
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] mt-0.5">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-white">4.8%</span>
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] mt-0.5">Engagement</span>
            </div>
            <div className="text-center">
              <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-white">328</span>
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] mt-0.5">Posts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPermissionsList = () => (
    state === "default" && (
      <div className="mb-6">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          We'll import
        </span>
        <div className="space-y-3">
          {[
            { icon: Icons.Users, label: "Follower count & growth trends", desc: "Public audience metrics" },
            { icon: Icons.BarChart3, label: "Engagement rate & reach", desc: "Average likes, comments, shares" },
            { icon: Icons.Image, label: "Content history", desc: "Recent posts for portfolio" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
                <div className="w-8 h-8 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#5B4FE9]" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{item.label}</span>
                  <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{item.desc}</span>
                </div>
                <Icons.Check className="w-4 h-4 text-[#5B4FE9] ml-auto shrink-0" strokeWidth={2.5} />
              </div>
            );
          })}
        </div>
      </div>
    )
  );

  const renderManualInputs = () => (
    state === "manualFallback" && (
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
            Username
          </label>
          <div className="flex items-center rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] px-4 py-3.5">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0] mr-2">@</span>
            <input
              type="text"
              placeholder="yourhandle"
              className="flex-1 text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Followers
            </label>
            <input
              type="text"
              placeholder="e.g. 50K"
              className="w-full rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] px-4 py-3.5 text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9]/[0.24] transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Engagement rate
            </label>
            <input
              type="text"
              placeholder="e.g. 3.5%"
              className="w-full rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] px-4 py-3.5 text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9]/[0.24] transition-colors"
            />
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-[10px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10]">
          <Icons.Info className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
            Manual entries may be verified by our team. Accurate data helps you get better campaign matches.
          </span>
        </div>
      </div>
    )
  );

  const renderCTA = () => (
    <div className="mt-6 md:mt-8">
      {state === "default" && (
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
          <Icons.Link className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Connect Instagram
          </span>
        </button>
      )}
      {state === "metricsPreview" && (
        <div className="space-y-2.5">
          <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
            <Icons.Check className="w-4 h-4 text-white" strokeWidth={3} />
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Confirm & continue
            </span>
          </button>
          <button className="w-full py-3.5 rounded-[14px] bg-transparent border border-[#E8E4F0] flex items-center justify-center hover:bg-[#FBF9F6] hover:border-[#5B4FE9]/[0.12] transition-colors">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
              These don't look right
            </span>
          </button>
        </div>
      )}
      {state === "manualFallback" && (
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
          <Icons.ArrowRight className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Save & continue
          </span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Sidebar (Desktop) */}
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) */}
        {renderDesktopTopBar()}

        {/* Centered Content Area */}
        <main className="flex-1 p-5 md:p-8 md:pt-12">
          <div className="w-full max-w-[600px] relative z-10">
            <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E8E4F0] p-6 md:p-10">
              {renderProgressHeader()}
              {renderPlatformCard()}
              {renderPermissionsList()}
              {renderManualInputs()}
              {renderCTA()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SocialAccountConnectionScreen;