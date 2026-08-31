/**
 * In-Memory & Storage Idempotency Key Manager
 * Protects financial and state-modifying actions against double-clicks, network retries, and race conditions.
 */

export interface IdempotencyRecord<T = unknown> {
  key: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  result?: T;
  error?: string;
  createdAt: number;
}

class IdempotencyManager {
  private records = new Map<string, IdempotencyRecord>();
  private readonly ttlMs = 1000 * 60 * 15; // 15 minutes TTL

  public start<T>(key: string): { ok: boolean; cached?: IdempotencyRecord<T> } {
    this.cleanup();
    const existing = this.records.get(key) as IdempotencyRecord<T> | undefined;

    if (existing) {
      return { ok: false, cached: existing };
    }

    this.records.set(key, {
      key,
      status: 'PENDING',
      createdAt: Date.now(),
    });

    return { ok: true };
  }

  public resolve<T>(key: string, result: T): void {
    const existing = this.records.get(key);
    if (existing) {
      existing.status = 'RESOLVED';
      existing.result = result;
    }
  }

  public reject(key: string, error: string): void {
    const existing = this.records.get(key);
    if (existing) {
      existing.status = 'REJECTED';
      existing.error = error;
    }
  }

  public get<T>(key: string): IdempotencyRecord<T> | undefined {
    return this.records.get(key) as IdempotencyRecord<T> | undefined;
  }

  public clear(): void {
    this.records.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, rec] of this.records.entries()) {
      if (now - rec.createdAt > this.ttlMs) {
        this.records.delete(key);
      }
    }
  }
}

export const idempotency = new IdempotencyManager();
