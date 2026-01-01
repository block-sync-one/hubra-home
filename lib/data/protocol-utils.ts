import type { Protocol } from "@/lib/types/defi-stats";

import { UnifiedProtocolData } from "@/lib/data/unified-protocol-cache";

/**
 * Protocol Resolution Utilities
 *
 * Explicit, centralized logic for determining parent/child relationships
 * and resolving protocol slugs to their parent protocols.
 */

/**
 * Determines if a protocol is a parent protocol
 *
 * A protocol is a parent if:
 * - isParentProtocol === true, OR
 * - parentProtocol is empty/null/undefined (no parent relationship)
 *
 * @param protocol - Protocol to check
 * @returns true if the protocol is a parent protocol
 */
export function isParentProtocol(protocol: Protocol | UnifiedProtocolData): boolean {
  return protocol.isParentProtocol === true || !protocol.parentProtocol;
}
/**
 * Protocol Resolution Result
 *
 * Contains metadata about the resolution process for explicit handling
 */
export interface ProtocolResolutionResult {
  /** The original slug that was requested */
  originalSlug: string;
  /** The resolved slug (parent if original was child) */
  resolvedSlug: string;
  /** Whether a resolution occurred (child -> parent) */
  wasResolved: boolean;
  /** The resolved protocol data */
  protocol: UnifiedProtocolData;
}
