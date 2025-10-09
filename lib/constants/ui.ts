/**
 * UI Configuration Constants
 * @description Centralized constants for UI elements, animations, and styling
 */

// Opacity Values
export const OPACITY = {
  BACKGROUND_LOW: 0.05,
  BACKGROUND_MEDIUM: 0.1,
  BORDER: 0.1,
  CARD_BORDER: 0.1,
} as const;

// Animation & Loading (Skeleton Loaders)
export const ANIMATION = {
  SKELETON_HEIGHT: 128, // h-32
  PULSE_OPACITY: 0.3, // bg-gray-800/30
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  MOBILE: "(max-width: 768px)",
  TABLET: "(max-width: 1024px)",
  DESKTOP: "(min-width: 769px)",
} as const;

// Grid Columns
export const GRID = {
  COLS_MOBILE: 1,
  COLS_TABLET: 2,
  COLS_DESKTOP: 4,
} as const;

// Icon Sizes
export const ICON_SIZES = {
  SMALL: 12, // w-3 h-3
  MEDIUM: 16, // w-4 h-4
  LARGE: 20, // w-5 h-5
  EXTRA_LARGE: 48, // w-12 h-12
} as const;

// Rounded Corners
export const BORDER_RADIUS = {
  SMALL: 8, // rounded-lg
  MEDIUM: 12, // rounded-xl
  LARGE: 16, // rounded-2xl
  FULL: 9999, // rounded-full
} as const;

// Z-Index Layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  MODAL: 50,
  TOOLTIP: 100,
} as const;

// Transition Durations (ms)
export const TRANSITION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Polling/Refresh Intervals (ms)
export const INTERVALS = {
  REFRESH_DATA: 120000, // 2 minutes
  CHART_UPDATE: 60000, // 1 minute
} as const;

// Cache Revalidation (seconds)
export const CACHE = {
  REVALIDATE_SHORT: 60, // 1 minute
  REVALIDATE_MEDIUM: 120, // 2 minutes
  REVALIDATE_LONG: 300, // 5 minutes
  STALE_WHILE_REVALIDATE: 240, // 4 minutes
} as const;
