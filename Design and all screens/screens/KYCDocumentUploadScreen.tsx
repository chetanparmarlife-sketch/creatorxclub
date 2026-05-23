import React from "react";
import * as Icons from "lucide-react";

export interface KYCDocumentUploadScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the initial screen with document type guidance and the option to start capturing the front of the ID.
 * - reviewImages: All required images (ID front, ID back, Selfie) have been captured and are displayed in a review grid with retake options.
 * - uploading: The submission process is active, showing a progress bar or compression status as files are uploaded to Supabase Storage.
 * - readOnly: The user's KYC is pending review. The screen is in a read-only state, indicating they cannot apply to campaigns yet.
 */
const KYCDocumentUploadScreen: React.FC<KYCDocumentUploadScreenProps> = ({ state }) => {
  const steps = [
    { id: "front", label: "Front of ID", icon: Icons.CreditCard },
    { id: "back", label: "Back of ID", icon: Icons.CreditCard },
    { id: "selfie", label: "Selfie", icon: Icons.User },
  ];

  const completedSteps = state === "default" ? [] : state === "reviewImages" || state === "uploading" || state === "readOnly" ? ["front", "back", "selfie"] : [];

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
          { icon: Icons.User, label: "Profile", active: true },
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

  const renderDesktopTopBar = () => (
    <header className="hidden md:flex items-center gap-8 px-8 py-4 bg-white border-b border-[#E8E4F0] ml-64">
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-[12px] bg-[#FBF9F6] border-transparent">
          <Icons.Search className="w-4 h-4 text-[#9B96B0]" />
          <input
            type="text"
            placeholder="Search campaigns, brands..."
            className="flex-1 min-w-0 text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] placeholder-[#C4C0D4] bg-transparent outline-none"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
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

  const renderProgressHeader = () => (
    <div className="mb-6">
      <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] md:text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A2E] mb-2">
        {state === "readOnly" ? "Verification in progress" : "Verify your identity"}
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-light leading-[1.5] text-[#6B6B7B]">
        {state === "readOnly"
          ? "Your documents are being reviewed. You'll be notified within 24 hours."
          : "We need to verify who you are before you can start earning. This keeps our community safe."}
      </p>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = !isCompleted && (index === completedSteps.length);
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div className={`w-8 h-[2px] rounded-full ${
                  isCompleted ? "bg-[#5B4FE9]" : "bg-[#E8E4F0]"
                }`} />
              )}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                  isCompleted
                    ? "bg-[#5B4FE9]"
                    : isCurrent
                    ? "bg-[#5B4FE9] shadow-[0_0_0_4px_rgba(91,79,233,0.12)]"
                    : "bg-[#E8E4F0]"
                }`}>
                  {isCompleted ? (
                    <Icons.Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? "text-white" : "text-[#9B96B0]"}`} strokeWidth={1.5} />
                  )}
                </div>
                <span className={`text-[10px] font-['Plus_Jakarta_Sans'] font-medium ${
                  isCompleted || isCurrent ? "text-[#1A1A2E]" : "text-[#9B96B0]"
                }`}>
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
  );

  const renderCaptureFrame = () => (
    state === "default" && (
      <div className="mb-6">
        <div className="relative aspect-[3/4] max-w-[280px] md:max-w-[320px] mx-auto rounded-[20px] bg-[#1A1A2E] overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/40 rounded-tl-[8px]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/40 rounded-tr-[8px]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/40 rounded-bl-[8px]" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/40 rounded-br-[8px]" />

          {/* Center guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-32 border border-white/20 rounded-[8px] flex items-center justify-center">
              <Icons.CreditCard className="w-12 h-12 text-white/20" strokeWidth={1} />
            </div>
          </div>

          {/* Bottom instruction */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-white/80">
              Position front of ID in frame
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 px-4">
          <div className="w-8 h-8 rounded-[8px] bg-[#5B4FE9]/[0.06] flex items-center justify-center shrink-0">
            <Icons.ShieldCheck className="w-4 h-4 text-[#5B4FE9]" />
          </div>
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] mb-0.5">
              Your data is secure
            </span>
            <span className="block text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
              Documents are encrypted and only used for verification. They are never shared with brands.
            </span>
          </div>
        </div>
      </div>
    )
  );

  const renderReviewGrid = () => (
    (state === "reviewImages" || state === "uploading") && (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "front", label: "Front of ID", image: "./images/id-front.png" },
            { id: "back", label: "Back of ID", image: "./images/id-back.png" },
            { id: "selfie", label: "Selfie verification", image: "./images/selfie.png" },
          ].map((item) => (
            <div key={item.id} className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] overflow-hidden">
              <div className="aspect-[16/10] bg-[#FBF9F6] relative group cursor-pointer hover:bg-[#E8E4F0] transition-colors">
                <img
                  src={item.image}
                  alt={item.id === "selfie" 
                    ? "Headshot photo of a young woman in her 20s, neutral expression, plain light background, clear facial features for identity verification, soft even lighting"
                    : "Close-up photograph of a government-issued identification card showing personal details, placed on a flat surface, clear legible text, neutral lighting"
                  }
                  data-context={item.id === "selfie" ? "KYC selfie verification photo" : "KYC ID document scan"}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-[8px] bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-white transition-colors">
                  <Icons.RotateCcw className="w-4 h-4 text-[#1A1A2E]" />
                </button>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <Icons.Check className="w-4 h-4 text-[#5B4FE9]" strokeWidth={3} />
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">Captured</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderUploadProgress = () => (
    state === "uploading" && (
      <div className="mb-6 p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Uploading documents</span>
          <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#5B4FE9]">68%</span>
        </div>
        <div className="h-2 bg-[#E8E4F0] rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#5B4FE9] rounded-full animate-[progress_2s_ease-out_forwards]" style={{ width: "68%" }} />
        </div>
        <div className="flex items-center gap-2">
          <Icons.Zap className="w-3 h-3 text-[#8B82F0]" />
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">
            Compressing images for secure transfer...
          </span>
        </div>
      </div>
    )
  );

  const renderReadOnlyState = () => (
    state === "readOnly" && (
      <div className="mb-6">
        <div className="rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06] p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[16px] bg-[#FFB4A2]/[0.08] flex items-center justify-center mb-4">
            <Icons.Clock className="w-7 h-7 text-[#E07A5F]" />
          </div>
          <h2 className="text-[18px] font-['Plus_Jakarta_Sans'] font-bold text-[#1A1A2E] mb-2">
            Under review
          </h2>
          <p className="text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.6] max-w-[240px] mb-4">
            Our team is verifying your documents. This usually takes less than 24 hours.
          </p>
          <div className="px-4 py-2 rounded-full bg-[#5B4FE9]/[0.06] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5B4FE9] animate-pulse" />
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#5B4FE9]">
              Estimated: 18 hours remaining
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-[12px] bg-[#FFB4A2]/[0.06] border border-[#FFB4A2]/[0.10] flex items-start gap-3">
          <Icons.Lock className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
          <div>
            <span className="block text-[13px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E] mb-0.5">
              Limited access until verified
            </span>
            <span className="block text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B] leading-[1.5]">
              You can browse campaigns but cannot apply. Complete verification to unlock full earning potential.
            </span>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-[16px] bg-white shadow-[0_1px_3px_rgba(91,79,233,0.06)] border border-[#5B4FE9]/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Icons.History className="w-4 h-4 text-[#5B4FE9]" />
            <span className="text-[13px] font-['Plus_Jakarta_Sans'] font-semibold text-[#1A1A2E]">Submission timeline</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#5B4FE9] mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">Documents submitted</span>
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">Today, 2:34 PM</span>
                </div>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#6B6B7B]">All required documents uploaded successfully</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E8E4F0] mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-medium text-[#9B96B0]">Under review</span>
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Pending</span>
                </div>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0]">Verification team is reviewing your documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderCTA = () => (
    <div className="mt-6 md:mt-8">
      {state === "default" && (
        <>
          <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
            <Icons.Camera className="w-4 h-4 text-white" />
            <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
              Capture front of ID
            </span>
          </button>
          <button className="w-full mt-3 py-3 rounded-[14px] bg-white border-2 border-[#E8E4F0] flex items-center justify-center gap-2 hover:bg-[#FBF9F6] transition-colors">
            <Icons.Upload className="w-4 h-4 text-[#1A1A2E]" />
            <span className="text-[14px] font-['Plus_Jakarta_Sans'] font-medium text-[#1A1A2E]">
              Upload from device
            </span>
          </button>
        </>
      )}
      {state === "reviewImages" && (
        <button className="w-full py-4 rounded-[14px] bg-[#5B4FE9] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(91,79,233,0.16)] hover:shadow-[0_4px_12px_rgba(91,79,233,0.20)] transition-shadow">
          <Icons.UploadCloud className="w-4 h-4 text-white" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-white">
            Submit for verification
          </span>
        </button>
      )}
      {state === "uploading" && (
        <button className="w-full py-4 rounded-[14px] bg-[#E8E4F0] flex items-center justify-center gap-2 cursor-not-allowed" disabled>
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#9B96B0]">
            Uploading...
          </span>
        </button>
      )}
      {state === "readOnly" && (
        <button className="w-full py-4 rounded-[14px] bg-white border-2 border-[#5B4FE9]/[0.12] flex items-center justify-center gap-2 hover:bg-[#FBF9F6] transition-colors">
          <Icons.Compass className="w-4 h-4 text-[#5B4FE9]" />
          <span className="text-[15px] font-['Plus_Jakarta_Sans'] font-semibold text-[#5B4FE9]">
            Browse campaigns
          </span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Sidebar (Desktop) */}
      {renderSidebar()}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) */}
        {renderDesktopTopBar()}

        {/* Centered Content Area */}
        <main className="flex-1 flex items-center justify-center p-5 md:p-8">
          <div className="w-full max-w-4xl relative z-10">
            <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E8E4F0] p-6 md:p-10">
              {renderProgressHeader()}
              {renderStepIndicator()}
              {renderCaptureFrame()}
              {renderReviewGrid()}
              {renderUploadProgress()}
              {renderReadOnlyState()}
              {renderCTA()}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 68%; }
        }
      `}</style>
    </div>
  );
};

export default KYCDocumentUploadScreen;