"use client";
import { Section, SectionHeader } from "./Section";

const steps = [
  {
    num: "01",
    title: "Connect your wallet",
    desc: "Link your Solana wallet or sign in with Google. Non-custodial. Your keys stay yours.",
  },
  {
    num: "02",
    title: "Deposit your assets",
    desc: "Pick an asset. SOL, USDC, USDT, and more. Drop it into an Earn vault.",
  },
  {
    num: "03",
    title: "Earn automatically",
    desc: "Copilot finds the best yields and rebalances every 30 minutes. No manual work.",
  },
  {
    num: "04",
    title: "Withdraw anytime",
    desc: "No lockups, no cooldowns. Your funds are always liquid and accessible.",
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

      <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
        <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        {steps.map((step, i) => (
          <div key={i} className="relative flex flex-col items-start lg:items-center text-left lg:text-center gap-4 px-2 group">
            <span className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-primary/15 group-hover:text-primary/35 transition-colors duration-300 select-none">
              {step.num}
            </span>
            <h3 className="font-sans text-white font-semibold text-lg">{step.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-[260px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
