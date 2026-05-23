import React from "react";
import * as Icons from "lucide-react";

export interface OnboardingNicheSelectionScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the grid of niche categories with no selections made.
 * - selectionsMade: The user has selected one or more niche categories, which are visually highlighted.
 * - limitReached: The user has selected the maximum of 3 categories. The interface prevents further selection and highlights the limit.
 */
const OnboardingNicheSelectionScreen: React.FC<OnboardingNicheSelectionScreenProps> = ({ state }) => {
  const categories = [
    { id: "fashion", label: "Fashion", icon: Icons.Shirt, description: "Style & trends" },
    { id: "beauty", label: "Beauty", icon: Icons.Sparkles, description: "Skincare & makeup" },
    { id: "lifestyle", label: "Lifestyle", icon: Icons.Coffee, description: "Daily life & home" },
    { id: "fitness", label: "Fitness", icon: Icons.Dumbbell, description: "Health & wellness" },
    { id: "food", label: "Food", icon: Icons.UtensilsCrossed, description: "Recipes & dining" },
    { id: "travel", label: "Travel", icon: Icons.Plane, description: "Destinations & tips" },
    { id: "tech", label: "Tech", icon: Icons.Laptop, description: "Gadgets & reviews" },
    { id: "gaming", label: "Gaming", icon: Icons.Gamepad2, description: "Streams & esports" },
    { id: "music", label: "Music", icon: Icons.Music, description: "Artists & culture" },
    { id: "business", label: "Business", icon: Icons.Briefcase, description: "Entrepreneurship" },
    { id: "education", label: "Education", icon: Icons.BookOpen, description: "Learning & tips" },
    { id: "parenting", label: "Parenting", icon: Icons.Heart, description: "Family & kids" },
  ];

  const selectedIds = state === "default" ? [] : state === "selectionsMade" ? ["fashion", "beauty"] : ["fashion", "beauty", "lifestyle"];

  const renderProgressHeader = () => (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-6">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider leading-[8px]">
          Step 1 of 3
        </span>
        <div className="flex items-center gap-2 mb-[1px]">
          <div className="w-8 h-2 rounded-full bg-[#5B4FE9]" />
          <div className="w-8 h-2 rounded-full bg-[#E8E4F0]" />
          <div className="w-8 h-2 rounded-full bg-[#E8E4F0]" />
        </div>
      </div>
      <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-3">
        What do you create?
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[15px] md:text-[16px] font-light leading-[1.6] text-[#6B6B7B] max-w-2xl">
        Select up to 3 niches that best describe your content. This helps us match you with relevant brands.
      </p>
    </div>
  );

  const renderSelectionCounter = () => (
    <div className={`flex items-center mb-6 ${state === "limitReached" ? "gap-3" : "justify-between"}`}>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
          Selected:
        </span>
        <span className={`text-[14px] font-['Plus_Jakarta_Sans'] font-bold ${
          state === "limitReached" ? "text-[#E07A5F]" : "text-[#5B4FE9]"
        }`}>
          {selectedIds.length} of 3
        </span>
      </div>
      {state === "limitReached" && (
        <span className="px-3 py-1.5 rounded-full bg-[#FFB4A2]/[0.12] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] flex items-center gap-1.5">
          <Icons.AlertCircle className="w-3 h-3" />
          Maximum reached
        </span>
      )}
    </div>
  );

  const renderCategoryGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {categories.map((category) => {
        const isSelected = selectedIds.includes(category.id);
        const isDisabled = state === "limitReached" && !isSelected;
        const Icon = category.icon;

        return (
          <button
            key={category.id}
            disabled={isDisabled}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-[16px] border transition-all group ${
              isSelected
                ? "bg-[#5B4FE9] border-[#5B4FE9] shadow-[0_4px_16px_rgba(91,79,233,0.25)] transform scale-[1.02]"
                : isDisabled
                ? "bg-white border-[#E8E4F0] opacity-40 cursor-not-allowed"
                : "bg-white border-[#5B4FE9]/[0.08] shadow-[0_2px_6px_rgba(91,79,233,0.04)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.10)] hover:border-[#5B4FE9]/[0.20] active:scale-[0.98]"
            }`}
          >
            <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center transition-colors ${
              isSelected ? "bg-white/[0.15]" : "bg-[#5B4FE9]/[0.06] group-hover:bg-[#5B4FE9]/[0.10]"
            }`}>
              <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-[#5B4FE9]"}`} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <span className={`block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold ${
                isSelected ? "text-white" : "text-[#1A1A2E]"
              }`}>
                {category.label}
              </span>
              <span className={`block text-[11px] font-['Plus_Jakarta_Sans'] font-light mt-1 ${
                isSelected ? "text-[#C4C0D4]" : "text-[#9B96B0]"
              }`}>
                {category.description}
              </span>
            </div>
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Icons.Check className="w-3 h-3 text-[#5B4FE9]" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderCTA = () => (
    <div className="sticky bottom-0 md:static bg-[#FBF9F6] md:bg-transparent pt-4 pb-8 md:pb-0 border-t md:border-t-0 border-[#E8E4F0] mt-auto">
      <div className="flex items-center justify-between gap-4">
        <button className="hidden md:flex h-[56px] items-center gap-2 px-6 py-3 rounded-[12px] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
          Back
        </button>
        <button
          className={`h-[56px] flex-1 md:flex-none md:w-auto px-8 py-4 rounded-[16px] flex items-center justify-center gap-2 transition-all ${
            selectedIds.length > 0
              ? "bg-[#5B4FE9] shadow-[0_4px_12px_rgba(91,79,233,0.25)] hover:shadow-[0_6px_16px_rgba(91,79,233,0.30)]"
              : "bg-[#E8E4F0] cursor-not-allowed"
          }`}
        >
          <span className={`text-[16px] font-['Plus_Jakarta_Sans'] font-semibold ${
            selectedIds.length > 0 ? "text-white" : "text-[#9B96B0]"
          }`}>
            Continue
          </span>
          {selectedIds.length > 0 ? <Icons.ArrowRight className="w-5 h-5 text-white" /> : <Icons.Lock className="w-4 h-4 text-[#9B96B0]" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[-50px] w-[300px] h-[300px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[80px]" />
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

      {/* Skip button (Mobile only) */}
      <div className="md:hidden px-5 py-3 flex justify-end z-10">
        <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">
          Skip for now
        </button>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 px-6 md:px-10 py-4 md:py-10 max-w-6xl mx-auto w-full overflow-y-auto">
        {renderProgressHeader()}
        {renderSelectionCounter()}
        {renderCategoryGrid()}
        {renderCTA()}
      </main>
    </div>
  );
};

export default OnboardingNicheSelectionScreen;