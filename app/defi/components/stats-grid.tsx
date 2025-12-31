"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface StatItem {
  name: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  url?: string;
  isExternal?: boolean;
  subtitle?: string;
}

interface StatsGridProps {
  className?: string;
  title?: string;
  stats: StatItem[];
}

// Memoized stat card component for better performance
const StatCard = React.memo(({ stat }: { stat: StatItem }) => {
  const cardContent = (
    <Card
      className={`group bg-transparent shadow-none md:shadow-card md:bg-card md:backdrop-blur-sm h-full ${
        stat.url ? "bg-card backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer" : ""
      }`}>
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-medium truncate mr-2">{stat.name}</span>
          <Icon className="text-gray-400 flex-shrink-0" icon={stat.icon} width={18} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-white truncate">{stat.value}</span>

          {stat.subtitle && <span className={`text-xs text-gray-400 ${stat.url ? "font-mono" : ""} truncate`}>{stat.subtitle}</span>}

          {stat.change && (
            <div className="flex items-center gap-1">
              <Icon
                className={`flex-shrink-0 ${
                  stat.changeType === "positive" ? "text-success" : stat.changeType === "negative" ? "text-danger" : "text-gray-400"
                }`}
                icon={
                  stat.changeType === "positive"
                    ? "solar:arrow-up-linear"
                    : stat.changeType === "negative"
                      ? "solar:arrow-down-linear"
                      : "solar:minus-linear"
                }
                width={12}
              />
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-success text-xs"
                    : stat.changeType === "negative"
                      ? "text-danger text-xs"
                      : "text-gray-400 text-xs"
                }>
                {stat.change}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );

  if (stat.url) {
    return (
      <Link
        className="block h-full"
        href={stat.url}
        rel={stat.isExternal ? "noopener noreferrer" : undefined}
        target={stat.isExternal ? "_blank" : undefined}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
});

StatCard.displayName = "StatCard";

export function StatsGrid({ className = "", title, stats }: StatsGridProps) {
  return (
    <div className="w-full mb-4 overflow-x-hidden">
      {title && <h3 className="text-lg font-medium mb-3 px-1">{title}</h3>}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full ${className}`}>
        {stats.map((stat) => {
          const stableKey = stat.name || stat.url || `stat-${stat.value}`;

          return <StatCard key={stableKey} stat={stat} />;
        })}
      </div>
    </div>
  );
}
