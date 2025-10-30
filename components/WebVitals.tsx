"use client";

import type { Metric } from "web-vitals";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

function handleMetric(metric: Metric) {
  if (typeof window !== "undefined" && (window as any).va) {
    (window as any).va("event", {
      name: `web_vitals_${metric.name.toLowerCase()}`,
      data: { value: metric.value, rating: metric.rating },
    });
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);
  }, []);

  return null;
}
