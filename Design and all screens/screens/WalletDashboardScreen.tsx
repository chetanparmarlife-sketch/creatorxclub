import React from "react";
import * as Icons from "lucide-react";

export interface WalletDashboardScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the balance cards (Available, Pending, Escrow) and the recent transaction history list/table.
 */
const WalletDashboardScreen: React.FC<WalletDashboardScreenProps> = ({ state }) => {
  const balances = [
    { label: "Available", amount: "$1,245.00", color: "#5B4FE9", bgColor: "#5B4FE9", icon: Icons.Wallet, description: "Ready to withdraw" },
    { label: "Pending", amount: "$630.00", color: "#8B82F0", bgColor: "#8B82F0", icon: Icons.Clock, description: "Clearing in 2-3 days" },
    { label: "In escrow", amount: "$315.00", color: "#E07A5F", bgColor: "#FFB4A2", icon: Icons.Lock, description: "Active campaigns" },
  ];

  const transactions = [
    { id: 1, type: "credit", title: "Glossier — Spring Glow", amount: "+$315.00", date: "Mar 15", status: "available", icon: Icons.ArrowDownLeft },
    { id: 2, type: "debit", title: "Withdrawal to Chase", amount: "-$500.00", date: "Mar 12", status: "completed", icon: Icons.ArrowUpRight },
    { id: 3, type: "credit", title: "Rare Beauty — Blush", amount: "+$450.00", date: "Mar 08", status: "pending", icon: Icons.ArrowDownLeft },
    { id: 4, type: "fee", title: "Platform fee", amount: "-$35.00", date: "Mar 08", status: "completed", icon: Icons.Percent },
    { id: 5, type: "credit", title: "Away — Travel Kit", amount: "+$180.00", date: "Feb 28", status: "available", icon: Icons.ArrowDownLeft },
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
          { icon: Icons.Wallet, label: "Wallet", active: true },
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

  const renderDesktopTopBar = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64 sticky top-0 z-20">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
          Wallet
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
          Your earnings and transactions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Gift className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
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

  const renderBalanceCards = () => {
    const isEscrowCard = (label: string) => label === "In escrow";

    return (
      <div className="px-5 md:px-0 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0 scrollbar-hide">
          {balances.map((balance) => {
            const Icon = balance.icon;
            const useDarkText = isEscrowCard(balance.label);
            return (
              <div
                key={balance.label}
                className={`flex-shrink-0 w-[160px] md:w-auto p-4 md:p-6 rounded-[16px] relative overflow-hidden ${useDarkText ? 'text-[#1A1A2E]' : 'text-white'}`}
                style={{ backgroundColor: balance.bgColor }}
              >
                <div className="absolute inset-0 bg-[#1A1A2E]/[0.08]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${useDarkText ? 'bg-[#1A1A2E]/[0.08]' : 'bg-white/[0.15]'}`}>
                      <Icon className={`w-4 h-4 ${useDarkText ? 'text-[#1A1A2E]' : 'text-white'}`} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-wider ${useDarkText ? 'text-[#1A1A2E]/80' : 'text-white/80'}`}>
                      {balance.label}
                    </span>
                  </div>
                  <span className={`block text-[24px] md:text-[28px] font-['Plus_Jakarta_Sans'] font-bold mb-1 ${useDarkText ? 'text-[#1A1A2E]' : 'text-white'}`}>
                    {balance.amount}
                  </span>
                  <span className={`text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light ${useDarkText ? 'text-[#1A1A2E]/60' : 'text-white/60'}`}>
                    {balance.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWithdrawCTA = () => (
    <div className="px-5 md:px-0 mb-6">
      <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
        <Icons.ArrowUpRight className="w-4 h-4 text-white" />
        <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
          Withdraw $1,245.00
        </span>
      </button>
    </div>
  );

  const renderReferralCard = () => (
    <div className="px-5 md:px-0 mb-6">
      <div className="p-4 rounded-[16px] bg-gradient-to-br from-[#5B4FE9] to-[#8B82F0] shadow-[0_4px_20px_rgba(91,79,233,0.16)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.05]" />
        <div className="absolute top-[-20px] right-[-20px] w-[100px] h-[100px] rounded-full bg-white/[0.08] blur-[30px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[8px] bg-white/[0.15] flex items-center justify-center">
              <Icons.Gift className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-white/80 uppercase tracking-wider">
              Refer & Earn
            </span>
          </div>
          <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-white mb-1">
            Get $50 for every friend
          </span>
          <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-white/70 mb-3">
            Invite friends to CreatorX and earn rewards when they complete KYC
          </span>
          <button className="w-full py-2.5 rounded-[10px] bg-white/[0.15] hover:bg-white/[0.20] transition-colors flex items-center justify-center gap-2">
            <Icons.Gift className="w-4 h-4 text-white" />
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Invite friends
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTransactionHistory = () => (
    <div className="px-5 md:px-0">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider">
          Recent transactions
        </span>
        <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
          View all
        </button>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-2.5">
        {transactions.map((tx) => {
          const Icon = tx.icon;
          const isPositive = tx.type === "credit";

          return (
            <div key={tx.id} className="flex items-center gap-3 p-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.04)] border border-[#5B4FE9]/[0.04]">
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
                isPositive ? "bg-[#5B4FE9]/[0.06]" : tx.type === "fee" ? "bg-[#FFB4A2]/[0.06]" : "bg-[#FBF9F6]"
              }`}>
                <Icon className={`w-4 h-4 ${
                  isPositive ? "text-[#5B4FE9]" : tx.type === "fee" ? "text-[#E07A5F]" : "text-[#6B6B7B]"
                }`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">
                  {tx.title}
                </span>
                <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  {tx.date}
                </span>
              </div>
              <div className="text-right">
                <span className={`block text-[14px] font-['Plus_Jakarta_Sans'] font-bold ${
                  isPositive ? "text-[#5B4FE9]" : "text-[#1A1A2E]"
                }`}>
                  {tx.amount}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-['Plus_Jakarta_Sans'] font-bold ${
                  tx.status === "available" ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]" :
                  tx.status === "pending" ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]" :
                  "bg-[#FBF9F6] text-[#9B96B0]"
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[16px] shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8E4F0] bg-[#FBF9F6]">
              <th className="pl-[52px] pr-6 py-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4F0]">
            {transactions.map((tx) => {
              const Icon = tx.icon;
              const isPositive = tx.type === "credit";
              return (
                <tr key={tx.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${
                        isPositive ? "bg-[#5B4FE9]/[0.06]" : tx.type === "fee" ? "bg-[#FFB4A2]/[0.06]" : "bg-[#FBF9F6]"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isPositive ? "text-[#5B4FE9]" : tx.type === "fee" ? "text-[#E07A5F]" : "text-[#6B6B7B]"
                        }`} strokeWidth={1.5} />
                      </div>
                      <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                        {tx.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold ${
                      tx.status === "available" ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]" :
                      tx.status === "pending" ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]" :
                      "bg-[#FBF9F6] text-[#9B96B0]"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right text-[15px] font-['Plus_Jakarta_Sans'] font-bold ${
                    isPositive ? "text-[#5B4FE9]" : "text-[#1A1A2E]"
                  }`}>
                    {tx.amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
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
          <Icons.Wallet className="w-5 h-5 text-[#5B4FE9]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-1 relative">
          <Icons.User className="w-5 h-5 text-[#9B96B0]" />
          <span className="text-[9px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Profile</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans']">
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {renderSidebar()}
        <div className="flex-1 flex flex-col ml-64">
          {renderDesktopTopBar()}
          <main className="flex-1 p-8">
            {renderBalanceCards()}
            {renderWithdrawCTA()}
            {renderReferralCard()}
            {renderTransactionHistory()}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen relative overflow-hidden pb-28">
        {/* Soft gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5%] right-[-30px] w-[200px] h-[200px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[50px]" />
          <div className="absolute bottom-[20%] left-[-20px] w-[150px] h-[150px] rounded-full bg-[#FFB4A2] opacity-[0.03] blur-[40px]" />
        </div>

        <div className="relative z-10 px-5 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
          <div className="flex items-center gap-1">
            <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
            <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
            <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
          </div>
        </div>

        <div className="relative z-10 px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E]">
              Wallet
            </h1>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icons.Gift className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
              </button>
              <button className="w-10 h-10 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icons.History className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-light text-[#6B6B7B]">
            Your earnings and transactions
          </p>
        </div>

        <div className="relative z-10">
          {renderBalanceCards()}
          {renderWithdrawCTA()}
          {renderReferralCard()}
          {renderTransactionHistory()}
        </div>

        {renderBottomNav()}
      </div>
    </div>
  );
};

export default WalletDashboardScreen;