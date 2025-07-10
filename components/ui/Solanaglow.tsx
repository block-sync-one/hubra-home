import React from "react";
import { motion } from "framer-motion";

interface SolanaglowProps {
  right?: number;
  top?: number;
  size?: number;
}

const Solanaglow: React.FC<SolanaglowProps> = ({ right = 112, top = 102, size = 1 }) => (
  <motion.div
    className="absolute"
    style={{
      right,
      top,
      width: size,
      height: size,
      pointerEvents: 'none',
      zIndex: 2,
      borderRadius: '100%',
    }}
    initial={{ opacity: 0.7, scale: 1 }}
    animate={{
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.2, 1],
      boxShadow: [
        '0 0 24px 8px #FEAA01',
        '0 0 48px 16px #FEAA01',
        '0 0 24px 8px #FEAA01',
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '100%',
      }}
    />
  </motion.div>
);

export default Solanaglow;
