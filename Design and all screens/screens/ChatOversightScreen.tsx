import React from "react";
import * as Icons from "lucide-react";

export interface ChatOversightScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the list of active chat threads with sentiment and flag indicators.
 * - joinedChat: The Admin has joined a specific thread, appearing as "Team CreatorX" with full message history visible.
 */
const ChatOversightScreen: React.FC<ChatOversightScreenProps> = ({ state }) => {
  const isJoined = state === "joinedChat";

  const threads = [
    { id: 1, creator: "Maya Chen", brand: "Glossier", lastMessage: "2 min ago", sentiment: "negative", flagged: "auto", unread: 3 },
    { id: 2, creator: "Jordan Park", brand: "Rare Beauty", lastMessage: "15 min ago", sentiment: "neutral", flagged: null, unread: 0 },
    { id: 3, creator: "Alex Rivera", brand: "Away", lastMessage: "1 hour ago", sentiment: "negative", flagged: "user", unread: 5 },
    { id: 4, creator: "Sam Taylor", brand: "Glossier", lastMessage: "3 hours ago", sentiment: "positive", flagged: null, unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "brand", name: "Sarah from Glossier", text: "Hi! We're so excited to work with you on this campaign.", time: "2:30 PM" },
    { id: 2, sender: "creator", name: "Maya Chen", text: "Thank you! Can't wait to try the new collection.", time: "2:45 PM" },
    { id: 3, sender: "brand", name: "Sarah from Glossier", text: "Just remember to tag @glossier and use the hashtags we discussed.", time: "3:00 PM" },
    { id: 4, sender: "creator", name: "Maya Chen", text: "The tracking shows delivered but I haven't received it yet. Could you double check the address?", time: "5:15 PM" },
    { id: 5, sender: "brand", name: "Sarah from Glossier", text: "Let me check on that right away. Sometimes there's a delay with the carrier's scan.", time: "5:22 PM" },
    { id: 6, sender: "creator", name: "Maya Chen", text: "It's been 3 days now and still nothing. This is really frustrating.", time: "5:30 PM" },
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
        <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
          Admin
        </span>
      </div>

      <nav className="space-y-1 flex-1 px-3">
        {[
          { icon: Icons.LayoutDashboard, label: "Dashboard", active: false },
          { icon: Icons.Shield, label: "KYC Queue", active: false },
          { icon: Icons.Target, label: "Campaign Moderation", active: false },
          { icon: Icons.AlertTriangle, label: "Disputes", active: false },
          { icon: Icons.MessageSquare, label: "Chat Oversight", active: true, badge: 12 },
          { icon: Icons.Wallet, label: "Financial Ledger", active: false },
          { icon: Icons.Database, label: "Compliance", active: false },
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

       <div className="p-4 border-t border-[#E8E4F0]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden">
             <img
              src="./images/admin-avatar.png"
              alt="Admin profile avatar"
              data-context="Sidebar user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">Admin User</span>
            <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">System Admin</span>
          </div>
          <Icons.Settings className="w-4 h-4 text-[#6B6B7B] cursor-pointer" />
        </div>
      </div>
    </aside>
  );

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Chat Oversight</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Monitor and mediate conversations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
          <Icons.Filter className="w-3.5 h-3.5" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
          <Icons.ArrowUpDown className="w-3.5 h-3.5" />
          Sort
        </button>
      </div>
    </header>
  );

  const renderEmptyState = () => (
    !isJoined && (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center rounded-[16px] bg-white border border-[#5B4FE9]/[0.06]">
        <Icons.MessageSquare className="w-16 h-16 text-[#5B4FE9]/20 mb-4" />
        <h3 className="text-[16px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-2">
          Select a chat to monitor
        </h3>
        <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] max-w-xs mx-auto">
          Choose a conversation from the thread list to view messages and mediate if needed.
        </p>
      </div>
    )
  );

  const renderThreadList = () => (
    <div className={`flex flex-col gap-2 ${
      isJoined 
        ? "hidden md:flex md:w-[300px] shrink-0" 
        : "flex w-full max-w-xl mx-auto md:mx-0 md:w-[300px] md:shrink-0"
    }`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Active Threads</h2>
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">4 threads</span>
      </div>
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={`p-3 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border transition-all cursor-pointer ${
            isJoined && thread.id === 1
              ? "border-[#5B4FE9]/[0.20] shadow-[0_2px_8px_rgba(91,79,233,0.08)] ring-1 ring-[#5B4FE9]/[0.10]"
              : "border-[#5B4FE9]/[0.06] hover:border-[#5B4FE9]/[0.12]"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden border-2 border-white">
                <img
                  src="./images/creator-avatar.png"
                  alt="Creator avatar"
                  data-context="Chat thread creator avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden border-2 border-white">
                <img
                  src="./images/glossier-logo.png"
                  alt="Brand logo"
                  data-context="Chat thread brand avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] truncate">
                  {thread.creator} · {thread.brand}
                </span>
                {thread.unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#5B4FE9] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-white">
                    {thread.unread}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {thread.flagged === "auto" && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                  <Icons.Bot className="w-3 h-3" />
                  Auto-flagged
                </span>
              )}
              {thread.flagged === "user" && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB4A2]/[0.10] text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#E07A5F]">
                  <Icons.Hand className="w-3 h-3" />
                  User flagged
                </span>
              )}
              {!thread.flagged && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-medium ${
                  thread.sentiment === "positive" ? "bg-[#5B4FE9]/[0.04] text-[#5B4FE9]" :
                  thread.sentiment === "negative" ? "bg-[#FFB4A2]/[0.06] text-[#E07A5F]" :
                  "bg-[#FBF9F6] text-[#6B6B7B]"
                }`}>
                  {thread.sentiment}
                </span>
              )}
            </div>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">{thread.lastMessage}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatView = () => (
    isJoined && (
      <div className="flex flex-1 flex-col rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden h-full">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8E4F0]">
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            <button className="md:hidden w-8 h-8 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0] -ml-2">
              <Icons.ArrowLeft className="w-4 h-4 text-[#6B6B7B]" />
            </button>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden border-2 border-white">
                <img
                  src="./images/creator-avatar.png"
                  alt="Maya Chen avatar"
                  data-context="Chat view creator avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden border-2 border-white">
                <img
                  src="./images/glossier-logo.png"
                  alt="Glossier logo"
                  data-context="Chat view brand avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Maya Chen · Glossier</span>
              <span className="flex items-center gap-1 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9] animate-pulse" />
                Team CreatorX monitoring
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-[8px] bg-[#FFB4A2]/[0.08] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] hover:bg-[#FFB4A2]/[0.12]">
              Escalate to dispute
            </button>
            <button className="w-8 h-8 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
              <Icons.MoreHorizontal className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FBF9F6]/30">
          {/* System message */}
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-full bg-[#5B4FE9]/[0.06] flex items-center gap-2">
              <Icons.Shield className="w-3.5 h-3.5 text-[#5B4FE9]" />
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                Team CreatorX joined the conversation
              </span>
            </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "creator" ? "flex-row-reverse" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FBF9F6] overflow-hidden shrink-0">
                <img
                  src={msg.sender === "creator" ? "./images/creator-avatar.png" : "./images/brand-rep-avatar.png"}
                  alt={`${msg.name} avatar`}
                  data-context="Chat message avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`max-w-[70%] rounded-[14px] px-3.5 py-2.5 ${
                  msg.sender === "creator"
                    ? "bg-[#5B4FE9] text-white rounded-tr-[4px]"
                    : "bg-white text-[#1A1A2E] rounded-tl-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                }`}
              >
                <span className={`block text-[11px] font-['Plus_Jakarta_Sans'] font-medium mb-1 ${msg.sender === "creator" ? "text-[#C4C0D4]" : "text-[#9B96B0]"}`}>
                  {msg.name}
                </span>
                <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium leading-[1.5]">
                  {msg.text}
                </p>
                <span className={`mt-1 block text-[10px] font-['Plus_Jakarta_Sans'] font-light ${msg.sender === "creator" ? "text-[#C4C0D4]" : "text-[#9B96B0]"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#E8E4F0] bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5B4FE9] flex items-center justify-center shrink-0">
              <Icons.Shield className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              placeholder="Send message as Team CreatorX..."
              className="flex-1 px-4 py-2.5 rounded-[12px] bg-[#FBF9F6] text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] placeholder-[#9B96B0] outline-none focus:border-[#5B4FE9] focus:ring-1 focus:ring-[#5B4FE9]"
            />
            <button className="w-9 h-9 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center hover:bg-[#4a41d6] transition-colors">
              <Icons.Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex gap-4 h-full">
            {renderThreadList()}
            {renderEmptyState()}
            {renderChatView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatOversightScreen;