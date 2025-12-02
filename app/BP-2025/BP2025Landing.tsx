"use client";

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";

/* ===================================================================
   CONSTANTS
=================================================================== */

const FEATURES = ["Frictionless onboarding", "One-click yield strategies", "Non-custodial. Transparent. Verifiable."] as const;

const GIVEAWAY_STEPS = ["Scan QR", "Create account", "Open an Earn position or stake raSOL = automatic entry into the draw!"] as const;

const ELIGIBILITY_RULES = [
  "Must complete the entry steps before December 23, 23:59 UTC",
  "One entry per verified Hubra account",
  "Valid worldwide unless restricted by local laws",
  "Winners will be notified via the email linked to their Hubra account",
  "Fraudulent or duplicate account entries will be disqualified",
  "Hubra reserves the right to modify or cancel the giveaway if needed",
] as const;

const FLOATING_PARTICLES_COUNT = 35;

/* ===================================================================
   ANIMATIONS
=================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
} as const;

/* ===================================================================
   BACKGROUND COMPONENT - Optimized with memoization
=================================================================== */

interface FloatingParticle {
  top: number;
  left: number;
  delay: number;
  duration: number;
}

const Background = memo(() => {
  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setParticles(
      Array.from({ length: FLOATING_PARTICLES_COUNT }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute left-1/3 -top-40 h-[600px] w-[600px] rounded-full bg-primary-400/20 blur-[170px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-20 h-[500px] w-[500px] rounded-full bg-success-400/20 blur-[160px] animate-pulse-slower" />

      {/* Micro floating dust */}
      {isMounted && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/10 animate-float"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Background.displayName = "Background";

/* ===================================================================
   HERO SECTION
=================================================================== */

const HeroSection = memo(() => (
  <motion.div animate="visible" className="text-center" initial="hidden" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
    <motion.div
      className="mx-auto mb-6 md:mb-8 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-md shadow-md"
      custom={0}
      variants={fadeUp}>
      <Image priority alt="Hubra Logo" className="md:w-[60px] md:h-[60px]" height={50} src="/logo.svg" width={50} />
    </motion.div>

    <motion.h1 className="text-4xl md:text-5xl lg:text-6xl max-w-2xl mx-auto font-semibold tracking-tight" custom={1} variants={fadeUp}>
      Hubra - DeFi made simple. On Solana.
    </motion.h1>

    <motion.p
      className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed"
      custom={2}
      variants={fadeUp}>
      Hubra is an earn aggregator wallet which is gasless by default. You can capture the best yields across all your wallets in one place,
      with one-click strategies, staying fully non-custodial.
    </motion.p>

    <motion.p
      className="mt-4 text-sm sm:text-base md:text-lg text-primary-400 font-medium max-w-2xl mx-auto px-4"
      custom={3}
      variants={fadeUp}>
      For now, Hubra is offering ZERO fees for all on-chain transactions within the Hubra App.
    </motion.p>
  </motion.div>
));

HeroSection.displayName = "HeroSection";

/* ===================================================================
   FEATURES SECTION
=================================================================== */

const FeaturesSection = memo(() => (
  <motion.div
    className=""
    initial="hidden"
    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
    viewport={{ once: true, margin: "-100px" }}
    whileInView="visible">
    <div className="mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            custom={index}
            variants={fadeUp}>
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-primary-400 mb-4" />
            <p className="text-white text-base md:text-lg font-medium leading-relaxed">{feature}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
));

FeaturesSection.displayName = "FeaturesSection";

/* ===================================================================
   CTA SECTION
=================================================================== */

const CTASection = memo(() => (
  <motion.div animate="visible" className="text-center" initial="hidden" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
    <motion.div custom={1} variants={fadeUp}>
      <motion.a
        className="inline-flex items-center justify-center px-4 py-2 md:py-4 md:px-8 rounded-2xl  backdrop-blur-sm  transition-all duration-300 bg-primary-500 hover:bg-primary-500/80"
        href="/BP-2025/link"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}>
        <AuroraText className="text-xl md:text-2xl font-semibold tracking-tight" colors={["#FCFBF6", "#FFFFE7", "#FEFFC1"]}>
          Get Started
        </AuroraText>
      </motion.a>
    </motion.div>
  </motion.div>
));

CTASection.displayName = "CTASection";

/* ===================================================================
   GIVEAWAY SECTION
=================================================================== */

const GiveawaySection = memo(() => (
  <motion.div
    className="flex flex-col gap-10 md:gap-28 "
    initial="hidden"
    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    viewport={{ once: true, margin: "-100px" }}
    whileInView="visible">
    {/* Entry Steps */}
    <div>
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        <div className="flex items-center justify-center ">
          <AuroraText className="text-2xl md:text-4xl font-semibold tracking-tight" colors={["#FCFBF6", "#FFFFE7", "#FEFFC1"]}>
            Giveaway
          </AuroraText>
        </div>
        {GIVEAWAY_STEPS.map((text, index) => (
          <motion.div key={index} className="flex items-start gap-4 md:gap-6" custom={index + 1} variants={fadeUp}>
            <div className="h-[2px] w-8 md:w-12 text-2xl md:text-3xl lg:text-4xl font-bold text-primary-400 flex-shrink-0">{`0${index + 1}`}</div>
            <div className="h-[2px] w-8 md:w-12 lg:w-16 bg-primary-400/30 mt-3 md:mt-4 flex-shrink-0" />
            <p className="flex-1 text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Prize Information */}
    <motion.div className="mx-auto max-w-2xl text-center space-y-2 md:space-y-4" custom={4} variants={fadeUp}>
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        There will be <span className="text-primary-400 font-semibold">4 random winners</span>, each receiving{" "}
        <AuroraText className="text-2xl md:text-3xl font-semibold tracking-tight" colors={["#FDB122", "#FDB122", "#FDB122"]}>
          $250
        </AuroraText>
      </p>
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        Winners announced <span className="text-primary-400 font-semibold">Christmas Eve</span>.
      </p>
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        Rewards will be paid in <span className="text-primary-400 font-semibold">USDC on Solana</span> into your Hubra account.
      </p>
    </motion.div>

    {/* Eligibility */}
    <motion.div
      className="mx-auto max-w-3xl"
      custom={5}
      initial="hidden"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      viewport={{ once: true }}
      whileInView="visible">
      <motion.div
        className="text-2xl md:text-4xl font-semibold tracking-tight text-primary-400 mb-6 md:mb-8 text-center"
        custom={0}
        variants={fadeUp}>
        <AuroraText className="text-2xl md:text-4xl font-semibold tracking-tight" colors={["#FCFBF6", "#FFFFE7", "#FEFFC1"]}>
          Eligibility
        </AuroraText>
      </motion.div>

      <div className="space-y-3 md:space-y-4">
        {ELIGIBILITY_RULES.map((rule, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 md:gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
            custom={index + 1}
            variants={fadeUp}>
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400 mt-2" />
            <p className="text-white text-base md:text-lg leading-relaxed">{rule}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
));

GiveawaySection.displayName = "GiveawaySection";

/* ===================================================================
   FOOTER
=================================================================== */

const Footer = memo(() => (
  <div className="border-t border-white/10 py-6 md:py-8 text-center">
    <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto px-4">© 2025 Hubra. Non-custodial. On-chain. DeFi made simple.</p>
  </div>
));

Footer.displayName = "Footer";

/* ===================================================================
   MAIN COMPONENT
=================================================================== */

export const BP2025Landing = memo(() => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      <Background />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-10 md:pt-16 flex flex-col gap-20 md:gap-28">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <GiveawaySection />
        <Footer />
      </div>
    </div>
  );
});

BP2025Landing.displayName = "BP2025Landing";
