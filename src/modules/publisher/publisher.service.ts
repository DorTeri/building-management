import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PublisherService {
  private readonly logger = new Logger(PublisherService.name);

  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepo: Repository<Publisher>,

    @Inject(CacheService)
    private readonly cacheService: CacheService,
  ) {}

  async findAll(includeWebsites = false): Promise<Publisher[]> {
    return this.publisherRepo.find({
      relations: includeWebsites ? ['websites'] : [],
    });
  }

  async findOne(id: number): Promise<Publisher> {
    const publisher = await this.publisherRepo.findOne({
      where: { id },
      relations: ['websites'],
    });

    if (!publisher) {
      this.logger.error(`[findOne] Publisher with id ${id} not found`);
      throw new NotFoundException('Publisher not found');
    }

    return publisher;
  }

  async upsert(dto: CreatePublisherDto): Promise<Publisher> {
    const { publisher } = dto.id
      ? await this.updatePublisher(dto.id, dto)
      : await this.createPublisher(dto);

    const saved = await this.publisherRepo.save(publisher);

    await this.cacheService.clearPublisherCache(saved.id);

    return saved;
  }

  private async updatePublisher(
    publisherId: number,
    dto: CreatePublisherDto,
  ): Promise<{ publisher: Publisher }> {
    const publisher = await this.findOne(publisherId);

    if (dto.name) {
      publisher.name = dto.name;
    }

    if (dto.email) {
      publisher.email = dto.email;
    }

    if (dto.contact_name) {
      publisher.contact_name = dto.contact_name;
    }

    return { publisher };
  }

  private createPublisher(
    dto: CreatePublisherDto,
  ): Promise<{ publisher: Publisher }> {
    if (!dto.name || !dto.email || !dto.contact_name) {
      throw new BadRequestException(
        'name, email, and contact_name are required',
      );
    }

    const publisher = this.publisherRepo.create({
      name: dto.name,
      email: dto.email,
      contact_name: dto.contact_name,
    });

    return Promise.resolve({ publisher });
  }

  async remove(id: number): Promise<void> {
    const result = await this.publisherRepo.delete(id);

    if (!result.affected) {
      this.logger.error(
        `[remove] Failed to remove publisher: Publisher with id ${id} not found`,
      );
      throw new NotFoundException('Publisher not found');
    }

    await this.cacheService.clearPublisherCache(id);
    await this.cacheService.clearWebsiteCache(undefined, id);
  }
}
