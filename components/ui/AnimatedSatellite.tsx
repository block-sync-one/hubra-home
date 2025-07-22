"use client";
import { useWindowSize } from "@/lib/useWindowSize";
import { useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedSatelliteOrbit() {
  // The SVG path from globe.svg
  const pathData = "M496.164 647.036C496.164 953.573 247.493 1202.07 -59.2566 1202.07C-366.007 1202.07 -614.677 953.573 -614.677 647.036C-614.677 340.499 -366.007 92.002 -59.2566 92.002C247.493 92.002 496.164 340.499 496.164 647.036Z";
  const { isMobile } = useWindowSize();
  const svgWidth = 660;
  const svgHeight = 304;
  const [length, setLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const orbitThickness = 0.78; // Thicker orbit line
  const satelliteThickness = 0.78; // Satellite is thicker for visibility
  const segmentLength = 100; // Length of the gradient line segment

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get the total length of the path
  useEffect(() => {
    if (pathRef.current && isMounted) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [isMounted]);

  // Animate progress from 0 to 1 in a loop (right to left, slower)
  useAnimationFrame((t) => {
    if (typeof window === 'undefined') return;
    if (isMounted) {
      setProgress(1 - ((t / 10000) % 1)); // 60s per loop
    }
  });

  // Calculate the segment start and end
  const start = progress * length;
  const end = Math.min(start + segmentLength, length);

  // Helper to get a curved path segment as a new path string
  function getCurvedSegmentPath(d: string, start: number, end: number, samples = 20): string {
    if (!pathRef.current) return '';
    const path = pathRef.current;
    const points = [];
    for (let i = 0; i <= samples; i++) {
      const l = start + ((end - start) * i) / samples;
      const pt = path.getPointAtLength(l);
      points.push(`${pt.x},${pt.y}`);
    }
    return `M${points.join(' L')}`;
  }

  const segmentPath = length > 0 ? getCurvedSegmentPath(pathData, start, end, 32) : '';

  // Don't render animated content until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <svg
        className="absolute left-0 bottom-0 w-full h-full pointer-events-none"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 2 }}
      >
        {/* Static version for SSR */}
        <path
          d={pathData}
          stroke="white"
          strokeLinecap="round"
          strokeWidth={orbitThickness}
          opacity={0.2}
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      className="absolute left-0 bottom-0 w-full h-full pointer-events-none"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 2 }}
    >
      {/* Visible whitish orbit path */}
      <path
        ref={pathRef}
        d={pathData}
        stroke="white"
        strokeLinecap="round"
        strokeWidth={orbitThickness}
        opacity={0.2}
        fill="none"
      />
      {/* Animated gradient pink satellite line segment */}
      {length > 0 && segmentPath && (
        <path
          d={segmentPath}
          stroke="url(#satelliteGradient)"
          strokeWidth={satelliteThickness}
          strokeLinecap="round"
        />
      )}
      <defs>
        <linearGradient id="satelliteGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEAA01" stopOpacity="1" />
          <stop offset="100%" stopColor="#FEAA01" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
