/**
 * Protocol Helper Functions
 * Utilities for transforming and formatting protocol data
 */

import { Protocol } from "@/lib/types/defi-stats";

/**
 * Transform protocols array to include index for table rendering
 * UnifiedTable expects items to have a stable _index property
 */
export function prepareProtocolsForTable(protocols: Protocol[]): (Protocol & { _index: number })[] {
  return protocols.map((protocol, index) => ({
    ...protocol,
    _index: index,
  }));
}

/**
 * Filter protocols by search term
 */
export function filterProtocols(protocols: Protocol[], searchTerm: string): Protocol[] {
  if (!searchTerm) return protocols;

  const term = searchTerm.toLowerCase();

  return protocols.filter(
    (protocol) =>
      protocol.name.toLowerCase().includes(term) ||
      (typeof protocol.category === "string" && protocol.category.toLowerCase().includes(term)) ||
      (Array.isArray(protocol.category) && protocol.category.some((cat) => cat.toLowerCase().includes(term)))
  );
}

/**
 * Sort protocols by specified field
 */
export function sortProtocols(protocols: Protocol[], sortBy: keyof Protocol, direction: "ascending" | "descending"): Protocol[] {
  return [...protocols].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "ascending" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (aStr < bStr) return direction === "ascending" ? -1 : 1;
    if (aStr > bStr) return direction === "ascending" ? 1 : -1;

    return 0;
  });
}
