"use client";
import React, { useRef, useEffect, useState } from "react";

const PATH_D = "M-30 78.426C54.4272 81.111 198.669 75.741 263.556 1.45703";
const SVG_WIDTH = 274;
const SVG_HEIGHT = 112;

function getPointAtLength(path: SVGPathElement, length: number) {
  const pt = path.getPointAtLength(length);
  return { x: pt.x, y: pt.y };
}

export const TVLAnimatedPath = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [pathLength, setPathLength] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection Observer to detect when component enters viewport
  useEffect(() => {
    if (!isMounted) return;

    let prevVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(false); // Reset to trigger animation restart
          setTimeout(() => setIsVisible(true), 10); // Small delay to ensure effect re-runs
        } else {
          setIsVisible(false);
        }
        prevVisible = entry.isIntersecting;
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before fully in view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMounted]);

  // Animation effect - only run when component becomes visible
  useEffect(() => {
    if (!isVisible) return;
    if (typeof window === 'undefined') return;

    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
    setProgress(0); // Reset progress on each trigger
    let start: number | null = null;
    let req: number;
    const duration = 500; // ms

    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);
      if (t < 1) {
        req = requestAnimationFrame(animate);
      }
    }
    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [isVisible]);

  // Calculate current position for the circle
  let cx = 0, cy = 0;
  if (pathRef.current) {
    const pt = pathRef.current.getPointAtLength(pathLength * progress);
    cx = pt.x;
    cy = pt.y;
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div ref={containerRef}>
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          fill="none"
          style={{ overflow: "visible" }}
        >
          {/* Static version for SSR */}
          <path
            d={PATH_D}
            stroke="#B84794"
            strokeWidth={3}
            opacity={0.15}
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        fill="none"
        style={{ overflow: "visible" }}
      >
      <defs>
        <filter id="blurOuter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      {/* Background path (faint) */}
      <path
        d={PATH_D}
        stroke="#B84794"
        strokeWidth={3}
        opacity={0.15}
        fill="none"
      />
      {/* Animated path (revealed) */}
      <path
        ref={pathRef}
        d={PATH_D}
        stroke="#B84794"
        strokeWidth={3}
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress)}
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      {/* Animated circle with four parts */}
      {pathRef.current && (
        <>
          {/* Big blurred outer circle */}
          <circle
            cx={cx}
            cy={cy}
            r={40}
            fill="#B84794"
            opacity={0.12}
            filter="url(#blurOuter)"
          />
          {/* Outer glow circle */}
          <circle
            cx={cx}
            cy={cy}
            r={28}
            fill="#B84794"
            opacity={0.04}
          />
          {/* Middle circle (main) */}
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill="white"
            stroke="#B84794"
            strokeWidth={4}
            style={{ filter: "drop-shadow(0 0 8px #B84794)" }}
          />
          {/* Optional: Smallest solid white center for extra depth */}
          {/* <circle
            cx={cx}
            cy={cy}
            r={5}
            fill="white"
          /> */}
        </>
      )}
      </svg>
    </div>
  );
};