import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CACHE_KEYS } from 'src/constants/cache.consts';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async clearPublisherCache(id?: number) {
    await this.cacheManager.del(CACHE_KEYS.publishers());
    await this.cacheManager.del(CACHE_KEYS.publishersIncludeWebsites());

    if (id) {
      await this.cacheManager.del(CACHE_KEYS.publisher(id));
    }
  }

  async clearWebsiteCache(id?: number, publisherId?: number) {
    await this.cacheManager.del(CACHE_KEYS.websites());

    if (publisherId) {
      await this.cacheManager.del(CACHE_KEYS.websitesByPublisher(publisherId));
    }

    if (id) {
      await this.cacheManager.del(CACHE_KEYS.website(id));
    }
  }
}
