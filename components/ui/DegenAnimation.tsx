"use client";

import React from "react";
import { motion } from "framer-motion";

import Image from "next/image";

// Animated mini-line component that follows SVG paths with gradients
const AnimatedMiniLine = ({ 
  pathData, 
  width, 
  height, 
  duration = 2, 
  delay = 0, 
  gradientColors,
  uniqueId
}: { 
  pathData: string;
  width: number; 
  height: number; 
  duration?: number; 
  delay?: number; 
  gradientColors: { start: string; end: string };
  uniqueId: string;
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          <linearGradient id={`line-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0" />
            <stop offset="50%" stopColor={gradientColors.end} stopOpacity="1" />
            <stop offset="100%" stopColor={gradientColors.start} stopOpacity="0.3" />
          </linearGradient>
          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={gradientColors.end} floodOpacity="0.8" />
          </filter>
        </defs>
        <motion.path
          d={pathData}
          fill="none"
          stroke={`url(#line-gradient-${uniqueId})`}
          strokeWidth="1"
          strokeLinecap="round"
          filter={`url(#glow-${uniqueId})`}
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ 
            pathLength: [0, 0.2, 0.15],
            pathOffset: [0, 1]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
        />
      </svg>
    </div>
  );
};

// Custom rectangular orbit component
const RectangularOrbit = ({ width, height, duration = 4, delay = 0, colors }: { width: number; height: number; duration?: number; delay?: number; colors: { start: string; end: string } }) => {
  // Use a dynamic radius for best appearance
  const radius = Math.min(width, height) / 4;
  // Debug: log radius
  console.log('RectangularOrbit radius:', radius);

  // Calculate the total path length for a rounded rectangle
  const straightSides = 2 * (width + height - 4 * radius);
  const cornerArcs = 2 * Math.PI * radius;
  const pathLength = straightSides + cornerArcs;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          {/* Custom gradient for the trail */}
          <linearGradient id={`trail-gradient-${width}-${height}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="81%" stopColor={colors.start} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.end} stopOpacity="0.5" />
          </linearGradient>

          {/* Custom shadow filter */}
          <filter id={`shadow-${width}-${height}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={colors.start} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Main white border */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={radius * 2}
          ry={radius * 2}
          fill="none"
        />
        {/* Trail animation */}
        <motion.rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={radius * 2}
          ry={radius * 2}
          strokeWidth={1}
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -pathLength }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
        />
        {/* Second trail line */}
        <motion.rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={radius * 2}
          ry={radius * 2}
          fill="none"
          stroke={`url(#trail-gradient-${width}-${height})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={`${pathLength * 0.1} ${pathLength * 0.4}`}
          filter={`url(#shadow-${width}-${height})`}
          initial={{ strokeDashoffset: pathLength * 0.5 }}
          animate={{ strokeDashoffset: -pathLength * 0.5 }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
        />
      </svg>
    </div>
  );
};

export function DegenAnimation() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >

      <div className="flex flex-col absolute top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start ml-10">

          <div className="z-10 flex items-center justify-center rounded-full relative">
            <Icons.lp />
          </div>
          <div className="relative">
            <Image src="/image/lp_line.svg" alt="" width={254} height={89} />
            <AnimatedMiniLine 
              pathData="M254.986 90H120.638C100.88 90 81.9301 82.1509 68.3122 68.3259L0.986328 1"
              width={254} 
              height={89} 
              duration={3} 
              delay={0}
              gradientColors={{ start: "rgb(210 179 25)", end: "rgb(210 179 25)" }}
              uniqueId="lp-line-1"
            />
          </div>
          <div className="relative">
            <Image src="/image/vault_line.svg" alt="" width={254} height={89} />
            <AnimatedMiniLine 
              pathData="M0 90H134.348C154.107 90 173.056 82.1509 186.674 68.3259L254 1"
              width={254} 
              height={89} 
              duration={3} 
              delay={0.5}
              gradientColors={{ start: "rgb(149 69 253)", end: "rgb(149 69 253)" }}
              uniqueId="vault-line-1"
            />
          </div>
          <div className="z-10 flex items-center justify-center rounded-full relative">
            <Icons.vault />
          </div>
        </div>
        <div className="flex items-start">
          <div className="z-10 flex items-center justify-center rounded-full relative -ml-10">
            <Icons.perpetuals />
          </div>
          <div className="flex items-start gap-20">
            <div className="relative">
              <Image src="/image/perpetuals_line.svg" alt="" width={254} height={89} />
              <AnimatedMiniLine 
                pathData="M283 1L-4.41074e-06 0.999975"
                width={254} 
                height={89} 
                duration={3} 
                delay={1}
                gradientColors={{ start: "rgb(68 210 246)", end: "rgb(68 210 246)" }}
                uniqueId="perpetuals-line-1"
              />
            </div>
            <div className="relative">
              <Image src="/image/lend_line.svg" alt="" width={254} height={89} />
              <AnimatedMiniLine 
                pathData="M-4.41074e-06 0.999975L283 1"
                width={254} 
                height={89} 
                duration={3} 
                delay={1.5}
                gradientColors={{ start: "rgb(53 39 202)", end: "rgb(53 39 202)" }}
                uniqueId="lend-line-1"
              />
            </div>
          </div>
          <div className="z-10 flex items-center justify-center rounded-full relative -mr-10">
            <Icons.lend />
          </div>
          
        </div>
        <div className="flex items-start">
          <div className="z-10 flex items-center rounded-full relative">
            <Icons.borrow />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-[254px] h-[89px] relative">
              <Image src="/image/borrow_line.svg" alt="" width={254} height={89} className="absolute -top-[57px] left-[0] w-[254px] h-[89px]"/>
              <div className="absolute -top-[57px] left-[0] w-[254px] h-[89px]">
                <AnimatedMiniLine 
                  pathData="M254.986 1H120.638C101.012 1 82.1899 8.79641 68.3122 22.6741L0.986328 90"
                  width={254} 
                  height={89} 
                  duration={3} 
                  delay={2}
                  gradientColors={{ start: "rgb(254 102 51)", end: "rgb(254 102 51)" }}
                  uniqueId="borrow-line-1"
                />
              </div>
            </div>
            <div className="w-[254px] h-[89px] relative">
              <Image src="/image/convert_line.svg" alt="" width={254} height={89} className="absolute -top-[57px] right-[0] w-[254px] h-[89px]"/>
              <div className="absolute -top-[57px] right-[0] w-[254px] h-[89px]">
                <AnimatedMiniLine 
                  pathData="M0 1H134.348C153.974 1 172.796 8.79641 186.674 22.6741L254 90"
                  width={254} 
                  height={89} 
                  duration={3} 
                  delay={2.5}
                  gradientColors={{ start: "rgb(49 229 133)", end: "rgb(49 229 133)" }}
                  uniqueId="convert-line-1"
                />
              </div>
            </div>
          </div>
          <div className="z-10 flex items-center justify-center rounded-full relative">
            <Icons.convert />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center backdrop-blur-xl rounded-full scale-80">
        <Icons.middle />
      </div>
    </div>
  );
}

const Icons = {
  perpetuals: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[172px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/image/perpetuals.svg" alt="Perpetuals" width={170} height={57} />
      <RectangularOrbit width={172} height={57} duration={8} delay={0} colors={{ start: "rgb(68 210 246)", end: "rgb(68 210 246)" }} />
    </div>
  ),
  middle: () => (
    // Keep OpenAI as is, or replace if you have a custom icon
    <div className="flex items-center justify-center relative h-[112px] w-[400px] rounded-full overflow-hidden">
      <Image src="/image/middle.svg" alt="LP" width={400} height={112} className="relative z-10" />
    </div>
  ),
  lp: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[97px] rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/image/lp.svg" alt="LP" width={97} height={57} className="relative z-10" />
      <RectangularOrbit width={97} height={57} duration={8} delay={1} colors={{ start: "rgb(210 179 25)", end: "rgb(210 179 25)" }} />
    </div>
  ),
  borrow: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[144px] rounded-full overflow-hidden absolute left-1/2 -translate-x-1/2">
      <Image src="/image/borrow.svg" alt="Borrow" width={144} height={57} className="relative z-10" />
      <RectangularOrbit width={144} height={57} duration={8} delay={2} colors={{ start: "rgb(254 102 51)", end: "rgb(254 102 51)" }} />
    </div>
  ),
  vault: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[120px] rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/image/vaultd.svg" alt="Vault" width={120} height={57} className="relative z-10" />
      <RectangularOrbit width={120} height={57} duration={8} delay={3} colors={{ start: "rgb(149 69 253)", end: "rgb(149 69 253)" }} />
    </div>
  ),
  lend: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[120px] rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/image/lendd.svg" alt="Lend" width={120} height={57} className="relative z-10" />
      <RectangularOrbit width={120} height={57} duration={8} delay={4} colors={{ start: "rgb(53 39 202)", end: "rgb(53 39 202)" }} />
    </div>
  ),
  convert: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[147px] rounded-full overflow-hidden absolute left-1/2 -translate-x-1/2">
      <Image src="/image/convert.svg" alt="Convert" width={147} height={57} className="relative z-10" />
      <RectangularOrbit width={147} height={57} duration={8} delay={5} colors={{ start: "rgb(49 229 133)", end: "rgb(49 229 133)" }} />
    </div>
  ),
};
