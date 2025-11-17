import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Publisher } from './publisher.entity';
import { Website } from '../website/website.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepo: Repository<Publisher>,

    @InjectRepository(Website)
    private readonly websiteRepo: Repository<Website>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async clearCache() {
    await this.cacheManager.del('publishers');
  }

  async findAll(includeWebsites = false): Promise<Publisher[]> {
    if (includeWebsites) {
      return this.publisherRepo.find({ relations: ['websites'] });
    }

    return this.publisherRepo.find();
  }

  async findOne(id: number): Promise<Publisher | null> {
    return this.publisherRepo.findOne({
      where: { id },
      relations: ['websites'],
    });
  }

  async upsert(dto: CreatePublisherDto): Promise<Publisher> {
    let publisher = await this.publisherRepo.findOne({
      where: { name: dto.name },
    });

    if (publisher) {
      publisher.email = dto.email;
      publisher.contact_name = dto.contact_name;
    } else {
      publisher = this.publisherRepo.create(dto);
    }

    const saved = await this.publisherRepo.save(publisher);
    await this.clearCache();
    return saved;
  }

  async remove(id: number): Promise<void> {
    const result = await this.publisherRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Publisher not found');
    }

    await this.clearCache();
  }
}
