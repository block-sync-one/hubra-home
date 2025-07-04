'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const HeroSection = (): JSX.Element => {
  // Generate random particles with animation
  const [randomParticles, setRandomParticles] = useState<{ top: number, left: number, size: number, delay: number }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === 'undefined') return;

    const count = 10; // Number of particles
    const particles = Array.from({ length: count }).map(() => ({
      top: Math.random() * 80 + 10, // 10% to 90% vertical
      left: Math.random() * 80 + 10, // 10% to 90% horizontal
      size: Math.random() * 16 + 8, // 8px to 24px
      delay: Math.random() * 3, // random animation delay
    }));
    setRandomParticles(particles);
    // Optionally, re-randomize every 6s for dynamic effect
    const interval = setInterval(() => {
      setRandomParticles(Array.from({ length: count }).map(() => ({
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
        size: Math.random() * 16 + 8,
        delay: Math.random() * 3,
      })));
    }, 6000);
    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <Card className="relative w-full h-[676px] bg-[url('/image/hero-bg1.png')] bg-cover bg-center rounded-3xl overflow-hidden border-none">

      {/* Random animated particles OUTSIDE the pink gradient effect */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {randomParticles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: p.delay, repeatType: "loop" }}
              style={{
                position: "absolute",
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "radial-gradient(50% 50% at 50% 50%, rgba(243,125,205,0.7) 0%, rgba(227,64,175,0.5) 100%)",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Pink orb effect */}
      <div className="absolute -top-[5%] md:top-[0%] md:left-[8%] right-[0%]">
        <Image src="/image/pink-orb1.png" alt="Pink Orb" width={425} height={167} quality={100} />
      </div>


      {/* Pink gradient effect with bottom-to-top animation */}
      <div className="absolute top-[15%] w-full h-full flex justify-center items-center md:absolute md:w-[487px] md:h-[507px] md:top-[24%] md:right-[15%] md:flex md:justify-center md:items-center">
        <div
          className="relative flex justify-center items-center"
          style={{
            width: 'var(--hero-container-width)',
            height: 'var(--hero-container-height)'
          }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -90, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="absolute"
            style={{
              top: 'var(--hero-motion-top)',
              left: 'var(--hero-motion-left)'
            }}
          >
            <Image
              src="/image/hero-ball.png"
              alt="Pink Gradient"
              width={240}
              height={253}
              className="object-contain"
              style={{
                width: 'var(--hero-image-width)',
                height: 'var(--hero-image-height)'
              }}
              unoptimized
            />
          </motion.div>
          <div
            className="h-full rounded-[9999px_9999px_0px_0px] bg-[linear-gradient(180deg,rgba(235,66,181,1)_0%,rgba(235,66,181,0)_85%)] opacity-[0.2] flex justify-center items-center"
            style={{
              width: 'var(--hero-gradient-width)'
            }}
          >
            <div
              className="flex items-start p-1 overflow-hidden"
              style={{
                width: 'var(--hero-bars-width)',
                height: 'var(--hero-bars-height)',
                gap: 'var(--hero-bar-gap)'
              }}
            >
              <div
                className="h-full bg-[linear-gradient(0deg,rgba(255,75,198,0)_0%,rgba(184,71,148,1)_10%,rgba(255,75,198,0)_70%)]"
                style={{ width: 'var(--hero-bar-width)' }}
              />
              <div
                className="h-full bg-[linear-gradient(0deg,rgba(255,75,198,0)_0%,rgba(184,71,148,1)_10%,rgba(255,75,198,0)_70%)]"
                style={{ width: 'var(--hero-bar-width)' }}
              />
              <div
                className="h-full bg-[linear-gradient(0deg,rgba(255,75,198,0)_0%,rgba(184,71,148,1)_10%,rgba(255,75,198,0)_70%)]"
                style={{ width: 'var(--hero-bar-width)' }}
              />
              <div
                className="h-full bg-[linear-gradient(0deg,rgba(255,75,198,0)_0%,rgba(184,71,148,1)_10%,rgba(255,75,198,0)_70%)]"
                style={{ width: 'var(--hero-bar-width)' }}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Main content text */}
      <div className="flex flex-col w-full items-start gap-5 absolute top-[30px] md:top-[200px] left-[10px] md:left-[100px]">
        <div className="inline-flex items-center justify-end gap-[7px] px-3 py-2 rounded-[100px] border border-solid border-[#ffffff1a] bg-transparent">
          <span className="w-fit mt-[-1.00px] font-medium text-white text-sm tracking-[0] leading-[normal]">
            Built on
          </span>
          <Image
            alt="Group"
            src="/image/solana.png"
            width={20}
            height={14.94}
          />
          <span className="w-fit mt-[-1.00px] font-medium text-white text-sm tracking-[0] leading-[normal]">
            Solana
          </span>
        </div>
        <div>
          <h1 className="relative w-full md:w-[525px] mt-[-1.00px] [font-family:'Geist',Helvetica] font-semibold text-white text-[32px] md:text-[52px] tracking-[-1.04px] leading-[1.1] md:leading-[54.6px]">
            The Power Of CEX.
          </h1>
          <h1 className="relative w-full md:w-[525px] [font-family:'Geist',Helvetica] font-semibold text-white text-[32px] md:text-[52px] tracking-[-1.04px] leading-[1.1] md:leading-[54.6px]">
            The Freedom Of DeFi.
          </h1>
        </div>
        <p className="relative w-full md:w-[482px] [font-family:'Geist',Helvetica] font-normal text-[#787b91] text-lg tracking-[0] leading-[26px]">
          Hubra is the first truly all-in-one platform. Manage, Explore,
          Earn—across any device.
        </p>
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute -bottom-[5%] -left-[40%] md:bottom-0 md:left-0 w-[660px]  h-[304px] pointer-events-none select-none">
        <Image
          alt="Mask group"
          src="/image/globe.png"
          quality={100}
          fill
        />
        {/* Animated satellite overlay */}
        <AnimatedSatelliteOrbit />
      </div>
    </Card>
  );
};
