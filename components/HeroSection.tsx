'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const HeroSection = (): JSX.Element => {
  // Generate random particles with animation
  const [randomParticles, setRandomParticles] = useState<{top: number, left: number, size: number, delay: number}[]>([]);
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
      <div className="absolute top-[0%] left-[8%]">
        <Image src="/image/pink-orb1.png" alt="Pink Orb" width={425} height={167} quality={100}/>
      </div>


      {/* Pink gradient effect with bottom-to-top animation */}
      <div className="absolute w-[487px] h-[507px] top-[30%] right-[15%] flex justify-center items-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: -90, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut",
            delay: 0.3 // Slight delay for better visual effect
          }}
        >
          <Image src="/image/hero-ball.png" alt="Pink Gradient" width={480} height={507} quality={100}/>
        </motion.div>
        <div className="absolute top-[20px] left-[22%] w-[370px] h-full rounded-[9999px_9999px_0px_0px] bg-[linear-gradient(180deg,rgba(235,66,181,1)_0%,rgba(235,66,181,0)_85%)] opacity-[0.2]" >
          <Image className="absolute top-[150px] left-[10px]" src="/image/ball-back.svg" alt="Pink Gradient" width={350} height={507} quality={100}/>
        </div>
      </div>


      {/* Main content text */}
      <div className="flex flex-col w-[580px] items-start gap-5 absolute top-[200px] left-[100px]">
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

        <h1 className="relative w-[525px] mt-[-1.00px] [font-family:'Geist',Helvetica] font-semibold text-white text-[52px] tracking-[-1.04px] leading-[54.6px]">
          The Power Of CEX. The Freedom Of DeFi.
        </h1>
        <p className="relative w-[482px] [font-family:'Geist',Helvetica] font-normal text-[#787b91] text-lg tracking-[0] leading-[26px]">
          Hubra is the first truly all-in-one platform. Manage, Explore,
          Earn—across any device.
        </p>
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute bottom-0 left-0 w-[660px]  h-[304px] pointer-events-none select-none">
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
