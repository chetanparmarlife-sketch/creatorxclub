import React from "react";
import * as Icons from "lucide-react";

export interface CampaignDetailScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the full campaign information including brand profile, requirements, usage rights, and the primary "Apply" action.
 * - kycLocked: The primary "Apply" action is disabled or replaced with a "Complete KYC" prompt because the user's verification is pending.
 */
const CampaignDetailScreen: React.FC<CampaignDetailScreenProps> = ({ state }) => {
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
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">Explore</span>
          <h1 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Campaign Details</h1>
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

  const renderHero = () => (
    <div className="relative rounded-[16px] overflow-hidden mb-6">
      <div className="aspect-[16/10] bg-[#FBF9F6]">
        <img
          src="./images/campaign-glossier-detail.png"
          alt="Glossier Spring Glow Collection product photography, multiple skincare products arranged on soft pink marble surface, dewy fresh aesthetic, soft natural window light, editorial beauty campaign imagery"
          data-context="Campaign detail hero image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#1A1A2E]/[0.20]" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
            94% match
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
            Cash compensation
          </span>
        </div>
      </div>
    </div>
  );

  const renderBrandProfile = () => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
          <img
            src="./images/glossier-logo.png"
            alt="Glossier beauty brand logo, soft pink minimalist design"
            data-context="Brand logo in campaign detail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Glossier</span>
            <div className="w-4 h-4 rounded-full bg-[#5B4FE9] flex items-center justify-center">
              <Icons.Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            12 campaigns · 4.9★ rating
          </span>
        </div>
        <button className="px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] hover:bg-[#5B4FE9]/[0.10] transition-colors">
          View profile
        </button>
      </div>

      <h1 className="text-[20px] md:text-[24px] font-['Plus_Jakarta_Sans'] font-bold leading-[1.3] tracking-[-0.02em] text-[#1A1A2E] mb-2">
        Spring Glow Collection Launch
      </h1>
      <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.6]">
        We're looking for creators who love natural, dewy makeup to showcase our new Spring Glow collection. Share your authentic glow-up routine with products that enhance your natural beauty.
      </p>
    </div>
  );

  const renderRequirements = () => (
    <div className="mb-6">
      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Deliverables
      </span>
      <div className="space-y-2.5">
        {[
          { icon: Icons.Film, label: "1 Instagram Reel", desc: "30-60 seconds, showing product application" },
          { icon: Icons.Image, label: "3 Instagram Stories", desc: "15 seconds each, unboxing + review + final look" },
          { icon: Icons.Hash, label: "Required hashtags", desc: "#GlossierYou #SpringGlow2024 #GlossierPartner" },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
              <div className="w-9 h-9 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#5B4FE9]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.label}</span>
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderUsageRights = () => (
    <div className="mb-6">
      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Usage rights
      </span>
      <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
        <div className="space-y-3">
          {[
            { label: "Exclusivity", value: "No category exclusivity" },
            { label: "Duration", value: "6 months usage rights" },
            { label: "Territory", value: "Global" },
            { label: "Content", value: "Brand may boost with paid spend" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.Check className="w-3.5 h-3.5 text-[#5B4FE9]" strokeWidth={2.5} />
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">{item.label}</span>
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="mb-6">
      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Timeline
      </span>
      <div className="flex items-center gap-3 p-4 rounded-[12px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10]">
        <div className="w-10 h-10 rounded-[10px] bg-[#FFB4A2]/[0.12] flex items-center justify-center shrink-0">
          <Icons.Clock className="w-4 h-4 text-[#E07A5F]" />
        </div>
        <div>
          <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Apply by March 20, 2024</span>
          <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Content due within 14 days of approval</span>
        </div>
        <span className="ml-auto text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">8 days left</span>
      </div>
    </div>
  );

  const renderStickyActionColumn = () => (
    <div className="hidden lg:block sticky top-24">
      <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-5">
        <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
          Compensation
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-[4px] bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
            10% platform fee applied
          </span>
        </div>
        <div className="h-[1px] bg-[#E8E4F0] mb-4" />
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Campaign budget</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">$350.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Platform fee (10%)</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">-$35.00</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E4F0]">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">You receive</span>
            <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$315.00</span>
          </div>
        </div>
        
        {state === "default" ? (
          <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
            <Icons.Send className="w-4 h-4 text-white" />
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Apply now
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-[10px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10] flex items-start gap-2">
              <Icons.Lock className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                Complete identity verification to apply to campaigns and receive payments.
              </span>
            </div>
            <button className="w-full py-4 rounded-[14px] bg-[#FFB4A2]/[0.12] border border-[#FFB4A2]/[0.20] flex items-center justify-center gap-2 hover:bg-[#FFB4A2]/[0.18] transition-colors">
              <Icons.ShieldCheck className="w-4 h-4 text-[#E07A5F]" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
                Complete KYC to apply
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
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
        <main className="flex-1 p-5 md:p-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Content */}
            <div className="lg:col-span-8 lg:pb-0 pb-32">
              {renderHero()}
              {renderBrandProfile()}
              {renderRequirements()}
              {renderUsageRights()}
              {renderTimeline()}
              
              {/* Mobile Sticky CTA (Only visible on mobile) */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40 px-5 pt-4 pb-8 md:ml-0">
                {state === "default" ? (
                  <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                    <Icons.Send className="w-4 h-4 text-white" />
                    <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                      Apply now
                    </span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-[10px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10] flex items-start gap-2">
                      <Icons.Lock className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
                      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                        Complete identity verification to apply to campaigns.
                      </span>
                    </div>
                    <button className="w-full py-4 rounded-[14px] bg-[#FFB4A2]/[0.12] border border-[#FFB4A2]/[0.20] flex items-center justify-center gap-2">
                      <Icons.ShieldCheck className="w-4 h-4 text-[#E07A5F]" />
                      <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
                        Complete KYC to apply
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Actions */}
            <div className="lg:col-span-4">
              {renderStickyActionColumn()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignDetailScreen;