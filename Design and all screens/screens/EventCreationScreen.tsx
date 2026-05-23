import React from "react";
import * as Icons from "lucide-react";

export interface EventCreationScreenProps {
  state: string;
}

/**
 * States:
 * - default: The event creation form is displayed empty, waiting for user input.
 * - preview: The user has filled the form and is viewing a preview of how the event listing will appear.
 */
const EventCreationScreen: React.FC<EventCreationScreenProps> = ({ state }) => {
  const isPreview = state === "preview";

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
        <button className="p-2 rounded-[8px] hover:bg-[#FBF9F6] transition-colors">
          <Icons.ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
        </button>
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
          {isPreview ? "Preview Event" : "Create Event"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#1A1A2E]">
          Cancel
        </button>
        {isPreview && (
          <>
            <button className="px-6 py-2.5 rounded-[10px] bg-white border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:bg-[#FBF9F6] transition-colors">
              Edit
            </button>
            <button className="px-6 py-2.5 rounded-[10px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Publish Event
            </button>
          </>
        )}
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
      <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
        <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
      </button>
      <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
        {isPreview ? "Preview" : "Create event"}
      </span>
      {isPreview && (
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-2 rounded-[10px] bg-white border border-[#E8E4F0] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
            Edit
          </button>
          <button className="px-4 py-2 rounded-[10px] bg-[#5B4FE9] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Publish
          </button>
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    !isPreview && (
      <div className="space-y-6 md:space-y-8">
        {/* Cover image */}
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Cover image
          </label>
          <button className="w-full aspect-[16/9] rounded-[16px] bg-[#FBF9F6] border-2 border-dashed border-[#E8E4F0] flex flex-col items-center justify-center gap-3 hover:bg-[#F5F2ED] transition-colors">
            <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.Image className="w-6 h-6 text-[#5B4FE9]" />
            </div>
            <div className="text-center">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Upload cover photo</span>
              <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Recommended: 1200 x 675</span>
            </div>
          </button>
        </div>

        {/* Basics */}
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Event details
          </label>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event title"
              className="w-full px-4 py-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] text-[15px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)]"
              readOnly
            />
            <textarea
              placeholder="Describe your event..."
              className="w-full px-4 py-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] text-[15px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#C4C0D4] outline-none focus:border-[#5B4FE9] focus:shadow-[0_0_0_3px_rgba(91,79,233,0.08)] resize-none h-32 leading-[1.6]"
              readOnly
            />
          </div>
        </div>

        {/* Event type */}
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Event type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border-2 border-[#5B4FE9]/[0.20] flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icons.Video className="w-5 h-5 text-[#5B4FE9]" />
              </div>
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Virtual</span>
            </button>
            <button className="p-5 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0] flex flex-col items-center gap-2 hover:bg-[#E8E4F0] transition-colors">
              <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
                <Icons.MapPin className="w-5 h-5 text-[#6B6B7B]" />
              </div>
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Physical</span>
            </button>
          </div>
        </div>

        {/* Date & time */}
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            When
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 px-4 py-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08]">
              <Icons.Calendar className="w-5 h-5 text-[#5B4FE9]" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Mar 15, 2024</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08]">
              <Icons.Clock className="w-5 h-5 text-[#5B4FE9]" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">10:00 AM</span>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
            Capacity
          </label>
          <div className="p-5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08]">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-[28px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">500</span>
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">attendees</span>
            </div>
            <div className="relative h-2 bg-[#E8E4F0] rounded-full">
              <div className="absolute w-[50%] h-full rounded-full bg-[#5B4FE9]" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-5 h-5 rounded-full bg-white shadow-[0_2px_6px_rgba(91,79,233,0.20)] border-2 border-[#5B4FE9]" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">10</span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">1000</span>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderPreview = () => (
    isPreview && (
      <div className="space-y-6">
        <div className="p-5 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] flex items-start gap-3">
          <Icons.Eye className="w-5 h-5 text-[#5B4FE9] shrink-0 mt-0.5" />
          <div>
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] mb-1">Preview mode</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              This is how your event will appear to others. Make any changes before publishing.
            </span>
          </div>
        </div>

        {/* Preview card - matches EventListScreen format */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[100px] bg-[#5B4FE9]/[0.04] flex flex-row md:flex-col items-center justify-center p-4 border-r border-[#E8E4F0] gap-3 md:gap-2">
              <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] leading-none">15</span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0] uppercase tracking-wider mt-1">MAR</span>
            </div>
            <div className="flex-1 p-4 md:p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#8B82F0]/[0.08] text-[9px] font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider text-[#8B82F0]">
                    Virtual
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FBF9F6] text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                    Workshop
                  </span>
                </div>
              </div>
              <h3 className="text-[16px] md:text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-tight mb-2">
                Creator Monetization Masterclass
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Icons.Users className="w-3.5 h-3.5 text-[#9B96B0]" />
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">500 spots</span>
                </div>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  by Maya Chen
                </span>
              </div>
            </div>
          </div>
          <div className="h-[160px] bg-[#FBF9F6]">
            <img
              src="./images/event-preview.png"
              alt="Event cover preview, professional workshop setting with warm lighting"
              data-context="Event creation preview cover image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    )
  );

  const renderCTA = () => (
    !isPreview && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40 px-5 pt-4 pb-8">
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Eye className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Preview event
          </span>
        </button>
      </div>
    )
  );

  const renderDesktopCTA = () => (
    !isPreview && (
      <div className="pt-8 border-t border-[#E8E4F0] flex justify-end gap-4">
        <button className="px-6 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] hover:bg-[#FBF9F6] transition-colors">
          Save as draft
        </button>
        <button className="px-8 py-3 rounded-[12px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4B3FE9] transition-colors">
          <Icons.Eye className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Preview event
          </span>
        </button>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative pb-28 md:pb-0 flex flex-col">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[-30px] w-[150px] h-[150px] rounded-full bg-[#8B82F0] opacity-[0.04] blur-[40px]" />
      </div>

      {renderSidebar()}

      <div className="md:ml-64 flex flex-col min-h-screen">
        {renderTopBar()}
        
        <main className="flex-1 p-5 md:p-8 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-[600px]">
            {renderStatusBar()}
            {renderHeader()}

            <div className="mt-6 md:mt-8">
              {renderForm()}
              {renderPreview()}
            </div>

            {renderCTA()}
            {renderDesktopCTA()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventCreationScreen;