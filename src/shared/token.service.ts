import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from "../modules/prisma/prisma.service";
import { Token } from "@/prisma/generated";

@Injectable()
export class TokenService {
    constructor(private readonly prismaService: PrismaService) { }

    async generateToken() {
        let token = uuidv4();;

        const expiredAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

        const newToken = await this.prismaService.token.create({
            data: {
                token,
                expiredAt,
            }
        })

        return newToken;

    }

    async verifyToken(token: string): Promise<Token | null> {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: token,
            }
        })

        if (!existingToken) {
            return null
        }

        const hasExpired = new Date(existingToken.expiredAt) < new Date();
        if (hasExpired) {
            return null
        }

        return existingToken;
    }
}