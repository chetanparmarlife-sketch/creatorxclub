import React from "react";
import * as Icons from "lucide-react";

export interface EventDiscoveryScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of available events for sponsorship.
 * - sponsorshipModal: A modal is open allowing the Brand to select a sponsorship tier/amount and proceed to payment.
 */
const EventDiscoveryScreen: React.FC<EventDiscoveryScreenProps> = ({ state }) => {
  const isSponsorshipModal = state === "sponsorshipModal";

  const events = [
    { id: 1, title: "Creator Summit 2024", date: { day: "15", month: "MAR" }, type: "virtual", organizer: "CreatorX Team", attendees: 2340, sponsored: false, image: "./images/event-summit.png", category: "Conference", description: "The biggest virtual gathering of creators this year" },
    { id: 2, title: "Brand Workshop: Beauty", date: { day: "22", month: "MAR" }, type: "virtual", organizer: "Rare Beauty", attendees: 456, sponsored: true, sponsor: "Glossier", image: "./images/event-workshop.png", category: "Workshop", description: "Learn from industry leaders in beauty marketing" },
    { id: 3, title: "Community Meetup: NYC", date: { day: "05", month: "APR" }, type: "physical", organizer: "Maya Chen", attendees: 89, sponsored: false, image: "./images/event-meetup.png", category: "Meetup", description: "In-person networking for NYC-based creators" },
  ];

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
          { icon: Icons.Target, label: "Campaigns", active: false },
          { icon: Icons.Inbox, label: "Applications", active: false },
          { icon: Icons.CheckSquare, label: "Deliverables", active: false },
          { icon: Icons.Package, label: "Inventory", active: false },
          { icon: Icons.Calendar, label: "Events", active: true },
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
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Event Sponsorship</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Discover and sponsor creator events</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#5B4FE9]/[0.06]">
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">1 active sponsorship</span>
        </div>
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
           <img
            src="./images/brand-rep-avatar.png"
            alt="Brand user avatar"
            data-context="Top bar user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );

  const renderFilterBar = () => (
    <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {["All Events", "Virtual", "Physical", "Conferences", "Workshops", "Meetups"].map((filter, index) => (
        <button
          key={filter}
          className={`px-4 py-2.5 rounded-[10px] text-[13px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 transition-colors ${
            index === 0
              ? "bg-[#5B4FE9] text-white"
              : "bg-white text-[#6B6B7B] border border-[#E8E4F0] hover:bg-[#FBF9F6]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );

  const renderEventCard = (event: typeof events[0]) => (
    <div
      key={event.id}
      className="flex flex-col md:flex-row gap-5 p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] hover:shadow-[0_4px_12px_rgba(91,79,233,0.12)] transition-shadow"
    >
      {/* Date block */}
      <div className="w-[72px] h-[72px] rounded-[14px] bg-[#5B4FE9]/[0.04] flex flex-col items-center justify-center shrink-0 border border-[#5B4FE9]/[0.08] mx-auto md:mx-0">
        <span className="text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] leading-none">{event.date.day}</span>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#8B82F0] uppercase tracking-wider mt-1">{event.date.month}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold uppercase tracking-wider ${
                event.type === "virtual" ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]" : "bg-[#FFB4A2]/[0.08] text-[#E07A5F]"
              }`}>
                {event.type}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FBF9F6] text-[10px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                {event.category}
              </span>
              {event.sponsored && (
                <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                  Sponsored by {event.sponsor}
                </span>
              )}
            </div>
            <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">{event.title}</h3>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{event.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <Icons.Users className="w-3.5 h-3.5 text-[#9B96B0]" />
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              {event.attendees.toLocaleString()} attending
            </span>
          </div>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
            by {event.organizer}
          </span>
        </div>
      </div>

      <div className="shrink-0 self-center w-full md:w-auto flex flex-row md:flex-col items-center md:items-stretch justify-center gap-2">
        {event.sponsored ? (
          <div className="flex items-center gap-3 w-full md:text-center">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-[#5B4FE9]/[0.06]">
              <Icons.TrendingUp className="w-3.5 h-3.5 text-[#5B4FE9]" />
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Active</span>
            </div>
            <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#5B4FE9]">
              View analytics
            </button>
          </div>
        ) : (
          <button className="flex-1 md:flex-none px-6 py-3 rounded-[12px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.24)] transition-shadow">
            Sponsor
          </button>
        )}
      </div>
    </div>
  );

  const renderSponsoredEvents = () => (
    <div className="mb-8">
      <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
        Your Sponsorships
      </h2>
      <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
            <img
              src="./images/event-workshop.png"
              alt="Brand Workshop event promotional image"
              data-context="Sponsored event thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Brand Workshop: Beauty</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                Active
              </span>
            </div>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Mar 22, 2024 · Virtual · 456 attending</p>
          </div>
          <span className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] whitespace-nowrap">$2,500</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Impressions", value: "12.4K", change: "+8%" },
            { label: "Clicks", value: "892", change: "+12%" },
            { label: "Registrations", value: "156", change: "+5%" },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-[10px] bg-[#FBF9F6] text-center">
              <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">{metric.value}</span>
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">{metric.change}</span>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSponsorshipModal = () => (
    isSponsorshipModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[520px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Sponsor Creator Summit 2024
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                2,340 attendees expected · Mar 15, 2024
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="mb-2">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
              Select sponsorship tier
            </label>
            <div className="space-y-3">
              {[
                { tier: "Bronze", price: "$1,000", benefits: ["Logo on event page", "Social media mention"], color: "#6B6B7B" },
                { tier: "Silver", price: "$2,500", benefits: ["Logo on event page", "Social media mention", "5-min speaking slot", "Email blast to attendees"], color: "#8B82F0" },
                { tier: "Gold", price: "$5,000", benefits: ["All Silver benefits", "10-min keynote slot", "Booth in virtual expo", "Post-event attendee list"], color: "#5B4FE9", recommended: true },
              ].map((option) => (
                <button
                  key={option.tier}
                  className={`w-full p-4 rounded-[14px] border text-left transition-all ${
                    option.recommended
                      ? "bg-[#5B4FE9]/[0.04] border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)]"
                      : "bg-white border-[#E8E4F0] hover:border-[#5B4FE9]/[0.30]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: option.color }}>
                        {option.recommended && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: option.color }} />}
                      </div>
                      <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">{option.tier}</span>
                      {option.recommended && (
                        <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold" style={{ color: option.color }}>
                      {option.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    {option.benefits.map((benefit) => (
                      <span key={benefit} className="flex items-center gap-1 text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                        <Icons.Check className="w-3 h-3 text-[#5B4FE9]" strokeWidth={3} />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-[10px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-5 flex items-center gap-3">
            <Icons.ShieldCheck className="w-5 h-5 text-[#5B4FE9]" />
            <div>
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Secure payment via Razorpay</span>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Your card details are encrypted</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Proceed to payment
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderFilterBar()}
          {renderSponsoredEvents()}

          <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4">
            Available Events
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {events.map(renderEventCard)}
          </div>
        </main>
      </div>

      {renderSponsorshipModal()}
    </div>
  );
};

export default EventDiscoveryScreen;