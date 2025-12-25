"use client";

import type { ProtocolMetric } from "./types";

import React, { useEffect, useState, useMemo } from "react";

import { fetchKeyMetrics } from "./actions";
import { keyMetricsTableConfig } from "./key-metrics-config";
import { KeyMetricsSkeleton } from "./KeyMetricsSkeleton";

import UnifiedTable from "@/components/table/unified-table";

interface KeyMetricsSectionProps {
  protocolSlug: string;
  otherProtocols?: string[];
}

export function KeyMetricsSection({ protocolSlug, otherProtocols }: KeyMetricsSectionProps) {
  const [protocols, setProtocols] = useState<ProtocolMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const otherProtocolsKey = useMemo(() => (otherProtocols || []).join(","), [otherProtocols]);

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
      <UnifiedTable<ProtocolMetric> configuration={keyMetricsTableConfig} data={protocols} filterValue="" isLoading={false} />
    </div>
  );
}

export const MemoizedKeyMetricsSection = React.memo(KeyMetricsSection);
