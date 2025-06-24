import { Module } from '@nestjs/common';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { CronModule } from './modules/cron/cron.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { configModule } from './env-config/env-config.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CarModule } from './modules/car-repository/car.module';

@Module({
  imports: [configModule, PrismaModule, ScrapperModule, CronModule, TelegramModule, CarModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
