"use client";

import React, { useRef, useEffect } from "react";

export const MetallicPaint = ({
  children,
  color = "white",
  highlightColor = "#ffffff",
  speed = 1,
  intensity = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  highlightColor?: string;
  speed?: number;
  intensity?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame: number;
    let angle = 0;

    const animate = () => {
      angle += 0.01 * speed;
      const x = Math.cos(angle) * 50 + 50;
      const y = Math.sin(angle) * 50 + 50;

      if (ref.current) {
        ref.current.style.setProperty("--metal-gradient", `radial-gradient(circle at ${x}% ${y}%, ${highlightColor}, ${color})`);
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [color, highlightColor, speed]);

  return (
    <div
      ref={ref}
      className={`
        relative 
        ${className}
      `}
      style={{
        background: "var(--metal-gradient)",
        WebkitMaskImage: "url(#metal-mask)",
        maskImage: "url(#metal-mask)",
      }}>
      <svg height="0" width="0">
        <mask id="metal-mask">
          <rect fill="white" height="100%" width="100%" />
        </mask>
      </svg>

      <div
        style={{
          backdropFilter: `brightness(${1 + intensity})`,
        }}>
        {children}
      </div>
    </div>
  );
};
