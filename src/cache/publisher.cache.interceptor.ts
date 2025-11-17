import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_KEYS } from 'src/constants/cache.consts';
import { PublisherCacheRequest } from 'src/types/publisher/publisher.cache.types';

@Injectable()
export class PublisherCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<PublisherCacheRequest>();

    if (request.method !== 'GET') return undefined;

    const { params, query } = request;

    if (!params.id) {
      const include = query.includeWebsites === 'true';

      return include
        ? CACHE_KEYS.publishersIncludeWebsites()
        : CACHE_KEYS.publishers();
    }

    return CACHE_KEYS.publisher(params.id);
  }
}
