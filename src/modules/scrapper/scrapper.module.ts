import { Module } from '@nestjs/common';
import { ScraperService } from './scrapper.service';

@Module({
  controllers: [],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScrapperModule { }
