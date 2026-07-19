import { Logger } from "@/lib/utils/logger";

const logger = new Logger("QueueService");

type JobHandler<T = any> = (data: T) => Promise<void>;

interface Job<T = any> {
  id: string;
  type: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

export class QueueService {
  private static queues = new Map<string, Job[]>();
  private static handlers = new Map<string, JobHandler>();
  private static processing = false;
  private static readonly DEFAULT_MAX_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000;

  /**
   * Register a job handler
   */
  static registerHandler(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
    logger.info(`Registered handler for job type: ${type}`);
  }

  /**
   * Add a job to the queue
   */
  static async add<T>(type: string, data: T, options?: { maxAttempts?: number }): Promise<string> {
    if (!this.handlers.has(type)) {
      throw new Error(`No handler registered for job type: ${type}`);
    }

    const job: Job<T> = {
      id: crypto.randomUUID(),
      type,
      data,
      attempts: 0,
      maxAttempts: options?.maxAttempts || this.DEFAULT_MAX_ATTEMPTS,
      createdAt: new Date(),
      status: "pending",
    };

    if (!this.queues.has(type)) {
      this.queues.set(type, []);
    }

    this.queues.get(type)!.push(job);
    logger.info(`Job added to queue: ${type} (${job.id})`);

    // Start processing if not already
    this.startProcessing();

    return job.id;
  }

  /**
   * Process jobs in the queue
   */
  private static async startProcessing(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.processing) {
      let processed = false;

      for (const [type, jobs] of this.queues.entries()) {
        const pendingJobs = jobs.filter((j) => j.status === "pending");

        for (const job of pendingJobs) {
          const handler = this.handlers.get(type);
          if (!handler) continue;

          try {
            job.status = "processing";
            job.attempts++;

            await handler(job.data);

            job.status = "completed";
            logger.info(`Job completed: ${type} (${job.id})`);
            processed = true;
          } catch (error) {
            job.error = error instanceof Error ? error.message : "Unknown error";

            if (job.attempts < job.maxAttempts) {
              job.status = "pending";
              logger.warn(`Job retrying: ${type} (${job.id}) - Attempt ${job.attempts}/${job.maxAttempts}`);
              await this.delay(this.RETRY_DELAY * job.attempts);
            } else {
              job.status = "failed";
              logger.error(`Job failed: ${type} (${job.id}) - ${job.error}`);
            }
            processed = true;
          }
        }

        // Remove completed/failed jobs older than 1 hour
        const oneHourAgo = new Date(Date.now() - 3600000);
        this.queues.set(
          type,
          jobs.filter(
            (j) =>
              j.status === "pending" ||
              j.status === "processing" ||
              (j.createdAt > oneHourAgo)
          )
        );
      }

      if (!processed) {
        await this.delay(1000); // Wait before checking again
      }
    }
  }

  /**
   * Get queue stats
   */
  static getStats(type?: string): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const stats = { pending: 0, processing: 0, completed: 0, failed: 0 };

    const queues = type ? [[type, this.queues.get(type) || []] as const] : Array.from(this.queues.entries());

    for (const [, jobs] of queues) {
      for (const job of jobs) {
        switch (job.status) {
          case "pending":
            stats.pending++;
            break;
          case "processing":
            stats.processing++;
            break;
          case "completed":
            stats.completed++;
            break;
          case "failed":
            stats.failed++;
            break;
        }
      }
    }

    return stats;
  }

  /**
   * Stop processing
   */
  static stopProcessing(): void {
    this.processing = false;
  }

  /**
   * Clear all queues
   */
  static clearAll(): void {
    this.queues.clear();
    logger.info("All queues cleared");
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
