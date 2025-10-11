// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  MOBILE: "(max-width: 768px)",
  TABLET: "(max-width: 1024px)",
  DESKTOP: "(min-width: 769px)",
} as const;

// Polling/Refresh Intervals (ms)
export const INTERVALS = {
  REFRESH_DATA: 120000, // 2 minutes
  CHART_UPDATE: 60000, // 1 minute
} as const;
