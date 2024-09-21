import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, FRONT_END_URL } from './utils/const';
import { logger } from './utils/logger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  app.enableCors({
    origin: FRONT_END_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'access-control-allow-origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI,
  });

  await app.listen(PORT, () => {
    logger.debug(`Listening at ${PORT}`);
  });
}

bootstrap();
