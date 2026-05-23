import React from "react";
import * as Icons from "lucide-react";

export interface NotificationsScreenProps {
  state: string;
}

/**
 * States:
 * - default: Shows notification list with mixed read/unread items
 * - empty: No notifications state
 * - filterActive: Filtered view showing only specific notification type
 */
const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ state }) => {
  const notifications = state === "empty" ? [] : [
    {
      id: 1,
      type: "campaign",
      title: "New campaign invitation",
      message: "Glossier invited you to apply for Spring Glow Collection Launch",
      timestamp: "2 min ago",
      unread: true,
      accent: "blue",
      icon: Icons.Mail,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      message: "$315.00 has been deposited to your wallet from Rare Beauty campaign",
      timestamp: "1 hour ago",
      unread: true,
      accent: "green",
      icon: Icons.DollarSign,
    },
    {
      id: 3,
      type: "chat",
      title: "New message from Nike",
      message: "Hey! We love your portfolio. When can you start?",
      timestamp: "3 hours ago",
      unread: false,
      accent: "purple",
      icon: Icons.MessageCircle,
      avatar: "./images/nike-avatar.png",
    },
    {
      id: 4,
      type: "system",
      title: "KYC verification approved",
      message: "Your identity verification has been successfully completed",
      timestamp: "Yesterday",
      unread: false,
      accent: "purple",
      icon: Icons.ShieldCheck,
    },
    {
      id: 5,
      type: "campaign",
      title: "Application accepted",
      message: "Congratulations! Lululemon accepted your application for Yoga Flow Challenge",
      timestamp: "2 days ago",
      unread: false,
      accent: "blue",
      icon: Icons.CheckCircle,
    },
    {
      id: 6,
      type: "payment",
      title: "Withdrawal processed",
      message: "Your withdrawal of $500.00 has been processed successfully",
      timestamp: "3 days ago",
      unread: false,
      accent: "green",
      icon: Icons.ArrowUpRight,
    },
  ];

  const filteredNotifications = state === "filterActive" 
    ? notifications.filter(n => n.type === "campaign")
    : notifications;

  const activeFilter = state === "filterActive" ? "Campaigns" : "All";

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case "blue":
        return "bg-[#5B4FE9]/10 text-[#5B4FE9]";
      case "green":
        return "bg-[#10B981]/10 text-[#10B981]";
      case "purple":
        return "bg-[#8B5CF6]/10 text-[#8B5CF6]";
      default:
        return "bg-[#6B6B7B]/10 text-[#6B6B7B]";
    }
  };

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

  const renderDesktopTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div className="flex items-center gap-4">
        <h1 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
          Notifications
        </h1>
        <span className="px-2.5 py-1 rounded-full bg-[#E07A5F] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
          {notifications.filter(n => n.unread).length} new
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] hover:text-[#4B41D9] transition-colors">
          Mark all as read
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

  const renderMobileHeader = () => (
    <div className="md:hidden px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
            Notifications
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B] mt-0.5">
            {notifications.filter(n => n.unread).length} new notifications
          </p>
        </div>
        <button className="px-3 py-2 rounded-[10px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center gap-1.5">
          <Icons.CheckCheck className="w-4 h-4 text-[#5B4FE9]" strokeWidth={1.5} />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
            Mark all read
          </span>
        </button>
      </div>
    </div>
  );

  const renderFilterTabs = () => (
    <div className="flex items-center gap-2 px-5 md:px-8 py-3 overflow-x-auto scrollbar-hide">
      {["All", "Campaigns", "Payments", "System"].map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-full text-[13px] font-['Plus_Jakarta_Sans'] font-medium shrink-0 transition-all ${
            activeFilter === filter
              ? "bg-[#5B4FE9] text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]"
              : "bg-white text-[#6B6B7B] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );

  const renderNotificationItem = (notification: any) => {
    const Icon = notification.icon;
    const accentStyles = getAccentStyles(notification.accent);

    return (
      <div
        key={notification.id}
        className={`relative group flex items-start gap-4 p-4 rounded-[16px] transition-all ${
          notification.unread
            ? "bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
            : "bg-[#FBF9F6]/50 border border-transparent"
        }`}
      >
        {/* Unread indicator */}
        {notification.unread && (
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#5B4FE9]" />
        )}

        {/* Icon or Avatar */}
        {notification.avatar ? (
          <div className="w-12 h-12 rounded-full bg-[#FBF9F6] overflow-hidden shrink-0">
            <img
              src={notification.avatar}
              alt="Sender avatar"
              data-context="Notification sender avatar"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-[12px] ${accentStyles} flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-[14px] font-['Plus_Jakarta_Sans'] font-semibold leading-tight ${
              notification.unread ? "text-[#1A1A2E]" : "text-[#6B6B7B]"
            }`}>
              {notification.title}
            </h3>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0">
              {notification.timestamp}
            </span>
          </div>
          <p className={`text-[13px] font-['Plus_Jakarta_Sans'] font-light leading-[1.5] ${
            notification.unread ? "text-[#6B6B7B]" : "text-[#9B96B0]"
          }`}>
            {notification.message}
          </p>
        </div>

        {/* Swipe indicator (mobile visual) */}
        <div className="md:hidden absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#E07A5F]/10 to-transparent flex items-center justify-end pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icons.ChevronRight className="w-5 h-5 text-[#E07A5F]" />
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    state === "empty" && (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-[20px] bg-[#5B4FE9]/[0.06] flex items-center justify-center mb-5">
          <Icons.BellOff className="w-8 h-8 text-[#5B4FE9]" strokeWidth={1.5} />
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#1A1A2E] mb-2 text-center">
          All caught up!
        </h2>
        <p className="font-['Instrument_Serif'] italic text-[16px] text-[#6B6B7B] text-center leading-[1.5] max-w-md">
          You have no new notifications. We'll let you know when something exciting happens.
        </p>
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
          <div className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#E07A5F] flex items-center justify-center">
            <span className="text-[8px] font-['Plus_Jakarta_Sans'] font-bold text-white">3</span>
          </div>
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

        {/* Filter Tabs */}
        {renderFilterTabs()}

        {/* Notifications List */}
        <main className="flex-1 px-5 md:px-8 pb-28 md:pb-8">
          <div className="space-y-3">
            {filteredNotifications.map(renderNotificationItem)}
          </div>
          {renderEmptyState()}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {renderBottomNav()}
    </div>
  );
};

export default NotificationsScreen;