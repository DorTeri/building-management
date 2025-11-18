import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_KEYS } from 'src/constants/cache.consts';
import { WebsiteCacheRequest } from 'src/types/website/website.cache.types';

@Injectable()
export class WebsiteCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<WebsiteCacheRequest>();

    if (request.method !== 'GET') return undefined;

    const { params } = request;

    if (params.publisherId) {
      return CACHE_KEYS.websitesByPublisher(params.publisherId);
    }

    if (params.id) {
      return CACHE_KEYS.website(params.id);
    }

    return CACHE_KEYS.websites();
  }
}
