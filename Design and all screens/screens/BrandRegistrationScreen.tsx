import React from "react";
import * as Icons from "lucide-react";

export interface BrandRegistrationScreenProps {
  state: string;
}

/**
 * States:
 * - default: The registration form is displayed with empty fields.
 * - validationError: The form is submitted but has validation errors (e.g., weak password, mismatched emails, missing fields), which are highlighted.
 * - success: Registration is successful. Displays a confirmation message stating the account is pending admin verification.
 */
const BrandRegistrationScreen: React.FC<BrandRegistrationScreenProps> = ({ state }) => {
  const hasError = state === "validationError";
  const isSuccess = state === "success";

  const renderLeftPanel = () => (
    <div className="hidden md:flex flex-1 bg-[#5B4FE9] relative overflow-hidden items-center justify-center p-12">
      {/* Gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[#8B82F0] opacity-[0.20] blur-[80px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#FFB4A2] opacity-[0.15] blur-[60px]" />
      </div>

      <div className="relative z-10 max-w-[400px]">
        <div className="w-12 h-12 rounded-[12px] bg-white/[0.15] flex items-center justify-center mb-8">
          <Icons.Hexagon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-white mb-4">
          Partner with authentic{" "}
          <span className="font-['Instrument_Serif'] italic font-normal">voices</span>
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-light leading-[1.6] text-white/70">
          Access vetted creators, manage campaigns end-to-end, and measure real ROI — all in one beautiful workspace.
        </p>

        <div className="mt-10 space-y-4">
          {[
            { icon: Icons.Users, label: "12,000+ verified creators" },
            { icon: Icons.BarChart3, label: "Real-time campaign analytics" },
            { icon: Icons.ShieldCheck, label: "Escrow-protected payments" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-white/[0.10] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white/80" strokeWidth={1.5} />
                </div>
                <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-white/80">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    !isSuccess && (
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 md:py-0 max-w-[480px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-2">
            Create your brand account
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-light text-[#6B6B7B]">
            Start collaborating with creators in minutes.
          </p>
        </div>

        <div className="space-y-5">
          {/* Work email */}
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Work email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className={`w-full px-4 py-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none ${
                hasError ? "border-[#FFB4A2] shadow-[0_0_0_3px_rgba(255,180,162,0.12)]" : "border-[#5B4FE9]/[0.08]"
              }`}
              readOnly
              value={hasError ? "sarah@" : ""}
            />
            {hasError && (
              <span className="mt-1.5 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#E07A5F]">
                Please enter a valid email address
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              className={`w-full px-4 py-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none ${
                hasError ? "border-[#FFB4A2]" : "border-[#5B4FE9]/[0.08]"
              }`}
              readOnly
            />
            {/* Strength indicator */}
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-[#E8E4F0]" />
              ))}
            </div>
            {hasError && (
              <span className="mt-1.5 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#E07A5F]">
                Password is required
              </span>
            )}
          </div>

          {/* Company name */}
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Company name
            </label>
            <input
              type="text"
              placeholder="Your brand or company"
              className="w-full px-4 py-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.08] text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none"
              readOnly
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Tax ID / GST number
            </label>
            <input
              type="text"
              placeholder="For verification"
              className={`w-full px-4 py-3.5 rounded-[12px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] outline-none ${
                hasError ? "border-[#FFB4A2]" : "border-[#5B4FE9]/[0.08]"
              }`}
              readOnly
            />
            {hasError && (
              <span className="mt-1.5 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#E07A5F]">
                Tax ID is required for verification
              </span>
            )}
          </div>

          {/* Document upload */}
          <div>
            <label className="text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E] uppercase tracking-wider mb-2 block">
              Verification documents
            </label>
            <div className={`p-6 rounded-[14px] bg-[#FBF9F6] border-2 border-dashed flex flex-col items-center gap-3 ${
              hasError ? "border-[#FFB4A2]" : "border-[#E8E4F0]"
            }`}>
              <div className="w-12 h-12 rounded-[12px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
                <Icons.UploadCloud className="w-6 h-6 text-[#5B4FE9]" />
              </div>
              <div className="text-center">
                <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
                  Drop files or click to upload
                </span>
                <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">
                  Business registration, tax certificate (PDF, JPG)
                </span>
              </div>
            </div>
            {hasError && (
              <span className="mt-1.5 text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#E07A5F]">
                Please upload verification documents
              </span>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border ${
              hasError ? "bg-white border-[#E07A5F]" : "bg-white border-[#E8E4F0]"
            }`}>
            </div>
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
              I agree to the Terms of Service and Privacy Policy, and confirm I have authority to register this business.
            </span>
          </div>

          <button className={`w-full py-4 rounded-[14px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] ${
            hasError ? "bg-[#E8E4F0]" : "bg-[#5B4FE9]"
          }`}>
            <span className={`text-[15px] font-['Plus_Jakarta_Sans'] font-semibold ${
              hasError ? "text-[#9B96B0]" : "text-white"
            }`}>
              Create account
            </span>
          </button>

          <p className="text-center text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            Already have an account?{" "}
            <button className="font-semibold text-[#5B4FE9]">Sign in</button>
          </p>
        </div>
      </div>
    )
  );

  const renderSuccess = () => (
    isSuccess && (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-16 text-center max-w-[480px] mx-auto w-full">
        <div className="w-20 h-20 rounded-[20px] bg-[#5B4FE9] flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(91,79,233,0.20)]">
          <Icons.Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-3">
          Application received
        </h2>
        <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-light text-[#6B6B7B] leading-[1.6] mb-8">
          We're verifying your business details. You'll receive an email at <span className="font-medium text-[#1A1A2E]">sarah@glossier.com</span> once approved — usually within 24 hours.
        </p>

        <div className="w-full p-5 rounded-[14px] bg-[#FBF9F6] border border-[#E8E4F0] mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#5B4FE9]/[0.06] flex items-center justify-center">
              <Icons.Clock className="w-5 h-5 text-[#5B4FE9]" />
            </div>
            <div className="text-left">
              <span className="block text-[14px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Verification pending</span>
              <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Estimated: 18 hours</span>
            </div>
          </div>
          <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#5B4FE9] rounded-full animate-[progress_2s_ease-out_forwards]" style={{ width: "60%" }} />
          </div>
        </div>

        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)]">
          <Icons.Mail className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Back to sign in
          </span>
        </button>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] flex">
      {renderLeftPanel()}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto">
        {renderForm()}
        {renderSuccess()}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 60%; }
        }
      `}</style>
    </div>
  );
};

export default BrandRegistrationScreen;