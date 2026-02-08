"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

import { PartnerLogoStrip } from "./PartnerLogoStrip";
import { PhoneMockup } from "./PhoneMockup";
import { StatsBar } from "./StatsBar";

/**
 * HeroSection2026 - Fintech Clean 2026 Design
 *
 * Split layout: Copy left, Phone mockup right
 * Design Philosophy: "Trust at first scroll"
 *
 * @see /root/bots/designer-bot/briefs/HOMEPAGE-2026-DESIGN-BRIEF.md
 */
export const HeroSection2026 = (): JSX.Element => {
  // Ensure animations only run after hydration
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Trust bar items
  const trustItems = [
    { icon: "⛽", text: "No gas fees" },
    { icon: "🔑", text: "No seed phrases" },
    { icon: "⏱", text: "Withdraw anytime" },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "var(--hp-hero-bg)" }}>
      {/* Subtle animated gold gradient orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(230, 184, 0, 0.3) 0%, rgba(230, 184, 0, 0) 70%)",
            filter: "blur(80px)",
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main hero content - Split layout */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Copy */}
            <motion.div
              animate={isMounted ? "visible" : "hidden"}
              className="relative z-10 text-center lg:text-left"
              initial="hidden"
              variants={containerVariants}>
              {/* Headline */}
              <motion.h1
                className="font-sans font-semibold text-white tracking-tight leading-[1.1]"
                style={{ fontSize: "var(--hp-hero-size)" }}
                variants={itemVariants}>
                Your assets.
                <br />
                Real yields.
                <br />
                <span style={{ color: "var(--hp-gold-400)" }}>No middlemen.</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                className="mt-6 text-gray-300 max-w-md mx-auto lg:mx-0"
                style={{ fontSize: "var(--hp-body-large)" }}
                variants={itemVariants}>
                Deposit. Earn. Withdraw anytime. That&apos;s it.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start" variants={itemVariants}>
                {/* Primary CTA */}
                <Link
                  className="inline-flex items-center justify-center px-8 py-4 font-medium text-black transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
                  href="https://app.hubra.app"
                  style={{
                    backgroundColor: "var(--hp-gold-400)",
                    borderRadius: "var(--hp-button-radius)",
                    fontSize: "var(--hp-body)",
                  }}>
                  Start Earning
                  <span className="ml-2">→</span>
                </Link>

                {/* Secondary CTA */}
                <Link
                  className="inline-flex items-center justify-center px-8 py-4 font-medium text-white border border-white/30 transition-all duration-150 ease-out hover:scale-[1.02] hover:border-white/50 active:scale-[0.98]"
                  href="#how-it-works"
                  style={{
                    borderRadius: "var(--hp-button-radius)",
                    fontSize: "var(--hp-body)",
                  }}>
                  See how it works
                </Link>
              </motion.div>

              {/* Trust Micro-Strip */}
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-gray-400"
                style={{ fontSize: "var(--hp-caption)" }}
                variants={itemVariants}>
                {trustItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Phone Mockup */}
            <motion.div
              animate={isMounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 60 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}>
              <PhoneMockup alt="Hubra Earn Dashboard" screenshot="/image/app-screenshot-placeholder.svg" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar - Below hero content */}
      <StatsBar className="mt-auto" />

      {/* Partner Logo Strip - At bottom */}
      <motion.div
        animate={isMounted ? { opacity: 1 } : { opacity: 0 }}
        className="py-12"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}>
        <PartnerLogoStrip />
      </motion.div>
    </section>
  );
};
