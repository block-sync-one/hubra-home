"use client"
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const FloatingOrbsAnimation = () => {
    const containerRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const orbs = [
        { id: 1, x: "88", y: "79", size: "43", delay: 0.2 },
        { id: 2, x: "500", y: "248.5", size: "43", delay: 0.4 },
        { id: 3, x: "182.5", y: "26.5", size: "21", delay: 0.6 },
        { id: 4, x: "510", y: "52.5", size: "21", delay: 0.8 },
        { id: 5, x: "405", y: "94", size: "12", delay: 1.0 },
        { id: 6, x: "180", y: "169", size: "12", delay: 1.2 },
        { id: 7, x: "380", y: "285", size: "12", delay: 1.4 },
        { id: 8, x: "400", y: "-30", size: "80", delay: 1.6 },
    ];

    // Don't render animated content until mounted to prevent hydration mismatch
    if (!isMounted) {
        return (
            <div ref={containerRef} className="absolute inset-0 pointer-events-none">
                {/* Static version for SSR */}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    className="absolute"
                    style={{
                        left: `${orb.x}px`,
                        top: `${orb.y}px`,
                        width: `${orb.size}px`,
                        height: `${orb.size}px`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { 
                        opacity: orb.id === 1 || orb.id === 8 ? 0.2 : 0.6, 
                        scale: 1,
                        y: [0, -10, 0]
                    } : { opacity: 0, scale: 0 }}
                    transition={{
                        opacity: {
                            duration: 1.5,
                            delay: orb.delay,
                            ease: "easeOut"
                        },
                        scale: {
                            duration: 1.5,
                            delay: orb.delay,
                            ease: "easeOut"
                        },
                        y: {
                            duration: 4,
                            delay: orb.delay + 1.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }
                    }}
                >
                    <div 
                        className="w-full h-full rounded-full"
                        style={{
                            background: parseFloat(orb.size) <= 12 
                                ? 'radial-gradient(circle, #FEC84B 0%, #FEAA01 100%)'  // Brightest for smallest
                                : parseFloat(orb.size) <= 43 
                                ? 'radial-gradient(circle, #FEC84B 0%, #FEAA01 100%)'  // Medium for medium
                                : 'radial-gradient(circle, #FEC84B 0%, #FEAA01 100%)', // Darkest for largest
                            boxShadow: `0 0 ${parseFloat(orb.size) * 2}px ${
                                parseFloat(orb.size) <= 12 
                                    ? 'rgba(255, 145, 220, 0.5)'  // Brighter glow for smaller
                                    : parseFloat(orb.size) <= 43 
                                    ? 'rgba(255, 145, 220, 0.5)'  // Medium glow
                                    : 'rgba(255, 145, 220, 0.5)'   // Subtle glow for larger
                            }`
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
};