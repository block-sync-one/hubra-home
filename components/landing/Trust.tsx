"use client";
import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { Section, SectionHeader } from "./Section";

const stats = [
  { value: 150, suffix: "M+", label: "Total value optimized" },
  { value: 40, suffix: "+", label: "Protocols integrated" },
  { value: 98.7, suffix: "%", label: "Uptime" },
  { value: 30, suffix: "min", label: "Re-evaluation cycle" },
];

const differentiators = [
  {
    icon: "ri:brain-fill",
    title: "AI-native from day one",
    desc: "Not a dashboard with AI bolted on. The agent is the product.",
  },
  {
    icon: "ri:user-settings-fill",
    title: "You set the rules",
    desc: "Every action is permissioned. You define risk limits, strategies, and boundaries.",
  },
  { icon: "ri:key-fill", title: "Non-custodial", desc: "Your keys, your wallet. Hubra never holds your funds." },
  {
    icon: "ri:file-list-3-fill",
    title: "Transparent actions",
    desc: "Full activity log. Every move the agent makes is visible and auditable.",
  },
];

function AnimatedNumber({ suffix, target }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered || !ref.current) return;
    const el = ref.current;
    const isFloat = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = ease * target;

      el.textContent = `${isFloat ? current.toFixed(1) : Math.round(current)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Trust() {
  return (
    <Section>
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 py-12 md:py-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
        {stats.map((s, i) => (
          <div key={i} className="relative flex flex-col items-center text-center gap-2">
            <span className="font-sans text-3xl md:text-4xl font-bold tracking-tight text-white">
              <AnimatedNumber suffix={s.suffix} target={s.value} />
            </span>
            <span className="text-white/40 text-sm">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-24 flex flex-col lg:flex-row gap-14 lg:gap-24">
        <div className="lg:w-2/5 lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            eyebrow="Why Hubra"
            title={
              <>
                Built as an agent.
                <br />
                Not retrofitted into&nbsp;one.
              </>
            }
          />
        </div>

        <div className="flex flex-col gap-10 lg:w-3/5">
          {differentiators.map((d, i) => (
            <div key={i} className="group flex items-start gap-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-lg text-primary" icon={d.icon} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-white font-semibold text-[17px]">{d.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
