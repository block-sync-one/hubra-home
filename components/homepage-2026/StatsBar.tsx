"use client";

import { motion } from "framer-motion";

/**
 * StatsBar - Social proof numbers
 *
 * Display key metrics to build trust.
 * Uses demo numbers per Amir's direction.
 */

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "$12M+", label: "Assets Managed" },
  { value: "10K+", label: "Happy Users" },
  { value: "50K+", label: "Transactions" },
];

interface StatsBarProps {
  className?: string;
}

export const StatsBar = ({ className = "" }: StatsBarProps): JSX.Element => {
  return (
    <div className={`w-full py-8 border-y border-white/5 ${className}`} style={{ backgroundColor: "rgba(13, 14, 33, 0.8)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}>
              <div
                className="font-semibold text-white mb-1"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  color: "var(--hp-gold-400)",
                }}>
                {stat.value}
              </div>
              <div className="text-gray-400" style={{ fontSize: "var(--hp-caption)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
