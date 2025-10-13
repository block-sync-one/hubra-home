"use client";

import type { Metric } from "web-vitals";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

/**
 * Send metric to analytics if available
 */
function sendToAnalytics(metric: Metric) {
  if (typeof window !== "undefined" && (window as any).va) {
    (window as any).va("event", {
      name: `web_vitals_${metric.name.toLowerCase()}`,
      data: { value: metric.value, rating: metric.rating },
    });
  }
}

/**
 * Log metric to console with proper formatting
 */
function logMetric(metric: Metric) {
  const formattedValue = metric.name === "CLS" ? metric.value.toFixed(4) : `${metric.value.toFixed(2)}ms`;

  console.log(`[Web Vitals] ${metric.name}:`, {
    value: formattedValue,
    rating: metric.rating,
    name: metric.name,
  });

  // Special warning for poor LCP
  if (metric.name === "LCP" && metric.rating === "poor") {
    console.warn(`⚠️ Poor LCP: ${metric.value.toFixed(2)}ms (target: <2500ms)`);
  }
}

/**
 * Handle web vital metric
 * DRY helper that logs and sends to analytics
 */
function handleMetric(metric: Metric) {
  logMetric(metric);
  sendToAnalytics(metric);
}

/**
 * Web Vitals tracking component
 * Automatically tracks Core Web Vitals and reports to console/analytics
 */
export function WebVitals() {
  useEffect(() => {
    // Track all Core Web Vitals with unified handler
    onCLS(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);
  }, []);

  // This component doesn't render anything
  return null;
}
