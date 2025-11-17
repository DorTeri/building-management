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
import { Publisher } from '../publisher/publisher.entity';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { PublisherService } from '../publisher/publisher.service';
import { CACHE_KEYS } from 'src/constants/cache.consts';

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    @InjectRepository(Website)
    private readonly websiteRepo: Repository<Website>,

    @InjectRepository(Publisher)
    private readonly publisherRepo: Repository<Publisher>,

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

  async findOne(id: number): Promise<Website | null> {
    const website = await this.websiteRepo.findOne({
      where: { id },
    });
    return website;
  }

  async findByPublisher(publisherId: number): Promise<Website[]> {
    const publisher = await this.publisherRepo.findOne({
      where: { id: publisherId },
    });

    if (!publisher) {
      this.logger.error(
        `[findByPublisher] Publisher with id ${publisherId} not found`,
      );
      throw new NotFoundException('Publisher not found');
    }

    const websites = await this.websiteRepo.find({
      where: { publisher: { id: publisherId } },
    });
    return websites;
  }

  async upsert(dto: CreateWebsiteDto): Promise<Website> {
    const publisher = await this.publisherRepo.findOne({
      where: { id: dto.publisher_id },
    });

    if (!publisher) {
      this.logger.error(
        `[upsert] Publisher with id ${dto.publisher_id} does not exist`,
      );
      throw new BadRequestException('Publisher does not exist');
    }

    let website = await this.websiteRepo.findOne({
      where: { publisher: { id: dto.publisher_id }, name: dto.name },
    });

    if (!website) {
      website = this.websiteRepo.create({
        publisher: publisher,
        name: dto.name,
      });
    } else {
      website.name = dto.name;
      website.publisher = publisher;
    }

    const saved = await this.websiteRepo.save(website);
    await this.clearWebsiteCache(saved.id, dto.publisher_id);
    await this.publisherService.clearPublisherCache(dto.publisher_id);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const website = await this.websiteRepo.findOne({
      where: { id },
    });

    if (!website) {
      this.logger.error(`[remove] Website with id ${id} not found`);
      throw new NotFoundException('Website not found');
    }

    const publisherId = website.publisher_id;

    await this.websiteRepo.delete(id);

    await this.clearWebsiteCache(id, publisherId);
    await this.publisherService.clearPublisherCache(publisherId);
  }
}
