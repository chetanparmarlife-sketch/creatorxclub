import React from "react";
import * as Icons from "lucide-react";

export interface PhoneEntryScreenProps {
  state: string;
}

/**
 * States:
 * - default: The form is displayed empty, with the country code selector and phone input field ready for user entry.
 * - validationError: The phone number input is filled but invalid, displaying an error message indicating the incorrect format or unsupported region.
 */
const PhoneEntryScreen: React.FC<PhoneEntryScreenProps> = ({ state }) => {
  const renderIllustration = () => (
    <div className="flex justify-center mb-8">
      <div className="w-24 h-24 rounded-[24px] bg-[#5B4FE9]/[0.06] flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-[24px] bg-[#5B4FE9]/[0.04] blur-xl" />
        <Icons.Smartphone className="w-11 h-11 text-[#5B4FE9] relative z-10" strokeWidth={1.5} />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="text-center mb-8">
      <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] md:text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-3">
        What's your number?
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[14px] md:text-[15px] font-light leading-[1.5] text-[#6B6B7B] max-w-[300px] mx-auto">
        We'll send you a code to verify it's really you.
      </p>
    </div>
  );

  const renderInputField = () => (
    <div className="mb-6">
      <div
        className={`flex items-center gap-0 rounded-[16px] bg-white shadow-[0_2px_8px_rgba(91,79,233,0.08)] border ${
          state === "validationError"
            ? "border-[#FECACA] shadow-[0_0_0_4px_rgba(254,202,202,0.3)]"
            : "border-[#5B4FE9]/[0.10]"
        } overflow-hidden transition-all`}
      >
        <button className="flex items-center gap-2 px-5 py-4.5 bg-[#FBF9F6] border-r border-[#D4D0E0] hover:bg-[#F0EDE6] transition-colors">
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">+1</span>
          <Icons.ChevronDown className="w-4 h-4 text-[#9B96B0]" />
        </button>
        <input
          type="tel"
          placeholder="(555) 000-0000"
          className="flex-1 px-5 py-4.5 text-[17px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
          readOnly
          value={state === "validationError" ? "555-01" : ""}
        />
      </div>

      {state === "validationError" && (
        <div className="mt-3 flex items-start gap-2 px-1">
          <Icons.AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-normal text-[#DC2626] leading-[1.5]">
            Please enter a valid 10-digit phone number. This format isn't recognized.
          </span>
        </div>
      )}
    </div>
  );

  const renderPrivacyNote = () => (
    <p className="text-center text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] leading-[1.6] max-w-[320px] mx-auto mb-8">
      By continuing, you agree to receive SMS messages. Message and data rates may apply.
    </p>
  );

  const renderSubmitButton = () => (
    <button
      className={`w-full py-4 rounded-[16px] flex items-center justify-center gap-2 transition-all shadow-md ${
        state === "validationError"
          ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed shadow-none border border-[#E5E7EB]"
          : "bg-[#5B4FE9] text-white hover:shadow-[0_4px_12px_rgba(91,79,233,0.25)]"
      }`}
    >
      <span className="text-[16px] font-['Plus_Jakarta_Sans'] font-semibold">
        Continue
      </span>
      {state !== "validationError" && (
        <Icons.ArrowRight className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Soft gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[#8B82F0] opacity-[0.06] blur-[80px]" />
        <div className="absolute bottom-[-40px] left-[-40px] w-[250px] h-[250px] rounded-full bg-[#FFB4A2] opacity-[0.04] blur-[60px]" />
      </div>


      {/* Desktop Card Container */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_8px_40px_rgba(91,79,233,0.12)] border border-[#E8E4F0]/[0.5] p-8 md:p-10 flex flex-col items-center overflow-hidden">
        {/* Subtle card background mesh */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B4FE9]/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        {renderIllustration()}
        {renderHeader()}
        <div className="w-full">
          {renderInputField()}
        </div>
        {renderPrivacyNote()}
        <div className="w-full">
          {renderSubmitButton()}
        </div>
      </div>
    </div>
  );
};

export default PhoneEntryScreen;