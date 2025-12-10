"use client";

import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Calendar, Gift, Users } from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import { AccessModal } from "@/components/AccessModal";

const FEATURES = ["Frictionless onboarding", "One-click yield strategies", "Non-custodial. Transparent. Verifiable."] as const;

const ENTRY_STEPS = [
  {
    title: "Create your account",
    description: "Socials or email sign up",
  },
  {
    title: "Take action by Dec 23",
    description: "Open an Earn position or stake raSOL",
  },
  {
    title: "You're entered",
    description: "Automatic entry into the prize draw",
  },
] as const;

const ELIGIBILITY_TERMS = [
  "One entry per verified Hubra account",
  "Must complete entry steps before December 23, 23:59 UTC",
  "Valid worldwide unless restricted by local laws",
  "Winners notified via email linked to Hubra account",
  "Fraudulent or duplicate entries will be disqualified",
  "Hubra reserves the right to modify or cancel if needed",
] as const;

const FLOATING_PARTICLES_COUNT = 35;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
} as const;

interface FloatingParticle {
  top: number;
  left: number;
  delay: number;
  duration: number;
}

const Background = memo(() => {
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
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/3 via-background to-background" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[600px] w-[1000px] rounded-full bg-primary-400/15 blur-[200px]" />
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

const EventHeader = memo(() => (
  <motion.div animate="visible" className="text-center" initial="hidden" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
    <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  bg-primary-500/10 mb-6" custom={1} variants={fadeUp}>
      <Calendar className="w-4 h-4 text-primary-400" />
      <span className="text-sm font-medium text-primary-400">Solana Breakpoint 2025</span>
    </motion.div>

    <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 px-4" custom={2} variants={fadeUp}>
      <span className="text-white">$1,000 </span>
      <span className="text-primary-400">Giveaway</span>
    </motion.h1>

    <motion.p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 mb-8 leading-relaxed" custom={3} variants={fadeUp}>
      <span>Create an account</span>
      <span> and either open an Earn position or stake raSOL for </span>
      <span className="text-primary-400 font-semibold">FREE</span>. <span> You&#39;ll be automatically entered.</span>
    </motion.p>

    <motion.div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-4" custom={4} variants={fadeUp}>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary-400" />
        <span className="text-gray-300 text-sm md:text-base">
          <span className="text-white font-semibold">4</span> winners
        </span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-primary-400" />
        <span className="text-gray-300 text-sm md:text-base">
          <span className="text-white font-semibold">$250</span> each
        </span>
      </div>
      <div className="w-px h-4 bg-white/20" />
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-400" />
        <span className="text-gray-300 text-sm md:text-base">
          Announced <span className="text-white font-semibold">Dec 24</span>
        </span>
      </div>
    </motion.div>
  </motion.div>
));

EventHeader.displayName = "EventHeader";

const AboutSection = memo(() => (
  <motion.div
    className="text-center max-w-3xl mx-auto"
    initial="hidden"
    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    viewport={{ once: true, margin: "-100px" }}
    whileInView="visible">
    <motion.div
      className="mx-auto mb-4 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-md shadow-md"
      custom={0}
      variants={fadeUp}>
      <Image priority alt="Hubra Logo" className="md:w-[60px] md:h-[60px]" height={50} src="/logo.svg" width={50} />
    </motion.div>

    <motion.h2 className="text-2xl md:text-3xl font-bold mb-6" custom={1} variants={fadeUp}>
      <AuroraText className="font-semibold tracking-tight" colors={["#FDB122", "#FDB122", "#FDB122"]}>
        Hubra
      </AuroraText>
      <span className="text-gray-500 mx-2">-</span>
      <span className="text-white">DeFi made simple. On Solana.</span>
    </motion.h2>

    <motion.p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6" custom={2} variants={fadeUp}>
      Hubra is an earn aggregator wallet which is gasless by default. You can capture the best yields across all your wallets in one place
      with one-click strategies, staying fully non-custodial.
    </motion.p>

    <motion.p className="text-base font-bold text-gray-300 leading-relaxed mb-1" custom={3} variants={fadeUp}>
      Limited offer
    </motion.p>

    <motion.div className="inline-flex items-center gap-2 px-6 py-3 rounded-full  bg-primary-500/10" custom={3} variants={fadeUp}>
      <span className="text-primary-400 font-bold text-sm">ZERO FEES</span>
      <span className="text-white text-sm">on all transactions</span>
    </motion.div>
  </motion.div>
));

AboutSection.displayName = "AboutSection";

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
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm"
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

const CTASection = memo(() => (
  <motion.div animate="visible" className="text-center" initial="hidden" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
    <motion.div custom={0} variants={fadeUp}>
      <motion.a
        className="inline-flex items-center justify-center px-10 py-4 md:px-14 md:py-5 rounded-full bg-primary-500 hover:bg-primary-600 transition-all duration-200 text-lg md:text-xl font-bold text-white shadow-xl shadow-primary-500/20"
        href="/link"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        Get Started
      </motion.a>
    </motion.div>
  </motion.div>
));

CTASection.displayName = "CTASection";

const HowToEnterSection = memo(() => (
  <motion.div
    className="max-w-3xl mx-auto"
    initial="hidden"
    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    viewport={{ once: true, margin: "-100px" }}
    whileInView="visible">
    <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center" custom={0} variants={fadeUp}>
      How to Enter
    </motion.h2>

    <div className="space-y-6">
      {ENTRY_STEPS.map((step, index) => (
        <motion.div
          key={index}
          className="group relative flex items-start gap-4 md:gap-6 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/0  hover:border-primary-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
          custom={index + 1}
          variants={fadeUp}>
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30">
            <span className="text-2xl md:text-3xl font-bold text-primary-300">{`0${index + 1}`}</span>
          </div>

          <div className="h-[2px] w-8 md:w-12 lg:w-16 bg-gradient-to-r from-primary-400/50 to-transparent mt-6 md:mt-7 flex-shrink-0" />

          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-gray-200 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">{step.title}</h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

HowToEnterSection.displayName = "HowToEnterSection";

const EligibilitySection = memo(() => (
  <motion.div
    className="max-w-3xl mx-auto"
    initial="hidden"
    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    viewport={{ once: true, margin: "-100px" }}
    whileInView="visible">
    <motion.h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center" custom={0} variants={fadeUp}>
      Eligibility & Terms
    </motion.h2>

    <div className="space-y-3">
      {ELIGIBILITY_TERMS.map((term, index) => (
        <motion.div
          key={index}
          className="flex items-start gap-3 md:gap-4 p-5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300"
          custom={index + 1}
          variants={fadeUp}>
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-400 mt-2 shadow-lg shadow-primary-400/50" />
          <p className="text-gray-200 text-base md:text-lg leading-relaxed">{term}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

EligibilitySection.displayName = "EligibilitySection";

const Footer = memo(() => (
  <div className="border-t border-white/10 pt-8 pb-4 text-center">
    <p className="text-gray-500 text-sm">© 2025 Hubra · DeFi made simple</p>
  </div>
));

Footer.displayName = "Footer";

export const BP2025Landing = memo(() => {
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccessGranted = () => {
    setHasAccess(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bp2025_access", "true");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAccess = sessionStorage.getItem("bp2025_access");

      if (savedAccess === "true") {
        setHasAccess(true);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      <AccessModal isOpen={!hasAccess} onAccessGranted={handleAccessGranted} />
      <Background />

      <div className="relative mx-auto max-w-4xl px-4 pt-10 md:pt-20 pb-2 flex flex-col gap-20 md:gap-28">
        <EventHeader />
        <AboutSection />
        <FeaturesSection />
        <CTASection />
        <HowToEnterSection />
        <EligibilitySection />
        <CTASection />

        <Footer />
      </div>
    </div>
  );
});

BP2025Landing.displayName = "BP2025Landing";
