import type { Metric } from "web-vitals";

export function reportWebVitals(metric: Metric) {
  if (process.env.NODE_ENV === "production" && window.va) {
    window.va("event", {
      name: metric.name,
      data: {
        value: metric.value,
        rating: metric.rating,
      },
    });
  }
}

export function trackCustomMetric(name: string, value: number, unit: string = "ms") {
  if (process.env.NODE_ENV === "production" && window.va) {
    window.va("event", {
      name: `custom_${name}`,
      data: { value, unit },
    });
  }
}

export function trackAPIPerformance(endpoint: string, duration: number, status: number) {
  if (process.env.NODE_ENV === "production" && window.va) {
    window.va("event", {
      name: "api_performance",
      data: { endpoint, duration, status },
    });
  }
}

export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
} as const;

export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs-improvement";

  return "poor";
}

declare global {
  interface Window {
    va?: (event: string, data: any) => void;
  }
}
