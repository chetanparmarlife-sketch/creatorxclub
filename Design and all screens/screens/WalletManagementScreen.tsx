import React from "react";
import * as Icons from "lucide-react";

export interface WalletManagementScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays balance cards and the transaction history table.
 * - depositModal: A modal is open for entering a deposit amount and processing payment via Razorpay.
 */
const WalletManagementScreen: React.FC<WalletManagementScreenProps> = ({ state }) => {
  const isDepositModal = state === "depositModal";

  const transactions = [
    { id: "TXN-001", date: "Mar 15, 2024", type: "Escrow release", description: "Spring Glow · Maya Chen", amount: "-$450.00", status: "completed" },
    { id: "TXN-002", date: "Mar 12, 2024", type: "Deposit", description: "Razorpay · Card ending 4521", amount: "+$5,000.00", status: "completed" },
    { id: "TXN-003", date: "Mar 08, 2024", type: "Escrow release", description: "Soft Pinch Blush · Jordan Park", amount: "-$500.00", status: "completed" },
    { id: "TXN-004", date: "Mar 01, 2024", type: "Platform fee", description: "Monthly fee adjustment", amount: "-$350.00", status: "completed" },
    { id: "TXN-005", date: "Feb 28, 2024", type: "Deposit", description: "Razorpay · Card ending 4521", amount: "+$10,000.00", status: "completed" },
  ];

  const renderSidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E8E4F0] h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 p-6 mb-6">
        <div className="w-8 h-8 rounded-[10px] bg-[#5B4FE9] flex items-center justify-center flex-shrink-0">
          <Icons.Hexagon className="w-4 h-4 text-white" strokeWidth={2} />
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
          { icon: Icons.Calendar, label: "Events", active: false },
          { icon: Icons.Users, label: "Team", active: false },
          { icon: Icons.Wallet, label: "Wallet", active: true },
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
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">Wallet</h1>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Manage funds and transactions</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-5 py-3 rounded-[12px] bg-[#5B4FE9] text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.ArrowDownLeft className="w-4 h-4" />
          Deposit funds
        </button>
        <button className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center relative">
          <Icons.Bell className="w-5 h-5 text-[#1A1A2E]" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E07A5F]" />
        </button>
        <div className="w-9 h-9 rounded-[10px] bg-[#5B4FE9] overflow-hidden flex items-center justify-center relative">
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

  const renderBalanceCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {[
        { label: "Available Balance", amount: "$24,500.00", change: "+$2,400 this month", color: "#5B4FE9", icon: Icons.Wallet },
        { label: "Allocated to Escrows", amount: "$8,750.00", change: "3 active campaigns", color: "#8B82F0", icon: Icons.Lock },
        { label: "Total Spent", amount: "$142,300.00", change: "Lifetime spend", color: "#6B6B7B", icon: Icons.BarChart3 },
      ].map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${card.color}10` }}>
                <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
                {card.label}
              </span>
            </div>
            <span className="block text-[24px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-1">
              {card.amount}
            </span>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
              {card.change}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderTransactionTable = () => (
    <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">
          Transaction History
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
            <Icons.Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#FBF9F6] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0]">
            <Icons.Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-[#E8E4F0]">
              <th className="text-left py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider whitespace-nowrap">
                Transaction ID
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider whitespace-nowrap">
                Type
              </th>
              <th className="text-left py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider whitespace-nowrap">
                Amount
              </th>
              <th className="text-center py-3 px-3 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B] uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[#E8E4F0] last:border-0 hover:bg-[#FBF9F6] transition-colors">
                <td className="py-3 px-3 text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] whitespace-nowrap">
                  {tx.id}
                </td>
                <td className="py-3 px-3 text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap ${
                    tx.type === "Deposit" ? "bg-[#5B4FE9]/[0.06] text-[#5B4FE9]" :
                    tx.type === "Escrow release" ? "bg-[#FFB4A2]/[0.08] text-[#E07A5F]" :
                    "bg-[#FBF9F6] text-[#6B6B7B]"
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E]">
                  {tx.description}
                </td>
                <td className={`py-3 px-3 text-right text-[14px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap ${
                  tx.amount.startsWith("+") ? "text-[#5B4FE9]" : "text-[#1A1A2E]"
                }`}>
                  {tx.amount}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
                    <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoicesSection = () => (
    <div className="p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
      <h2 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
        Invoices & Tax Documents
      </h2>
      <div className="space-y-3">
        {[
          { name: "Invoice_INV-2024-1847-001.pdf", date: "Mar 22, 2024", size: "245 KB", type: "invoice" },
          { name: "Invoice_INV-2024-1832-001.pdf", date: "Mar 15, 2024", size: "198 KB", type: "invoice" },
          { name: "Tax_Document_2024_Q1.pdf", date: "Mar 01, 2024", size: "1.2 MB", type: "tax" },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FBF9F6] hover:bg-[#E8E4F0] transition-colors min-h-[60px]">
            <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center shrink-0 flex-shrink-0">
              {doc.type === "invoice" ? (
                <Icons.FileText className="w-5 h-5 text-[#5B4FE9]" strokeWidth={1.5} />
              ) : (
                <Icons.Receipt className="w-5 h-5 text-[#8B82F0]" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] truncate">{doc.name}</span>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] mt-0.5">{doc.date} · {doc.size}</span>
            </div>
            <button className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center hover:bg-[#5B4FE9]/[0.06] transition-colors shrink-0 flex-shrink-0">
              <Icons.Download className="w-4 h-4 text-[#6B6B7B]" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-3 rounded-[12px] bg-[#FBF9F6] border border-dashed border-[#E8E4F0] flex items-center justify-center gap-2 text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:bg-[#E8E4F0] transition-colors">
        <Icons.UploadCloud className="w-4 h-4" />
        Upload tax document
      </button>
    </div>
  );

  const renderDepositModal = () => (
    isDepositModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#1A1A2E]/[0.30] backdrop-blur-sm" />
        <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Deposit funds
              </h2>
              <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                Add money to your wallet via Razorpay
              </p>
            </div>
            <button className="w-9 h-9 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center hover:bg-[#E8E4F0]">
              <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
            </button>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Amount
            </label>
            <div className="flex items-center gap-2 p-4 rounded-[14px] bg-[#FBF9F6] border border-[#E8E4F0] focus-within:border-[#5B4FE9] transition-colors">
              <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#6B6B7B] shrink-0">$</span>
              <input
                type="text"
                defaultValue="5,000"
                className="flex-1 min-w-0 text-[32px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9] bg-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {["$1,000", "$5,000", "$10,000", "$25,000"].map((preset) => (
                <button
                  key={preset}
                  className="px-3 py-1.5 rounded-[8px] bg-[#5B4FE9]/[0.06] text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9] hover:bg-[#5B4FE9]/[0.12] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Payment method
            </label>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-4 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.15]">
                <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center">
                  <Icons.CreditCard className="w-5 h-5 text-[#5B4FE9]" />
                </div>
                <div className="text-left">
                  <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Card ending in 4521</span>
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Visa · Expires 09/26</span>
                </div>
                <div className="ml-auto w-5 h-5 rounded-full bg-[#5B4FE9] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-[12px] bg-white border border-[#E8E4F0] hover:border-[#5B4FE9]/[0.30] transition-colors">
                <div className="w-10 h-10 rounded-[8px] bg-[#FBF9F6] flex items-center justify-center">
                  <Icons.Plus className="w-5 h-5 text-[#6B6B7B]" />
                </div>
                <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Add new payment method</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-[10px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-5 flex items-center gap-3">
            <Icons.ShieldCheck className="w-5 h-5 text-[#5B4FE9]" />
            <div>
              <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Secure payment via Razorpay</span>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Your transaction is protected</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
              Cancel
            </button>
            <button className="flex-1 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              Pay $5,000.00
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderBalanceCards()}
          {renderTransactionTable()}
          {renderInvoicesSection()}
        </main>
      </div>

      {renderDepositModal()}
    </div>
  );
};

export default WalletManagementScreen;