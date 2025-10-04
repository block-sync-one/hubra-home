export interface ChartDataPoint {
  label: string;
  value: number;
  displayLabel?: string; // For X-axis display, allows sampling labels while keeping all data points
  timestamp?: number; // Original timestamp for full date display in tooltips
  // Optional metadata for tooltips or additional info
  metadata?: Record<string, any>;
}

export interface TimeRangeData {
  labels: string[];
  values: number[];
  timestamps?: number[]; // Original timestamps for full date display
}

export interface TimeRanges {
  [key: string]: TimeRangeData;
}

export interface ChartConfiguration {
  // Chart appearance
  chartType?: "line" | "area" | "bar";
  changeType?: "positive" | "negative" | "neutral";
  height?: {
    mobile: string;
    desktop: string;
  };

  // Chart features
  showTooltip?: boolean;
  showGradient?: boolean;
  animationDuration?: number;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
  // Responsive settings
  margins?: {
    mobile: { top: number; right: number; bottom: number; left: number };
    desktop: { top: number; right: number; bottom: number; left: number };
  };
}

export interface ChartHeaderConfiguration {
  label?: string;
  showChangeIndicator?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

export interface RangeSelectorConfiguration {
  position?: "top" | "bottom";
  orientation?: "horizontal" | "vertical";
  className?: string;
  variant?: "solid" | "bordered" | "light";
}

export interface UnifiedChartProps {
  // Data
  timeRanges: TimeRanges;
  value: number;
  changePercent: number;

  // State
  isLoading?: boolean;
  hasError?: boolean; // New: indicates if data failed to load
  errorMessage?: string; // New: optional error message to display
  selectedRange?: string;
  onRangeChange?: (range: string) => void;

  // Configuration
  chartConfig?: ChartConfiguration;
  headerConfig?: ChartHeaderConfiguration;
  rangeSelectorConfig?: RangeSelectorConfiguration;

  // Layout and styling
  className?: string;
  containerClassName?: string;

  // Children and additional content
  children?: React.ReactNode;
  additionalActions?: React.ReactNode;

  // Optional content to show when there is no data (distinct from error state)
  emptyContent?: React.ReactNode;
}

export type ChangeType = "positive" | "negative" | "neutral";
export type ChartType = "line" | "area" | "bar";
export type ResponsivePosition = "mobile-top" | "mobile-bottom" | "desktop-top" | "desktop-bottom" | "desktop-right";
