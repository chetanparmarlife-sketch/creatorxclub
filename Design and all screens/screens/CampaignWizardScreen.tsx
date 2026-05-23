import React from "react";
import * as Icons from "lucide-react";

export interface CampaignWizardScreenProps {
  state: string;
}

/**
 * States:
 * - step1Basics: The wizard is on Step 1, displaying inputs for title, description, niches, and platforms.
 * - step2Requirements: The wizard is on Step 2, displaying inputs for deliverables, deadlines, and usage rights.
 * - step3Compensation: The wizard is on Step 3, displaying inputs for budget, inventory, and negotiation settings.
 * - step4Review: The wizard is on Step 4, displaying a complete summary of the campaign and the Publish/Draft buttons.
 */
const CampaignWizardScreen: React.FC<CampaignWizardScreenProps> = ({ state }) => {
  const steps = [
    { id: "basics", label: "Basics", number: 1 },
    { id: "requirements", label: "Requirements", number: 2 },
    { id: "compensation", label: "Compensation", number: 3 },
    { id: "review", label: "Review", number: 4 },
  ];

  const currentStepIndex = state === "step1Basics" ? 0 : state === "step2Requirements" ? 1 : state === "step3Compensation" ? 2 : 3;

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
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Target, label: "Campaigns", active: true, badge: "New" },
          { icon: Icons.Inbox, label: "Applications", active: false },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false },
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

  const renderStepper = () => (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div className={`flex-1 h-[2px] mx-2 w-16 md:w-24 ${isCompleted ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"}`} />
              )}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
                    isCompleted
                      ? "bg-[#5B4FE9] text-white"
                      : isActive
                      ? "bg-[#5B4FE9] text-white shadow-[0_0_0_4px_rgba(91,79,233,0.12)]"
                      : "bg-[#E8E4F0] text-[#9B96B0]"
                  }`}
                >
                  {isCompleted ? (
                    <Icons.Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="hidden md:block w-20">
                  <span
                    className={`block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold whitespace-nowrap ${
                      isActive || isCompleted ? "text-[#1A1A2E]" : "text-[#9B96B0]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  const renderAutoSaveStatus = () => (
    <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-[8px] bg-[#5B4FE9]/[0.04] w-fit">
      <Icons.Check className="w-3 h-3 text-[#5B4FE9]" strokeWidth={3} />
      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
        Auto-saved 2 min ago
      </span>
    </div>
  );

  const renderStep1Basics = () => (
    <div className="space-y-6">
      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
          Campaign title
        </label>
        <input
          type="text"
          placeholder="e.g. Spring Glow Collection Launch"
          className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)]"
          defaultValue="Spring Glow Collection Launch"
        />
      </div>

      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
          Description
        </label>
        <textarea
          placeholder="Describe your campaign goals, target audience, and what you're looking for..."
          className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)] resize-none h-32 leading-[1.6]"
          defaultValue="We're looking for creators who love natural, dewy makeup to showcase our new Spring Glow collection. Share your authentic glow-up routine with products that enhance your natural beauty."
        />
      </div>

      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Niche categories
        </label>
        <div className="flex flex-wrap gap-2">
          {["Beauty", "Fashion", "Lifestyle", "Skincare", "Wellness"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-[13px] font-['Plus_Jakarta_Sans'] font-medium ${
                cat === "Beauty" || cat === "Skincare"
                  ? "bg-[#5B4FE9] text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)]"
                  : "bg-white text-[#6B6B7B] border border-[#E8E4F0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Target platforms
        </label>
        <div className="flex gap-3">
          {[
            { id: "instagram", label: "Instagram", icon: Icons.Camera },
            { id: "youtube", label: "YouTube", icon: Icons.Play },
            { id: "tiktok", label: "TikTok", icon: Icons.Music2 },
          ].map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-[12px] border ${
                  platform.id === "instagram"
                    ? "bg-[#5B4FE9]/[0.06] border-[#5B4FE9]/[0.20]"
                    : "bg-white border-[#E8E4F0]"
                }`}
              >
                <Icon className={`w-5 h-5 ${platform.id === "instagram" ? "text-[#5B4FE9]" : "text-[#6B6B7B]"}`} strokeWidth={1.5} />
                <span className={`text-[13px] font-['Plus_Jakarta_Sans'] font-medium ${platform.id === "instagram" ? "text-[#5B4FE9]" : "text-[#6B6B7B]"}`}>
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2Requirements = () => (
    <div className="space-y-6">
      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Deliverables
        </label>
        <div className="space-y-3">
          {[
            { type: "Instagram Reel", count: 1, duration: "30-60 seconds", selected: true },
            { type: "Instagram Stories", count: 3, duration: "15 seconds each", selected: true },
            { type: "TikTok Video", count: 0, duration: "Optional", selected: false },
          ].map((del) => (
            <div
              key={del.type}
              className={`flex items-center gap-4 p-4 rounded-[12px] border ${
                del.selected
                  ? "bg-[#5B4FE9]/[0.04] border-[#5B4FE9]/[0.15]"
                  : "bg-white border-[#E8E4F0]"
              }`}
            >
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
                del.selected ? "bg-[#5B4FE9]/[0.08]" : "bg-[#FBF9F6]"
              }`}>
                {del.type.includes("Reel") || del.type.includes("Video") ? (
                  <Icons.Film className={`w-5 h-5 ${del.selected ? "text-[#5B4FE9]" : "text-[#6B6B7B]"}`} strokeWidth={1.5} />
                ) : (
                  <Icons.Image className={`w-5 h-5 ${del.selected ? "text-[#5B4FE9]" : "text-[#6B6B7B]"}`} strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1">
                <span className={`block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold ${del.selected ? "text-[#1A1A2E]" : "text-[#6B6B7B]"}`}>
                  {del.count > 0 ? `${del.count}x ` : ""}{del.type}
                </span>
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  {del.duration}
                </span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                del.selected ? "bg-[#5B4FE9] border-[#5B4FE9]" : "border-[#E8E4F0]"
              }`}>
                {del.selected && <Icons.Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
            Content deadline
          </label>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-white border border-[#E8E4F0]">
            <Icons.Calendar className="w-4 h-4 text-[#5B4FE9]" />
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Mar 25, 2024</span>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
            SLA (days to submit)
          </label>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-white border border-[#E8E4F0]">
            <Icons.Clock className="w-4 h-4 text-[#5B4FE9]" />
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">14 days</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Usage rights
        </label>
        <div className="space-y-3">
          {[
            { label: "Exclusivity period", value: "No category exclusivity", icon: Icons.Lock },
            { label: "Usage duration", value: "6 months", icon: Icons.Clock },
            { label: "Territorial scope", value: "Global", icon: Icons.Globe },
            { label: "Content restrictions", value: "Brand may boost with paid spend", icon: Icons.Shield },
          ].map((right) => {
            const Icon = right.icon;
            return (
              <div key={right.label} className="flex items-center gap-3 p-4 rounded-[12px] bg-white border border-[#E8E4F0]">
                <div className="w-9 h-9 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#5B4FE9]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{right.label}</span>
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{right.value}</span>
                </div>
                <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3Compensation = () => (
    <div className="space-y-6">
      {/* Campaign type cards */}
      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Compensation type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "cash", label: "Cash", icon: Icons.Wallet, color: "#5B4FE9", selected: true },
            { id: "gifting", label: "Gifting", icon: Icons.Package, color: "#E07A5F", selected: false },
            { id: "perks", label: "Perks", icon: Icons.Sparkles, color: "#8B82F0", selected: false },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`flex flex-col items-center gap-3 p-5 rounded-[14px] border transition-all ${
                  type.selected
                    ? "bg-white border-[#5B4FE9]/[0.20] shadow-[0_2px_12px_rgba(91,79,233,0.08)]"
                    : "bg-white border-[#E8E4F0]"
                }`}
              >
                <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center`} style={{ backgroundColor: `${type.color}10` }}>
                  <Icon className="w-6 h-6" style={{ color: type.color }} strokeWidth={1.5} />
                </div>
                <span className={`text-[14px] font-['Plus_Jakarta_Sans'] font-semibold ${type.selected ? "text-[#1A1A2E]" : "text-[#6B6B7B]"}`}>
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget input */}
      <div>
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
          Total campaign budget
        </label>
        <div className="p-5 rounded-[14px] bg-white border border-[#E8E4F0]">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">$</span>
            <input
              type="text"
              defaultValue="3,500"
              className="text-[32px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] bg-transparent outline-none w-full"
            />
          </div>
          <div className="relative h-2 bg-[#E8E4F0] rounded-full">
            <div className="absolute w-[35%] h-full rounded-full bg-[#5B4FE9]" />
            <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-5 h-5 rounded-full bg-white shadow-[0_2px_6px_rgba(91,79,233,0.20)] border-2 border-[#5B4FE9]" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">$500</span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">$10,000+</span>
          </div>
        </div>
      </div>

      {/* Fee breakdown - key moment */}
      <div className="p-5 rounded-[14px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08]">
        <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
          Transparent fee breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-[#5B4FE9]/[0.08] flex items-center justify-center">
                <Icons.Users className="w-4 h-4 text-[#5B4FE9]" />
              </div>
              <div>
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Creator payout</span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">After 10% platform fee</span>
              </div>
            </div>
            <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$3,150</span>
          </div>
          <div className="h-[1px] bg-[#E8E4F0]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-[#FFB4A2]/[0.10] flex items-center justify-center">
                <Icons.Percent className="w-4 h-4 text-[#E07A5F]" />
              </div>
              <div>
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Platform fee (10%)</span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Added to brand cost</span>
              </div>
            </div>
            <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">$350</span>
          </div>
          <div className="h-[1px] bg-[#E8E4F0]" />
          <div className="flex items-center justify-between py-3 rounded-[10px] bg-white">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Total campaign cost</span>
            <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$3,850</span>
          </div>
        </div>
      </div>

      {/* Negotiation toggle */}
      <div className="flex items-center justify-between p-4 rounded-[12px] bg-white border border-[#E8E4F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
            <Icons.MessageSquare className="w-5 h-5 text-[#5B4FE9]" />
          </div>
          <div>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Allow negotiation</span>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Creators can propose custom rates</span>
          </div>
        </div>
        <div className="w-11 h-6 rounded-full bg-[#5B4FE9] relative">
          <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );

  const renderStep4Review = () => (
    <div className="space-y-6">
      <div className="p-5 rounded-[14px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] flex items-start gap-3">
        <Icons.Eye className="w-5 h-5 text-[#5B4FE9] shrink-0 mt-0.5" />
        <div>
          <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-0.5">
            Review everything before publishing
          </span>
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
            Once published, your campaign will be live and visible to creators. Budget will be allocated to escrow.
          </span>
        </div>
      </div>

      {/* Summary card */}
      <div className="p-6 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-[12px] bg-[#FBF9F6] p-3 shrink-0">
            <img
              src="./images/glossier-logo.png"
              alt="Glossier brand logo"
              data-context="Campaign review brand logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              Spring Glow Collection Launch
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
                Beauty
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
                Skincare
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#8B82F0]/[0.08] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0]">
                Instagram
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#E8E4F0] mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-[10px] bg-[#FBF9F6]">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Deliverables</span>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">1 Reel + 3 Stories</span>
          </div>
          <div className="p-4 rounded-[10px] bg-[#FBF9F6]">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Deadline</span>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Mar 25, 2024</span>
          </div>
          <div className="p-4 rounded-[10px] bg-[#FBF9F6]">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Compensation</span>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Cash — $3,500</span>
          </div>
          <div className="p-4 rounded-[10px] bg-[#FBF9F6]">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Negotiation</span>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Enabled</span>
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Creator payout</span>
            <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$3,150</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Platform fee (10%)</span>
            <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">$350</span>
          </div>
          <div className="h-[1px] bg-[#E8E4F0] my-2" />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Total from your wallet</span>
            <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$3,850</span>
          </div>
        </div>
      </div>

      {/* Escrow confirmation */}
      <div className="flex items-start gap-3 p-4 rounded-[10px] bg-[#FFB4A2]/[0.04] border border-[#FFB4A2]/[0.08]">
        <Icons.Lock className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
        <div>
          <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] mb-0.5">
            $3,850 will be held in escrow
          </span>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
            Funds are released only when deliverables are approved. You can pause or cancel the campaign at any time before applications are accepted.
          </span>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t border-[#E8E4F0] gap-4">
        <button
          className={`flex items-center gap-2 px-5 py-3 rounded-[12px] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold w-full sm:w-auto ${
            currentStepIndex === 0
              ? "text-[#C4C0D4] cursor-not-allowed"
              : "text-[#6B6B7B] bg-white border border-[#E8E4F0] shadow-[0_1px_3px_rgba(91,79,233,0.04)]"
          }`}
        >
          <Icons.ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          {currentStepIndex === 3 && (
            <button className="px-5 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] shadow-[0_1px_3px_rgba(91,79,233,0.04)] whitespace-nowrap">
              Save as draft
            </button>
          )}
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] w-full sm:w-auto">
          {currentStepIndex === 3 ? (
            <>
              <Icons.Rocket className="w-4 h-4" />
              Publish campaign
            </>
          ) : (
            <>
              Continue
              <Icons.ChevronRight className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Create Campaign</h1>
              <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Step {currentStepIndex + 1} of 4</p>
            </div>
          </div>
          <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#1A1A2E]">
            Exit wizard
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-[800px] mx-auto w-full">
            {renderAutoSaveStatus()}
            {renderStepper()}

            <div className="mt-6">
              {state === "step1Basics" && renderStep1Basics()}
              {state === "step2Requirements" && renderStep2Requirements()}
              {state === "step3Compensation" && renderStep3Compensation()}
              {state === "step4Review" && renderStep4Review()}
            </div>

            {renderNavigation()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignWizardScreen;