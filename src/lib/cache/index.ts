interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class CacheService {
  private static store = new Map<string, CacheEntry<any>>();
  private static defaultTTL = 300000; // 5 minutes

  /**
   * Get a value from cache
   */
  static get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Set a value in cache
   */
  static set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + (ttl || this.defaultTTL),
    });
  }

  /**
   * Delete a value from cache
   */
  static delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.store.clear();
  }

  /**
   * Get or set cache value
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Check if key exists and is not expired
   */
  static has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache stats
   */
  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }

  /**
   * Delete expired entries
   */
  static cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
        count++;
      }
    }

    return count;
  }
}
