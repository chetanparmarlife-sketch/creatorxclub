import React from "react";
import * as Icons from "lucide-react";

export interface FinancialLedgerScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the transaction table with default filters and summary cards.
 */
const FinancialLedgerScreen: React.FC<FinancialLedgerScreenProps> = ({ state }) => {
  const transactions = [
    { id: "TXN-2024-001847", date: "Mar 22, 2024 14:32", type: "Escrow Release", from: "Glossier", to: "Maya Chen", amount: "$450.00", fee: "$45.00", net: "$405.00", status: "completed", idempotency: "idem-8f3a9e2d", webhook: "delivered" },
    { id: "TXN-2024-001846", date: "Mar 22, 2024 11:15", type: "Deposit", from: "—", to: "Glossier", amount: "$5,000.00", fee: "$0.00", net: "$5,000.00", status: "completed", idempotency: "idem-7e2b1c4f", webhook: "delivered" },
    { id: "TXN-2024-001845", date: "Mar 20, 2024 09:45", type: "Escrow Release", from: "Rare Beauty", to: "Jordan Park", amount: "$500.00", fee: "$50.00", net: "$450.00", status: "completed", idempotency: "idem-9a4d2e8b", webhook: "delivered" },
    { id: "TXN-2024-001844", date: "Mar 18, 2024 16:20", type: "Platform Fee", from: "—", to: "CreatorX", amount: "$350.00", fee: "$0.00", net: "$350.00", status: "completed", idempotency: "idem-3c5f7a1d", webhook: "pending" },
    { id: "TXN-2024-001843", date: "Mar 15, 2024 10:00", type: "Refund", from: "CreatorX", to: "Away", amount: "$200.00", fee: "-$20.00", net: "$180.00", status: "completed", idempotency: "idem-2b4e6c8a", webhook: "delivered" },
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
          { icon: Icons.MessageSquare, label: "Chat Oversight", active: false },
          { icon: Icons.Wallet, label: "Financial Ledger", active: true },
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
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Financial Ledger</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">All platform transactions and audit trail</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#FBF9F6]">
          <Icons.Filter className="w-4 h-4" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:bg-[#4a41d6]">
          <Icons.Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </header>
  );

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Total Volume (30d)", value: "$284,500", change: "+12%", icon: Icons.BarChart3, color: "#5B4FE9" },
        { label: "Platform Fees", value: "$28,450", change: "+8%", icon: Icons.Percent, color: "#8B82F0" },
        { label: "Refunds Processed", value: "$4,200", change: "-3%", icon: Icons.ArrowUpRight, color: "#E07A5F" },
        { label: "Active Escrows", value: "$67,800", change: "23 campaigns", icon: Icons.Lock, color: "#6B6B7B" },
      ].map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
            <div className="flex items-center justify-between mb-3">
               <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${card.color}10` }}>
                <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <span className={`text-[12px] font-['Plus_Jakarta_Sans'] font-medium ${
                card.change.startsWith("+") ? "text-[#5B4FE9]" : card.change.startsWith("-") ? "text-[#E07A5F]" : "text-[#9B96B0]"
              }`}>
                {card.change}
              </span>
            </div>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider block mb-1">{card.label}</span>
            <span className="block text-[22px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] leading-none">{card.value}</span>
          </div>
        );
      })}
    </div>
  );

  const renderAlertBanner = () => (
    <div className="flex items-center gap-3 p-4 rounded-[12px] bg-[#FFB4A2]/[0.04] border border-[#FFB4A2]/[0.08] mb-6">
      <Icons.AlertTriangle className="w-5 h-5 text-[#E07A5F]" />
      <div className="flex-1">
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
          1 potential duplicate detected
        </span>
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
          {" · "}Idempotency key idem-7e2b1c4f appears similar to idem-7e2b1c4e (processed Mar 21)
        </span>
      </div>
      <button className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F] hover:underline">
        Review
      </button>
    </div>
  );

  const renderTransactionTable = () => (
    <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E4F0] bg-[#FBF9F6]">
              <th className="text-left py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                From → To
              </th>
              <th className="text-right py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Amount
              </th>
              <th className="text-right py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Fee
              </th>
              <th className="text-right py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Net
              </th>
              <th className="text-center py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-4 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Webhook
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[#E8E4F0] last:border-0 hover:bg-[#FBF9F6] transition-colors">
                <td className="py-3.5 px-4">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-mono font-medium text-[#5B4FE9]">
                    {tx.id}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                    tx.type === "Escrow Release" ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]" :
                    tx.type === "Deposit" ? "bg-[#8B82F0]/[0.08] text-[#8B82F0]" :
                    tx.type === "Refund" ? "bg-[#FFB4A2]/[0.08] text-[#E07A5F]" :
                    "bg-[#FBF9F6] text-[#6B6B7B]"
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E]">
                  {tx.from === "—" ? (
                    <span className="text-[#9B96B0]">—</span>
                  ) : (
                    <span>{tx.from}</span>
                  )}
                  <span className="text-[#C4C0D4] mx-1">→</span>
                  <span>{tx.to}</span>
                </td>
                <td className="py-3.5 px-4 text-right text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
                  {tx.amount}
                </td>
                <td className="py-3.5 px-4 text-right text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                  {tx.fee}
                </td>
                <td className="py-3.5 px-4 text-right text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">
                  {tx.net}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="flex items-center justify-center gap-1 text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                    {tx.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`flex items-center gap-1 text-[11px] font-['Plus_Jakarta_Sans'] font-medium ${
                    tx.webhook === "delivered" ? "text-[#5B4FE9]" : "text-[#E07A5F]"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${tx.webhook === "delivered" ? "bg-[#5B4FE9]" : "bg-[#E07A5F]"}`} />
                    {tx.webhook}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-[#E8E4F0]">
        <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
          Showing 1-5 of 1,247 transactions
        </span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0] transition-colors">
            <Icons.ChevronLeft className="w-4 h-4 text-[#6B6B7B]" />
          </button>
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Page 1</span>
          <button className="w-8 h-8 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0] transition-colors">
            <Icons.ChevronRight className="w-4 h-4 text-[#6B6B7B]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderSummaryCards()}
          {renderAlertBanner()}
          {renderTransactionTable()}
        </main>
      </div>
    </div>
  );
};

export default FinancialLedgerScreen;