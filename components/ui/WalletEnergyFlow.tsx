import React from "react";
import { motion } from "framer-motion";

// Add global style for energy gradient color
if (typeof window !== "undefined") {
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --energy-gradient-color: #FEAA01;
    }
    @media (max-width: 767px) {
      :root {
        --energy-gradient-color: #E379C1;
      }
    }
  `;
  document.head.appendChild(style);
}

interface WalletEnergyFlowProps {
  className?: string;
}

const WalletEnergyFlow: React.FC<WalletEnergyFlowProps> = ({ className = "" }) => {
  // Energy particles flowing from left to right on both paths
  const energyParticles = Array.from({ length: 6 }, (_, i) => i);
  // Energy particles flowing TO the right wallet (incoming)
  const incomingParticles = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Left Wallet Liquid */}
      <div
        className="absolute left-[28%] top-[18%] w-[43%] rounded-b-[26px] h-[13%] md:left-[6%] lg:left-[6.5%] xl:left-[9.5%] md:top-[42%] md:rounded-b-[20px] lg:rounded-b-[38px] md:w-[23.4%] lg:w-[22.9%] xl:w-[21.4%] md:h-[20.3%] lg:h-[26.4%] xl:h-[27.5%] overflow-hidden"
      >
        {/* Background liquid */}
        <div
          className="absolute inset-0 bg-transparent bg-cover bg-center"
        />

        {/* Wave overlay for liquid surface */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 237 111"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            initial={{ d: "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z" }}
            animate={{
              d: [
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
                "M0,15 Q59.25,25 118.5,15 T237,15 L237,111 L0,111 Z",
                "M0,25 Q59.25,5 118.5,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Second wave layer for more realistic effect */}
          <motion.path
            d="M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            fillOpacity="0.6"
            initial={{ d: "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z" }}
            animate={{
              d: [
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q79,30 158,20 T237,20 L237,111 L0,111 Z",
                "M0,30 Q79,10 158,30 T237,30 L237,111 L0,111 Z",
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </svg>
      </div>

      {/* Right Wallet Liquid */}
      <div
        className="absolute left-[26%] top-[70%] w-[46%] rounded-[21%] md:rounded-t-[20px] lg:rounded-[21%] h-[19%] md:left-[68.3%] lg:left-[68.2%] xl:left-[67.3%] md:top-[36%] lg:top-[30%] md:w-[25%] lg:w-[24.7%] xl:w-[23%] md:rounded-[21%] md:h-[27.2%] lg:h-[37.5%] xl:h-[39.5%] overflow-hidden"
      >
        {/* Background liquid */}
        <div
          className="absolute inset-0 bg-transparent bg-cover bg-center"
        />

        {/* Wave overlay for liquid surface */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 237 111"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            initial={{ d: "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z" }}
            animate={{
              d: [
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
                "M0,15 Q59.25,25 118.5,15 T237,15 L237,111 L0,111 Z",
                "M0,25 Q59.25,5 118.5,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Second wave layer for more realistic effect */}
          <motion.path
            d="M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            fillOpacity="0.6"
            initial={{ d: "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z" }}
            animate={{
              d: [
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q79,30 158,20 T237,20 L237,111 L0,111 Z",
                "M0,30 Q79,10 158,30 T237,30 L237,111 L0,111 Z",
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </svg>
      </div>

      {/* Responsive Energy Paths - FROM left wallet TO right wallet */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1014 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="energyGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="energyGradientBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Top path - responsive coordinates */}
        <motion.path
          d="M 178 200 V 106 C 178 101 182 98 187 98 H 262 C 297 98 326 126 326 162 V 177 C 326 189 336 200 349 200 H 502"
          fill="none"
          stroke="url(#energyGradientTop)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Bottom path - responsive coordinates */}
        <motion.path
          d="M 178 200 V 294 C 178 299 182 302 187 302 H 262 C 297 302 326 274 326 238 V 223 C 326 211 336 200 349 200 H 502"
          fill="none"
          stroke="url(#energyGradientBottom)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
        />
      </svg>

      {/* Responsive INCOMING Energy Paths - FROM right wallet TO external sources */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1014 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="incomingEnergyGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="incomingEnergyGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outgoing path 1 - FROM right wallet TO external (top path) */}
        <motion.path
          d="M 488 200 L 640 200 C 653 200 664 189 664 177 L 664 162 C 664 126 692 98 728 98 L 802 98 C 807 98 811 101 811 106 L 811 114"
          fill="none"
          stroke="url(#incomingEnergyGradient1)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        />

        {/* Outgoing path 2 - FROM right wallet TO external (bottom path) */}
        <motion.path
          d="M 488 200 L 640 200 C 653 200 664 211 664 223 L 664 238 C 664 274 692 302 728 302 L 802 302 C 807 302 811 299 811 294 L 811 286"
          fill="none"
          stroke="url(#incomingEnergyGradient2)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{
            pathLength: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
          }}
        />
      </svg>


      {/* MOBILE: Responsive energy flow paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none md:hidden" viewBox="0 0 350 518" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="energyFlowGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
            <stop offset="0.2" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="0.8" stopColor="var(--energy-gradient-color)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--energy-gradient-color)" stopOpacity="0" />
          </linearGradient>
          {/* Mask to hide energy flow behind Solana logo */}
          <mask id="solanaLogoMask">
            <rect x="0" y="0" width="350" height="518" fill="white" />
            <circle cx="175" cy="260" r="29" fill="black" />
          </mask>
        </defs>
        {/* Left path: single continuous path from top, through Solana, to bottom, masked */}
        <motion.path
          d="M95.3385 113L87.375 113C83.3019 113 80 116.302 80 120.375L80 146.222C80 162.791 93.4315 176.222 110 176.222L160 176.222C168.284 176.222 175 182.938 175 191.222L175 334.778C175 343.062 168.284 349.778 160 349.778L110 349.778C93.4315 349.778 80 363.209 80 379.778L80 405.625C80 409.698 83.3019 413 87.375 413L95.3385 413"
          fill="none"
          stroke="url(#energyFlowGradientMobile)"
          strokeWidth="1"
          strokeLinecap="round"
          mask="url(#solanaLogoMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        {/* Right path: single continuous path from top, through Solana, to bottom, masked */}
        <motion.path
          d="M254.661 113L262.625 113C266.698 113 270 116.302 270 120.375L270 146.222C270 162.791 256.569 176.222 240 176.222L190 176.222C181.716 176.222 175 182.938 175 191.222L175 334.778C175 343.062 181.716 349.778 190 349.778L240 349.778C256.569 349.778 270 363.209 270 379.778L270 405.625C270 409.698 266.698 413 262.625 413L254.661 413"
          fill="none"
          stroke="url(#energyFlowGradientMobile)"
          strokeWidth="1"
          strokeLinecap="round"
          mask="url(#solanaLogoMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 },
            opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 },
          }}
        />
      </svg>
    </div>
  );
};

export default WalletEnergyFlow; 