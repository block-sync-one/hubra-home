"use client";
import { Section, SectionHeader } from "./Section";

const steps = [
  {
    num: "01",
    title: "Connect your wallet",
    desc: "Link your Solana wallet. Non-custodial. Your keys stay yours.",
  },
  {
    num: "02",
    title: "Set your goals",
    desc: "Pick a strategy, set risk limits. Tell the agent what matters to you.",
  },
  {
    num: "03",
    title: "Agent executes",
    desc: "Hubra finds the best opportunities and moves your funds.",
  },
  {
    num: "04",
    title: "Ongoing adjustments",
    desc: "Markets shift. The agent re-evaluates and repositions — continuously.",
  },
];

export function HowItWorks() {
  return (
    <Section>
      <SectionHeader
        center
        description="No manual execution. No guesswork."
        eyebrow="How it works"
        title={<>Four steps. That&apos;s&nbsp;it.</>}
      />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
        <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative flex flex-col items-start lg:items-center text-left lg:text-center gap-5 px-2 py-6 lg:py-0 group">
            <span className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-primary/20 group-hover:text-primary/40 transition-colors select-none">
              {step.num}
            </span>
            <h3 className="font-sans text-white font-semibold text-lg">{step.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-[260px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
