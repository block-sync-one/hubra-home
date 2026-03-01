"use client";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const capabilities = [
  {
    icon: "ri:seedling-fill",
    title: "Earn",
    desc: "Deposit and earn yield. Your ra-tokens grow in value over time. Nothing to claim, nothing to reinvest.",
  },
  {
    icon: "ri:robot-2-fill",
    title: "Copilot",
    desc: "Finds the best yields and moves your funds when better rates show up. Runs around the clock.",
  },
  {
    icon: "ri:line-chart-fill",
    title: "Trends",
    desc: "Six market lenses with built-in safety filters. Updated every 10 minutes so you see what's actually moving.",
  },
  {
    icon: "ri:flashlight-fill",
    title: "Instant Unstake",
    desc: "Get your staked SOL back in seconds. No waiting for epochs. Full or partial.",
  },
];

export function Solution() {
  return (
    <Section className="bg-mesh-gold">
      <div className="flex flex-col lg:flex-row gap-14 lg:gap-24">
        <div className="lg:w-1/2 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            description="Earn yield, discover tokens, unstake instantly. All from one place. Every action is gasless."
            eyebrow="The platform"
            title={
              <>
                Everything you need.
                <br />
                Nothing you don&apos;t.
              </>
            }
          />
          <p className="text-white/35 text-base leading-relaxed mt-4">Built on Solana. Non-custodial. Open source.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-1/2">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 p-7 rounded-2xl bg-white/[0.025] hover:bg-white/[0.045] transition-[background-color] duration-300">
              <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="text-base text-primary" icon={cap.icon} />
              </div>
              <h3 className="font-sans text-white font-semibold text-lg leading-snug">{cap.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
