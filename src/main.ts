import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.setGlobalPrefix('/api');

  await app.listen(process.env.PORT ?? 3000).then(() => {
    logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
