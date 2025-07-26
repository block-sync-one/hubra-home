"use client";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

import { useWindowSize } from "../lib/useWindowSize";

import { Card, CardContent } from "./ui/card";
import { MailIcon } from "./ui/MailIcon";
import { TVLAnimatedPath } from "./TVLAnimation";
import { FloatingOrbsAnimation } from "./ui/FloatingOrbAnimation";
import Solanaglow from "./ui/Solanaglow";
import WalletEnergyFlow from "./ui/WalletEnergyFlow";
import DefiCardMotionOverlay from "./ui/DefiCardMotionOverlay";
import { FloatingEarnImages } from "./ui/FloatingEarnImages";
import {
  Partner10Icon,
  Partner11Icon,
  Partner12Icon,
  Partner13Icon,
  Partner1Icon,
  Partner2Icon,
  Partner3Icon,
  Partner4Icon,
  Partner5Icon,
  Partner6Icon,
  Partner9Icon,
  Partner7Icon,
  Partner8Icon,
} from "./icons";
import { DegenAnimation } from "./ui/DegenAnimation";
import { MobileDegenAnimation } from "./ui/MobileDegenAnimation";

import { AnimatedSatelliteOrbit } from "@/components/ui/AnimatedSatellite";

// Simple Separator component
const Separator = ({ className }: { className?: string }) => (
  <div className={className} />
);

