"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, Download } from "lucide-react";
import { Icon } from "@iconify/react";

import { AuroraText } from "@/components/ui/aurora-text";

/* -------------------------------------------------------------
   Animations
------------------------------------------------------------- */

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
};

/* -------------------------------------------------------------
   Background — Cinematic, clean, ultra-lightweight
------------------------------------------------------------- */

const Background = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Aurora blobs */}
    <div className="absolute left-1/3 -top-40 h-[600px] w-[600px] rounded-full bg-primary-400/20 blur-[170px] animate-pulse-slow" />
    <div className="absolute bottom-0 right-20 h-[500px] w-[500px] rounded-full bg-success-400/20 blur-[160px] animate-pulse-slower" />

    {/* Micro floating dust */}
    <div className="absolute inset-0">
      {[...Array(35)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/10 animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------
   Component
------------------------------------------------------------- */

export function BP2025Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-white">
      <Background />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 lg:py-36">
        {/* -------------------------------------------------------------
           HERO
        ------------------------------------------------------------- */}
        <motion.div
          animate="visible"
          className="text-center mb-20 md:mb-32"
          initial="hidden"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div
            className="mx-auto mb-6 md:mb-8 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-md shadow-md"
            custom={0}
            variants={fadeUp}>
            <Image alt="Hubra Logo" className="md:w-[60px] md:h-[60px]" height={50} src="/logo.svg" width={50} />
          </motion.div>

          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight" custom={1} variants={fadeUp}>
            Try Hubra
          </motion.h1>

          <motion.div className="mt-4" custom={2} variants={fadeUp}>
            <AuroraText className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-extrabold">WIN $250</AuroraText>
          </motion.div>

          <motion.p
            className="mt-4 md:mt-5 text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto px-2"
            custom={3}
            variants={fadeUp}>
            A chance to win. 4 winners announced on Christmas Eve.
          </motion.p>

          <motion.p className="mt-2 text-xs sm:text-sm text-gray-500 px-4" custom={4} variants={fadeUp}>
            Giveaway is optional and chance-based. Not guaranteed.
          </motion.p>
        </motion.div>

        {/* -------------------------------------------------------------
           HOW TO JOIN
        ------------------------------------------------------------- */}
        <motion.div
          className="mb-20 md:mb-32"
          initial="hidden"
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
          viewport={{ once: true }}
          whileInView="visible">
          <div className="flex items-center justify-center">
            <AuroraText
              className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-10 md:mb-14 text-success-400"
              colors={["#2ED387", "#2ED387", "#2ED387"]}>
              How to enter
            </AuroraText>
          </div>

          <div className="mx-auto max-w-3xl space-y-8 md:space-y-12">
            {["Download or use the web app", "Create an account", "Open an Earn position OR stake with raSOL"].map((text, index) => (
              <motion.div key={index} className="flex items-start gap-4 md:gap-6" custom={index + 1} variants={fadeUp}>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-400 flex-shrink-0">{`0${index + 1}`}</div>

                <div className="h-[2px] w-8 md:w-12 lg:w-16 bg-primary-400/30 mt-3 md:mt-4 flex-shrink-0" />

                <p className="flex-1 text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* -------------------------------------------------------------
           VERIFICATION
        ------------------------------------------------------------- */}
        <motion.div
          className="mb-16 md:mb-28 text-center"
          initial="hidden"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          viewport={{ once: true }}
          whileInView="visible">
          <motion.h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 md:mb-6" custom={0} variants={fadeUp}>
            How we verify your entry
          </motion.h3>

          <motion.p className="text-gray-300 max-w-xl mx-auto leading-relaxed text-sm sm:text-base px-4" custom={1} variants={fadeUp}>
            We automatically track account creation, Earn positions or raSOL staking, and your event QR/UTM code. No forms, no screenshots.
          </motion.p>
        </motion.div>

        {/* -------------------------------------------------------------
           CTA - Download/Open App
        ------------------------------------------------------------- */}
        <motion.div
          animate="visible"
          className="mb-12 md:mb-16"
          initial="hidden"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.h3
            className="text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-6 md:mb-8"
            custom={0}
            variants={fadeUp}>
            Get Started
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* App Store */}
            <motion.a
              className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300"
              custom={0}
              href="https://apps.apple.com/app/hubra"
              rel="noopener noreferrer"
              target="_blank"
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}>
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/10 group-hover:bg-primary-400/20 flex items-center justify-center transition-colors">
                <Icon height="24" icon="mingcute:appstore-fill" width="24" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-400 mb-1">Download on</div>
                <div className="text-base md:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  App Store
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </motion.a>

            {/* Google Play */}
            <motion.a
              className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300"
              custom={1}
              href="https://play.google.com/store/apps/details?id=app.hubra"
              rel="noopener noreferrer"
              target="_blank"
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}>
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/10 group-hover:bg-primary-400/20 flex items-center justify-center transition-colors">
                <Icon height="24" icon="simple-icons:googleplay" width="24" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-400 mb-1">Get it on</div>
                <div className="text-base md:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  Google Play
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </motion.a>

            {/* Solana Mobile */}
            <motion.a
              className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300"
              custom={2}
              href="https://hubra.app"
              rel="noopener noreferrer"
              target="_blank"
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}>
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/10 group-hover:bg-primary-400/20 flex items-center justify-center transition-colors">
                <Icon height="24" icon="formkit:solana" width="24" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-400 mb-1">Available on</div>
                <div className="text-base md:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  Solana Mobile
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </motion.a>

            {/* Web App */}
            <motion.a
              className="group relative flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300"
              custom={3}
              href="https://hubra.app"
              rel="noopener noreferrer"
              target="_blank"
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}>
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/10 group-hover:bg-primary-400/20 flex items-center justify-center transition-colors">
                <Icon height="24" icon="stash:globe" width="24" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-400 mb-1">Use in browser</div>
                <div className="text-base md:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  Open Web App
                </div>
              </div>
              <Globe className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </motion.a>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="border-t border-white/10 pt-6 md:pt-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto px-4">
            © 2025 Hubra. Giveaway is optional, chance-based, and subject to terms. No purchase necessary.
          </p>
        </div>
      </div>
    </div>
  );
}
