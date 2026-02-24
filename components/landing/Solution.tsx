"use client";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const capabilities = [
  { icon: "ri:eye-fill", title: "Watches", desc: "Your portfolio and the market, around the clock." },
  { icon: "ri:search-fill", title: "Finds", desc: "The best yield opportunities across vetted protocols." },
  { icon: "ri:swap-fill", title: "Moves", desc: "Your funds when something meaningfully better shows up." },
  { icon: "ri:equalizer-fill", title: "Adjusts", desc: "Continuously — re-evaluating every 30 minutes." },
];

export function Solution() {
  return (
    <Section className="bg-mesh-gold">
      <div className="flex flex-col lg:flex-row gap-14 lg:gap-24">
        <div className="lg:w-1/2 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            description="Hubra is not another dashboard. It's an agent that operates onchain — for you. Every action is gasless."
            eyebrow="The shift"
            title={
              <>
                A better way
                <br />
                to do DeFi
              </>
            }
          />
          <p className="text-white/35 text-base leading-relaxed mt-4">You tell it what you want. It figures out how to get there.</p>
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
