"use client";
import { Section } from "./Section";

export function CTA() {
  return (
    <Section className="bg-mesh-cta">
      <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-primary/70">Where this is going</span>

        <h2 className="font-sans text-[clamp(2rem,3.5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.08] text-white">
          The future of DeFi is <span className="text-primary">intent-driven.</span>
        </h2>

        <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg">
          You won&apos;t manage every transaction. You&apos;ll set goals. Your agent will handle the rest. That shift is already happening.
          Hubra is how you get there.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            className="px-10 py-4 bg-primary text-black font-bold rounded-full hover:bg-primary/85 transition-colors text-center text-[15px]"
            href="https://hubra.app">
            Start using your agent
          </a>
          <a
            className="px-10 py-4 border border-white/15 text-white font-medium rounded-full hover:bg-white/[0.06] transition-colors text-center text-[15px]"
            href="https://docs.hubra.app"
            rel="noopener noreferrer"
            target="_blank">
            Read the Docs
          </a>
        </div>

        <p className="text-white/25 text-sm mt-6">Non-custodial. Gasless. Permissioned. Transparent.</p>
      </div>
    </Section>
  );
}
