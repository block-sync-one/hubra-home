/**
 * Chart Configuration Constants
 */

// Chart Time Periods
export const CHART_TIME_PERIODS = {
  ONE_DAY: 1,
  ONE_WEEK: 7,
  ONE_MONTH: 30,
  THREE_MONTHS: 90,
  ONE_YEAR: 365,
  MAX: "max" as const,
} as const;

// Chart Dimensions
export const CHART_DIMENSIONS = {
  MINI_CHART_HEIGHT: 56, // 14 * 4 (h-14 in Tailwind)
  TOKEN_ICON_SIZE: 20,
  TOKEN_ICON_WIDTH: 20,
  TOKEN_ICON_HEIGHT: 20,
} as const;

// Chart Data Points
export const CHART_DATA_POINTS = {
  FALLBACK_POINTS: 7,
  FALLBACK_MAX_INDEX: 6,
} as const;

// Chart Colors (RGB values)
export const CHART_COLORS = {
  SUCCESS: "rgb(21 183 158)",
  DANGER: "rgb(246 61 104)",
} as const;

// Gradient Opacity
export const GRADIENT_OPACITY = {
  START: 0.3,
  END: 0,
} as const;

// Chart Stroke
export const CHART_STROKE = {
  WIDTH: 1.5,
} as const;

// Chart Margins
export const CHART_MARGINS = {
  TOP: 0,
  RIGHT: 0,
  LEFT: 0,
  BOTTOM: 0,
} as const;

// Price Change Percentage
export const PRICE_CHANGE = {
  PERCENTAGE_DIVISOR: 100,
  NOISE_MULTIPLIER: 0.02,
  DECIMAL_PLACES: 2,
} as const;

// Spacing
export const SPACING = {
  GAP_2: 8, // gap-2
  GAP_3: 12, // gap-3
  GAP_4: 16, // gap-4
  PADDING_4: 16, // p-4
  MARGIN_BOTTOM_4: 16, // mb-4
} as const;

// Component Sizes
export const COMPONENT_SIZES = {
  CHIP_HEIGHT: 24, // h-6
  CHIP_SIZE: "sm" as const,
  ICON_SIZE_SM: "text-sm",
  ICON_SIZE_LG: "text-lg",
} as const;
