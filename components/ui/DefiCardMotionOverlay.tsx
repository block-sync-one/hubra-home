import React from "react";
import { motion, useAnimationFrame } from "framer-motion";
import Image from "next/image";

const ORBIT_SIZE_RATIO = 0.92; // 80% of container width
const ORBIT_THICKNESS_RATIO = 0.002; // 0.2% of container width
const LINE_LENGTH_RATIO = 0.74; // 65% of container width
const LINE_THICKNESS_RATIO = 0.002; // 0.2% of container width
const PINK_LINE_LENGTH_RATIO = 0.1; // 10% of container width
const ANIMATION_DURATION = 2; // seconds
const SATELLITE_ARC_LENGTH = 20; // degrees
const SATELLITE_COLOR = "#B84794";
const SATELLITE_DURATION = 4; // seconds
const HEXAGON_SIZE_RATIO = 0.22; // 22% of container width

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");

  return d;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;

  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

type AnimatedArcProps = {
  radius: number;
  arcLength: number;
  duration: number;

  initialAngle?: number;
};

const AnimatedArc = ({
  radius,
  arcLength,
  duration,

  initialAngle = 0,
  gradientId,
  svgSize,
}: AnimatedArcProps & { gradientId: string; svgSize: number }) => {
  const center = svgSize / 2;
  // const angle = useMotionValue(initialAngle);
  // const startAngle = useTransform(angle, (a) => a % 360);
  // const endAngle = useTransform(startAngle, (a) => (a + arcLength) % 360);
  const [d, setD] = React.useState(() => describeArc(center, center, radius, initialAngle, initialAngle + arcLength));

  useAnimationFrame((t) => {
    // t is in ms
    const progress = ((t / 1000) % duration) / duration;
    const currentAngle = (progress * 360 + initialAngle) % 360;
    const currentEnd = (currentAngle + arcLength) % 360;

    setD(describeArc(center, center, radius, currentAngle, currentEnd));
  });

  return <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth={1} />;
};

export const DefiCardMotionOverlay = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = React.useState({
    orbitSize: 460,
    orbitThickness: 1,
    lineLength: 370,
    lineThickness: 1,
    pinkLineLength: 60,
    hexagonSize: 125,
    iconSize: 52,
  });

  React.useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const minDimension = containerWidth;

        setSizes({
          orbitSize: minDimension * ORBIT_SIZE_RATIO,
          orbitThickness: Math.max(1, minDimension * ORBIT_THICKNESS_RATIO),
          lineLength: minDimension * LINE_LENGTH_RATIO,
          lineThickness: Math.max(1, minDimension * LINE_THICKNESS_RATIO),
          pinkLineLength: minDimension * PINK_LINE_LENGTH_RATIO,
          hexagonSize: minDimension * HEXAGON_SIZE_RATIO,
          iconSize: Math.max(32, minDimension * 0.08), // Minimum 32px, 8% of container
        });
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);

    // Use ResizeObserver for more accurate container size changes
    const resizeObserver = new ResizeObserver(updateSizes);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSizes);
      resizeObserver.disconnect();
    };
  }, []);

  const orbit1Radius = sizes.orbitSize / 2;
  const orbit2Radius = (sizes.orbitSize * 0.8) / 2; // 20% smaller than outer orbit
  const svgSize = sizes.orbitSize;
  const center = svgSize / 2;

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        className="absolute left-1/2 top-1/2 opacity-40"
        height={svgSize}
        style={{ transform: "translate(-50%, -50%)", zIndex: 1 }}
        width={svgSize}>
        <defs>
          <linearGradient id="satellite-gradient-1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#FEAA01" stopOpacity="1" />
            <stop offset="100%" stopColor="#FEAA01" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="satellite-gradient-2" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#FEAA01" stopOpacity="1" />
            <stop offset="100%" stopColor="#FEAA01" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Orbits */}
        <circle cx={center} cy={center} fill="none" r={orbit1Radius} stroke="#fff2" strokeWidth={sizes.orbitThickness} />
        <circle cx={center} cy={center} fill="none" r={orbit2Radius} stroke="#fff2" strokeWidth={sizes.orbitThickness} />
        {/* Animated arc on outer orbit */}
        <AnimatedArc
          arcLength={SATELLITE_ARC_LENGTH}
          duration={SATELLITE_DURATION}
          gradientId="satellite-gradient-1"
          initialAngle={0}
          radius={orbit1Radius}
          svgSize={svgSize}
        />
        {/* Animated arc on inner orbit (opposite direction) */}
        <AnimatedArc
          arcLength={SATELLITE_ARC_LENGTH}
          duration={SATELLITE_DURATION * 1.2}
          gradientId="satellite-gradient-2"
          initialAngle={180}
          radius={orbit2Radius}
          svgSize={svgSize}
        />
      </svg>

      {/* Laptop Icon at start of line */}
      <div
        className="absolute left-1/2 top-1/2 backdrop-blur-xl bg-transparent rounded-xl"
        style={{
          transform: `translate(-50%, -50%) translateX(-${sizes.lineLength / 2}px)`,
          zIndex: 10,
        }}>
        <Image alt="Laptop" className="opacity-60" height={sizes.iconSize} src="/icons/laptop.svg" width={sizes.iconSize} />
      </div>

      {/* Middle Line */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: sizes.lineLength,
          height: sizes.lineThickness,
          background: "#fff2",
          transform: "translate(-50%, -50%)",
          borderRadius: sizes.lineThickness,
        }}
      />

      {/* Mobile Icon at end of line */}
      <div
        className="absolute left-1/2 top-1/2 backdrop-blur-xl bg-transparent rounded-xl"
        style={{
          transform: `translate(-50%, -50%) translateX(${sizes.lineLength / 2}px)`,
          zIndex: 10,
        }}>
        <Image alt="Mobile" className="opacity-60" height={sizes.iconSize} src="/icons/mobile.svg" width={sizes.iconSize} />
      </div>

      {/* Animated Pink Line */}
      <motion.div
        animate={{
          x: [0, sizes.lineLength - sizes.pinkLineLength, 0],
        }}
        className="absolute top-1/2"
        style={{
          left: `calc(50% - ${sizes.lineLength / 2}px)`,
          width: sizes.pinkLineLength,
          height: sizes.lineThickness,
          background: "linear-gradient(90deg, #FEAA01 0%, #FEAA01 100%)",
          borderRadius: sizes.lineThickness,
          transform: "translateY(-50%)",
          opacity: 0.4,
          zIndex: 1,
        }}
        transition={{
          duration: ANIMATION_DURATION,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Hexagon mask overlay to hide pink line underneath */}
      <div
        className="absolute inset-0 bg-[url('/icons/Hexagon.png')] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cover bg-center"
        style={{
          zIndex: 2,
          width: sizes.hexagonSize,
          height: sizes.hexagonSize * 0.904, // Maintain aspect ratio (113/125)
        }}
      />

      {/* Dot texture overlay on hexagon */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex: 3,
          width: sizes.hexagonSize,
          height: sizes.hexagonSize * 0.904, // Maintain aspect ratio
          backgroundImage: `
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                    `,
          backgroundSize: "8px 8px, 12px 12px, 16px 16px",
          backgroundPosition: "0 0, 4px 4px, 8px 8px",
          maskImage: "url(/icons/Hexagon.png)",
          maskSize: "cover",
          maskPosition: "center",
          WebkitMaskImage: "url(/icons/Hexagon.png)",
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
        }}
      />
    </div>
  );
};

export default DefiCardMotionOverlay;
