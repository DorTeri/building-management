import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Website } from './website.entity';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { PublisherService } from '../publisher/publisher.service';
import { CACHE_KEYS } from 'src/constants/cache.consts';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    @InjectRepository(Website)
    private readonly websiteRepo: Repository<Website>,

    @Inject(PublisherService)
    private readonly publisherService: PublisherService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async clearWebsiteCache(id?: number, publisherId?: number) {
    await this.cacheManager.del(CACHE_KEYS.websites());

    if (publisherId) {
      await this.cacheManager.del(CACHE_KEYS.websitesByPublisher(publisherId));
    }

    if (id) {
      await this.cacheManager.del(CACHE_KEYS.website(id));
    }
  }

  async findAll(): Promise<Website[]> {
    const websites = await this.websiteRepo.find();
    return websites;
  }

  async findOne(id: number): Promise<Website> {
    const website = await this.websiteRepo.findOne({
      where: { id },
    });

    if (!website) {
      this.logger.error(`[findOne] Website with id ${id} not found`);
      throw new NotFoundException('Website not found');
    }

    return website;
  }

  async findByPublisher(publisherId: number): Promise<Website[]> {
    const publisher = await this.publisherService.findOne(publisherId);

    const websites = await this.websiteRepo.find({
      where: { publisher: { id: publisher.id } },
    });
    return websites;
  }

  async upsert(dto: CreateWebsiteDto): Promise<Website> {
    const { website, publisherId } = dto.id
      ? await this.updateWebsite(dto.id, dto)
      : await this.createWebsite(dto);

    const saved = await this.websiteRepo.save(website);

    await this.clearWebsiteCache(saved.id, publisherId);
    await this.publisherService.clearPublisherCache(publisherId);

    return saved;
  }

  private async updateWebsite(
    websiteId: number,
    dto: CreateWebsiteDto,
  ): Promise<{ website: Website; publisherId: number }> {
    const website = await this.findOne(websiteId);

    if (dto.name) {
      website.name = dto.name;
    }

    let publisherId = website.publisher_id;

    if (dto.publisher_id) {
      const publisher = await this.publisherService.findOne(dto.publisher_id);
      website.publisher = publisher;
      publisherId = dto.publisher_id;
    }

    return { website, publisherId };
  }

  private async createWebsite(
    dto: CreateWebsiteDto,
  ): Promise<{ website: Website; publisherId: number }> {
    if (!dto.publisher_id || !dto.name) {
      throw new BadRequestException('publisher_id and name are required');
    }

    const publisher = await this.publisherService.findOne(dto.publisher_id);

    const website = this.websiteRepo.create({
      publisher,
      name: dto.name,
    });

    return { website, publisherId: dto.publisher_id };
  }

  async remove(id: number): Promise<void> {
    const website = await this.findOne(id);

    const publisherId = website.publisher_id;

    await this.websiteRepo.delete(id);

    await this.clearWebsiteCache(id, publisherId);
    await this.publisherService.clearPublisherCache(publisherId);
  }
}
