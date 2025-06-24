import { Injectable } from '@nestjs/common';
import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { PrismaService } from '../prisma/prisma.service';
import { delay } from '@/src/utils/delay';

export type CarData = {
    image: string | null;
    title: string | null;
    link: string | null;
    description: string | null;
    price: string | null;
    milleage: string | null;
    fuel: string | null;
    transmission: string | null;
    year: string | null;
    location: string | null;
    privateType: string | null;
    publicAt: string | null;
    filterId: string | null;
}

@Injectable()
export class ScraperService {
    private driver: any;

    constructor(private readonly prismaService: PrismaService) { }

    private async initDriver() {
        const chromeOptions = new chrome.Options();
        // chromeOptions.addArguments('--headless'); // Optional: run in headless mode

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();
    }

    async scrapeArticles(url: string, filterId: string): Promise<{ articles: CarData[], count: string }> {
        await this.initDriver();
        try {
            await this.driver.get(url);

            await this.driver.wait(until.elementsLocated(By.tagName('main')), 30000);
            await this.driver.wait(until.elementsLocated(By.tagName('article')), 30000);
            await this.driver.wait(until.elementsLocated(By.tagName('dl')), 30000);

            const mainElement = await this.driver.findElement(By.tagName('main')); //main

            const divs = await mainElement.findElements(By.xpath('./div'));
            const innerDivs1 = await divs[1].findElements(By.xpath('./div'));
            const innerDivs2 = await innerDivs1[0].findElements(By.xpath('./div'));
            const innerDivs3 = await innerDivs2[2].findElements(By.xpath('./div'));
            // find count of auto
            const mainHeader = await innerDivs3[0].findElements(By.xpath('./div'));
            const countElements = await mainHeader[0].findElements(By.tagName('p'));
            const countElement = await countElements[0].findElement(By.tagName('b'));
            const count = await countElement.getText();
            // find cars
            const mainContentArticles = await innerDivs3[1].findElements(By.xpath('./article'));

            let articles: any[] = []

            for (let article of mainContentArticles) {
                let carData: CarData = {
                    image: '',
                    title: '',
                    link: '',
                    description: '',
                    price: '',
                    milleage: '',
                    fuel: '',
                    transmission: '',
                    year: '',
                    location: '',
                    privateType: '',
                    publicAt: '',
                    filterId: filterId
                };
                let sections = await article.findElements(By.xpath('./section'));
                let sectionDivs = await sections[0].findElements(By.xpath('./div'));
                let imageDiv = sectionDivs[0];
                let titleDiv = sectionDivs[1]
                let descriptionDiv = sectionDivs[2]
                let priceDiv = sectionDivs[3]

                let img = await imageDiv.findElement(By.tagName('img'));
                carData.image = await img.getAttribute('src') || null;

                let titleInnerDiv = await titleDiv.findElement(By.xpath('./div'));
                let titleH2 = await titleInnerDiv.findElement(By.tagName('h2'));
                carData.title = await titleH2.getText() || null;
                let link = await titleH2.findElement(By.tagName('a'));
                carData.link = await link.getAttribute('href') || null;

                let titleInnerP = await titleDiv.findElement(By.xpath('./p'));
                carData.description = await titleInnerP.getText() || null;

                let priceDivs = await priceDiv.findElements(By.xpath('./div'));
                let innerPriceDivs2 = await priceDivs[1].findElements(By.xpath('./div'));
                let price = await innerPriceDivs2[0].getText()

                carData.price = price.replace('\n', ' ') || null;

                let descriptionDivs = await descriptionDiv.findElements(By.xpath('./dl'));

                let text = await descriptionDivs[0].getText()
                const params = text.split('\n')
                carData.milleage = params[0] || null;
                carData.fuel = params[1] || null;
                carData.transmission = params[2] || null;
                carData.year = params[3] || null;

                let locationDetails = await descriptionDivs[1].getText();

                const location = await locationDetails.split('\n');
                if (location.length > 1) {
                    const ownerDetails = await location[1].split('•');
                    carData.privateType = ownerDetails[0] || null;
                    carData.publicAt = ownerDetails[1] || null;
                }
                carData.location = location[0] || null;

                articles.push(carData)


            }
            return { articles, count };
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await this.driver.quit();
        }
    }
}
