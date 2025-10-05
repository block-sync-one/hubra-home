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
  uniqueId,
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
      <svg className="absolute inset-0" height={height} width={width}>
        <defs>
          <linearGradient id={`line-gradient-${uniqueId}`} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0" />
            <stop offset="50%" stopColor={gradientColors.end} stopOpacity="1" />
            <stop offset="100%" stopColor={gradientColors.start} stopOpacity="0.3" />
          </linearGradient>
          <filter height="200%" id={`glow-${uniqueId}`} width="200%" x="-50%" y="-50%">
            <feDropShadow dx="0" dy="0" floodColor={gradientColors.end} floodOpacity="0.8" stdDeviation="3" />
          </filter>
        </defs>
        <motion.path
          animate={{
            pathLength: [0, 0.2, 0.15],
            pathOffset: [0, 1],
          }}
          d={pathData}
          fill="none"
          filter={`url(#glow-${uniqueId})`}
          initial={{ pathLength: 0, pathOffset: 0 }}
          stroke={`url(#line-gradient-${uniqueId})`}
          strokeLinecap="round"
          strokeWidth="1"
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
const RectangularOrbit = ({
  width,
  height,
  duration = 4,
  delay = 0,
  colors,
}: {
  width: number;
  height: number;
  duration?: number;
  delay?: number;
  colors: { start: string; end: string };
}) => {
  // Use a dynamic radius for best appearance
  const radius = Math.min(width, height) / 4;

  // Debug: log radius
  console.log("RectangularOrbit radius:", radius);

  // Calculate the total path length for a rounded rectangle
  const straightSides = 2 * (width + height - 4 * radius);
  const cornerArcs = 2 * Math.PI * radius;
  const pathLength = straightSides + cornerArcs;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="absolute inset-0" height={height} width={width}>
        <defs>
          {/* Custom gradient for the trail */}
          <linearGradient id={`trail-gradient-${width}-${height}`} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="81%" stopColor={colors.start} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.end} stopOpacity="0.5" />
          </linearGradient>

          {/* Custom shadow filter */}
          <filter height="200%" id={`shadow-${width}-${height}`} width="200%" x="-50%" y="-50%">
            <feDropShadow dx="0" dy="0" floodColor="#000000" floodOpacity="0.3" stdDeviation="3" />
            <feDropShadow dx="0" dy="0" floodColor={colors.start} floodOpacity="0.4" stdDeviation="2" />
          </filter>
        </defs>

        {/* Main white border */}
        <rect fill="none" height={height} rx={radius * 2} ry={radius * 2} width={width} x={0} y={0} />
        {/* Trail animation */}
        <motion.rect
          animate={{ strokeDashoffset: -pathLength }}
          fill="none"
          height={height}
          initial={{ strokeDashoffset: 0 }}
          rx={radius * 2}
          ry={radius * 2}
          strokeWidth={1}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
          width={width}
          x={0}
          y={0}
        />
        {/* Second trail line */}
        <motion.rect
          animate={{ strokeDashoffset: -pathLength * 0.5 }}
          fill="none"
          filter={`url(#shadow-${width}-${height})`}
          height={height}
          initial={{ strokeDashoffset: pathLength * 0.5 }}
          rx={radius * 2}
          ry={radius * 2}
          stroke={`url(#trail-gradient-${width}-${height})`}
          strokeDasharray={`${pathLength * 0.1} ${pathLength * 0.4}`}
          strokeLinecap="round"
          strokeWidth="1"
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
          width={width}
          x={0}
          y={0}
        />
      </svg>
    </div>
  );
};

