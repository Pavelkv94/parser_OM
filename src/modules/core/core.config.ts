import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum Environments {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

@Injectable()
export class CoreConfig {

    @IsNotEmpty({
        message: 'Set Env variable NODE_ENV, example: development',
    })
    @IsEnum(Environments, {
        message: 'Set Env variable NODE_ENV, example: development',
    })
    nodeEnv: string

    @IsNumber(
        {},
        {
            message: 'Set Env variable PORT, example: 3000',
        },
    )
    port: number

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_HOST, example: localhost',
    })
    postgresHost: string

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_USER, example: admin',
    })
    postgresUser: string

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_PASSWORD, example: admin',
    })
    postgresPassword: string

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_PORT, example: 5432',
    })
    postgresPort: number

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_DB, example: otomoto',
    })
    postgresDb: string

    @IsNotEmpty({
        message: 'Set Env variable POSTGRES_URI, example: postgresql://localhost:5432/otomoto',
    })
    postgresUri: string

    @IsNotEmpty({
        message: 'Set Env variable TELEGRAM_BOT_TOKEN, example: 7555203188:AAHMqwHgXRM3r-CwofMheOvsxEhS4vPkadM',
    })
    telegramBotToken: string

    @IsNotEmpty({
        message: 'Set Env variable TELEGRAM_ADMIN_ID, example: 7165651580',
    })
    telegramAdminId: string

    @IsNotEmpty({
        message: 'Set Env variable FIREFOX_BINARY, example: /usr/local/bin/firefox',
    })
    firefoxBinary: string


    constructor(private configService: ConfigService<any, true>) {
        this.nodeEnv = this.configService.get('NODE_ENV');
        this.port = this.configService.get('PORT');
        this.postgresHost = this.configService.get('POSTGRES_HOST');
        this.postgresUser = this.configService.get('POSTGRES_USER');
        this.postgresPassword = this.configService.get('POSTGRES_PASSWORD');
        this.postgresPort = this.configService.get('POSTGRES_PORT');
        this.postgresDb = this.configService.get('POSTGRES_DB');
        this.postgresUri = this.configService.get('POSTGRES_URI');
        this.telegramBotToken = this.configService.get('TELEGRAM_BOT_TOKEN');
        this.telegramAdminId = this.configService.get('TELEGRAM_ADMIN_ID');
        this.firefoxBinary = this.configService.get('FIREFOX_BINARY');
    }
}
