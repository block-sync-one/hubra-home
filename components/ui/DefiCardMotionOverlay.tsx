import React from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";

const ORBIT_SIZE = 460;
const ORBIT_THICKNESS = 1;
const LINE_LENGTH = 370;
const LINE_THICKNESS = 1;
const PINK_LINE_LENGTH = 60;
const ANIMATION_DURATION = 2; // seconds
const SATELLITE_ARC_LENGTH = 20; // degrees
const SATELLITE_COLOR = "#B84794";
const SATELLITE_DURATION = 4; // seconds

function describeArc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
): string {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;
}

function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
): { x: number; y: number } {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

type AnimatedArcProps = {
    radius: number;
    arcLength: number;
    duration: number;
    color: string;
    initialAngle?: number;
};

const AnimatedArc = ({
    radius,
    arcLength,
    duration,
    color,
    initialAngle = 0,
    gradientId
}: AnimatedArcProps & { gradientId: string }) => {
    const svgSize = ORBIT_SIZE;
    const center = svgSize / 2;
    const angle = useMotionValue(initialAngle);
    const startAngle = useTransform(angle, (a) => a % 360);
    const endAngle = useTransform(startAngle, (a) => (a + arcLength) % 360);
    const [d, setD] = React.useState(() =>
        describeArc(center, center, radius, initialAngle, initialAngle + arcLength)
    );

    useAnimationFrame((t) => {
        // t is in ms
        const progress = ((t / 1000) % duration) / duration;
        const currentAngle = (progress * 360 + initialAngle) % 360;
        const currentEnd = (currentAngle + arcLength) % 360;
        setD(describeArc(center, center, radius, currentAngle, currentEnd));
    });

    return (
        <path
            d={d}
            stroke={`url(#${gradientId})`}
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
        />
    );
};

export const DefiCardMotionOverlay = () => {
    const orbit1Radius = ORBIT_SIZE / 2;
    const orbit2Radius = (ORBIT_SIZE - 90) / 2;
    const svgSize = ORBIT_SIZE;
    const center = svgSize / 2;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width={svgSize} height={svgSize} className="absolute left-1/2 top-1/2 opacity-40" style={{ transform: 'translate(-50%, -50%)' }}>
                <defs>
                    <linearGradient id="satellite-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF4FCB" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="satellite-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF4FCB" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF4FCB" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Orbits */}
                <circle
                    cx={center}
                    cy={center}
                    r={orbit1Radius}
                    stroke="#fff2"
                    strokeWidth={ORBIT_THICKNESS}
                    fill="none"
                />
                <circle
                    cx={center}
                    cy={center}
                    r={orbit2Radius}
                    stroke="#fff2"
                    strokeWidth={ORBIT_THICKNESS}
                    fill="none"
                />
                {/* Animated arc on outer orbit */}
                <AnimatedArc
                    radius={orbit1Radius}
                    arcLength={SATELLITE_ARC_LENGTH}
                    duration={SATELLITE_DURATION}
                    color={SATELLITE_COLOR}
                    initialAngle={0}
                    gradientId="satellite-gradient-1"
                />
                {/* Animated arc on inner orbit (opposite direction) */}
                <AnimatedArc
                    radius={orbit2Radius}
                    arcLength={SATELLITE_ARC_LENGTH}
                    duration={SATELLITE_DURATION * 1.2}
                    color={SATELLITE_COLOR}
                    initialAngle={180}
                    gradientId="satellite-gradient-2"
                />
            </svg>
            {/* Middle Line */}
            <div
                className="absolute left-1/2 top-1/2"
                style={{
                    width: LINE_LENGTH,
                    height: LINE_THICKNESS,
                    background: '#fff2',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: LINE_THICKNESS,
                }}
            />
            {/* Animated Pink Line */}
            <motion.div
                className="absolute top-1/2"
                style={{
                    left: `calc(50% - ${LINE_LENGTH / 2}px)`,
                    width: PINK_LINE_LENGTH,
                    height: LINE_THICKNESS,
                    background: 'linear-gradient(90deg, #B84794 0%, #FFB6E6 100%)',
                    borderRadius: LINE_THICKNESS,
                    transform: 'translateY(-50%)',
                    opacity: 0.4,
                    zIndex: 1,
                }}
                animate={{
                    x: [0, LINE_LENGTH - PINK_LINE_LENGTH, 0],
                }}
                transition={{
                    duration: ANIMATION_DURATION,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            />
            
            {/* Hexagon mask overlay to hide pink line underneath */}
            <div 
                className="absolute inset-0 bg-[url('/icons/Hexagon.png')] w-[125px] h-[113px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover bg-center"
                style={{ zIndex: 2 }}
            />
            
            {/* Dot texture overlay on hexagon */}
            <div 
                className="absolute w-[125px] h-[113px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ 
                    zIndex: 3,
                    backgroundImage: `
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: '8px 8px, 12px 12px, 16px 16px',
                    backgroundPosition: '0 0, 4px 4px, 8px 8px',
                    maskImage: 'url(/icons/Hexagon.png)',
                    maskSize: 'cover',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url(/icons/Hexagon.png)',
                    WebkitMaskSize: 'cover',
                    WebkitMaskPosition: 'center'
                }}
            />
        </div>
    );
};

export default DefiCardMotionOverlay; 