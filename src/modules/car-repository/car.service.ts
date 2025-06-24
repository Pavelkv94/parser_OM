import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarService {
    constructor(private readonly prismaService: PrismaService) { }


    async saveCarsToPrisma(cars: any[], filterId: string) {
        await this.prismaService.car.deleteMany({
            where: {
                filterId: filterId
            }
        });

        await this.prismaService.car.createMany({
            data: cars
        });
    }
}
