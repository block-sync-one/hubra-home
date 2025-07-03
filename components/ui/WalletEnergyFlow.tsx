import React from "react";
import { motion } from "framer-motion";

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
        className="absolute left-[60px] bottom-[122px] w-[237px] rounded-b-[28%] overflow-hidden"
        style={{ height: "111px" }}
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
              <stop offset="0%" stopColor="#FF68CF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF68CF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF68CF" stopOpacity="0.5" />
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
        className="absolute right-[70px] bottom-[120px] w-[255px] rounded-[21%] overflow-hidden"
        style={{ height: "155px" }}
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
              <stop offset="0%" stopColor="#FF68CF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF68CF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF68CF" stopOpacity="0.5" />
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
      
      {/* Top Energy Path - FROM left wallet TO right wallet */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="energyGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4FCB" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF4FCB" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Top path from SVG */}
        <motion.path
          d="M 178.499 200 V 106.157 C 178.499 101.445 182.319 97.6254 187.03 97.6254 H 261.678 C 297.016 97.6254 325.663 126.272 325.663 161.609 V 176.539 C 325.663 189.496 336.166 200 349.123 200 H 501.619"
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
      </svg>

      {/* Bottom Energy Path - FROM left wallet TO right wallet */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="energyGradientBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4FCB" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF4FCB" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Bottom path from SVG */}
        <motion.path
          d="M 178.499 200 V 293.843 C 178.499 298.555 182.319 302.375 187.03 302.375 H 261.678 C 297.016 302.375 325.663 273.728 325.663 238.391 V 223.461 C 325.663 210.504 336.166 200 349.123 200 H 501.619"
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

      {/* INCOMING Energy Paths - FROM right wallet TO external sources */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="incomingEnergyGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4FCB" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF4FCB" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="incomingEnergyGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4FCB" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF4FCB" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Outgoing path 1 - FROM right wallet TO external (top path) */}
        <motion.path
          d="M 487.756 200 L 640.252 200 C 653.209 200 663.712 189.496 663.712 176.539 L 663.712 161.609 C 663.712 126.272 692.359 97.6254 727.696 97.6254 L 802.345 97.6254 C 807.056 97.6254 810.876 101.445 810.876 106.157 L 810.876 114.155"
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
          d="M 487.756 200 L 640.252 200 C 653.209 200 663.712 210.504 663.712 223.461 L 663.712 238.391 C 663.712 273.728 692.359 302.375 727.696 302.375 L 802.345 302.375 C 807.056 302.375 810.876 298.555 810.876 293.843 L 810.876 285.845"
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

      {/* Wallet Glow Effects */}
      <motion.div
        className="absolute left-[120px] bottom-[80px] w-[80px] h-[80px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-[120px] bottom-[80px] w-[80px] h-[80px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Additional glow for incoming energy to right wallet */}
      <motion.div
        className="absolute right-[120px] top-[60px] w-[60px] h-[60px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute right-[120px] bottom-[140px] w-[60px] h-[60px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 105, 210, 0.3) 0%, rgba(255,79,203,0) 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
};

export default WalletEnergyFlow; 