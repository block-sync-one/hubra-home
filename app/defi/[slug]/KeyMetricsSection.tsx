"use client";

import type { ProtocolMetric } from "./types";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import { fetchKeyMetrics } from "./actions";
import { keyMetricsTableConfig } from "./key-metrics-config";
import { KeyMetricsSkeleton } from "./KeyMetricsSkeleton";
import { buildDefillamaUrl } from "./helpers";

import UnifiedTable from "@/components/table/unified-table";

interface KeyMetricsSectionProps {
  protocolSlug: string;
  otherProtocols?: string[];
}

export function KeyMetricsSection({ protocolSlug, otherProtocols }: KeyMetricsSectionProps) {
  const [protocols, setProtocols] = useState<ProtocolMetric[]>([]);
  const [loading, setLoading] = useState(true);

  // Create stable key for otherProtocols to prevent unnecessary re-renders
  const otherProtocolsKey = useMemo(() => {
    if (!otherProtocols || otherProtocols.length === 0) return "";

    return [...otherProtocols].sort().join(",");
  }, [otherProtocols]);

  const handleRowClick = useCallback((item: ProtocolMetric) => {
    const defillamaUrl = buildDefillamaUrl(item.slug || "", item.id);

    window.open(defillamaUrl, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMetrics() {
      setLoading(true);
      try {
        const data = await fetchKeyMetrics(protocolSlug, otherProtocols || []);

        if (!cancelled) {
          setProtocols(data);
        }
      } catch {
        if (!cancelled) {
          setProtocols([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, [protocolSlug, otherProtocolsKey]);

  if (loading) {
    return <KeyMetricsSkeleton />;
  }

  if (protocols.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-white">Key Metrics</h3>
      <UnifiedTable<ProtocolMetric>
        configuration={keyMetricsTableConfig}
        data={protocols}
        filterValue=""
        isLoading={false}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export const MemoizedKeyMetricsSection = React.memo(KeyMetricsSection);
