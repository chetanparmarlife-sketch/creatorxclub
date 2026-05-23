import React from "react";
import * as Icons from "lucide-react";

export interface DigitalContractSigningScreenProps {
  state: string;
}

/**
 * States:
 * - viewMode: Displays the contract terms, Creator signature, and the "Sign" button for the Brand.
 * - signed: The Brand has signed. Displays the confirmation, the signed status, and confirmation of escrow release.
 */
const DigitalContractSigningScreen: React.FC<DigitalContractSigningScreenProps> = ({ state }) => {
  const isSigned = state === "signed";

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
          { icon: Icons.CheckSquare, label: "Deliverables", active: true },
          { icon: Icons.Package, label: "Inventory", active: false },
          { icon: Icons.Calendar, label: "Events", active: false },
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
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b border-[#E8E4F0] ml-0 md:ml-64 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-[#6B6B7B]">
          <span className="hover:text-[#1A1A2E] cursor-pointer">Deliverables</span>
          <Icons.ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1A2E] font-medium">Contract #1847</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#FBF9F6] border border-[#E8E4F0] text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">
          <Icons.Download className="w-4 h-4" />
          Download PDF
        </button>
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

  const renderContractHeader = () => (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-[12px] bg-[#FBF9F6] overflow-hidden">
          <img
            src="./images/glossier-logo.png"
            alt="Glossier brand logo"
            data-context="Contract brand logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-2">
            Spring Glow Collection Launch
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              Campaign #CX-2024-1847
            </span>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              Created Mar 10, 2024
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-[12px] bg-[#FBF9F6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
            <img
              src="./images/creator-avatar.png"
              alt="Maya Chen avatar"
              data-context="Contract creator avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Maya Chen</span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">@mayachencreates</span>
          </div>
        </div>
        <div className="hidden md:block h-8 w-[1px] bg-[#E8E4F0]" />
        <div>
          <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Glossier</span>
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Sarah Chen, Brand Representative</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[14px]" />
      </div>
    </div>
  );

  const renderUsageRightsSummary = () => (
    <div className="p-5 rounded-[14px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] mb-6">
      <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
        <Icons.Shield className="w-4 h-4 text-[#5B4FE9]" />
        Usage Rights Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Exclusivity", value: "No category exclusivity" },
          { label: "Duration", value: "6 months from execution" },
          { label: "Territory", value: "Global, all markets" },
          { label: "Usage", value: "Digital + paid social boost" },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-[10px] bg-white">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">{item.label}</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContractTerms = () => (
    <div className="mb-6">
      <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">
        Full Terms & Conditions
      </h3>
      <div className="relative rounded-[14px] bg-white border border-[#E8E4F0]">
        <div className="p-5 h-64 overflow-y-auto">
          <div className="space-y-4 text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#1A1A2E] leading-[1.7]">
          <p>
            <strong className="font-semibold">1. Content License.</strong> Creator grants Brand a non-exclusive, royalty-free license to use the delivered content for the duration and territory specified above. Brand may use content in organic social media posts, paid advertising, website display, and email marketing.
          </p>
          <p>
            <strong className="font-semibold">2. Payment Terms.</strong> Upon Brand approval of deliverables and execution of this agreement, payment will be released from escrow to Creator within 2 business days. Platform fee of 10% is deducted from Creator payout and 10% added to Brand cost.
          </p>
          <p>
            <strong className="font-semibold">3. Content Standards.</strong> Creator warrants that all content is original, does not infringe third-party rights, and complies with applicable advertising disclosure requirements including FTC guidelines.
          </p>
          <p>
            <strong className="font-semibold">4. Termination.</strong> Either party may terminate this agreement prior to content approval with written notice. Approved content licenses remain valid per terms above regardless of termination.
          </p>
          <p>
            <strong className="font-semibold">5. Dispute Resolution.</strong> Parties agree to mediation through CreatorX platform before pursuing external legal remedies. Platform admin decisions on escrow release are binding.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[14px]" />
      </div>
    </div>
    </div>
  );

  const renderCreatorSignature = () => (
    <div className="p-5 rounded-[14px] bg-white border border-[#E8E4F0] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Creator Signature</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
          <Icons.Check className="w-3 h-3" strokeWidth={3} />
          Signed
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
          <img
            src="./images/creator-avatar.png"
            alt="Maya Chen avatar"
            data-context="Signature creator avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Maya Chen</span>
          <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            Digitally signed Mar 22, 2024 at 2:34 PM PST
          </span>
          <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1">
            Transaction ID: 0x7f3a...9e2d
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[14px]" />
      </div>
    </div>
  );

  const renderBrandSignature = () => (
    <div className="p-5 rounded-[14px] bg-white border border-[#E8E4F0] mb-6">
      {isSigned ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Brand Signature</h3>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              <Icons.Check className="w-3 h-3" strokeWidth={3} />
              Signed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[10px] bg-[#FBF9F6] overflow-hidden">
              <img
                src="./images/brand-rep-avatar.png"
                alt="Sarah Chen avatar"
                data-context="Signature brand avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Sarah Chen</span>
              <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
                Digitally signed Mar 22, 2024 at 3:15 PM PST
              </span>
              <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] mt-1">
                Transaction ID: 0x8b2c...3f1a
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-4">Brand Signature</h3>
          <div className="flex items-center gap-3 p-4 rounded-[10px] bg-[#FBF9F6] cursor-pointer hover:bg-[#5B4FE9]/[0.04] transition-colors">
            <div className="w-6 h-6 rounded-[6px] border-2 border-[#5B4FE9] flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-[2px] bg-[#5B4FE9]" />
            </div>
            <div>
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] mb-1">
                I acknowledge and agree to the terms above
              </span>
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
                By checking this box, I confirm I have authority to bind Glossier to this agreement and authorize the release of $450 from escrow to Maya Chen.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSignedConfirmation = () => (
    isSigned && (
      <div className="p-6 rounded-[16px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.12] mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center">
            <Icons.Check className="w-7 h-7 text-white" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-0.5">
              Contract executed successfully
            </h3>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              Mar 22, 2024 at 3:15 PM PST
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-[#E8E4F0] mb-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-[10px] bg-white">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Escrow released</span>
            <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">$450.00</span>
          </div>
          <div className="p-4 rounded-[10px] bg-white">
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] uppercase tracking-wider mb-1">Creator receives</span>
            <span className="block text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$405.00</span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">After 10% platform fee</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 rounded-[10px] bg-white">
          <Icons.FileText className="w-4 h-4 text-[#5B4FE9]" />
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
            Invoice #INV-2024-1847-001 generated
          </span>
          <button className="ml-auto text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
            Download
          </button>
        </div>
      </div>
    )
  );

  const renderActions = () => (
    !isSigned && (
      <div className="flex flex-col md:flex-row gap-3 pt-6 mt-6 border-t border-[#E8E4F0] sticky bottom-0 bg-[#FBF9F6]/95 backdrop-blur-sm pb-6 md:pb-6 -mx-6 md:-mx-10 px-6 md:px-10 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button className="px-5 py-3 rounded-[12px] bg-white border border-[#E8E4F0] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6B6B7B]">
          Cancel
        </button>
        <button className="px-5 py-3 rounded-[12px] bg-[#FFB4A2]/[0.08] border border-[#FFB4A2]/[0.15] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#E07A5F]">
          Raise dispute
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] bg-[#5B4FE9] text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-white shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.PenTool className="w-4 h-4" />
          Sign and release escrow
        </button>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex flex-col md:flex-row">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0">
        {renderTopBar()}

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-[720px] mx-auto">
            {renderContractHeader()}
            {renderUsageRightsSummary()}
            {renderContractTerms()}
            {renderCreatorSignature()}
            {renderBrandSignature()}
            {renderSignedConfirmation()}
            {renderActions()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalContractSigningScreen;