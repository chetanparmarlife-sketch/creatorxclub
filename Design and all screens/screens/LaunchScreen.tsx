import React from "react";
import * as Icons from "lucide-react";

export interface LaunchScreenProps {
  state: string;
}

/**
 * States:
 * - default: Displays the brand logo, tagline, and a loading indicator while the system checks for an existing auth token in AsyncStorage.
 */
const LaunchScreen: React.FC<LaunchScreenProps> = ({ state }) => {
  const renderLogoMark = () => (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] bg-[#5B4FE9] shadow-[0_8px_30px_rgba(91,79,233,0.25)] flex items-center justify-center mb-8 md:mb-10 transition-all duration-500">
      <Icons.Hexagon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
    </div>
  );

  const renderTagline = () => (
    <div className="text-center max-w-[300px] md:max-w-lg px-4">
      <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1A2E] mb-4">
        Creator<span className="text-[#5B4FE9]">X</span>
      </h1>
      <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[20px] font-light leading-[1.6] text-[#6B6B7B]">
        Where creators and brands build{" "}
        <span className="font-['Instrument_Serif'] italic text-[#5B4FE9]">beautiful</span>{" "}
        partnerships.
      </p>
    </div>
  );

  const renderLoadingIndicator = () => (
    <div className="mt-12 md:mt-16 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#5B4FE9] animate-[pulse_1.4s_ease-in-out_infinite]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#5B4FE9] animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#5B4FE9] animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
      </div>
      <span className="text-[12px] md:text-[13px] font-['Plus_Jakarta_Sans'] font-light text-[#9B96B0] tracking-wide">
        Checking for your session...
      </span>
    </div>
  );

  const renderVersionFooter = () => (
    <div className="absolute bottom-8 left-0 right-0 text-center">
      <span className="text-[11px] md:text-[12px] font-['Plus_Jakarta_Sans'] font-light text-[#C4C0D4] tracking-wider">
        v2.4.0 · Soft Studio
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Plus_Jakarta_Sans'] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Soft gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#8B82F0] opacity-[0.08] blur-[100px] md:w-[600px] md:h-[600px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-[#FFB4A2] opacity-[0.06] blur-[80px] md:w-[500px] md:h-[500px]" />
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[500px] h-[500px] rounded-full bg-[#5B4FE9] opacity-[0.03] blur-[120px] md:w-[700px] md:h-[700px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #5B4FE9 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {renderLogoMark()}
        {renderTagline()}
        {state === "default" && renderLoadingIndicator()}
      </div>

      {renderVersionFooter()}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LaunchScreen;