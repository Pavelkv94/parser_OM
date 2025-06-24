import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScraperService } from '../scrapper/scrapper.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CarService } from '../car-repository/car.service';
import { TelegramService } from '../telegram/telegram.service';
import { TokenService } from '@/src/shared/token.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, ScraperService, CarService, TelegramService, TokenService],
})
export class CronModule { }
