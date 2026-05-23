import React from "react";
import * as Icons from "lucide-react";

export interface WithdrawalFlowScreenProps {
  state: string;
}

/**
 * States:
 * - amountInput: The user selects a bank account and enters the withdrawal amount.
 * - confirmation: Displays a summary of the withdrawal, fees, and destination bank, asking for final confirmation.
 * - success: Displays the success message, the transaction reference, and the estimated processing time (2-3 business days).
 */
const WithdrawalFlowScreen: React.FC<WithdrawalFlowScreenProps> = ({ state }) => {
  const steps = ["Amount", "Confirm", "Done"];
  const currentStep = state === "amountInput" ? 0 : state === "confirmation" ? 1 : 2;

  const renderStepIndicator = () => (
    <div className="px-5 md:px-0 mb-6">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = state === "success" ? index <= currentStep : index < currentStep;
          const isActive = state !== "success" && index === currentStep;
          
          return (
            <React.Fragment key={step}>
              {index > 0 && (
                <div className={`w-6 h-[2px] rounded-full ${isCompleted ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"}`} />
              )}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted ? "bg-[#5B4FE9]" :
                isActive ? "bg-[#5B4FE9] shadow-[0_0_0_4px_rgba(91,79,233,0.12)]" :
                "bg-[#E8E4F0]"
              }`}>
                {isCompleted ? (
                  <Icons.Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span className={`text-[12px] font-['Plus_Jakarta_Sans'] font-bold ${isActive ? "text-white" : "text-[#9B96B0]"}`}>
                    {index + 1}
                  </span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-center gap-8 mt-2">
        {steps.map((step, index) => (
          <span key={step} className={`text-[11px] font-['Plus_Jakarta_Sans'] font-medium ${index <= currentStep ? "text-[#5B4FE9]" : "text-[#9B96B0]"}`}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );

  const renderAmountInput = () => (
    (state === "amountInput" || state === "confirmation") && (
      <div className="px-5 md:px-0 mb-6">
        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          To account
        </label>
        <div className="p-4 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[10px] bg-[#FBF9F6] flex items-center justify-center">
            <Icons.Landmark className="w-5 h-5 text-[#6B6B7B]" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Chase Checking</span>
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">•••• 4521</span>
          </div>
          <Icons.ChevronRight className="w-4 h-4 text-[#C4C0D4]" />
        </div>

        <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 block">
          Amount
        </label>
        <div className="p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[32px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$</span>
            <input
              type="text"
              className="text-[32px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] bg-transparent outline-none w-full"
              readOnly
              value={state === "confirmation" ? "500" : ""}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
              Available: $1,245.00
            </span>
            <button className="px-3.5 py-1.5 rounded-[6px] bg-[#5B4FE9]/[0.06] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
              Max
            </button>
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-[#FBF9F6] border border-[#E8E4F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Withdrawal amount</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{state === "confirmation" ? "$500.00" : "$0.00"}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Processing fee</span>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">$0.00</span>
          </div>
          <div className="h-[1px] bg-[#E8E4F0] my-2" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">You'll receive</span>
            <span className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">{state === "confirmation" ? "$500.00" : "$0.00"}</span>
          </div>
        </div>
      </div>
    )
  );

  const renderConfirmationDetails = () => (
    state === "confirmation" && (
      <div className="px-5 md:px-0 mb-6">
        <div className="p-4 rounded-[12px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.08] flex items-start gap-3">
          <Icons.ShieldCheck className="w-5 h-5 text-[#5B4FE9] shrink-0 mt-0.5" />
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] mb-0.5">
              Secure transfer
            </span>
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
              Funds will be processed via Razorpay. You'll receive a confirmation email and push notification.
            </span>
          </div>
        </div>
      </div>
    )
  );

  const renderSuccessState = () => (
    state === "success" && (
      <div className="px-5 md:px-0 flex flex-col items-center text-center py-8">
        <div className="w-20 h-20 rounded-[20px] bg-[#5B4FE9] flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(91,79,233,0.20)]">
          <Icons.Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-[22px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-2">
          Withdrawal initiated
        </h2>
        <p className="text-[14px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.6] max-w-[280px] md:max-w-[400px] mb-6">
          Your funds are on the way. You'll receive them in 2-3 business days.
        </p>

        <div className="w-full p-5 rounded-[14px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] mb-6 max-w-[400px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Amount</span>
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">$500.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">To</span>
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Chase •••• 4521</span>
            </div>
            <div className="h-[1px] bg-[#E8E4F0]" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Reference</span>
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">CXW-2024-78432</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Expected arrival</span>
              <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">Mar 18-19</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-[10px] bg-[#5B4FE9]/[0.04] border border-[#5B4FE9]/[0.06] max-w-[400px]">
          <Icons.Mail className="w-4 h-4 text-[#5B4FE9]" />
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            Confirmation sent to maya@email.com
          </span>
        </div>
      </div>
    )
  );

  const renderCTA = () => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#E8E4F0] z-40 px-5 pt-4 pb-8 ${isDesktop ? "md:relative md:bg-transparent md:border-none md:p-0 md:pt-6 md:pb-0" : ""}`}>
        {state === "amountInput" && (
          <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Continue</span>
            <Icons.ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}
        {state === "confirmation" && (
          <div className="space-y-2.5">
            <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
              <Icons.Lock className="w-4 h-4 text-white" />
              <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Confirm & withdraw</span>
            </button>
            <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center">
              <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Cancel</span>
            </button>
          </div>
        )}
        {state === "success" && (
          <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
            <Icons.Wallet className="w-4 h-4 text-white" />
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Back to wallet</span>
          </button>
        )}
      </div>
    );
  };

  // For mobile, we render full screen. For desktop, we render a modal.
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  if (isDesktop) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A1A2E]/[0.40] backdrop-blur-sm p-4">
        <div className="relative w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E]">
                Withdraw Funds
              </h1>
              <button className="w-8 h-8 rounded-full bg-[#FBF9F6] flex items-center justify-center">
                <Icons.X className="w-4 h-4 text-[#6B6B7B]" />
              </button>
            </div>

            {renderStepIndicator()}
            {renderAmountInput()}
            {renderConfirmationDetails()}
            {renderSuccessState()}
            
            <div className="mt-6">
              {state === "amountInput" && (
                <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                  <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Continue</span>
                  <Icons.ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}
              {state === "confirmation" && (
                <div className="space-y-2.5">
                  <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                    <Icons.Lock className="w-4 h-4 text-white" />
                    <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Confirm & withdraw</span>
                  </button>
                  <button className="w-full py-3.5 rounded-[14px] bg-transparent flex items-center justify-center">
                    <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">Cancel</span>
                  </button>
                </div>
              )}
              {state === "success" && (
                <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
                  <Icons.Wallet className="w-4 h-4 text-white" />
                  <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">Back to wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile View (Full Screen)
  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-30px] w-[180px] h-[180px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[40px]" />
      </div>

      {/* Status Bar */}
      <div className="relative z-10 px-5 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
        <div className="flex items-center gap-1">
          <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </div>
      </div>

      {/* Back button */}
      <div className="relative z-10 px-5 py-2">
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
      </div>

      <main className="relative z-10 flex-1 overflow-y-auto">
        {renderStepIndicator()}
        {renderAmountInput()}
        {renderConfirmationDetails()}
        {renderSuccessState()}
      </main>

      {renderCTA()}
    </div>
  );
};

export default WithdrawalFlowScreen;