import React from "react";
import * as Icons from "lucide-react";

export interface OnboardingPlatformBudgetScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the platform options, budget slider, and demographics inputs in their default empty/unselected state.
 * - filled: All fields are filled: a platform is selected, the budget slider is set, and demographics are inputted. The "Next" button is active.
 */
const OnboardingPlatformBudgetScreen: React.FC<OnboardingPlatformBudgetScreenProps> = ({ state }) => {
  const platforms = [
    { id: "instagram", label: "Instagram", icon: Icons.Camera, followers: "1B+ users", color: "#E4405F" },
    { id: "youtube", label: "YouTube", icon: Icons.Play, followers: "2.7B+ users", color: "#FF0000" },
    { id: "tiktok", label: "TikTok", icon: Icons.Music2, followers: "1B+ users", color: "#000000" },
  ];

  const selectedPlatform = state === "filled" ? "instagram" : null;
  const budgetValue = state === "filled" ? 2500 : 500;
  const selectedAgeRanges = state === "filled" ? ["18-24", "25-34"] : [];
  const selectedGenders = state === "filled" ? ["female", "male"] : [];

  const renderProgressHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
          Step 2 of 3
        </span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 rounded-full bg-[#5B4FE9]" />
          <div className="w-8 h-2 rounded-full bg-[#5B4FE9] shadow-[0_0_8px_rgba(91,79,233,0.4)]" />
          <div className="w-8 h-2 rounded-full bg-[#E8E4F0]" />
        </div>
      </div>
      <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-3">
        Your platform & reach
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#6B6B7B] max-w-2xl">
        Help brands understand where you create and who you reach.
      </p>
    </div>
  );

  const renderPlatformSelection = () => (
    <div className="mb-8">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 block">
        Primary platform
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              className={`flex flex-col items-center gap-2 p-4 rounded-[16px] border text-left transition-all w-full ${
                isSelected
                  ? "bg-[#5B4FE9] border-[#5B4FE9] shadow-[0_4px_16px_rgba(91,79,233,0.20)] transform scale-[1.02]"
                  : "bg-white border-[#5B4FE9]/[0.08] shadow-[0_2px_6px_rgba(91,79,233,0.04)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.10)] hover:border-[#5B4FE9]/[0.20]"
              }`}
            >
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors ${
                isSelected ? "bg-white/[0.15]" : "bg-[#FBF9F6]"
              }`}>
                <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#1A1A2E]"}`} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <span className={`block text-[15px] font-['Plus_Jakarta_Sans'] font-bold mb-1 ${
                  isSelected ? "text-white" : "text-[#1A1A2E]"
                }`}>
                  {platform.label}
                </span>
                <span className={`block text-[12px] font-['Plus_Jakarta_Sans'] font-light ${
                  isSelected ? "text-[#C4C0D4]" : "text-[#9B96B0]"
                }`}>
                  {platform.followers}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderBudgetSlider = () => (
    <div className="mb-8">
      <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 block">
        Expected campaign budget
      </label>
      <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_8px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[32px] md:text-[36px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
            ${budgetValue.toLocaleString()}
          </span>
          <span className="text-[14px] md:text-[15px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            per campaign
          </span>
        </div>
        <div className="relative h-2.5 bg-[#E8E4F0] rounded-full mb-3 cursor-pointer">
          <div
            className="absolute h-full rounded-full bg-[#5B4FE9]"
            style={{ width: `${(budgetValue / 10000) * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-[0_2px_8px_rgba(91,79,233,0.25)] border-2 border-[#5B4FE9] hover:scale-110 transition-transform"
            style={{ left: `calc(${(budgetValue / 10000) * 100}% - 12px)` }}
          />
        </div>
        <div className="flex justify-between text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
          <span>$500</span>
          <div className="flex items-center gap-1">
            <span>$10,000</span>
            <button className="w-5 h-5 rounded-[6px] bg-[#5B4FE9]/10 text-[#5B4FE9] flex items-center justify-center text-[10px] font-semibold">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="mb-8">
      <div className="mb-4">
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider block">
          Target audience
        </label>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1 block">
          Select all that apply
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age ranges */}
        <div>
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] mb-3 block">Age range</span>
          <div className="flex flex-wrap gap-2">
            {["13-17", "18-24", "25-34", "35-44", "45+"].map((range) => {
              const isSelected = selectedAgeRanges.includes(range);
              return (
                <button
                  key={range}
                  className={`px-4 py-2.5 rounded-full text-[13px] font-['Plus_Jakarta_Sans'] font-medium transition-all ${
                    isSelected
                      ? "bg-[#5B4FE9] text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)]"
                      : "bg-white text-[#6B6B7B] border border-[#E8E4F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#5B4FE9]/[0.20]"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender */}
        <div>
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] mb-3 block">Gender</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "female", label: "Female" },
              { id: "male", label: "Male" },
              { id: "non-binary", label: "Non-binary" },
              { id: "all", label: "All genders" },
            ].map((gender) => {
              const isSelected = selectedGenders.includes(gender.id);
              return (
                <button
                  key={gender.id}
                  className={`px-4 py-2.5 rounded-full text-[13px] font-['Plus_Jakarta_Sans'] font-medium transition-all ${
                    isSelected
                      ? "bg-[#5B4FE9] text-white shadow-[0_2px_6px_rgba(91,79,233,0.16)]"
                      : "bg-white text-[#6B6B7B] border border-[#E8E4F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#5B4FE9]/[0.20]"
                  }`}
                >
                  {gender.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCTA = () => (
    <div className="sticky bottom-0 md:static bg-[#FBF9F6] md:bg-transparent pt-4 pb-8 md:pb-0 border-t md:border-t-0 border-[#E8E4F0] mt-auto">
      <div className="flex items-center justify-between gap-4">
        <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-[12px] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
          <Icons.ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          className={`flex-1 md:flex-none md:w-auto px-8 py-4 rounded-[16px] flex items-center justify-center gap-2 transition-all ${
            state === "filled"
              ? "bg-[#5B4FE9] shadow-[0_4px_12px_rgba(91,79,233,0.25)] hover:shadow-[0_6px_16px_rgba(91,79,233,0.30)]"
              : "bg-[#E8E4F0] cursor-not-allowed"
          }`}
        >
          <span className={`text-[16px] font-['Plus_Jakarta_Sans'] font-semibold ${
            state === "filled" ? "text-white" : "text-[#9B96B0]"
          }`}>
            Continue
          </span>
          {state === "filled" && <Icons.ArrowRight className="w-5 h-5 text-white" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-30px] w-[250px] h-[250px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[60px]" />
      </div>

      {/* Top status bar (Mobile only) */}
      <div className="md:hidden px-5 pt-3 pb-1 flex items-center justify-between z-20">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
        <div className="flex items-center gap-1">
          <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </div>
      </div>

      {/* Back button (Mobile only) */}
      <div className="md:hidden px-5 py-3">
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 px-6 md:px-10 py-4 md:py-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {renderProgressHeader()}
        {renderPlatformSelection()}
        {renderBudgetSlider()}
        {renderDemographics()}
        {renderCTA()}
      </main>
    </div>
  );
};

export default OnboardingPlatformBudgetScreen;