// Mobile Carousel Component
const MobileCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/image/df-1.svg",
      title: "Eagle Eye",
      description:
        "Track, manage, and optimize your entire on-chain protfoio from one dashboard",
      isCard: false,
    },
    {
      image: "/image/df-2.svg",
      title: "Explore",
      description:
        "Discover emerging trends. Seamlessly convert tokens with minimal fees",
      isCard: false,
    },
    {
      image: "/image/df-3.png",
      title: "Earn",
      description:
        "Effortlessly tap into yield opportunities, all from a single platform",
      isCard: true,
      component: <FloatingEarnImages />,
    },
    {
      image: "/image/df-4.png",
      title: "Cross Platform",
      description: "One app, One account, All Devices",
      isCard: true,
      component: <DefiCardMotionOverlay />,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ x: `-${currentSlide * 100}%` }}
          className="flex"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="flex flex-col gap-8 items-center">
                {slide.isCard ? (
                  <Card
                    className={`relative flex w-full h-[310px] bg-cover bg-center rounded-2xl ${slide.component ? "overflow-hidden" : "overflow-hidden"}`}
                  >
                    {slide.component}
                  </Card>
                ) : (
                  <Image
                    alt="Hubra"
                    className="w-full h-full object-cover rounded-2xl"
                    height={310}
                    src={slide.image}
                    width={310}
                  />
                )}
                <div className="w-full gap-4 flex flex-col items-start">
                  <h3
                    className={`font-sans text-white text-lg font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px]`}
                  >
                    {slide.title}
                  </h3>
                  <p
                    className={`font-geist text-gray-400/70 break-words text-sm font-normal leading-[26px]`}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-[#191a2c] hover:bg-gray-600"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export const MainContentSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"normies" | "degens">("normies");
  const { isMobile } = useWindowSize();

  const features = [
    {
      icon: "ri:key-2-fill",
      title: "Non-Custodial   ",
      description: "Your keys, your assets. Always.",
    },
    {
      icon: "streamline-sharp:transparent-solid",
      title: "Transparent",
      description: "Fully open-source with clear, straightforward fees.",
    },
    {
      icon: "ri:rocket-fill",
      title: "Scalable",
      description:
        "Automatically updated with new tokens and pools, ensuring you never miss out.",
    },
    {
      icon: "mdi:swap-vertical-circle",
      title: "Onramp & Offramp",
      description: "Onramp & offramp with creditcard",
    },
  ];

  return (
    <section className="flex flex-col w-full items-start gap-20 mx-auto max-w-6xl md:mb-5 md:px-4">
      {/* Meet Hubra Section */}
      <div className="flex flex-col w-full items-start gap-8">
        <div className="flex flex-col items-center gap-10 w-full">
          <div className="flex flex-col max-w-[580px] items-center justify-center gap-5">
            <h2 className="font-geist text-white text-3xl font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px] text-center">
              Meet Hubra
            </h2>
          </div>

          {/* Mobile Layout: Stacked sections */}
          {isMobile && (
            <div className="flex flex-col gap-8">
              {/* Normies Section */}
              <div className="flex flex-col gap-4">
                <Card className="flex items-center justify-center mx-auto w-[350px] h-[518px] bg-[url('/image/hubra-m.png')] bg-cover bg-center rounded-2xl relative overflow-hidden">
                  <div className="absolute left-[60%] top-[17%] z-20 backdrop-blur-sm bg-transparent rounded-xl">
                    <Image
                      alt="Hubra"
                      className="w-[47px] h-[43px]"
                      height={43}
                      src="/icons/wallet.svg"
                      width={47}
                    />
                  </div>
                  <div className="absolute left-[63%] top-[75%] z-30 backdrop-blur-sm bg-transparent rounded-xl">
                    <Image
                      alt="Hubra"
                      className="w-[47px] h-[43px]"
                      height={43}
                      src="/icons/wallet.svg"
                      width={47}
                    />
                  </div>
                  <div className="absolute left-[32%] top-[18%] z-10">
                    <span className="capitalize w-[84px] h-[27px] inline-block text-lg font-bold leading-[27px] text-gradient-brand-mobile text-center tracking-[1px]">
                      You.hub
                    </span>
                  </div>
                  <div className="absolute left-[32%] top-[77%] z-10">
                    <span className="capitalize w-[98px] h-[27px] inline-block text-lg font-bold leading-[27px] text-gradient-brand-mobile text-center tracking-[1px]">
                      Friend.hub
                    </span>
                  </div>
                  <Image
                    alt="Hubra"
                    className="relative top-[-9px] left-[2px]"
                    height={300}
                    src="/image/wgroup-m2.png"
                    width={238}
                  />
                  <WalletEnergyFlow />
                </Card>

                {/* Normies Tab Text */}
                <div className="flex items-start">
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white text-card-title">
                      Normies
                    </h3>
                    <p className="font-geist text-gray-400/70 text-body">
                      No complicated jargon. Effortless onboarding
                    </p>
                  </div>
                </div>
              </div>

              {/* Degens Section */}
              <div className="flex flex-col gap-4">
                <Card className="flex items-center justify-center mx-auto w-[350px] h-[518px] bg-[url('/image/degens.png')] bg-cover bg-center rounded-2xl relative overflow-hidden">
                  <MobileDegenAnimation />
                </Card>

                {/* Degens Tab Text */}
                <div className="flex items-start">
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white text-card-title">
                      Degens
                    </h3>
                    <p className="font-geist text-gray-400/70 text-body">
                      Powerful DeFi tools. Endless possibilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Layout: Tab functionality */}
          {!isMobile && (
            <div className="flex-1 w-full">
              {/* Tab Content with Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {activeTab === "normies" && (
                    <Card className="flex items-center justify-center mx-auto w-full h-[398px] bg-[url('/image/token.svg')] bg-no-repeat  bg-center rounded-2xl relative overflow-hidden">
                      <div className="absolute left-[25.8%] lg:left-[26%] xl:left-[26.4%] top-[45%] lg:top-[44%] xl:top-[42%] z-20 backdrop-blur-sm bg-transparent rounded-xl">
                        <Image
                          alt="Hubra"
                          className="w-[45px] h-[43px] lg:w-[59px] lg:h-[51px] xl:w-[75px] xl:h-[63px]"
                          height={63}
                          src="/icons/wallet.svg"
                          width={70}
                        />
                      </div>
                      <div className="absolute left-[90.5%] lg:left-[89%] xl:left-[87%] top-[45%] lg:top-[44%] xl:top-[42%] z-30 backdrop-blur-sm bg-transparent rounded-xl">
                        <Image
                          alt="Hubra"
                          className="w-[45px] h-[43px] lg:w-[59px] lg:h-[51px] xl:w-[75px] xl:h-[63px]"
                          height={63}
                          src="/icons/wallet.svg"
                          width={70}
                        />
                      </div>
                      <div className="flex items-center justify-center relative">
                        <div
                          className="flex items-center justify-center relative"
                          style={{
                            marginBottom: "var(--dynamic-margin-bottom)",
                          }}
                        >
                          <span className="absolute left-[7%] top-[50%] z-10 w-[131px] h-[42px] inline-block text-2xl font-bold leading-[42px] text-gradient-brand text-center tracking-[1px]">
                            You.hub
                          </span>
                          <span className="absolute left-[70%] top-[50%] z-10 w-[156px] h-[46px] inline-block text-2xl font-bold leading-[42px] text-gradient-brand text-center tracking-[1px]">
                            Friend.hub
                          </span>

                          <Image
                            alt="Hubra"
                            height={281}
                            src="/image/wgroup.png"
                            width={1014}
                          />
                        </div>
                      </div>
                      <WalletEnergyFlow />
                    </Card>
                  )}

                  {activeTab === "degens" && (
                    <Card className="flex items-center justify-center mx-auto w-full h-[398px] bg-[url('/image/degens.png')] bg-cover bg-center rounded-2xl relative overflow-hidden">
                      <DegenAnimation />
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Desktop Tab Navigation */}
        {!isMobile && (
          <div className="flex flex-row items-center justify-between w-full mx-auto">
            <button
              aria-label="Switch to Normies tab"
              aria-selected={activeTab === "normies"}
              className="flex w-1/2 h-[72px] items-start cursor-pointer bg-transparent border-none p-0"
              role="tab"
              onClick={() => setActiveTab("normies")}
            >
              {/* Glowing pink shadowed stick - only show for active tab */}

              <div
                className={`mr-8 w-1  h-[72px] opacity-80 rounded-full ${activeTab === "normies" ? "bg-primary shadow-[0_0_40px_#FEAA01,0_0_60px_rgba(245,255,104,0.4)]" : ""}`}
              />

              <div className="w-fit h-full flex flex-col items-start justify-between">
                <span
                  className={`text-2xl font-semibold font-sans transition-all duration-300 ${
                    activeTab === "normies"
                      ? "text-white"
                      : "text-white opacity-50 hover:opacity-75"
                  }`}
                >
                  Normies
                </span>
                <p className="font-geist text-gray-400/70 text-body">
                  No complicated jargon. Effortless onboarding
                </p>
              </div>
            </button>

            <button
              aria-label="Switch to Degens tab"
              aria-selected={activeTab === "degens"}
              className="flex items-start w-1/2 h-[72px] cursor-pointer bg-transparent border-none p-0"
              role="tab"
              onClick={() => setActiveTab("degens")}
            >
              {/* Glowing pink shadowed stick - only show for active tab */}
              <div
                className={`mr-8 w-1 h-[72px] opacity-80 rounded-full ${activeTab === "degens" ? "bg-primary shadow-[0_0_40px_#FEAA01,0_0_60px_rgba(245,255,104,0.4)]" : ""}`}
              />
              <div className="w-fit h-full flex flex-col items-start justify-between">
                <span
                  className={`text-2xl font-semibold font-sans  transition-all duration-300 ${
                    activeTab === "degens"
                      ? "text-white"
                      : "text-white opacity-50 hover:opacity-75"
                  }`}
                >
                  Degens
                </span>
                <p className="font-geist text-gray-400/70 text-body">
                  Powerful DeFi tools. Endless possibilities
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      <Separator className="w-full h-px bg-ui-border-transparent" />

      {/* Introducing sunSOL Section */}
      <div className="flex flex-col w-full items-center justify-center gap-8 md:gap-10 px-4">
        <div className="flex flex-col w-full text-wrap-break-word md:w-[580px] items-center justify-center gap-5">
          <h2 className="font-geist text-white text-3xl font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px] text-center">
            Introducing sunSOL
          </h2>
          <p className="w-[80%] break-words md:w-fit font-geist text-gray-400/70 text-xl text-center">
            our empowered liquid staked SOL 
          </p>
        </div>
        <div className="flex flex-col items-center md:flex-row-reverse md:items-start gap-4 w-full">
          {/* Right column: Large logo card */}
          <Card className="relative w-full h-[390px] md:flex-1 bg-[url('/image/hubsol-sec.png')] bg-cover bg-center rounded-2xl overflow-hidden flex items-center justify-center">
            <FloatingOrbsAnimation />
            <div className="w-[600px] h-[304px] flex relative -bottom-16 -left-20">
              <AnimatedSatelliteOrbit />
            </div>
          </Card>

          {/* Left column: 2 stacked cards */}
          <div className="flex flex-col justify-between w-full h-[390px] md:w-[370px]">
            {/* $13M TVL Card */}
            <Card className="relative h-[180px] bg-card rounded-2xl flex flex-col w-full justify-between p-6 overflow-hidden">
              {/* Chart line (placeholder) */}
              <div className="absolute left-0 bottom-0 w-full h-2/3 flex items-end">
                <TVLAnimatedPath />
                <Image
                  alt="Solana"
                  className="absolute left-0 bottom-0 w-auto h-[90%] flex hover:opacity-100"
                  height={80}
                  src="/image/tvl.svg"
                  width={264}
                />
              </div>
              <div className="z-10">
                <div className="text-white text-2xl font-semibold">$5M+</div>
                <div className="text-gray-400/70 text-body">TVL</div>
              </div>
            </Card>
            {/* 20+ Integrated platforms Card */}
            <Card className="relative h-[180px] bg-[url('/image/hex-group.svg')] bg-cover bg-center rounded-2xl flex flex-col justify-between p-6 overflow-hidden">
              <Solanaglow
                color={isMobile ? "#FDB122" : "#FDB122"}
                right={96}
                top={86}
              />
              <div className="flex flex-col items-start justify-start">
                <div className="text-white text-2xl font-semibold">20+</div>
                <div className="text-gray-400/70 text-body">
                  Integrated platforms
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="w-full h-px bg-ui-border-transparent" />

      {/* DeFi, Simplified Section */}
      <div className="flex flex-col items-start justify-center w-full gap-10 px-4">
        <div className="flex flex-col w-full items-center gap-10">
          <div className="flex flex-col w-full md:w-[580px] items-center justify-center gap-5">
            <h2 className="font-geist text-white text-3xl font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px] text-center">
              Defi, Simplified
            </h2>
            <p className="w-[80%] break-words md:w-fit font-geist text-gray-400/70 text-xl text-center">
              Empowering supporters through platform revenue.
            </p>
          </div>
          {isMobile ? (
            <div className="relative w-full">
              <MobileCarousel />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-4 w-full">
                <div className="flex w-full md:w-1/2 flex-col gap-8">
                  <Image
                    alt="Hubra"
                    className="w-full h-full object-cover rounded-2xl"
                    height={310}
                    src="/image/df-1.svg"
                    width={310}
                  />
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white font-semibold text-xl">
                      Eagle Eye
                    </h3>
                    <p className="font-geist text-gray-400/70 text-body break-words">
                      Track, manage, and optimize your entire on-chain protfoio
                      from one dashboard
                    </p>
                  </div>
                </div>
                <div className="flex w-full md:w-1/2 flex-col gap-8">
                  <Image
                    alt="Hubra"
                    className="w-full h-full object-cover rounded-2xl"
                    height={310}
                    src="/image/df-2.svg"
                    width={310}
                  />
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white font-semibold text-xl">
                      Explore
                    </h3>
                    <p className="font-geist text-gray-400/70 text-body break-words">
                      Discover emerging trends. Seamlessly convert tokens with
                      minimal fees
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-4 w-full">
                <div className="flex w-full md:w-1/2 flex-col gap-8">
                  <Card className="relative flex w-full h-[310px] bg-[url('/image/df-3.png')] bg-cover bg-center rounded-2xl">
                    <FloatingEarnImages />
                  </Card>
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white font-semibold text-xl">
                      Earn
                    </h3>
                    <p className="font-geist text-gray-400/70  break-words">
                      Effortlessly tap into yield opportunities, all from a
                      single platform
                    </p>
                  </div>
                </div>
                <div className="flex w-full md:w-1/2 flex-col gap-8">
                  <Card className="relative overflow-hidden flex w-full h-[310px] bg-[url('/image/df-4.png')] bg-cover bg-center rounded-2xl">
                    <DefiCardMotionOverlay />
                  </Card>
                  <div className="w-full gap-4 flex flex-col items-start">
                    <h3 className="font-sans text-white font-semibold text-xl">
                      Cross Platform
                    </h3>
                    <p className="font-geist text-gray-400/70 break-words">
                      One app, One account, All Devices
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Features Section */}
        <Card className="flex flex-col w-full items-start bg-card rounded-2xl">
          <CardContent className="p-0 w-full flex flex-col">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`h-[90px] flex flex-col items-start justify-center md:flex-row md:items-center md:justify-between px-4 md:px-6 w-full ${index > 0 ? "border-t [border-top-style:solid] border-white/10" : ""}`}
              >
                <div className="inline-flex items-center gap-[9px]">
                  {feature.icon && (
                    <Icon className="text-[#FEAA01]" icon={feature.icon} />
                  )}
                  <div className="font-sans text-white whitespace-nowrap">
                    {feature.title}
                  </div>
                </div>
                <div className="break-words font-sans text-gray-500 text-label md:text-right">
                  {feature.description}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Partners Section */}
      <div className="flex flex-col items-center gap-[52px] w-full">
        <h2 className="font-geist text-white text-3xl font-semibold leading-[1.1] md:leading-[54.6px] tracking-[-1.04px] text-center">
          Hubsol Partners
        </h2>

        <div className="flex w-full flex-col md:flex-row md:justify-center items-center gap-4">
          {/* Left column */}
          <div className="flex md:flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-end gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px] hover:opacity-100">
                <Partner1Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner2Icon />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]" />
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner3Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner4Icon />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner5Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner6Icon />
              </div>
            </div>
          </div>
          {/* center column */}
          <div className="flex items-center justify-center w-full max-w-[180px] h-auto lg:block md:max-w-[320px]">
            <Image
              alt="Logo"
              className="w-full h-auto  md:flex max-w-[320px] max-h-[320px]"
              height={323}
              src="/image/hero-ball.svg"
              width={323}
            />
  
  
          </div>
          {/* right column */}
          <div className="flex md:flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-start gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner7Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner8Icon />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-start gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner9Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner10Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner11Icon />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-start gap-4">
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner12Icon />
              </div>
              <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-card rounded-[100px]">
                <Partner13Icon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-10 w-full items-start md:rounded-[32px] py-12 md:mb-4 bg-card px-4 md:px-8">
        <div className="flex flex-col gap-16 md:flex-row justify-between items-start w-full">
          <div className="flex-col items-start gap-8 flex relative flex-1 grow w-full">
            <div className="flex flex-col h-[62px] items-start gap-2 w-full">
              <h3 className=" font-text-xl-semibold text-white">
                Stay Connected
              </h3>
              <p className="w-fit font-sans text-gray-400/70 text-body break-words">
                Follow us on social to stay up to date on the latest announcements
              </p>
            </div>

            {/* <div className="flex flex-col w-full md:flex-row items-start gap-2.5">
              <div className="flex flex-col lg:flex-row lg:w-[257px] lg:items-start gap-1.5 w-full">
                <div className="items-center gap-2 flex relative flex-1 grow w-full">
                  <Input
                    classNames={{}}
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 flex items-center mt-2" />
                    }
                    placeholder="Enter your email"
                    radius="full"
                    type="email"
                  />
                </div>
              </div>

              <Button
                className="bg-primary-500 w-full md:w-[120px] text-center"
                radius="full"
              >
                Subscribe
              </Button>
            </div> */}
          </div>

          <div className="flex items-start gap-4 md:gap-8 relative flex-1 grow w-full">
            <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
              <h4 className="font-sans text-white text-sm sm:text-base md:text-lg text-left md:text-right">
                Product
              </h4>
              <div className="flex flex-col items-start md:items-end text-xs sm:text-sm md:text-base justify-center gap-3 w-full">
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/70 text-body text-left md:text-right break-words">
                      Download App
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Web App
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Learn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
              <h4 className="font-sans text-white text-sm sm:text-base md:text-lg text-left md:text-right">
                Community
              </h4>
              <div className="flex flex-col items-start md:items-end text-xs sm:text-sm md:text-base justify-center gap-3 w-full">
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Discord
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Telegram
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Twitter
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
              <h4 className="font-sans text-white text-sm sm:text-base md:text-lg text-left md:text-right">
                Resources
              </h4>
              <div className="flex flex-col items-start md:items-end text-xs sm:text-sm md:text-base justify-center gap-3 w-full">
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      GitHub
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Developer
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Docs
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Stats
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2">
                  <div className="inline-flex items-center justify-center gap-2">
                    <div className="w-fit font-sans text-gray-400/80 text-body text-left md:text-right break-words">
                      Privacy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 w-full">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center justify-between w-full">
            <div className="inline-flex items-center gap-[8.03px]">
              <Image
                alt="hub"
                className="w-[22px] h-[22px] md:w-6 md:h-6 rounded-none"
                height={32}
                src="/logo.png"
                width={32}
              />

              <h2 className="text-white font-medium"> Hubra </h2>
            </div>

            <div className="inline-flex items-center gap-6">
              <a className="" href="/">
                <Icon
                  className="w-6 h-6 cursor-pointer text-[#797B92] hover:text-white"
                  icon="ri:twitter-fill"
                />
              </a>

              <a className="" href="/">
                <Icon
                  className="w-6 h-6 cursor-pointer text-[#797B92] hover:text-white"
                  icon="ri:github-fill"
                />
              </a>

              <a className="" href="/">
                <Icon
                  className="w-6 h-6 cursor-pointer text-[#797B92] hover:text-white"
                  icon="ri:discord-fill"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};
