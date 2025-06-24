import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '@/src/shared/token.service';
import { ScraperService } from '../scrapper/scrapper.service';
import { CarService } from '../car-repository/car.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') as string,
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [TelegramService, TokenService, ScraperService, CarService],
})
export class TelegramModule { }
