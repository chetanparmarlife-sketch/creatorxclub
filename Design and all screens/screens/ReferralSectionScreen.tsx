import React from "react";
import * as Icons from "lucide-react";

export interface ReferralSectionScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the unique referral code, copy button, and the list of referred users with their status.
 * - shareSheetOpen: The native share sheet is visible, allowing the user to share their referral link via other apps.
 */
const ReferralSectionScreen: React.FC<ReferralSectionScreenProps> = ({ state }) => {
  const referrals = [
    { id: 1, name: "Alex Chen", avatar: "./images/referral-1.png", status: "completed", reward: "$50.00", date: "Mar 10" },
    { id: 2, name: "Jordan Park", avatar: "./images/referral-2.png", status: "pending", reward: "$50.00", date: "Mar 14" },
    { id: 3, name: "Sam Taylor", avatar: "./images/referral-3.png", status: "pending", reward: "$50.00", date: "Mar 15" },
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
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: false },
          { icon: Icons.MessageCircle, label: "Messages", active: false, badge: 2 },
          { icon: Icons.User, label: "Profile", active: false },
          { icon: Icons.Gift, label: "Referrals", active: true },
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
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div className="flex items-center gap-4">
        <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Referral Program</h1>
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
    <div className="md:hidden px-5 py-4">
      <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-1">
        Invite friends
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
        Earn together, grow together
      </p>
    </div>
  );

  const renderRewardCard = () => (
    <div className="p-5 md:p-8 rounded-[16px] bg-[#5B4FE9] shadow-[0_4px_20px_rgba(91,79,233,0.16)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1A1A2E]/[0.05]" />
      <div className="absolute top-[-20px] right-[-20px] w-[100px] h-[100px] rounded-full bg-white/[0.08] blur-[30px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-[8px] bg-white/[0.15] flex items-center justify-center">
            <Icons.Gift className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-white/80 uppercase tracking-wider">
            Your reward
          </span>
        </div>
        <span className="block text-[32px] md:text-[40px] font-['Plus_Jakarta_Sans'] font-bold text-white mb-1">
          $50
        </span>
        <span className="block text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-light text-white/70 mb-4 md:mb-6">
          For every friend who completes KYC
        </span>

        <div className="p-3 md:p-4 rounded-[10px] md:rounded-[12px] bg-white/[0.10] backdrop-blur-sm flex items-center justify-between">
          <span className="text-[16px] md:text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-white tracking-wider">
            MAYA2024
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-[6px] md:rounded-[8px] bg-white/[0.15] hover:bg-white/[0.20] transition-colors">
            <Icons.Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            <span className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Copy</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderShareButton = () => (
    <div className="mb-6">
      <button className="w-full py-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] flex items-center justify-center gap-2 hover:bg-[#FBF9F6] transition-colors">
        <Icons.Share2 className="w-4 h-4 text-[#5B4FE9]" />
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
          Share your link
        </span>
      </button>
    </div>
  );

  const renderProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
          Your referrals
        </span>
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
          1 of 3 completed
        </span>
      </div>
      <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
        <div className="h-full bg-[#5B4FE9] rounded-full" style={{ width: "33%" }} />
      </div>
      <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1.5">
        2 more friends to unlock $100 bonus
      </span>
    </div>
  );

  const renderReferralList = () => {
    if (referrals.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#FBF9F6] flex items-center justify-center mb-4">
            <Icons.UserPlus className="w-8 h-8 text-[#9B96B0]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-1">No referrals yet</h3>
          <p className="text-[13px] text-[#6B6B7B] max-w-[240px]">
            Share your code with friends to start earning rewards.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] uppercase tracking-wider">
            Referred friends
          </h3>
          <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
            View history
          </button>
        </div>

        <div className="space-y-2.5">
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center gap-3 md:gap-4 p-3.5 md:p-4 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
              <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden shrink-0">
                <img
                  src={referral.avatar}
                  alt={`Headshot portrait of ${referral.name}`}
                  data-context="Small circular user avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">{referral.name}</span>
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  Joined {referral.date}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className={`block text-[13px] md:text-[14px] font-['Plus_Jakarta_Sans'] font-bold ${
                  referral.status === "completed" ? "text-[#5B4FE9]" : "text-[#9B96B0]"
                }`}>
                  {referral.reward}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-['Plus_Jakarta_Sans'] font-medium ${
                  referral.status === "completed"
                    ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]"
                    : "bg-[#FFB4A2]/[0.08] text-[#E07A5F]"
                }`}>
                  {referral.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShareSheet = () => (
    state === "shareSheetOpen" && (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full md:w-[480px] bg-white md:rounded-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
          <div className="hidden md:flex justify-end p-4">
             <button className="p-2 rounded-full hover:bg-[#FBF9F6]"><Icons.X className="w-5 h-5 text-[#6B6B7B]"/></button>
          </div>
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#E8E4F0]" />
          </div>

          <div className="px-5 md:px-8 pt-2 md:pt-4 pb-8">
            <h2 className="text-[18px] md:text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1 text-center">
              Share invite link
            </h2>
            <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mb-6 text-center">
              Friends get $25 off their first campaign fee when they sign up with your code.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { icon: Icons.MessageCircle, label: "Messages", color: "#5B4FE9" },
                { icon: Icons.Mail, label: "Email", color: "#8B82F0" },
                { icon: Icons.Link, label: "Copy link", color: "#6B6B7B" },
                { icon: Icons.MoreHorizontal, label: "More", color: "#6B6B7B" },
              ].map((option, index) => {
                const Icon = option.icon;
                return (
                  <button key={index} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-[16px] bg-[#FBF9F6] flex items-center justify-center transition-transform group-hover:scale-105">
                      <Icon className="w-6 h-6" style={{ color: option.color }} strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                Cancel
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
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden pb-28 md:pb-0">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[-20px] w-[150px] h-[150px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[40px]" />
      </div>

      {renderSidebar()}

      <div className="md:ml-64 flex flex-col min-h-screen">
        {renderTopBar()}

        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column: Promotion */}
            <div className="lg:col-span-4 space-y-6">
              <div className="md:hidden">{renderStatusBar()}</div>
              <div className="md:hidden">{renderHeader()}</div>
              {renderRewardCard()}
              {renderShareButton()}
              {renderProgress()}
            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-8">
               <div className="hidden lg:block mb-6">
                  <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Referral Status</h2>
                  <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Track your invites and earnings</p>
               </div>
               {renderReferralList()}
            </div>
          </div>
        </main>
      </div>

      {renderShareSheet()}
      {renderBottomNav()}
    </div>
  );
};

export default ReferralSectionScreen;