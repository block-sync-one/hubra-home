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
          className="relative pointer-events-none z-20 hero-container w-full h-full"
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
      <div className="absolute flex w-full h-full z-0 top-0 left-0">
        <Image src="/image/pink-orb.png" alt="Pink Orb" width={425} height={167} quality={100} className="flex md:hidden absolute top-0 -right-10 opacity-90 " />
        <Image src="/image/pink-orb1.png" alt="Pink Orb" width={425} height={167} quality={100} className="md:flex hidden absolute top-0 left-[50%]" />
      </div>


      {/* Pink gradient effect with bottom-to-top animation */}
      <div className="absolute z-20 w-full h-full top-0 left-0 justify-center items-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: -90, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: 0.3
          }}
          className="relative justify-center items-center h-full flex top-36 "
        >
          <Image
            src="/image/hero-ball.svg"
            alt="Pink Gradient"
            width={200}
            height={200}
            className="absolute w-[200px] h-[200px] hero-image"
            unoptimized
          />
          <div
            className="relative h-2/3 top-1/4 w-[200px] rounded-[9999px_9999px_0px_0px] flex flex-row justify-center items-center"
          >
            <div
              className="flex h-full items-start p-1 overflow-hidden hero-bars gap-2"
            >
              <div
                className="h-full w-[45px] bg-gradient-bars flex"
              />
              <div
                className="h-full w-[45px] bg-gradient-bars flex"
              />
              <div
                className="h-full w-[45px] bg-gradient-bars flex"
              />
              <div
                className="h-full w-[45px] bg-gradient-bars flex"
              />
            </div>
          </div>
        </motion.div>

      </div>


      {/* Main content text */}
      <div className="flex flex-col w-full items-start gap-5 absolute top-4 left-4 main-content-position">
        <div className="inline-flex items-center justify-end gap-2 px-3 py-2 bg-transparent border border-white/10 rounded-full">
          <span className="w-fit mt-[-1.00px] text-white text-sm font-medium">
            Built on
          </span>
          <Image
            alt="Group"
            src="/image/solana.png"
            width={20}
            height={14.94}
          />
          <span className="w-fit mt-[-1.00px] text-white text-sm font-medium">
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
