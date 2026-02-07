"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Eye, Smartphone } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Non-Custodial",
    description: "Your keys, your assets",
  },
  {
    icon: Zap,
    title: "Gasless",
    description: "No SOL needed for transactions",
  },
  {
    icon: Eye,
    title: "Transparent",
    description: "Open-source, clear fees",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Web, iOS, Android",
  },
];

export function TrustSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Built different.
          </h2>
        </motion.div>

        {/* Trust points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-white/5 text-white mb-4">
                <point.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{point.title}</h3>
              <p className="text-sm text-[#797B92]">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Partner logos placeholder */}
        <motion.div
          className="mt-16 pt-12 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-center text-sm text-[#797B92] mb-6">Powered by the best in Solana</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {/* Partner logos will go here - using text placeholders for now */}
            <span className="text-white/60 font-medium">Jupiter</span>
            <span className="text-white/60 font-medium">Marinade</span>
            <span className="text-white/60 font-medium">Sanctum</span>
            <span className="text-white/60 font-medium">Helius</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
