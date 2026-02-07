"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { siteConfig } from "@/config/site";

const features = [
  "Competitive APY",
  "Instant liquidity",
  "Use across DeFi",
];

export function RasolSection() {
  return (
    <section className="py-24 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* raSOL badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Liquid Staking
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Meet raSOL
          </h2>
          <p className="text-xl text-[#797B92] max-w-xl mx-auto mb-8">
            Hubra&apos;s liquid staked SOL. Stake, earn, stay liquid.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={siteConfig.links.app + "/earn"}
            className="inline-flex px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Stake Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
