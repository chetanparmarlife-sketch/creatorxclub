import React from "react";
import * as Icons from "lucide-react";

export interface EventListScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of event cards with default sorting and filters.
 * - filtersOpen: The filter controls (date, type, sponsorship) are expanded or visible for adjustment.
 */
const EventListScreen: React.FC<EventListScreenProps> = ({ state }) => {
  const events = [
    {
      id: 1,
      title: "Creator Summit 2024",
      date: { day: "15", month: "MAR" },
      type: "virtual",
      organizer: "CreatorX Team",
      attendees: 2340,
      sponsored: true,
      sponsor: "Glossier",
      image: "./images/event-summit.png",
      category: "Conference",
    },
    {
      id: 2,
      title: "Brand Workshop: Beauty",
      date: { day: "22", month: "MAR" },
      type: "virtual",
      organizer: "Rare Beauty",
      attendees: 456,
      sponsored: true,
      sponsor: "Rare Beauty",
      image: "./images/event-workshop.png",
      category: "Workshop",
    },
    {
      id: 3,
      title: "Community Meetup: NYC",
      date: { day: "05", month: "APR" },
      type: "physical",
      organizer: "Maya Chen",
      attendees: 89,
      sponsored: false,
      sponsor: null,
      image: "./images/event-meetup.png",
      category: "Meetup",
    },
    {
      id: 4,
      title: "Content Strategy Masterclass",
      date: { day: "12", month: "APR" },
      type: "virtual",
      organizer: "Nike",
      attendees: 1200,
      sponsored: true,
      sponsor: "Nike",
      image: "./images/event-summit.png",
      category: "Workshop",
    },
  ];

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
          { icon: Icons.Calendar, label: "Events", active: true },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.User, label: "Profile", active: false, badge: 3 },
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

  const renderTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Events</h1>
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Learn, connect, grow</span>
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

  const renderStatusBar = () => (
    <div className="md:hidden relative z-10 px-5 pt-3 pb-1 flex items-center justify-between">
      <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
      <div className="flex items-center gap-1">
        <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
        <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
        <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="px-5 py-4 md:hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
            Events
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
            Learn, connect, grow
          </p>
        </div>
        <button className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
          state === "filtersOpen" ? "bg-[#5B4FE9] shadow-[0_2px_8px_rgba(91,79,233,0.16)]" : "bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
        }`}>
          <Icons.SlidersHorizontal className={`w-5 h-5 ${state === "filtersOpen" ? "text-white" : "text-[#1A1A2E]"}`} />
        </button>
      </div>

      {/* Quick filters - Mobile Only */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {["All", "Virtual", "Physical", "Workshop", "Meetup", "Conference"].map((filter, index) => (
          <button
            key={filter}
            className={`px-3.5 py-2 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 ${
              index === 0 ? "bg-[#5B4FE9] text-white" : "bg-white text-[#6B6B7B] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEventCard = (event: any) => (
    <div key={event.id} className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden hover:shadow-[0_4px_12px_rgba(91,79,233,0.12)] transition-all duration-300 flex flex-col h-full group">
      {/* Image */}
      <div className="h-[160px] md:h-[140px] bg-[#FBF9F6] relative">
        <img
          src={event.image}
          alt={`Event promotional image for ${event.title}, featuring professional event photography with warm lighting and engaged audience`}
          data-context="Event card promotional image"
          className="w-full h-full object-cover"
        />
        {event.sponsored && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
            <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">SPONSORED</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Date block */}
          <div className="w-14 h-14 bg-[#5B4FE9]/[0.04] rounded-[10px] flex flex-col items-center justify-center shrink-0 border border-[#E8E4F0]">
            <span className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] leading-none">{event.date.day}</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0] uppercase tracking-wider mt-0.5">{event.date.month}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider ${
                event.type === "virtual" ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]" : "bg-[#FFB4A2]/[0.08] text-[#E07A5F]"
              }`}>
                {event.type}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#FBF9F6] text-[8px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                {event.category}
              </span>
            </div>
            <h3 className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight line-clamp-2">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-[#E8E4F0]/[0.5] flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Icons.Building2 className="w-3 h-3 text-[#9B96B0] shrink-0" />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">
                {event.organizer}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Users className="w-3 h-3 text-[#9B96B0] shrink-0" />
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                {event.attendees.toLocaleString()} attending
              </span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-[8px] bg-[#5B4FE9] text-white text-[12px] font-bold font-['Plus_Jakarta_Sans'] shadow-[0_2px_4px_rgba(91,79,233,0.2)] hover:bg-[#4B41D9] transition-colors shrink-0 whitespace-nowrap">
            Register
          </button>
        </div>
      </div>
    </div>
  );

  const renderFilterSidebar = () => (
    <div className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit">
      <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Filter Events</h3>
          <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">Reset</button>
        </div>

        {/* Date range */}
        <div className="mb-6">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            When
          </span>
          <div className="flex flex-col gap-2">
            <button className="p-2.5 rounded-[10px] bg-[#5B4FE9] text-center">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">This month</span>
            </button>
            <button className="p-2.5 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-center hover:bg-[#E8E4F0] transition-colors">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">This week</span>
            </button>
            <button className="p-2.5 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-center hover:bg-[#E8E4F0] transition-colors">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">All time</span>
            </button>
          </div>
        </div>

        {/* Event type */}
        <div className="mb-6">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Event type
          </span>
          <div className="flex flex-col gap-2">
            {["Virtual", "Physical", "Workshop", "Meetup", "Conference"].map((type) => (
              <button key={type} className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors text-left">
                <div className="w-4 h-4 rounded-full border-2 border-[#5B4FE9] bg-[#5B4FE9]" />
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sponsorship */}
        <div className="mb-6">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Sponsorship
          </span>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors text-left">
              <div className="w-4 h-4 rounded-full border-2 border-[#5B4FE9] bg-[#5B4FE9]" />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">All events</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors text-left">
              <div className="w-4 h-4 rounded-full border-2 border-[#E8E4F0]" />
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Sponsored only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilterSheet = () => (
    state === "filtersOpen" && (
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end md:hidden">
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
              <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Filter events</h2>
              <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                Reset
              </button>
            </div>

            {/* Date range */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                When
              </span>
              <div className="flex gap-3">
                <button className="flex-1 p-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-center">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">This week</span>
                </button>
                <button className="flex-1 p-3 rounded-[12px] bg-[#5B4FE9] text-center">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">This month</span>
                </button>
                <button className="flex-1 p-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-center">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">All</span>
                </button>
              </div>
            </div>

            {/* Event type */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Event type
              </span>
              <div className="flex flex-wrap gap-2">
                {["Virtual", "Physical", "Workshop", "Meetup", "Conference", "Panel"].map((type) => (
                  <button key={type} className="px-4 py-2 rounded-full bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sponsorship */}
            <div className="mb-6">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
                Sponsorship
              </span>
              <div className="flex gap-3">
                <button className="flex-1 p-3 rounded-[12px] bg-[#5B4FE9] text-center">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">All events</span>
                </button>
                <button className="flex-1 p-3 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] text-center">
                  <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Sponsored only</span>
                </button>
              </div>
            </div>

            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Show 12 events
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40">
      <div className="flex items-center justify-around py-2 pb-6">
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Compass className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Users className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Calendar className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1">
          <Icons.Wallet className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1 relative">
          <Icons.User className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Profile</span>
          <div className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden pb-28 md:pb-0">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[-20px] w-[150px] h-[150px] rounded-full bg-[#8B82F0] opacity-[0.04] blur-[40px]" />
      </div>

      {renderSidebar()}

      <div className="md:ml-64 flex flex-col min-h-screen">
        {renderTopBar()}
        
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-9 xl:col-span-10">
              {renderStatusBar()}
              {renderHeader()}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map(renderEventCard)}
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              {renderFilterSidebar()}
            </div>
          </div>
        </main>
      </div>

      {renderFilterSheet()}
      {state !== "filtersOpen" && renderBottomNav()}
    </div>
  );
};

export default EventListScreen;