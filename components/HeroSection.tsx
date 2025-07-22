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
    <Card className="relative w-full h-[676px] bg-[url('/image/hero-bg1.png')] bg-cover bg-center rounded-none md:rounded-3xl overflow-hidden border-none justify-center items-center">

      {/* Pink orb effect */}
      <div className="absolute flex w-full h-full z-0 top-0 left-0">
        <Image src="/image/pink-orb1.png" alt="Pink Orb" width={425} height={167} quality={100} className="flex absolute top-0 left-14 md:left-[16%]" />
      </div>

      <div className={`${isMobile ? "flex-col h-full" : "flex-row h-4/5"} absolute flex justify-center items-center gap-8 w-full md:top-[10%] py-10 px-8 md:px-14 xl:px-24`}>
        {/* Main content text */}
        <div className="flex flex-col w-full md:max-w-lg items-start gap-5 top-4 left-4 main-content-position font-mono">
          <div className="inline-flex items-center justify-end gap-2 px-3 py-2 bg-transparent border border-white/10 rounded-full">
            <span className="w-fit mt-[-1.00px] text-white text-sm font-sans">
              Built on
            </span>
            <Image
              alt="Group"
              src="/image/solana.png"
              width={20}
              height={14.94}
            />
            <span className="w-fit text-white text-sm font-sans">
              Solana
            </span>
          </div>
          <div className={`${isMobile ? "w-full" : "max-w-lg"}`}>
            <h1 className="relative w-full font-mono text-white text-3xl md:text-2xl lg:text-5xl font-semibold ">
              The Power Of CEX.
            </h1>
            <h1 className="relative w-full  font-mono text-white text-3xl md:text-2xl lg:text-5xl  font-semibold">
              The Freedom Of DeFi.
            </h1>
            <p className="relative max-w-md font-mono text-gray-400/70 text-lg md:text-base lg:text-lg font-normal">
              Hubra is the first truly all-in-one platform. Manage, Explore,
              Earn—across any device.
            </p>
          </div>
        </div>

        {/* Pink gradient effect with bottom-to-top animation */}
        <div className="z-20 w-[80%] md:w-full h-full top-0 left-0 justify-center items-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: -90, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="justify-center items-center w-full h-full flex relative"
          >
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
                      background: p.size <= 12 ? `radial-gradient(circle, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)` : p.size <= 24 ? `radial-gradient(50% 50% at 50% 50%, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)` : `radial-gradient(circle, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)`,
                      pointerEvents: "none",
                      transform: "translate(-50%, -50%)", // Center the particles on their coordinates
                    }}
                  />
                ))}
              </div>
            )}
            <Image
              src={isMobile ? "/image/hero-ball-m.svg" : "/image/hero-ball.svg"}
              alt="Pink Gradient"
              width={200}
              height={200}
              className="w-[60%] max-w-[260px] md:max-w-[340px] hero-image absolute z-20 rounded-full"
              unoptimized
            />
            <div
              className="absolute h-full top-[40%] w-[60%] max-w-[260px] md:max-w-[340px] rounded-[9999px_9999px_0px_0px] flex flex-row justify-center items-center z-10"
            >
              <div
                className="flex w-full h-full items-start p-1 bg-gradient-bar gap-4 relative"
              >
                <div
                  className="h-full w-full bg-gradient-bar-tab flex relative top-5"
                />
                <div
                  className="h-full w-full bg-gradient-bar-tab flex relative top-5"
                />
                <div
                  className="h-full w-full bg-gradient-bar-tab flex relative top-5"
                />
                <div
                  className="h-full w-full bg-gradient-bar-tab flex relative top-5"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute satellite-position w-[660px] h-[304px] pointer-events-none select-none">
        <Image
          alt="Mask group"
          src="/image/globe.png"
          quality={100}
          fill
          className="flex w-[400px] h-[150px] md:h-[300px]"
        />
        {/* Animated satellite overlay */}
        <AnimatedSatelliteOrbit />
      </div>
    </Card>
  );
};
