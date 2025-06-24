import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('process.env.PORT', process.env.PORT);
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  console.log('process.env.POSTGRES_HOST', process.env.POSTGRES_HOST);
  console.log('process.env.POSTGRES_USER', process.env.POSTGRES_USER);
  console.log('process.env.POSTGRES_PASSWORD', process.env.POSTGRES_PASSWORD);
  console.log('process.env.POSTGRES_PORT', process.env.POSTGRES_PORT);
  console.log('process.env.POSTGRES_DB', process.env.POSTGRES_DB);
  console.log('process.env.POSTGRES_URI', process.env.POSTGRES_URI);
  console.log('process.env.TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
