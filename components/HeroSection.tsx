'use client'
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const HeroSection = (): JSX.Element => {
  // Fixed particles matching the SVG file positions and sizes
  const [isMounted, setIsMounted] = useState(false);

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
    <Card className="relative w-full h-[676px] bg-[url('/image/hero-bg1.png')] bg-cover bg-center rounded-none md:rounded-3xl overflow-hidden border-none">

      {/* Fixed particles matching SVG file positions and sizes */}
      {isMounted && (
        <div 
          className="absolute pointer-events-none z-10 hero-container"
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
                background: p.size <=12 ? "radial-gradient(circle, #FEC84B 0%, #FEAA01 100%)" : p.size <= 24 ? "radial-gradient(50% 50% at 50% 50%, #FEC84B 0%, #FEAA01 100%)" : "radial-gradient(circle, #FEC84B 0%, #FEAA01 100%)",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)", // Center the particles on their coordinates
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
      <div className="absolute w-full h-full flex justify-center items-center md:w-[487px] md:h-[507px] md:flex md:justify-center md:items-center hero-container">
        <div
          className="flex justify-center items-center relative"
        >
          <div className="absolute top-[var(--hero-motion-top)] w-full h-full flex justify-center items-center">
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
        <div className="inline-flex items-center justify-end gap-[7px] px-3 py-2 rounded-[100px] border border-solid border-ui-light bg-transparent">
          <span className="w-fit mt-[-1.00px] font-medium text-white text-caption">
            Built on
          </span>
          <Image
            alt="Group"
            src="/image/solana.png"
            width={20}
            height={14.94}
          />
          <span className="w-fit mt-[-1.00px] font-medium text-white text-caption">
            Solana
          </span>
        </div>
        <div>
          <h1 className="relative w-full md:w-[525px] mt-[-1.00px] font-geist text-white text-hero-title md:text-hero-title-md">
            The Power Of CEX.
          </h1>
          <h1 className="relative w-full md:w-[525px] font-geist text-white text-hero-title md:text-hero-title-md">
            The Freedom Of DeFi.
          </h1>
        </div>
        <p className="relative w-full md:w-[482px] font-geist text-ui-primary text-body-large">
          Hubra is the first truly all-in-one platform. Manage, Explore,
          Earn—across any device.
        </p>
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute satellite-position w-[660px]  h-[304px] pointer-events-none select-none">
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
