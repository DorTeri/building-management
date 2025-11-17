import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Publisher } from './publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { CACHE_KEYS } from 'src/constants/cache.consts';

@Injectable()
export class PublisherService {
  private readonly logger = new Logger(PublisherService.name);

  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepo: Repository<Publisher>,

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

  async findAll(includeWebsites = false): Promise<Publisher[]> {
    if (includeWebsites) {
      const publishers = await this.publisherRepo.find({
        relations: ['websites'],
      });
      return publishers;
    }

    const publishers = await this.publisherRepo.find();
    return publishers;
  }

  async findOne(id: number): Promise<Publisher | null> {
    const publisher = await this.publisherRepo.findOne({
      where: { id },
      relations: ['websites'],
    });
    return publisher;
  }

  async upsert(dto: CreatePublisherDto): Promise<Publisher> {
    const { name, email, contact_name } = dto;
    let publisher = await this.publisherRepo.findOne({
      where: { name },
    });

    if (publisher) {
      publisher.email = email;
      publisher.contact_name = contact_name;
    } else {
      publisher = this.publisherRepo.create(dto);
    }

    const saved = await this.publisherRepo.save(publisher);
    await this.clearPublisherCache(saved.id);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const result = await this.publisherRepo.delete(id);

    if (result.affected === 0) {
      this.logger.error(
        `[remove] Failed to remove publisher: Publisher with id ${id} not found`,
      );
      throw new NotFoundException('Publisher not found');
    }

    await this.clearPublisherCache(id);
  }
}
