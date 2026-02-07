"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Headline */}
        <h2 
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
        >
          Ready to start earning?
        </h2>
        <p 
          className="text-lg mb-10"
          style={{ color: "#A1A1AA" }}
        >
          Join thousands of users earning yield on Solana — the easy way.
        </p>

        {/* CTA Button */}
        <Link
          href={siteConfig.links.app}
          className="inline-flex px-10 py-4 font-semibold rounded-lg transition-transform active:scale-[0.97]"
          style={{ 
            backgroundColor: "#E6B800",
            color: "#0D0D0F",
          }}
        >
          Launch App
        </Link>

        {/* Subtle note */}
        <p 
          className="mt-6 text-sm"
          style={{ color: "#52525B" }}
        >
          No wallet required. Sign up with email.
        </p>
      </motion.div>
    </section>
  );
}
