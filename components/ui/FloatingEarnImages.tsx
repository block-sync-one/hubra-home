"use client"
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export const FloatingEarnImages = () => {
    const containerRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const images = [
        {
            id: 1,
            src: "/image/stake.svg",
            alt: "Stake",
            x: "right-[8%]",
            y: "top-[12%]",
            delay: 0.2,
            floatRange: 8,
            duration: 3.5
        },
        {
            id: 2,
            src: "/image/vault.svg",
            alt: "Vault",
            x: "left-[8%]",
            y: "top-[37%]",
            delay: 0.6,
            floatRange: 6,
            duration: 4.2
        },
        {
            id: 3,
            src: "/image/lend.svg",
            alt: "Lend",
            x: "right-[9%]",
            y: "top-[62%]",
            delay: 1.0,
            floatRange: 10,
            duration: 3.8
        },
    ];

    // Don't render animated content until mounted to prevent hydration mismatch
    if (!isMounted) {
        return (
            <div ref={containerRef} className="absolute inset-0 pointer-events-none">
                {/* Static version for SSR */}
                {images.map((image) => (
                    <Image
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        width={192}
                        height={76}
                        className={`absolute ${image.x} ${image.y} w-auto h-auto`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            {images.map((image) => (
                <motion.div
                    key={image.id}
                    className={`absolute ${image.x} ${image.y}`}
                    initial={{ opacity: 0, scale: 0.8, y: 0 }}
                    animate={isInView ? {
                        opacity: 1,
                        scale: 1,
                        y: [0, -image.floatRange, 0]
                    } : { opacity: 0, scale: 0.8, y: 0 }}
                    transition={{
                        opacity: {
                            duration: 1.2,
                            delay: image.delay,
                            ease: "easeOut"
                        },
                        scale: {
                            duration: 1.2,
                            delay: image.delay,
                            ease: "easeOut"
                        },
                        y: {
                            duration: image.duration,
                            delay: image.delay + 1.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }
                    }}
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={192}
                        height={76}
                        className="w-[145px] h-[58px] sm:w-[192px] sm:h-[76px] md:w-[145px] md:h-[58px] lg:w-[192px] lg:h-[76px]"
                    />
                </motion.div>
            ))}
        </div>
    );
}; 