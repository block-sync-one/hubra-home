"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to simplify DeFi?
          </h2>
          <p className="text-lg text-[#797B92] mb-10">
            Connect your wallet and start earning in seconds.
          </p>

          {/* CTA Button */}
          <Link
            href={siteConfig.links.app}
            className="inline-flex px-10 py-5 bg-primary text-background text-lg font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
