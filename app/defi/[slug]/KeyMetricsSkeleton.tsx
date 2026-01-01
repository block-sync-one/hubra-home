"use client";

import { keyMetricsTableConfig } from "./key-metrics-config";

import UnifiedTable from "@/components/table/unified-table";

export function KeyMetricsSkeleton() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-white">Key Metrics</h3>
      <UnifiedTable configuration={keyMetricsTableConfig} data={[]} filterValue="" isLoading={true} />
    </div>
  );
}
