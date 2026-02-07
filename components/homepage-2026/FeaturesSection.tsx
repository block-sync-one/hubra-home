"use client";

import { motion } from "framer-motion";
import { Wallet, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Social Login",
    description: "Sign in with email or Google. No seed phrases, no extensions. Your wallet is created automatically.",
  },
  {
    icon: Zap,
    title: "Gasless",
    description: "Every transaction is sponsored. No SOL needed for fees. Just connect and go.",
  },
  {
    icon: TrendingUp,
    title: "Earn Aggregator",
    description: "One dashboard for all DeFi yields. Staking, lending, LPs — find the best rates instantly.",
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description: "Your keys, your crypto. We never hold your funds. Full self-custody, always.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
          >
            DeFi without the friction
          </h2>
          <p 
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            Everything you need to earn on Solana, nothing you don't.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: "#1A1A1E",
                borderColor: "#27272A",
              }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "#242428" }}
              >
                <feature.icon 
                  className="w-6 h-6" 
                  style={{ color: "#E6B800" }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Content */}
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: "#FFFFFF" }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: "#A1A1AA" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
