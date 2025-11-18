import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Injectable, Logger, Inject } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async clearAll(): Promise<void> {
    try {
      await this.cacheManager.clear();
      this.logger.log('All cache cleared');
      return;
    } catch (error) {
      this.logger.error('Failed to clear cache', error);
      throw error;
    }
  }
}
