"use server";

import type { ProtocolMetric } from "./types";
import type { Protocol } from "@/lib/types/defi-stats";

import { fetchChildProtocols } from "@/lib/data/defi-data";

function extractNumericValue(value: unknown): number {
  if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);

    return !isNaN(parsed) && isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function transformProtocolToMetric(protocol: Protocol): ProtocolMetric {
  const id = protocol.id || protocol.slug || protocol.name || "";

  return {
    id,
    name: protocol.name || "-",
    slug: protocol.slug || protocol.id || id,
    tvl: extractNumericValue(protocol.tvl),
    fees: extractNumericValue(protocol.totalFees_1d),
    revenue: extractNumericValue(protocol.totalRevenue_1d),
    assetToken: protocol.assetToken || protocol.symbol,
  };
}

export async function fetchKeyMetrics(protocolSlug: string, otherProtocols: string[]): Promise<ProtocolMetric[]> {
  try {
    const childProtocols = await fetchChildProtocols(protocolSlug, otherProtocols);
    const protocolMap = new Map<string, ProtocolMetric>();

    for (const protocol of childProtocols) {
      const id = protocol.id || protocol.slug || protocol.name;

      if (!id || protocolMap.has(id)) continue;

      protocolMap.set(id, transformProtocolToMetric(protocol));
    }

    return Array.from(protocolMap.values());
  } catch {
    return [];
  }
}
