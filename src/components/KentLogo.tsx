import React from "react";

interface KentLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const KentLogo: React.FC<KentLogoProps> = ({ className = "", size = "md" }) => {
  // Dimension mappings based on size
  const sizeClasses = {
    sm: {
      boxWidth: "w-[110px]",
      kentText: "text-lg",
      middleText: "text-[9px]",
      bottomText: "text-[7px] py-0.5",
      subText: "text-[7px] mt-0.5 tracking-[0.12em]",
      middlePy: "py-0.5"
    },
    md: {
      boxWidth: "w-[130px]",
      kentText: "text-xl md:text-2xl",
      middleText: "text-[10px] md:text-xs",
      bottomText: "text-[8px] md:text-[9px] py-1",
      subText: "text-[8px] md:text-[10px] mt-1 tracking-[0.15em]",
      middlePy: "py-1"
    },
    lg: {
      boxWidth: "w-[180px]",
      kentText: "text-3xl md:text-4xl",
      middleText: "text-sm md:text-base",
      bottomText: "text-xs md:text-sm py-1.5",
      subText: "text-xs md:text-sm mt-1.5 tracking-[0.2em]",
      middlePy: "py-1.5"
    }
  }[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Outer box */}
      <div className={`bg-[#12317a] border-2 border-[#12317a] rounded-lg overflow-hidden flex flex-col ${sizeClasses.boxWidth} shadow-md`}>
        {/* Top Segment: KENT */}
        <div className="bg-[#12317a] text-white py-1 flex items-center justify-center">
          <span className={`font-black tracking-tight font-sans leading-none ${sizeClasses.kentText}`}>
            KENT
          </span>
        </div>
        
        {/* Middle Segment: Mineral RO */}
        <div className={`bg-[#e0f2fe] ${sizeClasses.middlePy} px-1 flex items-center justify-center relative overflow-hidden border-y border-[#12317a]`}>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100 opacity-90" />
          <span className={`relative z-10 font-bold font-sans text-[#12317a] italic tracking-tight leading-none ${sizeClasses.middleText}`}>
            Mineral RO<sup className="text-[5px] md:text-[7px] not-italic font-bold ml-0.5">TM</sup>
          </span>
        </div>
        
        {/* Bottom Segment: Water Purifiers */}
        <div className={`bg-[#12317a] text-white ${sizeClasses.bottomText} px-1 flex items-center justify-center`}>
          <span className="font-bold font-sans uppercase tracking-wider text-center leading-none">
            Water Purifiers
          </span>
        </div>
      </div>
      
      {/* Footer Text: HOUSE of PURITY */}
      <span className={`text-[#e01979] font-black uppercase text-center whitespace-nowrap font-sans ${sizeClasses.subText}`}>
        HOUSE of PURITY
      </span>
    </div>
  );
};
