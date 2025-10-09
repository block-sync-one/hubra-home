"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

/**
 * Web Vitals tracking component
 * Automatically tracks Core Web Vitals and reports to console/analytics
 */
export function WebVitals() {
  useEffect(() => {
    // Track all Core Web Vitals
    onCLS((metric) => {
      console.log("[Web Vitals] CLS:", {
        value: metric.value.toFixed(4),
        rating: metric.rating,
        name: metric.name,
      });

      // Send to analytics if available
      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", {
          name: "web_vitals_cls",
          data: { value: metric.value, rating: metric.rating },
        });
      }
    });

    onFCP((metric) => {
      console.log("[Web Vitals] FCP:", {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        name: metric.name,
      });

      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", {
          name: "web_vitals_fcp",
          data: { value: metric.value, rating: metric.rating },
        });
      }
    });

    onLCP((metric) => {
      console.log("[Web Vitals] LCP:", {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        name: metric.name,
      });

      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", {
          name: "web_vitals_lcp",
          data: { value: metric.value, rating: metric.rating },
        });
      }

      // Warn if poor
      if (metric.rating === "poor") {
        console.warn(`⚠️ Poor LCP: ${metric.value.toFixed(2)}ms (target: <2500ms)`);
      }
    });

    onTTFB((metric) => {
      console.log("[Web Vitals] TTFB:", {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        name: metric.name,
      });

      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", {
          name: "web_vitals_ttfb",
          data: { value: metric.value, rating: metric.rating },
        });
      }
    });

    onINP((metric) => {
      console.log("[Web Vitals] INP:", {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        name: metric.name,
      });

      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", {
          name: "web_vitals_inp",
          data: { value: metric.value, rating: metric.rating },
        });
      }
    });
  }, []);

  // This component doesn't render anything
  return null;
}
