'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "@/lib/useWindowSize";


export const HeroSection = (): JSX.Element => {
  // Fixed particles matching the SVG file positions and sizes
  const [isMounted, setIsMounted] = useState(false);
  const { isMobile } = useWindowSize();

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Particles data positioned around the pink gradient effect
  // Adjusted to appear within the gradient container area
  const particles = [
    { top: -5, left: 40, size: 32, opacity: 0.12, delay: 0 }, // Top left of gradient
    { top: 30, left: 0, size: 24, opacity: 0.46, delay: 0.5 }, // Center area
    { top: 40, left: 100, size: 32, opacity: 0.42, delay: 1 }, // Bottom left
    { top: 25, left: 90, size: 9.624, opacity: 1, delay: 1.5 }, // Upper center
    { top: 45, left: 5, size: 11, opacity: 1, delay: 2 }, // Lower right
    { top: 20, left: 10, size: 8, opacity: 1, delay: 2.5 }, // Middle left
  ];
  

  return (
    <Card className="relative w-full h-[676px] bg-[url('/image/hero-bg1-m.png')] md:bg-[url('/image/hero-bg1.png')] bg-cover bg-center rounded-none md:rounded-3xl overflow-hidden border-none">

      {/* Fixed particles matching SVG file positions and sizes */}
      {isMounted && (
        <div
          className="absolute pointer-events-none z-20 hero-container"
        >
          {particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, p.opacity, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: p.delay, repeatType: "loop" }}
              style={{
                position: "absolute",
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.size <= 12 ? `radial-gradient(circle, ${isMobile ? "#E02BA7" : "#FEC84B"} 0%, ${isMobile ? "#E02BA7" : "#FEC84B"} 100%)` : p.size <= 24 ? `radial-gradient(50% 50% at 50% 50%, ${isMobile ? "#E02BA7" : "#FEC84B"} 0%, ${isMobile ? "#E02BA7" : "#FEC84B"} 100%)` : `radial-gradient(circle, ${isMobile ? "#E02BA7" : "#FEC84B"} 0%, ${isMobile ? "#E02BA7" : "#FEC84B"} 100%)`,
                pointerEvents: "none",
                transform: "translate(-50%, -50%)", // Center the particles on their coordinates
              }}
            />
          ))}
        </div>
      )}

      {/* Pink orb effect */}
      <div className="absolute top-[0%] md:left-[8%] z-0 right-0">
        <Image src="/image/pink-orb.png" alt="Pink Orb" width={425} height={167} quality={100} className="flex md:hidden" />
        <Image src="/image/pink-orb1.png" alt="Pink Orb" width={425} height={167} quality={100} className="md:flex hidden" />
      </div>


      {/* Pink gradient effect with bottom-to-top animation */}
      <div className="absolute w-full h-full flex justify-center items-center md:w-[487px] md:h-[507px] md:flex md:justify-center md:items-center hero-container">
        <div
          className="flex justify-center items-center relative"
        >
          <div className="absolute top-20px w-full h-full flex justify-center items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -90, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.3
              }}
              className="absolute"
            >
              <Image
                src="/image/hero-ball.svg"
                alt="Pink Gradient"
                width={240}
                height={240}
                className="object-contain hero-image"
                unoptimized
              />
            </motion.div>
          </div>

          <div
            className="h-full rounded-[9999px_9999px_0px_0px] bg-gradient-hero opacity-[0.2] flex justify-center items-center hero-gradient"
          >
            <div
              className="flex items-start p-1 overflow-hidden hero-bars"
            >
              <div
                className="h-full bg-gradient-bars hero-bar"
              />
              <div
                className="h-full bg-gradient-bars hero-bar"
              />
              <div
                className="h-full bg-gradient-bars hero-bar"
              />
              <div
                className="h-full bg-gradient-bars hero-bar"
              />
            </div>
          </div>
        </div>
      </div>


      {/* Main content text */}
      <div className="flex flex-col w-full items-start gap-5 absolute main-content-position">
        <div className="inline-flex items-center justify-end gap-2 px-3 py-2 bg-transparent border border-white/10 rounded-full">
          <span className="w-fit mt-[-1.00px] font-medium text-white text-sm font-medium">
            Built on
          </span>
          <Image
            alt="Group"
            src="/image/solana.png"
            width={20}
            height={14.94}
          />
          <span className="w-fit mt-[-1.00px] font-medium text-white text-sm font-medium">
            Solana
          </span>
        </div>
        <div className="max-w-lg">
          <h1 className="relative w-full mt-[-1.00px] font-geist text-white text-3xl md:text-5xl font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px]">
            The Power Of CEX.
          </h1>
          <h1 className="relative w-full  font-geist text-white text-3xl md:text-5xl  font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px]">
            The Freedom Of DeFi.
          </h1>
          <p className="relative max-w-md font-geist text-gray-400/70 text-lg leading-[26px] font-normal">
          Hubra is the first truly all-in-one platform. Manage, Explore,
          Earn—across any device.
        </p>
        </div>
        
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute satellite-position w-[660px] h-[304px] pointer-events-none select-none">
        <Image
          alt="Mask group"
          src="/image/globe.png"
          quality={100}
          fill
          className="hidden md:flex"
        />
        <Image
          alt="Mask group"
          src="/image/globe-m.png"
          quality={100}
          fill
          className="md:hidden flex"
        />
        {/* Animated satellite overlay */}
        <AnimatedSatelliteOrbit />
      </div>
    </Card>
  );
};
