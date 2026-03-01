"use client";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const features = [
  {
    icon: "ri:seedling-fill",
    title: "Earn Vaults",
    desc: "Deposit SOL, USDC, or USDT. You get ra-tokens that grow in value as yield accrues. No claiming, no compounding. It just works.",
  },
  {
    icon: "ri:robot-2-fill",
    title: "Copilot",
    desc: "Turn it on once. Copilot puts idle tokens to work and moves them when rates improve by at least 1%. It checks continuously.",
  },
  {
    icon: "ri:line-chart-fill",
    title: "Token Trends",
    desc: "Six views into Solana tokens: New, Best of Solana, Most Traded, Gainers, Newcomers, and the full list. Safety filters catch rugs before you do.",
  },
  {
    icon: "ri:flashlight-fill",
    title: "Instant Unstake",
    desc: "Unstake SOL in seconds instead of waiting for epochs. Full or partial. Powered by Sanctum. Gasless.",
  },
  {
    icon: "ri:dashboard-fill",
    title: "Portfolio",
    desc: "All your assets and yield positions in one place. Send, convert, or withdraw in a tap. Drill into any position when you need to.",
  },
  {
    icon: "ri:gas-station-fill",
    title: "Zero Gas Fees",
    desc: "Swaps, deposits, unstaking. Hubra covers all network fees. You never pay gas.",
  },
];

export function Features() {
  return (
    <Section className="bg-mesh-purple">
      <SectionHeader
        center
        description="These aren't roadmap items. They're live, shipped, and working."
        eyebrow="Features"
        title="What you can do today"
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
