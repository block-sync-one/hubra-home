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

export function MobileDegenAnimation() {
  return (
    <div
      className="relative flex flex-col h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col relative justify-center items-center">
        <div className="absolute top-[-74px] left-[-127px] -rotate-90">
          <Image src="/image/vault_line.svg" alt="" width={254} height={89} />
          <AnimatedMiniLine
            pathData="M-300,60 L79,44 L72,50 L129,0"
            width={254}
            height={89}
            duration={3}
            delay={0}
            gradientColors={{ start: "#E6D36A", end: "#E6D36A" }}
            uniqueId="lp-line-1"
          />
        </div>


        <div className="absolute top-[-74px] right-[-127px] rotate-90">
          <Image src="/image/lp_line.svg" alt="" width={254} height={100} />
          <AnimatedMiniLine
            pathData="M300,60 L48,44 L57,53 L0,0"
            width={254}
            height={100}
            duration={3}
            delay={2}
            gradientColors={{ start: "#FE6633", end: "#FE6633" }}
            uniqueId="borrow-line-1"
          />
        </div>


        <div className="absolute bottom-[-174px] left-[-147px] -rotate-90">
          <Image src="/image/lp_line.svg" alt="" width={254} height={100} />
          <AnimatedMiniLine
            pathData="M300,70 L67.5,51.4 L55,50 L0,0"
            width={254}
            height={100}
            duration={3}
            delay={0.5}
            gradientColors={{ start: "#44D2F6", end: "#44D2F6" }}
            uniqueId="perpetuals-line-1"
          />
        </div>

        <div className="absolute bottom-[-174px] right-[-127px] rotate-90">
          <Image src="/image/vault_line.svg" alt="" width={254} height={89} />
          <AnimatedMiniLine
            pathData="M-300,60 L79,44 L72,50 L129,0"
            width={254}
            height={89}
            duration={3}
            delay={2.5}
            gradientColors={{ start: "#31E585", end: "#31E585" }}
            uniqueId="convert-line-1"
          />
        </div>

        <div className="flex items-start gap-20 top-11 absolute -rotate-90">
          <div className="relative w-[154px] h-[10px] justify-center items-center rotate-180">
            <Image src="/image/perpetuals_line.svg" alt="" width={254} height={10} />
            <AnimatedMiniLine
              pathData="M-0,1 L150,0"
              width={254}
              height={10}
              duration={3}
              delay={1.5}
              gradientColors={{ start: "#44D2F6", end: "#44D2F6" }}
              uniqueId="perpetuals-line-2"
            />
          </div>
          <div className="relative w-[154px] h-[10px] ">
            <Image src="/image/lend_line.svg" alt="" width={254} height={10} />
            <AnimatedMiniLine
              pathData="M-0,1 L150,0"
              width={254}
              height={10}
              duration={3}
              delay={1}
              gradientColors={{ start: "#3527CA", end: "#3527CA" }}
              uniqueId="lend-line-1"
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
      <Image src="/image/perpetuals.svg" alt="Perpetuals" width={132} height={44} />
      <RectangularOrbit width={132} height={44} duration={8} delay={0} colors={{ start: "#44D2F6", end: "#44D2F6" }} />
    </div>
  ),
  middle: () => (
    <div className="flex items-center justify-center relative h-[96px] w-[320px] rounded-full overflow-hidden">
      <Image src="/image/middle.svg" alt="LP" width={320} height={96} className="relative z-10 md:flex hidden" />
      <Image src="/image/middle-m.svg" alt="LP" width={320} height={96} className="relative z-10 flex md:hidden" />
    </div>
  ),
  lp: () => (
    <div className="flex items-center justify-center relative h-[42px] w-[72px] rounded-full overflow-hidden">
      <Image src="/image/lp.svg" alt="LP" width={72} height={42} className="relative z-10" />
      <RectangularOrbit width={72} height={42} duration={8} delay={1} colors={{ start: "#E6D36A", end: "#E6D36A" }} />
    </div>
  ),
  borrow: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[100px] rounded-full overflow-hidden ">
      <Image src="/image/borrow.svg" alt="Borrow" width={100} height={40} className="relative z-10" />
      <RectangularOrbit width={100} height={40} duration={8} delay={2} colors={{ start: "#FE6633", end: "#FE6633" }} />
    </div>
  ),
  vault: () => (
    <div className="flex items-center justify-center relative h-[44px] w-[96px] rounded-full overflow-hidden top-1/2">
      <Image src="/image/vaultd.svg" alt="Vault" width={96} height={44} className="relative z-10" />
      <RectangularOrbit width={96} height={44} duration={8} delay={3} colors={{ start: "#9545FD", end: "#9545FD" }} />
    </div>
  ),
  lend: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[84px] rounded-full overflow-hidden">
      <Image src="/image/lendd.svg" alt="Lend" width={84} height={40} className="relative z-10" />
      <RectangularOrbit width={84} height={40} duration={8} delay={4} colors={{ start: "#3527CA", end: "#3527CA" }} />
    </div>
  ),
  convert: () => (
    <div className="flex items-center justify-center relative h-[40px] w-[100px] rounded-full overflow-hidden ">
      <Image src="/image/convert.svg" alt="Convert" width={100} height={40} className="relative z-10" />
      <RectangularOrbit width={100} height={40} duration={8} delay={2} colors={{ start: "#31E585", end: "#31E585" }} />
    </div>
  ),
};

