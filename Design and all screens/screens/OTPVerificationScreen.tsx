import React from "react";
import * as Icons from "lucide-react";

export interface OTPVerificationScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the empty 6-digit input fields, the resend timer, and the edit phone number option.
 * - codeEntered: All 6 digits are filled in. The system indicates it is processing or automatically submitting the code.
 * - invalidCode: Displays an error message stating the code is incorrect, clears the input, and allows the user to try again.
 */
const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ state }) => {
  const digits = state === "default" ? ["", "", "", "", "", ""] : state === "codeEntered" ? ["3", "2", "8", "4", "9", "1"] : ["", "", "", "", "", ""];

  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="w-16 h-16 rounded-[18px] bg-[#5B4FE9]/[0.06] flex items-center justify-center mx-auto mb-6">
        <Icons.Lock className="w-7 h-7 text-[#5B4FE9]" strokeWidth={1.5} />
      </div>
      <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] md:text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-3">
        Enter the code
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[14px] md:text-[15px] font-light leading-[1.5] text-[#6B6B7B]">
        Sent to <span className="font-medium text-[#1A1A2E]">+1 (555) 234-5678</span>
      </p>
    </div>
  );

  const renderCodeInputs = () => (
    <div className="flex justify-center gap-3 md:gap-4 mb-6">
      {digits.map((digit, index) => (
        <div
          key={index}
          className={`w-12 h-14 md:w-14 md:h-16 rounded-[12px] md:rounded-[14px] flex items-center justify-center text-[20px] md:text-[24px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
            state === "invalidCode"
              ? "bg-[#FFB4A2]/[0.08] border-2 border-[#FFB4A2] text-[#E07A5F] animate-[shake_0.5s_ease-in-out]"
              : digit
              ? "bg-[#5B4FE9] text-white shadow-[0_2px_8px_rgba(91,79,233,0.20)]"
              : "bg-white border-2 border-[#E8E4F0] text-[#1A1A2E]"
          }`}
        >
          {digit || ""}
        </div>
      ))}
    </div>
  );

  const renderProcessingState = () => (
    state === "codeEntered" && (
      <div className="flex flex-col items-center gap-4 mb-8 mt-6 animate-[fadeIn_0.3s_ease-out]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-[pulse_1.2s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-[pulse_1.2s_ease-in-out_0.2s_infinite]" />
          <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-[pulse_1.2s_ease-in-out_0.4s_infinite]" />
        </div>
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
          Verifying your code...
        </span>
      </div>
    )
  );

  const renderErrorState = () => (
    state === "invalidCode" && (
      <div className="flex items-center justify-center gap-2 mb-6 animate-[fadeIn_0.3s_ease-out]">
        <Icons.AlertCircle className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#E07A5F] mb-0.5">
            Invalid code
          </p>
          <p className="text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            The code you entered doesn't match. Please try again or request a new one.
          </p>
        </div>
      </div>
    )
  );

  const renderResendSection = () => (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
          Didn't receive it?
        </span>
        <button className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9] hover:underline">
          Resend in 0:42
        </button>
      </div>
      <button className="flex items-center gap-1.5 mx-auto text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B] hover:text-[#1A1A2E] transition-colors">
        <Icons.Pencil className="w-3 h-3" />
        Edit phone number
      </button>
    </div>
  );

  const renderKeyboardHint = () => (
    <div className="mt-auto md:hidden text-center">
      <p className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4]">
        Auto-fill from messages may be available
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-40px] w-[250px] h-[250px] rounded-full bg-[#8B82F0] opacity-[0.05] blur-[60px]" />
      </div>

      {/* Top status bar (Mobile only) */}
      <div className="md:hidden w-full max-w-md absolute top-0 left-0 right-0 px-5 pt-3 pb-1 flex items-center justify-between z-20">
        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#6B6B7B]">9:41</span>
        <div className="flex items-center gap-1">
          <Icons.Signal className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Wifi className="w-3.5 h-3.5 text-[#6B6B7B]" />
          <Icons.Battery className="w-3.5 h-3.5 text-[#6B6B7B]" />
        </div>
      </div>

      {/* Back button (Mobile only) */}
      <div className="md:hidden w-full max-w-md absolute top-10 left-0 right-0 px-5 py-3 z-20">
        <button className="w-9 h-9 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] flex items-center justify-center">
          <Icons.ChevronLeft className="w-4 h-4 text-[#1A1A2E]" />
        </button>
      </div>

      {/* Desktop Card Container */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_8px_40px_rgba(91,79,233,0.12)] border border-[#E8E4F0]/[0.5] p-8 md:p-10 flex flex-col items-center overflow-hidden">
        {/* Subtle card background mesh */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#8B82F0]/[0.03] rounded-full blur-3xl pointer-events-none" />

        {renderHeader()}
        {renderCodeInputs()}
        {/* Hidden input for mobile keypad trigger */}
        {state === "default" && (
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="absolute opacity-0 pointer-events-none w-1 h-1"
            autoFocus
          />
        )}
        {renderProcessingState()}
        {renderErrorState()}
        {renderResendSection()}
        {renderKeyboardHint()}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OTPVerificationScreen;