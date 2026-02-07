"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Sign in with email, Google, or your existing Solana wallet. Takes 10 seconds.",
  },
  {
    number: "02",
    title: "Deposit",
    description: "Add USDC, SOL, or any supported token. On-ramp with card if needed.",
  },
  {
    number: "03",
    title: "Earn",
    description: "Choose a yield strategy or let us find the best rate. Sit back and earn.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6" style={{ backgroundColor: "#0D0D0F" }}>
      <div className="max-w-4xl mx-auto">
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
            Three steps to earning
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-6 items-start"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              {/* Number */}
              <div 
                className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ 
                  backgroundColor: "#1A1A1E",
                  color: "#E6B800",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-base"
                  style={{ color: "#A1A1AA", lineHeight: 1.6 }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
