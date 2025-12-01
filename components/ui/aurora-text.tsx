"use client";

import React, { ReactNode } from "react";

import { cn } from "@/lib/cn-utils";

interface AuroraTextProps {
  className?: string;
  children: ReactNode;
  colors?: string[];
  speed?: number;
}

export function AuroraText({ className, children, colors = ["#feaa03", "#fcb426", "#fdb018", "#ffd073"], speed = 1 }: AuroraTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className="relative z-10 bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `aurora-shift ${3 / speed}s ease-in-out infinite`,
        }}>
        {children}
      </span>
      <span
        className="absolute inset-0 z-0 bg-clip-text text-transparent blur-xl opacity-60"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `aurora-shift ${3 / speed}s ease-in-out infinite`,
        }}>
        {children}
      </span>
    </span>
  );
}
