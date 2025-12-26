"use client";

import { keyMetricsTableConfig } from "./key-metrics-config";

import UnifiedTable from "@/components/table/unified-table";

export function KeyMetricsSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-7 w-32 bg-gray-700/50 animate-pulse rounded-lg mb-4" />
      <UnifiedTable configuration={keyMetricsTableConfig} data={[]} filterValue="" isLoading={true} />
    </div>
  );
}
