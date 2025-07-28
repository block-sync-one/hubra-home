import React from "react";
import { motion } from "framer-motion";

// Add global style for energy gradient color
if (typeof window !== "undefined") {
  const style = document.createElement("style");

  style.innerHTML = `
    :root {
      --energy-gradient-color: #FEAA01;
    }
    @media (max-width: 767px) {
      :root {
        --energy-gradient-color: #FEAA01;
      }
    }
  `;
  document.head.appendChild(style);
}

interface WalletEnergyFlowProps {
  className?: string;
}

const WalletEnergyFlow: React.FC<WalletEnergyFlowProps> = ({
  className = "",
}) => {
  return (
    <div className={`absolute mb-0 lg:mb-1 xl:mb-2 inset-0 md:inset-auto pointer-events-none ${className}`}>
      {/* Left Wallet Liquid */}
      <div className="absolute flex flex-col w-full left-[28%] top-[18%] max-w-[43%] rounded-b-[26px] h-[13%] md:max-w-[152px] md:h-[54px] md:left-10 md:top-[48%] lg:max-w-[198px] lg:h-[70px] lg:left-[50px] lg:top-[41%] overflow-hidden object-cover">
        {/* Wave overlay for liquid surface */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 237 111"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" x2="0%" y1="100%" y2="0%">
              <stop
                offset="0%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0"
              />
              <stop
                offset="50%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0.5"
              />
            </linearGradient>
          </defs>

          <motion.path
            animate={{
              d: [
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
                "M0,15 Q59.25,25 118.5,15 T237,15 L237,111 L0,111 Z",
                "M0,25 Q59.25,5 118.5,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
              ],
            }}
            d="M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            initial={{
              d: "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Second wave layer for more realistic effect */}
          <motion.path
            animate={{
              d: [
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q79,30 158,20 T237,20 L237,111 L0,111 Z",
                "M0,30 Q79,10 158,30 T237,30 L237,111 L0,111 Z",
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
              ],
            }}
            d="M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            fillOpacity="0.6"
            initial={{ d: "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </svg>
      </div>

      {/* Right Wallet Liquid */}
      <div className="absolute flex flex-col w-full left-[26%] top-[76.5%] max-w-[46%] rounded-b-[26px] h-[13%] md:max-w-[164px] md:h-[66px] md:left-[444px] md:top-[41%] md:rounded-b-[26px] lg:max-w-[213px] lg:h-[86px] lg:left-[580px] lg:top-[35%] object-cover overflow-hidden">
        {/* Wave overlay for liquid surface */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 237 111"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" x2="0%" y1="100%" y2="0%">
              <stop
                offset="0%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0"
              />
              <stop
                offset="50%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="var(--energy-gradient-color)"
                stopOpacity="0.5"
              />
            </linearGradient>
          </defs>

          <motion.path
            animate={{
              d: [
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
                "M0,15 Q59.25,25 118.5,15 T237,15 L237,111 L0,111 Z",
                "M0,25 Q59.25,5 118.5,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
              ],
            }}
            d="M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            initial={{
              d: "M0,20 Q59.25,10 118.5,20 T237,20 L237,111 L0,111 Z",
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Second wave layer for more realistic effect */}
          <motion.path
            animate={{
              d: [
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
                "M0,20 Q79,30 158,20 T237,20 L237,111 L0,111 Z",
                "M0,30 Q79,10 158,30 T237,30 L237,111 L0,111 Z",
                "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z",
              ],
            }}
            d="M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z"
            fill="url(#waveGradient)"
            fillOpacity="0.6"
            initial={{ d: "M0,25 Q79,15 158,25 T237,25 L237,111 L0,111 Z" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </svg>
      </div>

      {/* Responsive Energy Paths - FROM left wallet TO right wallet */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block max-w-[1000px] max-h-[400px] gap-10 rotate-180 top-[14px] -left-[16px] lg:-left-[36px] xl:top-4"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1014 281"
      >
        <defs>
          <linearGradient
            id="incomingEnergyGradient1"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
            <stop
              offset="50%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
          </linearGradient>
          <linearGradient
            id="incomingEnergyGradient2"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
            <stop
              offset="50%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {/* Outgoing path 1 - FROM right wallet TO external (top path) */}
        <motion.path
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          d="M810.876 76.1546L810.876 68.1566C810.876 63.4449 807.056 59.6254 802.345 59.6254L727.696 59.6254C692.359 59.6254 663.712 88.272 663.712 123.609L663.712 138.539C663.712 151.496 653.209 162 640.252 162L487.756 162"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="url(#incomingEnergyGradient1)"
          strokeLinecap="round"
          strokeWidth="2"
          transition={{
            pathLength: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
            opacity: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
        />
        {/* Outgoing path 2 - FROM right wallet TO external (bottom path) */}
        <motion.path
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          d="M810.876 247.845L810.876 255.843C810.876 260.555 807.056 264.375 802.345 264.375L727.696 264.375C692.359 264.375 663.712 235.728 663.712 200.391L663.712 185.461C663.712 172.504 653.209 162 640.252 162L487.756 162"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="url(#incomingEnergyGradient2)"
          strokeLinecap="round"
          strokeWidth="2"
          transition={{
            pathLength: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            },
            opacity: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
        />
      </svg>

      {/* Responsive INCOMING Energy Paths - FROM right wallet TO external sources */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block max-w-[1000px] max-h-[400px] gap-10 -top-[14px] left-[0px] lg:-top-[18px] lg:left-[15px] xl:-top-[16px] xl:left-[16px]"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1014 281"
      >
        <defs>
          <linearGradient
            id="incomingEnergyGradient1"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
            <stop
              offset="50%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
          </linearGradient>
          <linearGradient
            id="incomingEnergyGradient2"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
            <stop
              offset="50%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {/* Outgoing path 1 - FROM right wallet TO external (top path) */}
        <motion.path
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          d="M810.876 76.1546L810.876 68.1566C810.876 63.4449 807.056 59.6254 802.345 59.6254L727.696 59.6254C692.359 59.6254 663.712 88.272 663.712 123.609L663.712 138.539C663.712 151.496 653.209 162 640.252 162L487.756 162"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="url(#incomingEnergyGradient1)"
          strokeLinecap="round"
          strokeWidth="2"
          transition={{
            pathLength: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
            opacity: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
        />
        {/* Outgoing path 2 - FROM right wallet TO external (bottom path) */}
        <motion.path
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          d="M810.876 247.845L810.876 255.843C810.876 260.555 807.056 264.375 802.345 264.375L727.696 264.375C692.359 264.375 663.712 235.728 663.712 200.391L663.712 185.461C663.712 172.504 653.209 162 640.252 162L487.756 162"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          stroke="url(#incomingEnergyGradient2)"
          strokeLinecap="round"
          strokeWidth="2"
          transition={{
            pathLength: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            },
            opacity: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            },
          }}
        />
      </svg>

      {/* MOBILE: Responsive energy flow paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none md:hidden"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 350 518"
      >
        <defs>
          <linearGradient
            id="energyFlowGradientMobile"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
            <stop
              offset="0.2"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="0.8"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="1"
            />
            <stop
              offset="1"
              stopColor="var(--energy-gradient-color)"
              stopOpacity="0"
            />
          </linearGradient>
          {/* Mask to hide energy flow behind Solana logo */}
          <mask id="solanaLogoMask">
            <rect fill="white" height="518" width="350" x="0" y="0" />
            <circle cx="175" cy="260" fill="black" r="29" />
          </mask>
        </defs>
        {/* Left path: single continuous path from top, through Solana, to bottom, masked */}
        <motion.path
          animate={{ pathLength: 1, opacity: 1 }}
          d="M95.3385 113L87.375 113C83.3019 113 80 116.302 80 120.375L80 146.222C80 162.791 93.4315 176.222 110 176.222L160 176.222C168.284 176.222 175 182.938 175 191.222L175 334.778C175 343.062 168.284 349.778 160 349.778L110 349.778C93.4315 349.778 80 363.209 80 379.778L80 405.625C80 409.698 83.3019 413 87.375 413L95.3385 413"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          mask="url(#solanaLogoMask)"
          stroke="url(#energyFlowGradientMobile)"
          strokeLinecap="round"
          strokeWidth="1"
          transition={{
            pathLength: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        {/* Right path: single continuous path from top, through Solana, to bottom, masked */}
        <motion.path
          animate={{ pathLength: 1, opacity: 1 }}
          d="M254.661 113L262.625 113C266.698 113 270 116.302 270 120.375L270 146.222C270 162.791 256.569 176.222 240 176.222L190 176.222C181.716 176.222 175 182.938 175 191.222L175 334.778C175 343.062 181.716 349.778 190 349.778L240 349.778C256.569 349.778 270 363.209 270 379.778L270 405.625C270 409.698 266.698 413 262.625 413L254.661 413"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          mask="url(#solanaLogoMask)"
          stroke="url(#energyFlowGradientMobile)"
          strokeLinecap="round"
          strokeWidth="1"
          transition={{
            pathLength: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.25,
            },
            opacity: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.25,
            },
          }}
        />
      </svg>
    </div>
  );
};

export default WalletEnergyFlow;
