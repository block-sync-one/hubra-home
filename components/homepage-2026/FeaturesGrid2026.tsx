"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * FeaturesGrid2026 - 4-Card Feature Grid
 *
 * Layout: 2x2 on desktop, stacked on mobile
 * Copy direction: Benefits, not features. What the user *feels*, not what we *do*.
 *
 * Card treatment:
 * - Glass card (--hp-card-glass)
 * - Icon: 32px, gold-400 accent
 * - Title: --hp-body-large, white
 * - Description: --hp-body, gray-300
 * - Subtle hover lift (2px translateY)
 */

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "⛽️",
    title: "Zero gas fees",
    description: "Every transaction is on us. You just see your money grow.",
  },
  {
    icon: "🔑",
    title: "Sign in like normal",
    description: "Google, Apple, email. No seed phrases, no wallet apps.",
  },
  {
    icon: "📈",
    title: "Always the best rate",
    description: "We automatically find the highest yields across protocols.",
  },
  {
    icon: "✨",
    title: "It's just money",
    description: "Deposit dollars. Earn more. That's the whole story.",
  },
];

export const FeaturesGrid2026 = (): JSX.Element => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
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

  return (
    <section ref={ref} className="w-full py-24 px-6" style={{ backgroundColor: "var(--hp-section-alt)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div animate={isInView ? "visible" : "hidden"} className="text-center mb-16" initial="hidden" variants={cardVariants}>
          <h2 className="font-sans font-semibold text-white tracking-tight" style={{ fontSize: "var(--hp-section-title)" }}>
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto" style={{ fontSize: "var(--hp-body-large)" }}>
            We removed everything that makes crypto feel like crypto.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          variants={containerVariants}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--hp-card-glass)",
                borderRadius: "var(--hp-card-radius)",
                border: "1px solid var(--hp-card-border)",
              }}
              variants={cardVariants}>
              {/* Subtle hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  borderRadius: "var(--hp-card-radius)",
                  boxShadow: "inset 0 0 60px rgba(230, 184, 0, 0.03)",
                }}
              />

              {/* Icon */}
              <div className="text-3xl mb-4" style={{ color: "var(--hp-gold-400)" }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-sans font-medium text-white mb-2" style={{ fontSize: "var(--hp-body-large)" }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed" style={{ fontSize: "var(--hp-body)" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
