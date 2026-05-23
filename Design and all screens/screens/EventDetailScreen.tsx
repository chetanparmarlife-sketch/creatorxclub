import React from "react";
import * as Icons from "lucide-react";

export interface EventDetailScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays all event details. The "Register" button is active.
 * - registered: The user is registered. The button changes to "Registered" or "Cancel", and attendee information is visible.
 * - sponsored: The event is sponsored by a Brand, displaying the Sponsor's branding prominently.
 */
const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ state }) => {
  const isSponsored = state === "sponsored";
  const isRegistered = state === "registered";

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
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors">
          <Icons.ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
        </button>
        <div className="flex items-center gap-2 text-sm text-[#6B6B7B]">
          <span className="hover:text-[#5B4FE9] cursor-pointer">Events</span>
          <Icons.ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1A2E] font-medium truncate max-w-[200px]">Creator Summit 2024</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 p-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors">
          <Icons.Share2 className="w-5 h-5 text-[#1A1A2E]" />
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
    <div className="md:hidden relative z-10 px-5 py-3 flex items-center gap-3">
      <button className="w-9 h-9 rounded-[12px] bg-white/90 backdrop-blur-sm shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
        <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
      </button>
      <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Event Details</span>
      <button className="ml-auto w-9 h-9 rounded-[12px] bg-white/90 backdrop-blur-sm shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
        <Icons.Share2 className="w-4 h-4 text-[#1A1A2E]" />
      </button>
    </div>
  );

  const renderHero = () => (
    <div className="relative rounded-[16px] overflow-hidden mb-6 md:mb-8 -mx-5 md:mx-0">
      <div className="aspect-[16/9] md:aspect-[21/9] bg-[#FBF9F6]">
        <img
          src="./images/event-summit-detail.png"
          alt="Creator Summit 2024 event photography, large modern venue with stage lighting, diverse audience of content creators, professional conference atmosphere with warm ambient lighting"
          data-context="Event detail hero image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/[0.60] to-transparent" />

      {/* Date badge */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 p-4 rounded-[12px] bg-white/90 backdrop-blur-sm text-center">
        <span className="block text-[28px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] leading-none">15</span>
        <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0] uppercase tracking-wider mt-1">MAR</span>
      </div>

      {/* Sponsor badge */}
      {isSponsored && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 px-4 py-2 rounded-[10px] bg-white/90 backdrop-blur-sm flex items-center gap-2">
          <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Presented by</span>
          <div className="w-6 h-6 rounded-[4px] bg-[#FBF9F6] overflow-hidden flex items-center justify-center">
            <img
              src="./images/glossier-logo.png"
              alt="Glossier sponsor logo"
              data-context="Event sponsor logo badge"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Type badge */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1.5">
        <Icons.Video className="w-4 h-4 text-[#5B4FE9]" />
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Virtual Event</span>
      </div>
    </div>
  );

  const renderTitleSection = () => (
    <div className="mb-6 md:mb-8">
      <h1 className="text-[26px] md:text-[32px] font-['Plus_Jakarta_Sans'] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-4">
        Creator Summit 2024
      </h1>

      {/* Organizer - Hidden on Desktop (lg:hidden) to prevent duplication */}
      <div className="flex items-center gap-3 mb-6 lg:hidden">
        <div className="w-12 h-12 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
          <img
            src="./images/admin-avatar.png"
            alt="CreatorX team organizer avatar"
            data-context="Event organizer avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <span className="block text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">CreatorX Team</span>
          <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">12 events hosted</span>
        </div>
        <button className="hidden md:flex px-5 py-2.5 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] border border-[#5B4FE9]/[0.10] hover:bg-[#5B4FE9]/[0.10] transition-colors">
          Follow
        </button>
      </div>

      <p className="text-[15px] md:text-[16px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.7]">
        Join us for the biggest virtual gathering of creators this year. Learn from industry leaders, discover new monetization strategies, and connect with brands looking for authentic partnerships.
      </p>
    </div>
  );

  const renderDetails = () => (
    <div className="mb-6 md:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
        <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04] flex items-center gap-4">
          <div className="w-10 h-10 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
            <Icons.Clock className="w-5 h-5 text-[#5B4FE9]" />
          </div>
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">10:00 AM PST</span>
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Duration: 3 hours</span>
          </div>
        </div>
        <div className="p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04] flex items-center gap-4">
          <div className="w-10 h-10 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
            <Icons.Users className="w-5 h-5 text-[#5B4FE9]" />
          </div>
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">2,340 attending</span>
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Limited spots</span>
          </div>
        </div>
      </div>

      {/* Agenda preview */}
      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Agenda
      </span>
      <div className="space-y-3">
        {[
          { time: "10:00", title: "Opening Keynote: The Future of Creator Economy", speaker: "Sarah Chen, Glossier" },
          { time: "11:00", title: "Workshop: Negotiating with Confidence", speaker: "Jordan Park, CreatorX" },
          { time: "12:00", title: "Panel: Building Long-term Brand Partnerships", speaker: "Multiple creators" },
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] w-14 shrink-0 pt-1">{item.time}</span>
            <div>
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{item.title}</span>
              <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{item.speaker}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendees = () => (
    <div className="mb-6">
      <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
        Who's attending
      </span>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-[#FBF9F6] border-2 border-white overflow-hidden">
              <img
                src={`./images/attendee-${i}.png`}
                alt={`Attendee profile photo ${i}, young creative professional`}
                data-context="Event attendee avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
          +2,336 more creators
        </span>
      </div>
    </div>
  );

  const renderRegisteredState = () => (
    isRegistered && (
      <div className="p-5 rounded-[12px] bg-[#5B4FE9]/[0.06] border border-[#5B4FE9]/[0.10]">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center shrink-0">
            <Icons.Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div className="flex-1">
            <span className="block text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-1">
              You're registered!
            </span>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.6]">
              We'll send you the virtual link 24 hours before the event.
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#5B4FE9] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white hover:bg-[#4B3FE9] transition-colors">
            <Icons.CalendarPlus className="w-4 h-4" />
            Add to calendar
          </button>
          <button className="px-4 py-2.5 rounded-[8px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.20] flex items-center justify-center text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] hover:bg-[#FFB4A2]/[0.12] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  );

  const renderStickyCTA = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40 px-5 pt-4 pb-8">
      {isRegistered ? (
        <div className="flex gap-3">
          <button className="flex-1 py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
            <Icons.Video className="w-4 h-4 text-white" />
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Join event
            </span>
          </button>
          <button className="py-4 px-5 rounded-[14px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] flex items-center justify-center">
            <Icons.X className="w-4 h-4 text-[#E07A5F]" />
          </button>
        </div>
      ) : (
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Ticket className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Register for free
          </span>
        </button>
      )}
    </div>
  );

  const renderDesktopSidebar = () => (
    <div className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* CTA - Moved to Top */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-5">
           {renderRegisteredState()}
           {!isRegistered && (
             <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4B3FE9] transition-colors">
              <Icons.Ticket className="w-4 h-4 text-white" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
                Register for free
              </span>
            </button>
           )}
        </div>

        {/* Organizer Card */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 block">
            Organizer
          </span>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
              <img
                src="./images/admin-avatar.png"
                alt="CreatorX team organizer avatar"
                data-context="Event organizer avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">CreatorX Team</span>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">12 events hosted</span>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-[10px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] border border-[#5B4FE9]/[0.10] hover:bg-[#5B4FE9]/[0.10] transition-colors">
            Follow
          </button>
        </div>

        {/* Attendees Preview */}
        <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 block">
            Attendees
          </span>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-[#FBF9F6] border-2 border-white overflow-hidden">
                <img
                  src={`./images/attendee-${i > 4 ? 1 : i}.png`}
                  alt={`Attendee profile photo`}
                  data-context="Event attendee avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <button className="w-full text-center text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] hover:underline">
            View all 2,340 attendees
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden pb-32 md:pb-0">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[-30px] w-[180px] h-[180px] rounded-full bg-[#8B82F0] opacity-[0.04] blur-[40px]" />
      </div>

      {renderSidebar()}

      <div className="md:ml-64 flex flex-col min-h-screen">
        {renderTopBar()}
        
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                  {renderStatusBar()}
                  {renderHeader()}
                  {renderHero()}
                  {renderTitleSection()}
                  {renderDetails()}
                  
                  {/* Mobile Attendees (Desktop is in sidebar) */}
                  <div className="lg:hidden">
                    {renderAttendees()}
                  </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block lg:col-span-4">
                   {renderDesktopSidebar()}
                </div>
             </div>
          </div>
        </main>
      </div>

      {renderStickyCTA()}
    </div>
  );
};

export default EventDetailScreen;