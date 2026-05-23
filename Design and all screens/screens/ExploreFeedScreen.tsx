import React from "react";
import * as Icons from "lucide-react";

export interface ExploreFeedScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the grid of campaign cards (Desktop) or vertical feed (Mobile) with the filter bar and search input visible.
 * - filterPanelOpen: The filter bar is expanded or a modal is visible, showing the specific options for category, budget, platform, and compensation type.
 * - searchActive: The search input is focused, displaying the keyboard (Mobile) or a dropdown history (Desktop).
 * - emptyState: No campaigns match the current criteria or search query. Displays an empty state illustration and message.
 */
const ExploreFeedScreen: React.FC<ExploreFeedScreenProps> = ({ state }) => {
  const campaigns = state === "emptyState" ? [] : [
    {
      id: 1,
      brand: "Glossier",
      brandLogo: "./images/glossier-logo.png",
      title: "Spring Glow Collection Launch",
      image: "./images/campaign-glossier.png",
      matchScore: 94,
      payout: "$315",
      originalBudget: "$350",
      compensationType: "cash",
      category: "Beauty",
      deadline: "Apply by Mar 20",
    },
    {
      id: 2,
      brand: "Rare Beauty",
      brandLogo: "./images/rare-beauty-logo.png",
      title: "Soft Pinch Liquid Blush Campaign",
      image: "./images/campaign-rare-beauty.png",
      matchScore: 89,
      payout: "$450",
      originalBudget: "$500",
      compensationType: "cash",
      category: "Beauty",
      deadline: "Apply by Mar 25",
    },
    {
      id: 3,
      brand: "Away",
      brandLogo: "./images/away-logo.png",
      title: "Summer Travel Essentials",
      image: "./images/campaign-away.png",
      matchScore: 82,
      payout: "$180",
      originalBudget: "$200",
      compensationType: "gifting",
      category: "Travel",
      deadline: "Apply by Apr 02",
    },
    {
      id: 4,
      brand: "Nike",
      brandLogo: "./images/nike-logo.png",
      title: "Running Club Ambassador",
      image: "./images/campaign-nike.png",
      matchScore: 88,
      payout: "$500",
      originalBudget: "$550",
      compensationType: "cash",
      category: "Fitness",
      deadline: "Apply by Mar 22",
    },
    {
      id: 5,
      brand: "Lululemon",
      brandLogo: "./images/lululemon-logo.png",
      title: "Yoga Flow Challenge",
      image: "./images/campaign-lulu.png",
      matchScore: 91,
      payout: "$300",
      originalBudget: "$330",
      compensationType: "perks",
      category: "Fitness",
      deadline: "Apply by Mar 30",
    },
  ];

  const recentSearches = ["skincare", "fitness gear", "sustainable fashion", "tech unboxing"];

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
          { icon: Icons.MessageCircle, label: "Messages", active: false, badge: 2 },
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

  const renderMobileHeader = () => (
    <div className="md:hidden px-5 py-3">
        <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
            Discover
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B] mt-0.5">
            Campaigns matched for you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center relative">
            <Icons.MessageCircle className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
          </button>
          <button className="w-10 h-10 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center relative">
            <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDesktopTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div className="relative">
        <div className={`flex items-center gap-3 w-96 px-4 py-2.5 rounded-[12px] border transition-all ${
          state === "searchActive"
            ? "bg-white shadow-[0_2px_12px_rgba(91,79,233,0.08)] border-[#5B4FE9]/[0.12]"
            : "bg-[#FBF9F6] border-transparent"
        }`}>
          <Icons.Search className="w-4 h-4 text-[#9B96B0]" />
          <input
            type="text"
            placeholder="Search campaigns, brands, creators..."
            className="flex-1 w-full text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
            readOnly
            value={state === "searchActive" ? "skin" : ""}
          />
          {state === "searchActive" && (
            <button className="w-6 h-6 rounded-full bg-[#E8E4F0] flex items-center justify-center">
              <Icons.X className="w-3 h-3 text-[#6B6B7B]" />
            </button>
          )}
        </div>

        {state === "searchActive" && (
          <div className="hidden md:block absolute top-full left-0 mt-2 w-[450px] p-4 rounded-[12px] bg-white border border-[#E8E4F0] shadow-[0_4px_20px_rgba(0,0,0,0.05)] z-50">
            <div className="mb-4">
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">
                Recent searches
              </span>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button key={search} className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FBF9F6] border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                    <Icons.Clock className="w-3 h-3 text-[#9B96B0]" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">
                Top results for "skin"
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FBF9F6]">
                  <div className="w-8 h-8 rounded bg-[#5B4FE9]/10 flex items-center justify-center"><Icons.Search className="w-4 h-4 text-[#5B4FE9]"/></div>
                  <div><span className="text-sm font-medium text-[#1A1A2E]">Skincare Routine</span><span className="block text-xs text-[#6B6B7B]">Category</span></div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FBF9F6]">
                  <div className="w-8 h-8 rounded bg-[#5B4FE9]/10 flex items-center justify-center"><Icons.Building2 className="w-4 h-4 text-[#5B4FE9]"/></div>
                  <div><span className="text-sm font-medium text-[#1A1A2E]">Glow Co.</span><span className="block text-xs text-[#6B6B7B]">Brand</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.MessageCircle className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
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

  const renderFilterBar = () => (
    <div className="flex items-center justify-between px-5 md:px-8 py-4 pb-2">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 ${
          state === "filterPanelOpen" ? "bg-[#5B4FE9] text-white" : "bg-white text-[#1A1A2E] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
        }`}>
          <Icons.SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>
        {["Beauty", "Fashion", "Lifestyle", "Fitness", "Travel"].map((cat) => (
          <button key={cat} className="px-3.5 py-2 rounded-full bg-white text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] shrink-0">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSearchDropdown = () => (
    state === "searchActive" && (
      <div className="hidden md:block mx-8 mb-4 p-4 rounded-[12px] bg-white border border-[#E8E4F0] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">
            Recent searches
          </span>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button key={search} className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FBF9F6] border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                <Icons.Clock className="w-3 h-3 text-[#9B96B0]" />
                {search}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider mb-2 block">
            Top results for "skin"
          </span>
          {/* Mock search results */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FBF9F6]">
                <div className="w-8 h-8 rounded bg-[#5B4FE9]/10 flex items-center justify-center"><Icons.Search className="w-4 h-4 text-[#5B4FE9]"/></div>
                <div><span className="text-sm font-medium text-[#1A1A2E]">Skincare Routine</span><span className="block text-xs text-[#6B6B7B]">Category</span></div>
            </div>
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FBF9F6]">
                <div className="w-8 h-8 rounded bg-[#5B4FE9]/10 flex items-center justify-center"><Icons.Building2 className="w-4 h-4 text-[#5B4FE9]"/></div>
                <div><span className="text-sm font-medium text-[#1A1A2E]">Glow Co.</span><span className="block text-xs text-[#6B6B7B]">Brand</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderCampaignCard = (campaign: any) => {
    const CompIcon = campaign.compensationType === "cash" ? Icons.Wallet : campaign.compensationType === "gifting" ? Icons.Package : Icons.Sparkles;

    return (
      <div key={campaign.id} className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden group hover:shadow-[0_4px_12px_rgba(91,79,233,0.12)] transition-all duration-300">
        {/* Image */}
        <div className="aspect-[16/10] bg-[#FBF9F6] relative overflow-hidden">
          <img
            src={campaign.image}
            alt={`Campaign promotional image for ${campaign.brand}, featuring product photography with soft natural lighting, warm cream and pastel tones, editorial style composition`}
            data-context="Campaign card hero image in explore feed"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
            <Icons.Zap className="w-3 h-3 text-[#5B4FE9]" />
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">{campaign.matchScore}% match</span>
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
            <CompIcon className="w-3 h-3 text-[#6B6B7B]" />
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] capitalize">{campaign.compensationType}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
              <img
                src={campaign.brandLogo}
                alt={`${campaign.brand} brand logo, minimalist design on neutral background`}
                data-context="Brand logo thumbnail in campaign card"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] uppercase tracking-wider">
                {campaign.brand}
              </span>
              <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight mt-0.5 truncate">
                {campaign.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                You earn (after 10% fee)
              </span>
              <span className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                {campaign.payout}
              </span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] line-through ml-1">
                {campaign.originalBudget}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                {campaign.deadline}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    state === "emptyState" && (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-[20px] bg-[#5B4FE9]/[0.06] flex items-center justify-center mb-5">
          <Icons.Search className="w-8 h-8 text-[#5B4FE9]" strokeWidth={1.5} />
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#1A1A2E] mb-2 text-center">
          No matches found
        </h2>
        <p className="font-['Instrument_Serif'] italic text-[16px] text-[#6B6B7B] text-center leading-[1.5] mb-6 max-w-md">
          Try adjusting your filters or search for something different — great campaigns are waiting.
        </p>
        <button className="px-6 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          Clear all filters
        </button>
      </div>
    )
  );

  const renderFilterPanel = () => {
    if (state !== "filterPanelOpen") return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.40] backdrop-blur-sm z-0" />
        <div className="relative w-full md:w-[400px] bg-white md:rounded-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)] h-[85vh] md:h-auto md:mr-8 overflow-y-auto z-10">
          {/* Mobile Handle */}
          <div className="md:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
            <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
          </div>
           {/* Desktop Close Button */}
           <div className="hidden md:flex justify-end p-4 border-b border-[#E8E4F0]">
             <button className="p-2 rounded-full hover:bg-[#FBF9F6]"><Icons.X className="w-5 h-5 text-[#6B6B7B]"/></button>
           </div>

          <div className="px-5 pt-2 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Filters</h2>
              <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                Reset all
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Category
              </span>
              <div className="flex flex-wrap gap-2">
                {["Beauty", "Fashion", "Lifestyle", "Fitness", "Travel", "Tech", "Food", "Gaming"].map((cat) => (
                  <button key={cat} className="px-3.5 py-2 rounded-full bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget range */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Budget range
              </span>
              <div className="bg-[#FBF9F6] rounded-[12px] p-4">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$500</span>
                  <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]"> - $5,000+</span>
                </div>
                <div className="relative h-2 bg-[#E8E4F0] rounded-full">
                  <div className="absolute left-[10%] right-[30%] h-full rounded-full bg-[#5B4FE9]" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[10%] w-5 h-5 rounded-full bg-white shadow-[0_2px_6px_rgba(91,79,233,0.20)] border-2 border-[#5B4FE9]" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-[30%] w-5 h-5 rounded-full bg-white shadow-[0_2px_6px_rgba(91,79,233,0.20)] border-2 border-[#5B4FE9]" />
                </div>
              </div>
            </div>

            {/* Platform */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Platform
              </span>
              <div className="flex gap-3">
                {[
                  { id: "instagram", label: "Instagram", icon: Icons.Camera },
                  { id: "youtube", label: "YouTube", icon: Icons.Play },
                  { id: "tiktok", label: "TikTok", icon: Icons.Music2 },
                ].map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button key={platform.id} className="flex-1 flex flex-col items-center gap-2 p-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0]">
                      <Icon className="w-5 h-5 text-[#6B6B7B]" strokeWidth={1.5} />
                      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{platform.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compensation type */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Compensation
              </span>
              <div className="flex gap-3">
                {[
                  { id: "cash", label: "Cash", icon: Icons.Wallet },
                  { id: "gifting", label: "Gifting", icon: Icons.Package },
                  { id: "perks", label: "Perks", icon: Icons.Sparkles },
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button key={type.id} className="flex-1 flex flex-col items-center gap-2 p-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0]">
                      <Icon className="w-5 h-5 text-[#6B6B7B]" strokeWidth={1.5} />
                      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Show 24 results
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40">
      <div className="flex items-center justify-around py-2 pb-6">
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Compass className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Users className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Calendar className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Wallet className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1 relative">
          <Icons.User className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Profile</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative">
      {/* Sidebar (Desktop) */}
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) / Header (Mobile) */}
        {renderDesktopTopBar()}
        {renderMobileHeader()}

        {/* Filters & Search */}
        <div className="md:px-8">
          {renderFilterBar()}
          {/* Mobile Search Input (placed inside header area visually, but separate div for structure) */}
          <div className={`md:hidden px-5 mb-3 flex items-center gap-3 ${
            state === "searchActive" ? "bg-white shadow-[0_2px_12px_rgba(91,79,233,0.08)] border-[#5B4FE9]/[0.12]" : "bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border-[#5B4FE9]/[0.06]"
          } rounded-[14px] border px-4 py-3`}>
            <Icons.Search className="w-4 h-4 text-[#9B96B0]" />
            <input
              type="text"
              placeholder="Search campaigns, brands..."
              className="flex-1 w-full text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
              readOnly
              value={state === "searchActive" ? "skin" : ""}
            />
            {state === "searchActive" && (
              <button className="w-6 h-6 rounded-full bg-[#E8E4F0] flex items-center justify-center">
                <Icons.X className="w-3 h-3 text-[#6B6B7B]" />
              </button>
            )}
          </div>
        </div>

        {/* Grid Content */}
        <main className="flex-1 px-5 md:px-8 pb-28 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(renderCampaignCard)}
          </div>
          {renderEmptyState()}
        </main>
      </div>

      {/* Overlays */}
      {renderFilterPanel()}
      {state !== "filterPanelOpen" && renderBottomNav()}
    </div>
  );
};

export default ExploreFeedScreen;