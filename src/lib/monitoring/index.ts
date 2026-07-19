import { Logger } from "@/lib/utils/logger";

const logger = new Logger("MonitoringService");

interface Metric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: Date;
}

export class MonitoringService {
  private static metrics: Metric[] = [];
  private static readonly MAX_METRICS = 1000;

  /**
   * Record a metric
   */
  static record(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void {
    const metric: Metric = {
      name,
      value,
      tags,
      timestamp: new Date(),
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    logger.debug(`Metric recorded: ${name}=${value}`, tags);
  }

  /**
   * Get metrics by name
   */
  static getMetrics(
    name: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Metric[] {
    let filtered = this.metrics.filter((m) => m.name === name);

    if (options?.startDate) {
      filtered = filtered.filter((m) => m.timestamp >= options.startDate!);
    }

    if (options?.endDate) {
      filtered = filtered.filter((m) => m.timestamp <= options.endDate!);
    }

    if (options?.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  /**
   * Get average value for a metric
   */
  static getAverage(
    name: string,
    options?: { startDate?: Date; endDate?: Date }
  ): number {
    const metrics = this.getMetrics(name, options);

    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Record API response time
   */
  static recordApiResponse(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number
  ): void {
    this.record("api.response_time", responseTime, {
      endpoint,
      method,
      status: statusCode.toString(),
    });

    if (statusCode >= 400) {
      this.record("api.error", 1, {
        endpoint,
        method,
        status: statusCode.toString(),
      });
    }
  }

  /**
   * Record database query time
   */
  static recordDbQuery(query: string, duration: number): void {
    this.record("db.query_time", duration, {
      query: query.substring(0, 100),
    });
  }

  /**
   * Record user action
   */
  static recordUserAction(
    userId: string,
    action: string,
    metadata?: Record<string, any>
  ): void {
    this.record("user.action", 1, {
      userId,
      action,
      ...metadata,
    });
  }

  /**
   * Get system health summary
   */
  static getHealthSummary(): {
    api: { avgResponseTime: number; errorRate: number };
    database: { avgQueryTime: number };
    memory: { heapUsed: number; heapTotal: number };
    uptime: number;
  } {
    const apiMetrics = this.getMetrics("api.response_time");
    const errorMetrics = this.getMetrics("api.error");
    const dbMetrics = this.getMetrics("db.query_time");
    const memoryUsage = process.memoryUsage();

    return {
      api: {
        avgResponseTime: apiMetrics.length > 0
          ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
          : 0,
        errorRate: errorMetrics.length > 0
          ? errorMetrics.reduce((sum, m) => sum + m.value, 0)
          : 0,
      },
      database: {
        avgQueryTime: dbMetrics.length > 0
          ? dbMetrics.reduce((sum, m) => sum + m.value, 0) / dbMetrics.length
          : 0,
      },
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      uptime: process.uptime(),
    };
  }

  /**
   * Clear all metrics
   */
  static clear(): void {
    this.metrics = [];
    logger.info("All metrics cleared");
  }
}
