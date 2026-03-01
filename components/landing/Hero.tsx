"use client";
import Image from "next/image";

import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";

export function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden rounded-none md:rounded-3xl bg-[url('/image/hero-bg1.png')] bg-cover bg-center">
      <div className="absolute inset-0 z-0">
        <Image
          priority
          alt=""
          className="absolute opacity-80 top-0 left-1/2 -translate-x-1/2 md:left-[16%] md:translate-x-0"
          height={124}
          src="/image/pink-orb1.png"
          width={360}
        />
        <Image priority alt="" className="absolute top-0 right-0 opacity-50" height={124} src="/image/top-m.png" width={360} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-7 px-6 max-w-3xl hero-entrance">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm">
          <span className="text-white text-sm">Built on</span>
          <Image alt="Solana" height={15} src="/image/solana.png" width={20} />
          <span className="text-white text-sm">Solana</span>
        </div>

        <h1 className="font-sans text-[clamp(2.75rem,5.5vw,5.5rem)] font-semibold tracking-[-0.04em] leading-[1.04] text-white">
          Your Own
          <br />
          <span className="text-primary">AI DeFi Agent.</span>
        </h1>

        <p className="max-w-lg text-white/50 text-base md:text-lg leading-relaxed">
          Earn yield, discover tokens, unstake instantly. Hubra finds the best rates and moves your funds.{" "}
          <span className="text-white font-medium">Automatically.</span> <span className="text-primary font-medium">Gasless.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            className="px-8 py-3.5 bg-primary text-black font-bold rounded-full hover:bg-primary/85 transition-colors text-center text-[15px]"
            href="https://hubra.app">
            Launch App
          </a>
          <a
            className="px-8 py-3.5 border border-white/15 text-white font-medium rounded-full hover:bg-white/[0.06] transition-colors text-center text-[15px]"
            href="https://docs.hubra.app"
            rel="noopener noreferrer"
            target="_blank">
            Read the Docs
          </a>
        </div>
      </div>

      <div className="absolute satellite-position w-[375px] h-[180px] md:w-[660px] md:h-[304px] pointer-events-none select-none z-20">
        <Image fill priority alt="" className="w-[400px] h-[300px]" quality={100} src="/image/globe.png" />
        <AnimatedSatelliteOrbit />
      </div>
    </section>
  );
}
