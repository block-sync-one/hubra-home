"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";
import { Card } from "@/components/ui/card";
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
        <Image
          alt="Pink Orb"
          className="flex absolute opacity-90 -top-5 md:top-0 left-20 md:left-[16%]"
          height={124}
          quality={100}
          src="/image/pink-orb1.png"
          width={360}
        />
        <Image
          alt="top"
          className="flex absolute top-0 right-0 opacity-55"
          height={124}
          quality={100}
          src="/image/top-m.png"
          width={360}
        />
      </div>

      <div
        className={`${isMobile ? "flex-col h-full" : "flex-row h-4/5"} absolute flex justify-center items-center gap-8 w-full md:top-[10%] py-8 md:py-10 px-4 md:px-14 xl:px-24`}
      >
        {/* Main content text */}
        <div className="flex flex-col w-full md:max-w-lg items-start gap-6 top-4 left-4 main-content-position font-sans">
          <div className="inline-flex items-center justify-end gap-2 px-3 py-2 bg-transparent border border-white/10 rounded-full">
            <span className="w-fit mt-[-1.00px] text-white text-sm font-sans">
              Built on
            </span>
            <Image
              alt="Group"
              height={14.94}
              src="/image/solana.png"
              width={20}
            />
            <span className="w-fit text-white text-sm font-sans">Solana</span>
          </div>
          <div
            className={`${isMobile ? "w-full" : "max-w-lg"} gap-6 flex flex-col`}
          >
            <div className="w-full font-sans text-white text-[34px] sm:text-3xl md:text-[34px] lg:text-5xl font-semibold tracking-[-2%] leading-[105%] ">
              The Power Of CEX.
              <br />
              The Freedom Of DeFi.
            </div>
            <p className="sm:max-w-md font-sans text-[#797B92] text-lg md:text-base lg:text-lg tracking-[1%]">
              Hubra is the first truly all-in-one platform. Manage, Explore,
              Earn—across any device.
            </p>
          </div>
        </div>

        {/* Pink gradient effect with bottom-to-top animation */}
        <div className="z-20 w-[80%] md:w-full h-full top-0 left-0 justify-center items-center">
          <motion.div
            animate={{ y: -90, opacity: 1 }}
            className="justify-center items-center w-full h-full flex relative"
            initial={{ y: 100, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            {/* Fixed particles matching SVG file positions and sizes */}
            {isMounted && (
              <div className="relative pointer-events-none z-20 hero-container w-full h-full">
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0, p.opacity, 0] }}
                    initial={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      top: `${p.top}%`,
                      left: `${p.left}%`,
                      width: p.size,
                      height: p.size,
                      borderRadius: "50%",
                      background:
                        p.size <= 12
                          ? `radial-gradient(circle, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)`
                          : p.size <= 24
                            ? `radial-gradient(50% 50% at 50% 50%, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)`
                            : `radial-gradient(circle, ${isMobile ? "#FEC84B" : "#FEC84B"} 0%, ${isMobile ? "#FEC84B" : "#FEC84B"} 100%)`,
                      pointerEvents: "none",
                      transform: "translate(-50%, -50%)", // Center the particles on their coordinates
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: p.delay,
                      repeatType: "loop",
                    }}
                  />
                ))}
              </div>
            )}
            <div className="absolute h-full top-1/4 w-full max-w-[236px] sm:max-w-[326px] md:max-w-[350px] flex flex-row z-10 object-cover px-[2px]">
              <Image
                unoptimized
                alt="Pink Gradient"
                className="w-full max-w-[230px] sm:max-w-[320px] top-1 md:max-w-[340px] hero-image absolute z-20 rounded-full md:mt-[6px] ml-[1px]"
                height={200}
                src={
                  isMobile ? "/image/hero-ball-m.svg" : "/image/hero-ball.svg"
                }
                width={200}
              />
              <div className="flex w-full h-full items-start p-1 bg-gradient-to-t from-[#FEAA0104] md:from-[#2E2E2E]/5 to-[#FEAA01]/25 md:to-[#2E2E2E]/25 rounded-[9999px_9999px_0px_0px] px-1.5 gap-1 md:gap-4 relative">
                <div className="h-full w-full bg-gradient-bar-tab bg-gradient-to-t from-[#FEAA01]/0 md:from-[#2E2E2E]/5 to-[#FEAA01]/25 md:to-[#2E2E2E]/25 flex relative top-[25%] sm:top-1/2 md:top-1/3" />
                <div className="h-full w-full bg-gradient-bar-tab bg-gradient-to-t from-[#FEAA01]/0 md:from-[#2E2E2E]/5 to-[#FEAA01]/25 md:to-[#2E2E2E]/25 flex relative top-[25%] sm:top-1/2 md:top-1/3" />
                <div className="h-full w-full bg-gradient-bar-tab bg-gradient-to-t from-[#FEAA01]/0 md:from-[#2E2E2E]/5 to-[#FEAA01]/25 md:to-[#2E2E2E]/25 flex relative top-[25%] sm:top-1/2 md:top-1/3" />
                <div className="h-full w-full bg-gradient-bar-tab bg-gradient-to-t from-[#FEAA01]/0 md:from-[#2E2E2E]/5 to-[#FEAA01]/25 md:to-[#2E2E2E]/25 flex relative top-[25%] sm:top-1/2 md:top-1/3" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom large circular gradient with animated satellite */}
      <div className="absolute satellite-position w-[375px] h-[180px] md:w-[660px] md:h-[304px] pointer-events-none select-none z-40">
        <Image
          fill
          alt="Mask group"
          className="flex w-[400px] h-[300px]"
          quality={100}
          src="/image/globe.png"
        />
        {/* Animated satellite overlay */}
        <AnimatedSatelliteOrbit />
      </div>
    </Card>
  );
};
