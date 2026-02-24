"use client";
import { Icon } from "@iconify/react";

const partners = [
  { name: "Jupiter", icon: "token-branded:jup" },
  { name: "Raydium", icon: "token-branded:ray" },
  { name: "Drift", icon: "token-branded:drift" },
  { name: "Jito", icon: "token-branded:jto" },
  { name: "Marinade", icon: "token-branded:mnde" },
  { name: "Orca", icon: "token-branded:orca" },
  { name: "MarginFi", icon: "token-branded:mfi" },
];

function ProtocolPill({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-300 whitespace-nowrap">
      <Icon className="text-xl" icon={icon} />
      <span className="text-white/60 text-sm font-medium">{name}</span>
    </div>
  );
}

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  const items = [...partners, ...partners];
  const anim = reverse ? "animate-marquee-reverse" : "animate-marquee";

  return (
    <div
      className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      style={{ "--duration": "30s", "--gap": "1rem" } as React.CSSProperties}>
      <div className={`flex shrink-0 gap-4 py-2 ${anim} group-hover:[animation-play-state:paused]`}>
        {items.map((p, i) => (
          <ProtocolPill key={`${p.name}-${i}`} icon={p.icon} name={p.name} />
        ))}
      </div>
      <div aria-hidden className={`flex shrink-0 gap-4 py-2 ${anim} group-hover:[animation-play-state:paused]`}>
        {items.map((p, i) => (
          <ProtocolPill key={`${p.name}-dup-${i}`} icon={p.icon} name={p.name} />
        ))}
      </div>
    </div>
  );
}

export function Partners() {
  return (
    <div className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 mb-12 flex flex-col items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-primary/70">Integrated protocols</span>
        <h3 className="font-sans text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white text-center">
          Built on Solana&apos;s best
        </h3>
        <p className="text-white/40 text-sm md:text-base text-center max-w-md">
          Your agent taps into the top DeFi protocols — no extra setup needed.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </div>
  );
}
