"use client"
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { MailIcon } from "./ui/MailIcon"
import { Badge } from "./ui/badge"
import Image from "next/image"
import { TVLAnimatedPath } from "./TVLAnimation"
import { FloatingOrbsAnimation } from "./ui/FloatingOrbAnimation";
import { motion } from "framer-motion";
import Solanaglow from "./ui/Solanaglow";
import WalletEnergyFlow from "./ui/WalletEnergyFlow";
import DefiCardMotionOverlay from "./ui/DefiCardMotionOverlay";
import { FloatingEarnImages } from "./ui/FloatingEarnImages";
import { Partner10Icon, Partner11Icon, Partner12Icon, Partner13Icon, Partner1Icon, Partner2Icon, Partner3Icon, Partner4Icon, Partner5Icon, Partner6Icon, Partner9Icon, Partner7Icon, Partner8Icon } from "./icons";
import { DegenAnimation } from "./ui/DegenAnimation";


// Simple Separator component
const Separator = ({ className }: { className?: string }) => (
    <div className={className} />
);

export const MainContentSection = (): JSX.Element => {
    // Tab state
    const [activeTab, setActiveTab] = useState<'normies' | 'degens'>('normies');

    // Data for months in chart
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Data for token table rows
    const tokenRows = [
        {
            id: 1,
            name: "Moo Deng",
            symbol: "MOODENG",
            price: "€0.22",
            change: "20%",
            marketCap: "€207.20M",
        },
        {
            id: 1,
            name: "Moo Deng",
            symbol: "MOODENG",
            price: "€0.22",
            change: "20%",
            marketCap: "€207.20M",
        },
        {
            id: 1,
            name: "Moo Deng",
            symbol: "MOODENG",
            price: "€0.22",
            change: "20%",
            marketCap: "€207.20M",
        },
        {
            id: 1,
            name: "Moo Deng",
            symbol: "MOODENG",
            price: "€0.22",
            change: "20%",
            marketCap: "€207.20M",
        },
    ];

    // Data for features section
    const features = [
        {
            title: "Non-Custodial",
            description: "Your keys, your assets. Always.",
            icon: "/icons/key.svg",
        },
        {
            title: "Transparent",
            description: "Fully open-source with clear, straightforward fees.",
            icon: "/icons/eye.svg",
        },
        {
            title: "Scalable",
            description:
                "Automatically updated with new tokens and pools, ensuring you never miss out.",
            icon: "/icons/rocket.svg",
        },
        {
            title: "Onramp & offramp",
            description: "Onramp & offramp with creditcard",
            icon: "/icons/circles.svg",
        },
    ];

    return (
        <section className="flex flex-col w-full items-start gap-[120px] mx-auto max-w-[1016px] mb-60 px-8">
            {/* Meet Hubra Section */}
            <div className="flex flex-col w-full items-start gap-8">
                <div className="flex flex-col items-center gap-10 w-full">
                    <div className="flex flex-col w-[580px] items-center justify-center gap-5">
                        <h2 className="font-geist text-white text-section-title text-center">
                            Meet Hubra
                        </h2>
                    </div>

                    <div className="flex-1 w-full"> 
                        {/* Tab Content */}
                        {activeTab === 'normies' && (
                            <Card className="flex items-center justify-center relative mx-auto w-[350px] h-[518px] md:w-full md:h-[398px] bg-[url('/image/hubra-m.png')] md:bg-[url('/image/hubra.png')] bg-cover bg-center rounded-2xl relative overflow-hidden">
                                <div className="absolute left-[60%] top-[17%] md:left-[24%] md:top-[41%] z-20 backdrop-blur-sm bg-transparent rounded-xl">
                                    <Image src="/icons/wallet.svg" alt="Hubra" width={47} height={43} className="w-[47px] h-[43px] md:w-[75px] md:h-[68px]" />
                                </div>
                                <div className="absolute left-[63%] top-[75%] md:left-[88%] md:top-[41%] z-30 backdrop-blur-sm bg-transparent rounded-xl">
                                    <Image src="/icons/wallet.svg" alt="Hubra" width={47} height={43} className="w-[47px] h-[43px] md:w-[75px] md:h-[68px]" />
                                </div>
                                <div className="absolute left-[32%] top-[18%] z-10 md:hidden">
                                    <span className="w-[84px] h-[27px] inline-block text-lg font-bold leading-[27px] text-gradient-brand text-center tracking-[1px]">
                                        amir.hub
                                    </span>
                                </div>
                                <div className="absolute left-[32%] top-[77%] z-10 md:hidden">
                                    <span className="w-[98px] h-[27px] inline-block text-lg font-bold leading-[27px] text-gradient-brand text-center tracking-[1px]">
                                        friend.hub
                                    </span>
                                </div>
                                <div className="hidden md:block">
                                    <div 
                                        className="flex items-center justify-center relative"
                                        style={{ marginBottom: 'var(--dynamic-margin-bottom)' }}
                                    >
                                        <span className="absolute md:block hidden left-[7%] top-[50%] z-10 w-[131px] h-[42px] inline-block text-2xl font-bold leading-[42px] text-gradient-brand text-center tracking-[1px]">
                                            amir.hub
                                        </span>
                                        <span className="absolute md:block hidden left-[70%] top-[50%] z-10 w-[156px] h-[46px] inline-block text-2xl font-bold leading-[42px] text-gradient-brand text-center tracking-[1px]">
                                            friend.hub
                                        </span>
                                        
                                        <Image src="/image/wgroup.png" alt="Hubra" width={1014} height={281} />
                                    </div>
                                </div>
                                <WalletEnergyFlow />
                            </Card>
                        )}
                        
                        {activeTab === 'degens' && (
                            <Card className="flex items-center justify-center relative mx-auto w-[350px] h-[518px] md:w-full md:h-[398px] bg-[url('/image/degens.png')] bg-cover bg-center rounded-2xl relative overflow-hidden">
                                <DegenAnimation />
                            </Card>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-col md:flex-row items-center gap-12 w-full mx-auto">
                    <div className="flex w-1/2 items-start">
                        {/* Glowing pink shadowed stick - only show for active tab */}
                        {activeTab === 'normies' && (
                            <div className="hidden md:mr-8 md:block w-1 h-[72px] bg-brand-primary opacity-80 rounded-full shadow-brand-glow"></div>
                        )}

                        <div className="w-[334px] gap-4 flex flex-col items-start">
                            <button
                                onClick={() => setActiveTab('normies')}
                                className={`font-sans text-card-title transition-all duration-300 ${
                                    activeTab === 'normies' 
                                        ? 'text-white' 
                                        : 'text-white opacity-50 hover:opacity-75'
                                }`}
                            >
                                Normies
                            </button>
                            <p className="font-geist text-ui-primary text-body">
                                No complicated jargon. Effortless onboarding
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start w-1/2">
                        {/* Glowing pink shadowed stick - only show for active tab */}
                        {activeTab === 'degens' && (
                            <div className="hidden md:mr-8 md:block w-1 h-[72px] bg-brand-primary opacity-80 rounded-full shadow-brand-glow"></div>
                        )}
                        
                        <div className="w-[334px] gap-4 flex flex-col items-start">
                            <button
                                onClick={() => setActiveTab('degens')}
                                className={`font-sans text-card-title transition-all duration-300 ${
                                    activeTab === 'degens' 
                                        ? 'text-white' 
                                        : 'text-white opacity-50 hover:opacity-75'
                                }`}
                            >
                                Degens
                            </button>
                            <p className="font-geist text-ui-primary text-body">
                                Powerful DeFi tools. Endless possibilities
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="w-full h-px bg-ui-border-transparent" />

            {/* Introducing HubSOL Section */}
            <div className="flex flex-col w-full items-center justify-center gap-8 md:gap-10">
                <div className="flex flex-col w-full text-wrap-break-word md:w-[580px] items-center justify-center gap-5">
                    <h2 className="font-geist text-white text-section-title text-center">
                        Introducing HubSOL
                    </h2>
                    <p className="w-[80%] break-words md:w-fit font-geist text-ui-primary text-xl text-center">
                        Empowering supporters through platform revenue.
                    </p>
                </div>
                <div className="flex flex-col items-center md:flex-row-reverse md:items-start gap-4 w-full">

                    {/* Right column: Large logo card */}
                    <Card className="relative flex w-full h-[390px] md:flex-1 bg-[url('/image/hubsol-sec.png')] bg-cover bg-center rounded-2xl overflow-hidden flex items-center justify-center">
                        <FloatingOrbsAnimation />
                    </Card>

                    {/* Left column: 2 stacked cards */}
                    <div className="flex flex-col gap-6 w-full md:w-[370px]">
                        {/* $13M TVL Card */}
                        <Card className="relative h-[180px] bg-ui-dark rounded-2xl flex flex-col w-full justify-between p-6 overflow-hidden">
                            {/* Chart line (placeholder) */}
                            <div className="absolute left-0 bottom-0 w-full h-2/3 flex items-end">
                                <TVLAnimatedPath />
                                <Image src="/image/tvl.svg" alt="Solana" width={264} height={80} className="absolute left-0 bottom-0 w-auto h-auto hover:opacity-100" />
                            </div>
                            <div className="z-10">
                                <div className="text-white text-2xl font-semibold">$13M</div>
                                <div className="text-ui-primary text-body">TVL</div>
                            </div>
                        </Card>
                        {/* 20+ Integrated platforms Card */}
                        <Card className="relative h-[180px] bg-[url('/image/hex-group.svg')] bg-cover bg-center rounded-2xl flex flex-col justify-between p-6 overflow-hidden">
                            <Solanaglow right={96} top={86} />
                            <div className="flex flex-col items-start justify-start">
                                <div className="text-white text-2xl font-semibold">20+</div>
                                <div className="text-ui-primary text-body">Integrated platforms</div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Separator className="w-full h-px bg-ui-border-transparent" />

            {/* DeFi, Simplified Section */}
            <div className="flex flex-col items-start justify-center w-full gap-10">
                <div className="flex flex-col w-full items-center gap-10">
                    <div className="flex flex-col w-full md:w-[580px] items-center justify-center gap-5">
                                            <h2 className="font-geist text-white text-section-title text-center">
                        Defi, Simplified
                    </h2>
                    <p className="w-[80%] break-words md:w-fit font-geist text-ui-primary text-xl text-center">
                        Empowering supporters through platform revenue.
                    </p>
                    </div>
                    <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-4 w-full">
                        <div className="flex w-full md:w-1/2 flex-col gap-8">
                            <Card className="flex w-full h-[310px] bg-[url('/image/df-1.svg')] bg-cover bg-center  rounded-2xl" />
                            <div className="w-full gap-4 flex flex-col items-start">
                                <h3 className="font-sans text-white text-card-title">
                                    Eagle Eye
                                </h3>
                                <p className="font-geist text-ui-primary text-body break-words">
                                    Track, manage, and optimize your entire on-chain protfoio from one dashboard
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full md:w-1/2 flex-col gap-8">
                            <Card className="flex w-full h-[310px] bg-[url('/image/df-2.svg')] bg-cover bg-center rounded-2xl" />
                            <div className="w-full gap-4 flex flex-col items-start">
                                <h3 className="font-sans text-white text-card-title">
                                    Explore
                                </h3>
                                <p className="font-geist text-ui-primary text-body break-words">
                                    Discover emerging trends. Seamlessly convert tokens with minimal fees
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-4 w-full">
                        <div className="flex w-full md:w-1/2 flex-col gap-8">
                            <Card className="relative flex w-full h-[310px] bg-[url('/image/df-3.png')] bg-cover bg-center rounded-2xl" >
                                <FloatingEarnImages />
                            </Card>
                            <div className="w-full gap-4 flex flex-col items-start">
                                <h3 className="font-sans text-white text-card-title-compact">
                                    Earn
                                </h3>
                                <p className="font-geist text-ui-primary text-body-compact break-words">
                                    Effortlessly tap into yield opportunities, all from a single platform
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full md:w-1/2 flex-col gap-8">
                            <Card className="relative overflow-hidden flex w-full h-[310px] bg-[url('/image/df-4.png')] bg-cover bg-center rounded-2xl">
                                <DefiCardMotionOverlay />
                            </Card>
                            <div className="w-full gap-4 flex flex-col items-start">
                                <h3 className="font-sans text-white text-card-title-compact">
                                    Cross Platform
                                </h3>
                                <p className="font-geist text-ui-primary text-body-compact break-words">
                                    One app, One account, All Devices
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <Card className="flex flex-col w-full items-start bg-ui-dark rounded-2xl">
                    <CardContent className="p-0 w-full flex flex-col">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`h-[90px] flex flex-col items-start justify-center md:flex-row md:items-center md:justify-between w-full ${index > 0 ? "border-t [border-top-style:solid] border-ui-light" : ""}`}
                            >
                                <div className="inline-flex items-center gap-[9px] pl-4 md:pl-6">
                                    <Image src={feature.icon} alt={feature.title} width={18} height={18} />
                                    <div className="font-sans text-white text-body-small whitespace-nowrap">
                                        {feature.title}
                                    </div>
                                </div>
                                <div className="pl-4 md:pr-6 break-words font-sans text-ui-secondary text-label md:text-right">
                                    {feature.description}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Partners Section */}
            <div className="flex flex-col items-center gap-[52px] w-full">
                <h2 className="font-geist text-white text-section-title text-center">
                    Hubsol Partners
                </h2>

                <div className="flex w-full flex-col md:flex-row md:justify-center items-center gap-4">
                    {/* Left column */}
                    <div className="flex md:flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center justify-end gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px] hover:opacity-100" >
                                <Partner1Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner2Icon />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-end gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >

                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner3Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner4Icon />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-end gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner5Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner6Icon />
                            </div>
                        </div>
                    </div>
                    {/* center column */}
                    <div className="flex items-center justify-center w-[180px] h-auto md:hidden lg:block lg:w-full">
                        <Image
                            alt="Logo"
                            src="/image/partner-logo.png"
                            width={323}
                            height={323}
                            className="w-full h-auto"
                        />
                    </div>
                    {/* right column */}
                    <div className="flex md:flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center justify-start gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner7Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner8Icon />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-start gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner9Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner10Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner11Icon />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-start gap-4">
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner12Icon />
                            </div>
                            <div className="flex items-center justify-center w-[98.22px] aspect-[1/1] bg-[#191a2c] rounded-[100px]" >
                                <Partner13Icon />
                            </div>
                        </div>

                    </div>


                </div>
            </div>

            {/* Footer */}
            <footer className="flex flex-col gap-10 w-screen md:w-full items-start bg-ui-darker rounded-[32px] py-12 -ml-10 md:ml-0">
                <div className="flex flex-col gap-16 md:flex-row md:justify-between items-start px-8 py-0 w-full">
                    <div className="flex-col items-start gap-8 flex relative flex-1 grow">
                        <div className="flex flex-col h-[62px] items-start gap-2 w-full">
                            <h3 className=" font-text-xl-semibold text-white">
                                Stay Connected
                            </h3>
                            <p className="w-fit font-sans text-ui-primary text-body break-words">
                                Sign up to stay up to-date on the latest announcements
                            </p>
                        </div>

                        <div className="flex flex-col w-full md:flex-row items-start gap-2.5">
                            <div className="flex flex-col lg:flex-row lg:w-[257px] lg:items-start gap-1.5 w-full">
                                <div className="items-center gap-2 flex relative flex-1 grow w-full">
                                    <Input
                                        placeholder="Enter your email"
                                        radius="full"
                                        classNames={{
                                            input: ["bg-ui-input",
                                                "placeholder:text-ui-muted",
                                            ],
                                            inputWrapper: ["bg-ui-input",
                                                "placeholder:text-ui-muted",
                                            ],
                                        }}
                                        endContent={
                                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 flex items-center mt-2" />
                                        }
                                        type="email"
                                    />
                                </div>
                            </div>

                            <Button radius="full" className="bg-brand-primary w-full md:w-fit">
                                Subscribe
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-start gap-8 relative flex-1 grow">
                        <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
                            <h4 className="font-sans text-white text-lg text-left md:text-right">
                                Product
                            </h4>
                            <div className="flex flex-col items-start md:items-end justify-center gap-3  w-full">
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-primary text-body text-left md:text-right break-words">
                                            Download App
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Web App
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Learn
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
                            <h4 className="font-sans text-white text-lg text-left md:text-right">
                                Community
                            </h4>
                            <div className="flex flex-col items-start md:items-end justify-center gap-3  w-full">
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Discord
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Telegram
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Twitter
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-center gap-4 flex-1 grow">
                            <h4 className="font-sans text-white text-lg text-left md:text-right">
                                Resources
                            </h4>
                            <div className="flex flex-col items-start md:items-end justify-center gap-3  w-full">
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            GitHub
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Developer
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Docs
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Stats
                                        </div>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <div className="inline-flex items-center justify-center gap-2">
                                        <div className="w-fit font-sans text-ui-secondary text-body text-left md:text-right break-words">
                                            Privacy
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-8 px-8 py-0 w-full">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center justify-between w-full">
                        <div className="inline-flex items-center gap-[8.03px]">
                            <Image
                                alt="hub"
                                src="/icons/hub.svg"
                                width={24}
                                height={24}
                            />
                            <h2 className="text-white text-stats font-medium"> Hubra </h2>
                        </div>

                        <div className="inline-flex items-center gap-6">
                            <Image
                                alt="x"
                                src="/icons/x.svg"
                                width={24}
                                height={24}
                            />
                            <Image
                                alt="github"
                                src="/icons/git.svg"
                                width={24}
                                height={24}
                            />
                            <Image
                                alt="discord"
                                src="/icons/discord.svg"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
};
