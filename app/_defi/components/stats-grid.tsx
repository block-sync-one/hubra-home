"use client";

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
}

interface StatsGridProps {
  className?: string;
  title?: string;
  stats: StatItem[];
}

export function StatsGrid({ className = "", title, stats }: StatsGridProps) {
  return (
    <div className="w-full mb-4 overflow-x-hidden">
      {title && <h3 className="text-lg font-medium mb-3 px-1">{title}</h3>}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full ${className}`}>
        {stats.map((stat, index) => (
          <Card key={index} className="bg-transparent shadow-none md:shadow-card md:bg-card md:backdrop-blur-sm h-full">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium truncate mr-2">{stat.name}</span>
                <Icon className="text-gray-400 flex-shrink-0" icon={stat.icon} width={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                {stat.url ? (
                  <Link
                    className="text-white hover:underline inline-flex items-center gap-1 truncate"
                    href={stat.url}
                    rel={stat.isExternal ? "noopener noreferrer" : undefined}
                    target={stat.isExternal ? "_blank" : undefined}>
                    <span className="text-base font-semibold truncate">{stat.value}</span>
                    {stat.isExternal && <Icon className="text-gray-400 flex-shrink-0" icon="solar:arrow-up-right-linear" width={12} />}
                  </Link>
                ) : (
                  <span className="text-base font-semibold text-white truncate">{stat.value}</span>
                )}

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
        ))}
      </div>
    </div>
  );
}
