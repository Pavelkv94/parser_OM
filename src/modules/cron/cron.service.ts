import { Injectable } from "@nestjs/common";
import { ScraperService } from "../scrapper/scrapper.service";
import { Cron, CronExpression, Timeout } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { buildScrapeUrl } from "@/src/utils/buildScrapeUrl.util";
import { CarService } from "../car-repository/car.service";
import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class CronService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly scraperService: ScraperService,
        private readonly carService: CarService,
        private readonly telegramService: TelegramService
    ) { }

    @Cron(CronExpression.EVERY_2_HOURS)
    // @Timeout(10000)
    async scrapeArticles() {
        const filters = await this.prismaService.filter.findMany({});

        const singleFilters = filters.filter((f, i) => i === 1);
        const savedCarLinks = await this.prismaService.car.findMany({});

        if (filters.length > 0) {
            for (const filter of filters) {
                try {
                    const cars = await this.scraperService.scrapeArticles(buildScrapeUrl(filter), filter.id);

                    const newUniqueItems = cars.articles.filter(newItem =>
                        !savedCarLinks.some(oldItem => oldItem.link === newItem.link)
                    );

                    if (newUniqueItems.length > 0) {
                        await this.telegramService.sendNewCars(newUniqueItems);
                    }

                    console.log(`Filter ${filter.brand}/${filter.model}: Found ${newUniqueItems.length} new items.`);

                    await this.carService.saveCarsToPrisma(cars.articles, filter.id);
                } catch (error) {
                    console.error(`Error processing filter ${filter.brand}/${filter.model}:`, error);
                }
            }
        }
    }
}
