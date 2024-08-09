import { Injectable } from '@angular/core';

type CacheItem<T> = {
  data: T;
  expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheDataService {

  setCache<T>(key: string, data: T, durationInSeconds: number): void {
    const now = new Date().getTime();
    const expiry = now + durationInSeconds * 1000;
    const item: CacheItem<T> = { data, expiry };

    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  getCache<T>(key: string): T | null {
    try {
      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) return null;

      const item: CacheItem<T> = JSON.parse(cachedItem);

      if (this.isExpired<T>(item)) {
        this.removeCacheByKey(key)
        return null;
      }
      return item.data;

    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  private isExpired<T>(item: CacheItem<T>): boolean {
    const now = new Date().getTime();
    return now > item.expiry;
  }

  removeCacheByKey(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  clearCache(): void {
    localStorage.clear();
  }
}
