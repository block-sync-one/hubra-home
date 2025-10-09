/**
 * Performance Monitoring Utilities
 * @description Track and report Web Vitals and custom performance metrics
 */

import type { Metric } from "web-vitals";

/**
 * Report Web Vitals to console and analytics
 * @param metric - Web Vitals metric object
 */
export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // You can send to your analytics service here
    // Example: Google Analytics, Vercel Analytics, etc.

    // For now, we'll use the Vercel Analytics if available
    if (window.va) {
      window.va("event", {
        name: metric.name,
        data: {
          value: metric.value,
          rating: metric.rating,
        },
      });
    }
  }

  // Warn if metrics are poor
  if (metric.rating === "poor") {
    console.warn(`⚠️ Poor ${metric.name}: ${metric.value.toFixed(2)}ms`);
  }
}

/**
 * Track custom performance metrics
 * @param name - Metric name
 * @param value - Metric value
 * @param unit - Unit of measurement (default: 'ms')
 */
export function trackCustomMetric(name: string, value: number, unit: string = "ms") {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Custom Metric] ${name}: ${value}${unit}`);
  }

  // Send to analytics
  if (process.env.NODE_ENV === "production" && window.va) {
    window.va("event", {
      name: `custom_${name}`,
      data: { value, unit },
    });
  }
}

/**
 * Measure API call performance
 * @param endpoint - API endpoint
 * @param duration - Request duration in ms
 * @param status - HTTP status code
 */
export function trackAPIPerformance(endpoint: string, duration: number, status: number) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[API] ${endpoint}: ${duration.toFixed(2)}ms (${status})`);
  }

  if (duration > 1000) {
    console.warn(`⚠️ Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
  }

  // Send to analytics
  if (process.env.NODE_ENV === "production" && window.va) {
    window.va("event", {
      name: "api_performance",
      data: {
        endpoint,
        duration,
        status,
      },
    });
  }
}

/**
 * Performance thresholds for Web Vitals
 */
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay (FID)
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    needsImprovement: 500,
  },
} as const;

/**
 * Get performance rating based on value
 */
export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs-improvement";

  return "poor";
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    va?: (event: string, data: any) => void;
  }
}
