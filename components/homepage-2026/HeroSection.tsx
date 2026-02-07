"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(230, 184, 0, 0.03) 0%, transparent 50%)",
        }}
      />
      
      <div className="max-w-3xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ backgroundColor: "rgba(230, 184, 0, 0.1)" }}
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#E6B800" }}
          />
          <span className="text-sm font-medium" style={{ color: "#E6B800" }}>
            Solana DeFi, Simplified
          </span>
        </motion.div>

        {/* Main headline - ONE focal point */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight"
          style={{ 
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          The easiest way to
          <br />
          <span style={{ color: "#E6B800" }}>earn on Solana</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg sm:text-xl max-w-xl mx-auto"
          style={{ color: "#A1A1AA", lineHeight: 1.5 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Connect with email or wallet. Earn yield across DeFi. 
          No gas fees. No complexity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link
            href={siteConfig.links.app}
            className="px-8 py-4 font-semibold rounded-lg transition-transform active:scale-[0.97]"
            style={{ 
              backgroundColor: "#E6B800",
              color: "#0D0D0F",
            }}
          >
            Start Earning
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 font-semibold rounded-lg border transition-colors"
            style={{ 
              borderColor: "#27272A",
              color: "#FFFFFF",
              backgroundColor: "transparent",
            }}
          >
            Learn More
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { value: "$3M+", label: "TVL" },
            { value: "Gasless", label: "Transactions" },
            { value: "20+", label: "Protocols" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm mt-1"
                style={{ color: "#A1A1AA" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
