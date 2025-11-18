import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  NotFoundException,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { WebsiteCacheInterceptor } from 'src/modules/cache/website.cache.interceptor';

@Controller('website')
@UseInterceptors(WebsiteCacheInterceptor)
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get()
  findAll() {
    return this.websiteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const website = await this.websiteService.findOne(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    return website;
  }

  @Get(':publisherId/publisher')
  async findByPublisher(
    @Param('publisherId', ParseIntPipe) publisherId: number,
  ) {
    return this.websiteService.findByPublisher(publisherId);
  }

  @Post()
  upsert(@Body() dto: CreateWebsiteDto) {
    return this.websiteService.upsert(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.websiteService.remove(id);
  }
}