export function DegenAnimation() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="flex flex-col absolute top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start ml-10">
          <div className="z-10 flex items-center justify-center rounded-full relative">
            <Icons.lp />
          </div>
          <div className="relative">
            <Image alt="" height={89} src="/image/lp_line.svg" width={254} />
            <AnimatedMiniLine
              delay={0}
              duration={3}
              gradientColors={{
                start: "rgb(210 179 25)",
                end: "rgb(210 179 25)",
              }}
              height={89}
              pathData="M254.986 90H120.638C100.88 90 81.9301 82.1509 68.3122 68.3259L0.986328 1"
              uniqueId="lp-line-1"
              width={254}
            />
          </div>
          <div className="relative">
            <Image alt="" height={89} src="/image/vault_line.svg" width={254} />
            <AnimatedMiniLine
              delay={0.5}
              duration={3}
              gradientColors={{
                start: "rgb(149 69 253)",
                end: "rgb(149 69 253)",
              }}
              height={89}
              pathData="M0 90H134.348C154.107 90 173.056 82.1509 186.674 68.3259L254 1"
              uniqueId="vault-line-1"
              width={254}
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
              <Image alt="" height={89} src="/image/perpetuals_line.svg" width={254} />
              <AnimatedMiniLine
                delay={1}
                duration={3}
                gradientColors={{
                  start: "rgb(68 210 246)",
                  end: "rgb(68 210 246)",
                }}
                height={89}
                pathData="M283 1L-4.41074e-06 0.999975"
                uniqueId="perpetuals-line-1"
                width={254}
              />
            </div>
            <div className="relative">
              <Image alt="" height={89} src="/image/lend_line.svg" width={254} />
              <AnimatedMiniLine
                delay={1.5}
                duration={3}
                gradientColors={{
                  start: "rgb(53 39 202)",
                  end: "rgb(53 39 202)",
                }}
                height={89}
                pathData="M-4.41074e-06 0.999975L283 1"
                uniqueId="lend-line-1"
                width={254}
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
              <Image
                alt=""
                className="absolute -top-[57px] left-[0] w-[254px] h-[89px]"
                height={89}
                src="/image/borrow_line.svg"
                width={254}
              />
              <div className="absolute -top-[57px] left-[0] w-[254px] h-[89px]">
                <AnimatedMiniLine
                  delay={2}
                  duration={3}
                  gradientColors={{
                    start: "rgb(254 102 51)",
                    end: "rgb(254 102 51)",
                  }}
                  height={89}
                  pathData="M254.986 1H120.638C101.012 1 82.1899 8.79641 68.3122 22.6741L0.986328 90"
                  uniqueId="borrow-line-1"
                  width={254}
                />
              </div>
            </div>
            <div className="w-[254px] h-[89px] relative">
              <Image
                alt=""
                className="absolute -top-[57px] right-[0] w-[254px] h-[89px]"
                height={89}
                src="/image/convert_line.svg"
                width={254}
              />
              <div className="absolute -top-[57px] right-[0] w-[254px] h-[89px]">
                <AnimatedMiniLine
                  delay={2.5}
                  duration={3}
                  gradientColors={{
                    start: "rgb(49 229 133)",
                    end: "rgb(49 229 133)",
                  }}
                  height={89}
                  pathData="M0 1H134.348C153.974 1 172.796 8.79641 186.674 22.6741L254 90"
                  uniqueId="convert-line-1"
                  width={254}
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
    <div className="flex items-center justify-center relative h-[57px] w-[172px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image alt="Perpetuals" height={57} src="/image/perpetuals.svg" width={170} />
      <RectangularOrbit colors={{ start: "rgb(68 210 246)", end: "rgb(68 210 246)" }} delay={0} duration={8} height={57} width={172} />
    </div>
  ),
  middle: () => (
    // Keep OpenAI as is, or replace if you have a custom icon
    <div className="flex items-center justify-center relative h-[96px] w-[320px] rounded-full overflow-hidden">
      <Image alt="LP" className="relative z-10" height={96} src="/image/middle.svg" width={320} />
    </div>
  ),
  lp: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[97px] rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image alt="LP" className="relative z-10" height={57} src="/image/lp.svg" width={97} />
      <RectangularOrbit colors={{ start: "rgb(210 179 25)", end: "rgb(210 179 25)" }} delay={1} duration={8} height={57} width={97} />
    </div>
  ),
  borrow: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[144px] rounded-full overflow-hidden left-1/2 -translate-x-1/2">
      <Image alt="Borrow" className="relative z-10" height={57} src="/image/borrow.svg" width={144} />
      <RectangularOrbit colors={{ start: "rgb(254 102 51)", end: "rgb(254 102 51)" }} delay={2} duration={8} height={57} width={144} />
    </div>
  ),
  vault: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[120px] rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image alt="Vault" className="relative z-10" height={57} src="/image/vaultd.svg" width={120} />
      <RectangularOrbit colors={{ start: "rgb(149 69 253)", end: "rgb(149 69 253)" }} delay={3} duration={8} height={57} width={120} />
    </div>
  ),
  lend: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[120px] rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image alt="Lend" className="relative z-10" height={57} src="/image/lendd.svg" width={120} />
      <RectangularOrbit colors={{ start: "rgb(53 39 202)", end: "rgb(53 39 202)" }} delay={4} duration={8} height={57} width={120} />
    </div>
  ),
  convert: () => (
    <div className="flex items-center justify-center relative h-[57px] w-[147px] rounded-full overflow-hidden left-1/2 -translate-x-1/2">
      <Image alt="Convert" className="relative z-10" height={57} src="/image/convert.svg" width={147} />
      <RectangularOrbit colors={{ start: "rgb(49 229 133)", end: "rgb(49 229 133)" }} delay={5} duration={8} height={57} width={147} />
    </div>
  ),
};
