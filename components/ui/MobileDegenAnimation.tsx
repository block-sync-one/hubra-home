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

export function MobileDegenAnimation() {
  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center overflow-hidden">
      <div className="flex flex-col relative justify-center items-center">
        <div className="absolute top-[-74px] left-[-127px] -rotate-90">
          <Image alt="" height={89} src="/image/vault_line.svg" width={254} />
          <AnimatedMiniLine
            delay={0}
            duration={3}
            gradientColors={{ start: "#E6D36A", end: "#E6D36A" }}
            height={89}
            pathData="M-300,60 L79,44 L72,50 L129,0"
            uniqueId="lp-line-1"
            width={254}
          />
        </div>

        <div className="absolute top-[-74px] right-[-127px] rotate-90">
          <Image alt="" height={100} src="/image/lp_line.svg" width={254} />
          <AnimatedMiniLine
            delay={2}
            duration={3}
            gradientColors={{ start: "#FE6633", end: "#FE6633" }}
            height={100}
            pathData="M300,60 L48,44 L57,53 L0,0"
            uniqueId="borrow-line-1"
            width={254}
          />
        </div>

        <div className="absolute bottom-[-174px] left-[-147px] -rotate-90">
          <Image alt="" height={100} src="/image/lp_line.svg" width={254} />
          <AnimatedMiniLine
            delay={0.5}
            duration={3}
            gradientColors={{ start: "#44D2F6", end: "#44D2F6" }}
            height={100}
            pathData="M300,70 L67.5,51.4 L55,50 L0,0"
            uniqueId="perpetuals-line-1"
            width={254}
          />
        </div>

        <div className="absolute bottom-[-174px] right-[-127px] rotate-90">
          <Image alt="" height={89} src="/image/vault_line.svg" width={254} />
          <AnimatedMiniLine
            delay={2.5}
            duration={3}
            gradientColors={{ start: "#31E585", end: "#31E585" }}
            height={89}
            pathData="M-300,60 L79,44 L72,50 L129,0"
            uniqueId="convert-line-1"
            width={254}
          />
        </div>

        <div className="flex items-start gap-20 top-11 absolute -rotate-90">
          <div className="relative w-[154px] h-[10px] justify-center items-center rotate-180">
            <Image alt="" height={10} src="/image/perpetuals_line.svg" width={254} />
            <AnimatedMiniLine
              delay={1.5}
              duration={3}
              gradientColors={{ start: "#44D2F6", end: "#44D2F6" }}
              height={10}
              pathData="M-0,1 L150,0"
              uniqueId="perpetuals-line-2"
              width={254}
            />
          </div>
          <div className="relative w-[154px] h-[10px] ">
            <Image alt="" height={10} src="/image/lend_line.svg" width={254} />
            <AnimatedMiniLine
              delay={1}
              duration={3}
              gradientColors={{ start: "#3527CA", end: "#3527CA" }}
              height={10}
              pathData="M-0,1 L150,0"
              uniqueId="lend-line-1"
              width={254}
            />
          </div>
        </div>

        <div className="z-10 flex items-center justify-center rounded-full absolute bottom-[-265px] left-[-160px]">
          <Icons.vault />
        </div>
        <div className="z-10 flex items-center justify-center rounded-full absolute top-[-155px] left-[-135px]">
          <Icons.lp />
        </div>
        <div className="z-10 flex items-center justify-center rounded-full absolute bottom-[-285px] left-[-65px]">
          <Icons.perpetuals />
        </div>

        <div className="z-10 flex items-center justify-center rounded-full absolute top-[-180px] left-[-46px]">
          <Icons.lend />
        </div>

        <div className="z-10 flex items-center justify-center rounded-full absolute top-[-155px] right-[-160px]">
          <Icons.borrow />
        </div>

        <div className="z-10 flex items-center justify-center rounded-full absolute bottom-[-255px] right-[-160px]">
          <Icons.convert />
        </div>
      </div>

      <div className="flex items-center justify-center backdrop-blur-xl rounded-full scale-80 ">
        <Icons.middle />
      </div>
    </div>
  );
}
const Icons = {
  perpetuals: () => (
    <div className="flex items-center justify-center relative h-[44px] w-[132px] rounded-full overflow-hidden">
      <Image alt="Perpetuals" height={44} src="/image/perpetuals.svg" width={132} />
      <RectangularOrbit colors={{ start: "#44D2F6", end: "#44D2F6" }} delay={0} duration={8} height={44} width={132} />
    </div>
  ),
  middle: () => (
    <div className="flex items-center justify-center relative h-[96px] w-[320px] rounded-full overflow-hidden">
      <Image alt="LP" className="relative z-10 flex" height={96} src="/image/middle.svg" width={320} />
    </div>
  ),
  lp: () => (
    <div className="flex items-center justify-center relative h-[42px] w-[72px] rounded-full overflow-hidden">
      <Image alt="LP" className="relative z-10" height={42} src="/image/lp.svg" width={72} />
      <RectangularOrbit colors={{ start: "#E6D36A", end: "#E6D36A" }} delay={1} duration={8} height={42} width={72} />
    </div>
  ),
  borrow: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[100px] rounded-full overflow-hidden ">
      <Image alt="Borrow" className="relative z-10" height={40} src="/image/borrow.svg" width={100} />
      <RectangularOrbit colors={{ start: "#FE6633", end: "#FE6633" }} delay={2} duration={8} height={40} width={100} />
    </div>
  ),
  vault: () => (
    <div className="flex items-center justify-center relative h-[44px] w-[96px] rounded-full overflow-hidden top-1/2">
      <Image alt="Vault" className="relative z-10" height={44} src="/image/vaultd.svg" width={96} />
      <RectangularOrbit colors={{ start: "#9545FD", end: "#9545FD" }} delay={3} duration={8} height={44} width={96} />
    </div>
  ),
  lend: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[84px] rounded-full overflow-hidden">
      <Image alt="Lend" className="relative z-10" height={40} src="/image/lendd.svg" width={84} />
      <RectangularOrbit colors={{ start: "#3527CA", end: "#3527CA" }} delay={4} duration={8} height={40} width={84} />
    </div>
  ),
  convert: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[100px] rounded-full overflow-hidden ">
      <Image alt="Convert" className="relative z-10" height={40} src="/image/convert.svg" width={100} />
      <RectangularOrbit colors={{ start: "#31E585", end: "#31E585" }} delay={2} duration={8} height={40} width={100} />
    </div>
  ),
};
