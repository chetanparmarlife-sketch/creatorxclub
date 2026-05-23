import React from "react";
import * as Icons from "lucide-react";

export interface ChatInterfaceScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the message thread and the text input area. Normal conversation state.
 * - adminJoined: A "Team CreatorX" system message is visible in the thread, and the admin avatar is present in the header.
 * - sentimentAlert: A banner is visible at the top of the chat indicating that negative sentiment was detected, with an option to flag for help.
 * - escalationMenu: The "Flag for help" or "Escalate to dispute" menu/action is visible or active.
 */
const ChatInterfaceScreen: React.FC<ChatInterfaceScreenProps> = ({ state }) => {
  const messages = [
    {
      id: 1,
      sender: "brand",
      name: "Sarah from Glossier",
      avatar: "./images/brand-rep-avatar.png",
      message: "Hi! We're so excited to work with you on this campaign. The package should arrive by Thursday.",
      time: "2:30 PM",
      date: "Today",
    },
    {
      id: 2,
      sender: "creator",
      name: "You",
      avatar: "./images/creator-avatar.png",
      message: "Thank you! Can't wait to try the new collection. Will share unboxing stories too!",
      time: "2:45 PM",
    },
    {
      id: 3,
      sender: "brand",
      name: "Sarah from Glossier",
      avatar: "./images/brand-rep-avatar.png",
      message: "That sounds perfect! Just remember to tag @glossier and use #GlossierYou #SpringGlow2024",
      time: "3:00 PM",
    },
    {
      id: 4,
      sender: "creator",
      name: "You",
      avatar: "./images/creator-avatar.png",
      message: "Quick question — the tracking shows delivered but I haven't received it yet. Could you double check the address?",
      time: "5:15 PM",
    },
    {
      id: 5,
      sender: "brand",
      name: "Sarah from Glossier",
      avatar: "./images/brand-rep-avatar.png",
      message: "Let me check on that right away. Sometimes there's a delay with the carrier's scan.",
      time: "5:22 PM",
    },
  ];

  const threads = [
    { id: 1, name: "Glossier", lastMsg: "Let me check on that...", time: "5:22 PM", active: true, unread: 0, avatar: "./images/glossier-logo.png" },
    { id: 2, name: "Rare Beauty", lastMsg: "Thanks for the quick submission!", time: "Yesterday", active: false, unread: 2, avatar: "./images/rare-beauty-logo.png" },
    { id: 3, name: "Away", lastMsg: "Travel kit is on its way", time: "Mar 10", active: false, unread: 0, avatar: "./images/away-logo.png" },
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
          { icon: Icons.Compass, label: "Explore", active: false },
          { icon: Icons.Users, label: "Community", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.MessageCircle, label: "Messages", active: true, badge: "3" },
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

      <div className="p-6 border-t border-[#E8E4F0]">
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
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[#9B96B0]">Messages</span>
        <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        <span className="text-[#1A1A2E] font-medium">Glossier</span>
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

  const renderMobileHeader = () => (
    <div className="md:hidden relative z-10">
      <div className="px-5 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
        <div className="flex items-center gap-1">
          <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </div>
      </div>
      <div className="px-5 py-3 flex items-center gap-3 border-b border-[#E8E4F0]">
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
        <div className="w-10 h-10 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
          <img src="./images/glossier-logo.png" alt="Glossier" data-context="Brand avatar mobile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] truncate">Glossier</span>
          <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            {state === "adminJoined" ? (
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9] animate-pulse" />
                Team CreatorX monitoring
              </span>
            ) : (
              "Typically replies in 10 min"
            )}
          </span>
        </div>
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.MoreHorizontal className="w-4 h-4 text-[#1A1A2E]" />
        </button>
      </div>
    </div>
  );

  const renderThreadList = () => (
    <div className="hidden md:flex flex-col w-80 border-r border-[#E8E4F0] bg-white h-full">
      <div className="p-4 border-b border-[#E8E4F0]">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B96B0]" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none"
            readOnly
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={`w-full p-4 flex items-center gap-3 border-b border-[#FBF9F6] hover:bg-[#FBF9F6] transition-colors ${
              thread.active ? "bg-[#5B4FE9]/[0.04]" : ""
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#FBF9F6] overflow-hidden">
                <img src={thread.avatar} alt={thread.name} className="w-full h-full object-cover" />
              </div>
              {thread.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E07A5F] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{thread.unread}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[13px] font-['Plus_Jakarta_Sans'] font-semibold truncate ${thread.active ? "text-[#5B4FE9]" : "text-[#1A1A2E]"}`}>
                  {thread.name}
                </span>
                <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] shrink-0">
                  {thread.time}
                </span>
              </div>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] truncate">
                {thread.lastMsg}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 px-5 md:px-8 py-4 overflow-y-auto">
      <div className="text-center mb-6">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Today</span>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "creator" ? "flex-row-reverse" : ""}`}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-[10px] md:rounded-[12px] bg-[#FBF9F6] overflow-hidden shrink-0">
              <img
                src={msg.avatar}
                alt={msg.sender === "brand" ? "Brand rep" : "Creator"}
                data-context="Chat avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`max-w-[70%] md:max-w-[60%] rounded-[16px] md:rounded-[18px] px-3.5 py-2.5 md:px-5 md:py-3 ${
              msg.sender === "creator"
                ? "bg-[#5B4FE9] text-white rounded-tr-[4px]"
                : "bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04] text-[#1A1A2E] rounded-tl-[4px]"
            }`}>
              <p className="text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-medium leading-[1.5]">
                {msg.message}
              </p>
              <span className={`mt-1 block text-[10px] md:text-[11px] font-['Plus_Jakarta_Sans'] font-light ${
                msg.sender === "creator" ? "text-[#C4C0D4]" : "text-[#9B96B0]"
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {state === "adminJoined" && (
          <div className="flex justify-center py-2">
            <div className="px-4 py-2.5 rounded-full bg-[#5B4FE9]/[0.06] flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#5B4FE9] flex items-center justify-center">
                <Icons.Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                Team CreatorX joined to help
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderInputArea = () => (
    <div className="px-5 md:px-8 py-3 md:py-4 border-t border-[#E8E4F0] bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-2 max-w-3xl mx-auto">
        <button className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
          <Icons.Paperclip className="w-4 h-4 text-[#6B6B7B]" />
        </button>
        <div className="flex-1 flex items-center gap-2 rounded-[12px] bg-[#FBF9F6] px-4 py-2.5 md:py-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#9B96B0] bg-transparent outline-none"
            readOnly
          />
          <button className="w-7 h-7 md:w-8 md:h-8 rounded-[6px] md:rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
            <Icons.Smile className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6B6B7B]" />
          </button>
        </div>
        <button className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center">
          <Icons.Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );

  const renderSentimentAlert = () => (
    state === "sentimentAlert" && (
      <div className="mx-5 md:mx-8 mt-4 p-3 md:p-4 rounded-[12px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.12] flex items-start gap-3 md:gap-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="w-8 h-8 rounded-[8px] bg-[#FFB4A2]/[0.12] flex items-center justify-center shrink-0">
          <Icons.AlertTriangle className="w-4 h-4 text-[#E07A5F]" />
        </div>
        <div className="flex-1">
          <span className="block text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-0.5">
            We noticed some tension
          </span>
          <span className="block text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5] mb-2">
            Our system detected language that suggests frustration. We're here to help if you need it.
          </span>
          <button className="px-3 py-1.5 rounded-[8px] bg-[#5B4FE9] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Flag for help
          </button>
        </div>
        <Icons.X className="w-4 h-4 text-[#9B96B0] shrink-0" />
      </div>
    )
  );

  const renderEscalationMenu = () => {
    if (state !== "escalationMenu") return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full md:w-[400px] bg-white md:rounded-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)] h-[85vh] md:h-auto overflow-y-auto z-10">
          <div className="md:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
            <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
          </div>
           <div className="hidden md:flex justify-end p-4 border-b border-[#E8E4F0]">
             <button className="p-2 rounded-full hover:bg-[#FBF9F6]"><Icons.X className="w-5 h-5 text-[#6B6B7B]"/></button>
           </div>

          <div className="px-5 pt-2 pb-8 md:p-8">
            <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              Need help with this conversation?
            </h2>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-6">
              Our team can mediate or help escalate if needed.
            </p>

            <div className="space-y-2.5">
              <button className="w-full p-4 rounded-[14px] bg-[#5B4FE9]/[0.06] border border-[#5B4FE9]/[0.10] flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-[10px] bg-[#5B4FE9]/[0.08] flex items-center justify-center">
                  <Icons.Shield className="w-5 h-5 text-[#5B4FE9]" />
                </div>
                <div>
                  <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Request mediation</span>
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">A team member will join this chat</span>
                </div>
              </button>

              <button className="w-full p-4 rounded-[14px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10] flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-[10px] bg-[#FFB4A2]/[0.12] flex items-center justify-center">
                  <Icons.AlertTriangle className="w-5 h-5 text-[#E07A5F]" />
                </div>
                <div>
                  <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Escalate to dispute</span>
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Formal resolution process with evidence</span>
                </div>
              </button>

              <button className="w-full p-4 rounded-[14px] bg-white border border-[#E8E4F0] flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
                  <Icons.MessageCircle className="w-5 h-5 text-[#6B6B7B]" />
                </div>
                <div>
                  <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Continue chatting</span>
                  <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">No action needed right now</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative">
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {renderSidebar()}
        <div className="flex-1 flex flex-col ml-64">
          {renderDesktopTopBar()}
          <div className="flex flex-1 h-[calc(100vh-73px)]">
            {renderThreadList()}
            <div className="flex-1 flex flex-col bg-[#FBF9F6]">
              {/* Desktop Chat Header */}
              <div className="px-8 py-4 bg-white border-b border-[#E8E4F0] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FBF9F6] overflow-hidden">
                    <img src="./images/glossier-logo.png" alt="Glossier" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Glossier</h2>
                    <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                      {state === "adminJoined" ? (
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9] animate-pulse" />
                          Team CreatorX monitoring
                        </span>
                      ) : (
                        "Typically replies in 10 min"
                      )}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-[#FBF9F6]">
                  <Icons.MoreHorizontal className="w-5 h-5 text-[#6B6B7B]" />
                </button>
              </div>

              {renderSentimentAlert()}
              {renderMessages()}
              {renderInputArea()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col">
        {renderMobileHeader()}
        {renderSentimentAlert()}
        {renderMessages()}
        {renderInputArea()}
      </div>

      {/* Escalation Menu Overlay */}
      {renderEscalationMenu()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterfaceScreen;