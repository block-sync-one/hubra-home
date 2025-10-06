import React, { Suspense, memo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import dynamic from "next/dynamic";

import { usePriceHistory } from "@/lib/hooks/usePriceHistory";

// Lazy load chart components with better optimization
const LineChart = dynamic(() => import("recharts").then((mod) => ({ default: mod.LineChart })), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-800 animate-pulse rounded" />,
});
const Line = dynamic(() => import("recharts").then((mod) => ({ default: mod.Line })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => ({ default: mod.ResponsiveContainer })), { ssr: false });

interface PriceChartProps {
  price: string;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  tokenId: string;
  periods: string[];
}

const ChartFallback = () => <div className="h-48 bg-gray-800 animate-pulse rounded" />;

const TokenChart = React.memo(
  ({ chartData, selectedPeriod }: { chartData: Array<{ month: string; price: number }>; selectedPeriod: string }) => {
    // Get appropriate interval for X-axis based on period with dynamic calculation
    const getXAxisInterval = (period: string) => {
      switch (period) {
        case "24h":
          return 0; // Show all 5 points (00:00, 04:00, 08:00, 12:00, 16:00)
        case "7d":
          return 0; // Show all 6 days (Mon, Tue, Wed, Thu, Fri, Sat)
        case "1M":
          return 2; // Show every 3rd day (7 labels)
        case "3M":
          return 0; // Show all 5 weeks (W1, W3, W5, W7, W9)
        case "1Y":
          return 0; // Show all 7 months (Jan, Mar, May, Jul, Sep, Nov, Jan)
        case "All":
          return 1; // Show every 2nd year (7 labels)
        default:
          return 0;
      }
    };

    return (
      <Suspense fallback={<ChartFallback />}>
        <div className="h-48">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <XAxis
                axisLine={false}
                dataKey="month"
                fontFamily="Inter"
                fontSize={12}
                fontWeight={500}
                height={40}
                interval={getXAxisInterval(selectedPeriod)} // Dynamic interval
                stroke="rgb(156 163 175)" // text-gray-400
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={["dataMin - 0.05", "dataMax + 0.05"]}
                fontFamily="Inter"
                fontSize={12}
                fontWeight={500}
                hide={true}
                stroke="rgb(156 163 175)" // text-gray-400
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(31 41 55)", // bg-gray-800
                  border: "1px solid rgb(55 65 81)", // border-gray-700
                  borderRadius: "8px",
                  color: "rgb(255 255 255)", // text-white
                  fontFamily: "Inter",
                  fontWeight: 500,
                }}
              />
              <Line
                dataKey="price"
                dot={false}
                stroke="rgb(21 183 158)" // success-500
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Suspense>
    );
  }
);

TokenChart.displayName = "TokenChart";

export const PriceChart = memo(function PriceChart({ price, selectedPeriod, onPeriodChange, tokenId, periods }: PriceChartProps) {
  // Map period selection to days
  const getDaysFromPeriod = (period: string): number | "max" => {
    switch (period) {
      case "24h":
        return 1;
      case "7d":
        return 7;
      case "1M":
        return 30;
      case "3M":
        return 90;
      case "1Y":
        return 365;
      case "All":
        return "max";
      default:
        return 1;
    }
  };

  const days = getDaysFromPeriod(selectedPeriod);
  const { chartData, loading, error, retry, isFallbackData } = usePriceHistory(tokenId, days);

  // Loading state
  if (loading) {
    return (
      <Card className="bg-gray-950 rounded-2xl">
        <CardHeader className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
            <p className="text-2xl font-medium text-white">{price}</p>
          </div>
        </CardHeader>
        <CardBody className="p-5">
          <div className="h-48 bg-gray-800 animate-pulse rounded flex items-center justify-center">
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-gray-950 rounded-2xl">
        <CardHeader className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
            <p className="text-2xl font-medium text-white">{price}</p>
          </div>
        </CardHeader>
        <CardBody className="p-5">
          <div className="h-48 bg-gray-800 rounded flex flex-col items-center justify-center">
            <p className="text-red-400 mb-2">Failed to load chart data</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={retry}>
              Retry
            </button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-950 rounded-2xl">
      <CardHeader className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
          <p className="text-2xl font-medium text-white">
            {/* <span className="text-gray-400 pr-1">€</span> */}
            {price}
          </p>
          {isFallbackData && <p className="text-xs text-yellow-400 mt-1">Using cached data</p>}
        </div>
        {/* Desktop timeframe selector - hidden on mobile */}
        <div className="hidden md:flex bg-white/5 rounded-xl p-1">
          {periods.map((period) => (
            <button
              key={period}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => onPeriodChange(period)}>
              {period}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody className="p-5">
        <TokenChart chartData={chartData} selectedPeriod={selectedPeriod} />
        {/* Mobile timeframe selector - positioned at bottom */}
        <div className="md:hidden w-full">
          <div className="flex w-full bg-gray-900 rounded-xl p-1">
            {periods.map((period) => (
              <button
                key={period}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period ? "bg-gray-800 text-base" : "text-gray-400 hover:text-base"
                }`}
                onClick={() => onPeriodChange(period)}>
                {period}
              </button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
});
