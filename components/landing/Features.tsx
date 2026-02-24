"use client";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const features = [
  {
    icon: "ri:funds-fill",
    title: "Yield optimization",
    desc: "Scans lending, staking, and LP pools across vetted Solana protocols. Moves your funds where returns are highest — automatically.",
  },
  {
    icon: "ri:shield-check-fill",
    title: "Risk management",
    desc: "Sets exposure limits and monitors health factors. Pulls back before things go south.",
  },
  {
    icon: "ri:scales-fill",
    title: "Automated rebalancing",
    desc: "When allocations drift, your agent brings them back in line with your targets.",
  },
  {
    icon: "ri:flashlight-fill",
    title: "Strategy execution",
    desc: "Pick a strategy — conservative, balanced, aggressive. The agent handles the rest.",
  },
  {
    icon: "ri:radar-fill",
    title: "Onchain monitoring",
    desc: "Tracks opportunities across protocols and chains, and moves when it makes sense.",
  },
  {
    icon: "ri:notification-3-fill",
    title: "Smart alerts",
    desc: "Notifications when something needs your attention. Autonomous action when it doesn't.",
  },
];

export function Features() {
  return (
    <Section className="bg-mesh-purple">
      <SectionHeader
        center
        description="Not a list of technical features. These are outcomes."
        eyebrow="Capabilities"
        title="What your agent actually does"
      />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        {features.map((f, i) => (
          <div key={i} className="group flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="text-lg text-primary" icon={f.icon} />
            </div>
            <h3 className="font-sans text-white font-semibold text-[17px]">{f.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
