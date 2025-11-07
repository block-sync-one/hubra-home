import { loggers } from "./logger";

export interface PerformanceMetrics {
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  itemCount?: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private enabled: boolean = process.env.NODE_ENV === "development" || process.env.ENABLE_PERF_TRACKING === "true";

  /**
   * Start tracking a performance operation
   */
  start(operationId: string, operationName: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    this.metrics.set(operationId, {
      operationName,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End tracking and log the results
   */
  end(operationId: string, itemCount?: number): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(operationId);

    if (!metric) {
      loggers.cache.warn(`No performance metric found for: ${operationId}`);

      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;
    metric.itemCount = itemCount;

    // Log the performance
    const itemsInfo = itemCount ? ` (${itemCount} items)` : "";
    const metaInfo = metric.metadata ? ` - ${JSON.stringify(metric.metadata)}` : "";

    loggers.cache.debug(`⏱️  ${metric.operationName}${itemsInfo}: ${duration.toFixed(2)}ms${metaInfo}`);

    // Calculate items per second if applicable
    if (itemCount && itemCount > 0) {
      const itemsPerSecond = (itemCount / duration) * 1000;

      loggers.cache.debug(`   → Throughput: ${itemsPerSecond.toFixed(0)} items/sec`);
    }

    this.metrics.delete(operationId);

    return duration;
  }

  /**
   * Track a promise-based operation
   */
  async track<T>(operationName: string, itemCount: number | undefined, fn: () => Promise<T>): Promise<T> {
    if (!this.enabled) return fn();

    const operationId = `${operationName}-${Date.now()}-${Math.random()}`;

    this.start(operationId, operationName);

    try {
      const result = await fn();

      this.end(operationId, itemCount);

      return result;
    } catch (error) {
      this.end(operationId, itemCount);
      throw error;
    }
  }

  /**
   * Compare two operations and log the improvement
   */
  logImprovement(oldDuration: number, newDuration: number, operationName: string): void {
    if (!this.enabled) return;

    const improvement = oldDuration - newDuration;
    const improvementPercent = (improvement / oldDuration) * 100;

    loggers.cache.info(
      `📊 ${operationName} Performance: ${oldDuration.toFixed(0)}ms → ${newDuration.toFixed(0)}ms ` +
        `(${improvementPercent > 0 ? "+" : ""}${improvementPercent.toFixed(1)}% ${improvementPercent > 0 ? "faster" : "slower"})`
    );
  }

  /**
   * Enable/disable performance tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Get all tracked metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceTracker = new PerformanceTracker();

/**
 * Helper to measure Redis batch operation improvement
 */
export function measureBatchOperation(
  operationName: string,
  batchSize: number
): {
  start: () => void;
  end: () => void;
} {
  let startTime: number;

  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const duration = performance.now() - startTime;
      const avgPerItem = duration / batchSize;

      loggers.cache.debug(`⚡ ${operationName}: ${duration.toFixed(0)}ms for ${batchSize} items (${avgPerItem.toFixed(2)}ms/item)`);
    },
  };
}
