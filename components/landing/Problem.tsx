"use client";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const painPoints = [
  {
    icon: "ri:layout-grid-fill",
    title: "Scattered everywhere",
    desc: "Too many tabs. Too many dashboards. Nothing in one place.",
  },
  {
    icon: "ri:time-fill",
    title: "Always watching",
    desc: "Rates shift overnight. You check at 2am because you don't want to miss out.",
  },
  {
    icon: "ri:speed-fill",
    title: "Too slow to act",
    desc: "A better opportunity shows up. By the time you act, it's gone.",
  },
  {
    icon: "ri:repeat-fill",
    title: "Manual busywork",
    desc: "Moving funds between protocols manually. Every. Few. Days.",
  },
  {
    icon: "ri:battery-low-fill",
    title: "Effort without reward",
    desc: "More time managing positions than actually earning.",
  },
];

export function Problem() {
  return (
    <Section>
      <div className="flex flex-col lg:flex-row gap-14 lg:gap-24">
        <div className="lg:w-2/5 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            description={
              <>
                You got into crypto for freedom.
                <br />
                Instead, you got a second job.
              </>
            }
            eyebrow="The problem"
            title={<>DeFi shouldn&apos;t feel like a&nbsp;full-time&nbsp;job.</>}
          />
        </div>

        <div className="flex flex-col gap-10 lg:w-3/5">
          {painPoints.map((point, i) => (
            <div key={i} className="group flex items-start gap-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-lg text-primary" icon={point.icon} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-white font-semibold text-[17px]">{point.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
