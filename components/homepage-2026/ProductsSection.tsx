"use client";
import { motion } from "framer-motion";
import { Eye, ArrowLeftRight, Lock, TrendingUp } from "lucide-react";

const products = [
  {
    icon: Eye,
    title: "Eagle Eye",
    description: "Track your entire portfolio from one dashboard",
  },
  {
    icon: ArrowLeftRight,
    title: "Swap",
    description: "Trade any token with minimal fees",
  },
  {
    icon: Lock,
    title: "Stake",
    description: "Earn with raSOL — our liquid staked SOL",
  },
  {
    icon: TrendingUp,
    title: "Earn",
    description: "Access the best yields across Solana DeFi",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Everything you need.
            <br />
            <span className="text-[#797B92]">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              className="group p-6 bg-card rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                <product.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
              <p className="text-[#797B92] text-sm leading-relaxed">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
