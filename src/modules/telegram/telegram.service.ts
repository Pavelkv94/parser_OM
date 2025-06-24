import { Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { TELEGRAM_MESSAGES, TEMP_TEXT } from './telegram.messages';
import { TELEGRAM_BUTTONS, TelegramButtons } from './telegram.buttons';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../../shared/token.service';
import { CarData, ScraperService } from '../scrapper/scrapper.service';
import { buildScrapeUrl } from '@/src/utils/buildScrapeUrl.util';
import { parsePublishedAt } from '@/src/utils/parseDate';
import { CarService } from '../car-repository/car.service';
import { Car, Filter } from '@/prisma/generated';

@Update()
@Injectable()
export class TelegramService extends Telegraf {
    private adminId: string;
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly scraperService: ScraperService,
        private readonly carService: CarService
    ) {
        super(configService.get<string>('TELEGRAM_BOT_TOKEN') as string);
        this.adminId = configService.get<string>('TELEGRAM_ADMIN_ID') as string;
    }

    @Start()
    async onStart(@Ctx() ctx: any) {
        const user = ctx.message?.from;
        const token = ctx.message?.text?.split(' ')[1];
        const isAdmin = user.id.toString() === this.adminId;
        const userData = await this.findUserByTelegramId(user.id.toString());
        if (isAdmin && !userData) {
            await this.connectTelegram(user);
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.start, TELEGRAM_BUTTONS.adminButtons());
        } else if (isAdmin && userData) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.start, TELEGRAM_BUTTONS.adminButtons());
        } else await ctx.replyWithHTML(TELEGRAM_MESSAGES.welcomeWithoutToken);

        if (!token && !isAdmin && !userData) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.welcomeWithoutToken);
        }

        if (token) {
            const tokenData = await this.tokenService.verifyToken(token);

            if (!tokenData) {
                await ctx.reply(TELEGRAM_MESSAGES.invalidToken);
            } else {
                const userData = await this.findUserByTelegramId(user.id.toString());
                if (!userData) {
                    await this.connectTelegram(user);
                } else {
                    await ctx.replyWithHTML(TELEGRAM_MESSAGES.telegramConnected, isAdmin ? TELEGRAM_BUTTONS.adminButtons() : TELEGRAM_BUTTONS.userButtons());
                }

                await this.prismaService.token.delete({
                    where: {
                        id: tokenData.id
                    }
                });

                await ctx.replyWithHTML(TELEGRAM_MESSAGES.telegramConnected, isAdmin ? TELEGRAM_BUTTONS.adminButtons() : TELEGRAM_BUTTONS.userButtons());
            }
        }

    }

    @Hears(TelegramButtons.GenerateNewToken)
    async onGenerateNewToken(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();

        const user = await this.findUserByTelegramId(chatId!);
        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.haventRights);
            return;
        }

        if (chatId !== this.configService.get<string>('TELEGRAM_ADMIN_ID')) {
            await ctx.reply(TELEGRAM_MESSAGES.haventRights);
            return;
        } else {
            const newToken = await this.tokenService.generateToken();
            await ctx.reply(TELEGRAM_MESSAGES.yourToken(newToken.token));
            return;
        }
    }

    @Hears(TelegramButtons.SetFilters)
    async onSetFilters(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();

        const user = await this.findUserByTelegramId(chatId!);
        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.haventRights);
            return;
        }

        await this.prismaService.filter.create({
            data: {
                userId: user.id,
                brand: 'ford',
                model: 'focus',
                fromYear: '2011',
                city: 'krakow',
                fuelTypeFirst: 'petrol',
                fuelTypeSecond: 'diesel',
                gearbox: 'manual',
                engine_capacity_from: '1500',
                engine_capacity_to: '1650',
                price_from: '10000',
                price_to: '35000',
                sortBy: 'created_at_first',
            }
        });

        await this.prismaService.filter.create({
            data: {
                userId: user.id,
                brand: 'renault',
                model: 'megane',
                fromYear: '2011',
                city: 'krakow',
                fuelTypeFirst: 'petrol',
                fuelTypeSecond: 'diesel',
                gearbox: 'manual',
                engine_capacity_from: '1450',
                engine_capacity_to: '1650',
                price_from: '10000',
                price_to: '35000',
                sortBy: 'created_at_first',
            }
        });

        await this.prismaService.filter.create({
            data: {
                userId: user.id,
                brand: 'dacia',
                model: 'duster',
                fromYear: '2014',
                city: 'krakow',
                fuelTypeFirst: 'petrol',
                fuelTypeSecond: 'diesel',
                gearbox: 'manual',
                engine_capacity_from: '1450',
                engine_capacity_to: '1650',
                price_from: '10000',
                price_to: '35000',
                sortBy: 'created_at_first',
            }
        });

        await ctx.reply(TELEGRAM_MESSAGES.filtersSet);

    }

    @Hears(TelegramButtons.ShowLastCars)
    async onShowLastCars(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();

        const user = await this.findUserByTelegramId(chatId!);
        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.haventRights);
            return;
        }

        // First get user's filters
        const filters = await this.prismaService.filter.findMany({});

        if (filters.length === 0) {
            await ctx.reply('You have no filters set up yet.');
            return;
        }

        // Get cars for all user's filters
        const cars = await this.prismaService.car.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (cars.length === 0) {
            await ctx.reply('No cars found for your filters.');
            return;
        }

        const sortedCars = cars.sort((a, b) => {
            return parsePublishedAt(a.publicAt || '') - parsePublishedAt(b.publicAt || '');
        }).slice(0, 10);

        for (const car of sortedCars) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.car(car).replace(TEMP_TEXT, ''));
        }

    }

    @Hears(TelegramButtons.GetFilters)
    async onGetFilters(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString();
        const user = await this.findUserByTelegramId(chatId!);
        if (!user) {
            await ctx.reply(TELEGRAM_MESSAGES.haventRights);
            return;
        }

        const filters = await this.prismaService.filter.findMany({
            //todo make own filters for each user
            // where: {
            //     userId: user.id
            // }
        });

        if (filters.length === 0) {
            await ctx.reply('You have no filters set up yet.');
            return;
        }

        for (const filter of filters) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.filter(filter), TELEGRAM_BUTTONS.showFilterResults(filter.id));
        }
    }

    @Command(TelegramButtons.ShowFilterResults)
    @Action(new RegExp(`^${TelegramButtons.ShowFilterResults}:(.+)$`))
    async onShowFilterResults(@Ctx() ctx: any) {
        const filterId = ctx.match[1];

        const filter = await this.prismaService.filter.findUnique({
            where: { id: filterId }
        });

        if (!filter) {
            await ctx.reply('Filter not found.');
            return;
        }

        const url = buildScrapeUrl(filter);
        const cars = await this.scraperService.scrapeArticles(url, filterId);
        if (cars.articles.length > 0) {
            await this.carService.saveCarsToPrisma(cars.articles, filterId);
        }

        if (cars.articles.length === 0 && cars.count === '0') {
            await ctx.reply('No cars found for this filter.');
            return;
        }
        if (cars.articles.length === 0 && cars.count !== '0') {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.foundedCars(cars.count));
            return;
        }

        const sortedCars = cars.articles.sort((a, b) => {
            return parsePublishedAt(a.publicAt || '') - parsePublishedAt(b.publicAt || '');
        });

        for (const car of sortedCars) {
            await ctx.replyWithHTML(TELEGRAM_MESSAGES.car(car).replace(TEMP_TEXT, ''));
        }
        await ctx.replyWithHTML(TELEGRAM_MESSAGES.foundedCars(cars.count));

    }

    async sendNewCars(cars: CarData[]) {
        const users = await this.prismaService.user.findMany({});

        for (const user of users) {
            if (user.telegramId) {
                for (const car of cars) {
                    await this.telegram.sendMessage(user.telegramId, TELEGRAM_MESSAGES.newCar(car as Car));
                }
            }
        }
    }

    private async connectTelegram(user: any) {
        await this.prismaService.user.create({
            data: {
                telegramId: user.id.toString(),
                username: user.username,
                firstName: user.first_name,
            }
        });
    }

    private async findUserByTelegramId(telegramId: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                telegramId: telegramId
            },
        });

        return user;
    }

}
