"use client";

import React, { memo, useMemo } from "react";
import { Icon } from "@iconify/react";

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;
  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-danger-500",
    iconColor: isPositive ? "text-success-500" : "text-danger-500"
  };
};

const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);
  
  return (
    <div className="flex items-center gap-0.5">
      <Icon 
        icon={config.icon}
        className={`w-3 h-3 ${config.iconColor}`}
      />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {Math.abs(value)}%
      </span>
    </div>
  );
});

ChangeIndicator.displayName = 'ChangeIndicator';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  isPositive?: boolean;
  className?: string;
}

const StatCard = memo(function StatCard({ title, value, change, isPositive, className = "" }: StatCardProps) {
  const valueColor = useMemo(() => {
    if (title === "Total Value Locked" && isPositive) {
      return 'text-success-500';
    }
    return 'text-white';
  }, [isPositive, title]);

  return (
    <div className={`flex flex-col gap-1.5 h-[91px] justify-center px-4 relative md:flex-1 w-full ${className}`}>
      {/* Border for desktop - always show */}
      <div className="hidden md:block absolute border-r border-white/10 right-0 top-0 bottom-0" />
      
      {/* Border for mobile - always show vertical separation */}
      <div className="md:hidden absolute border-r border-white/10 right-0 top-0 bottom-0" />
      
      <p className="text-sm font-medium text-gray-400 whitespace-nowrap">
        {title}
      </p>
      
      <div className="flex items-center gap-1">
        <p className={`text-lg font-medium whitespace-nowrap ${valueColor}`}>
          {value}
        </p>
        
        {change !== undefined && (
          <ChangeIndicator value={change} />
        )}
      </div>
    </div>
  );
});

interface StatsGridProps {
  children: React.ReactNode;
}

const StatsGrid = memo(function StatsGrid({ children }: StatsGridProps) {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  // Create mobile rows dynamically
  const mobileRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < childrenArray.length; i += 2) {
      const rowItems = childrenArray.slice(i, i + 2);
      const isLastRow = i + 2 >= childrenArray.length;
      const hasOnlyOneItem = rowItems.length === 1;
      
      rows.push(
        <div key={`mobile-row-${i}`} className={`flex ${!isLastRow ? 'border-b border-white/10' : ''}`}>
          {rowItems.map((child, index) => (
            <div key={`mobile-item-${i + index}`} className={hasOnlyOneItem ? "w-full" : "w-1/2"}>
              {child}
            </div>
          ))}
        </div>
      );
    }
    return rows;
  }, [childrenArray]);

  return (
    <div className="relative rounded-xl border border-white/10 overflow-hidden">
      {/* Desktop: 5 columns in a row - each section has equal width */}
      <div className="hidden md:flex">
        {children}
      </div>
      
      {/* Mobile: Dynamic grid based on number of items */}
      <div className="md:hidden">
        {mobileRows}
      </div>
    </div>
  );
});

interface StatData {
  title: string;
  value: string;
  change?: number;
  isPositive?: boolean;
}

const STATS_DATA: StatData[] = [
  { title: "Total Value Locked", value: "75.43%", isPositive: true },
  { title: "Market Cap", value: "$4.02B", change: 35.54, isPositive: true },
  { title: "24h Volume", value: "$195.40K", change: -12.5, isPositive: false },
  { title: "Active Users", value: "610.63K" },
  { title: "Total Supply", value: "583.20M" },
];

export default function Tokens() {
  const statsCards = useMemo(() => 
    STATS_DATA.map((stat, index) => (
      <StatCard 
        key={`stat-${index}`}
        title={stat.title}
        value={stat.value}
        change={stat.change}
        isPositive={stat.isPositive}
      />
    )), []
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-white">Tokens</h2>
      
      <StatsGrid>
        {statsCards}
      </StatsGrid>
    </div>
  );
}
