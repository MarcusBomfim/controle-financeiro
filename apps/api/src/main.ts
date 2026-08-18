import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import type { Environment } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Environment, true>);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get('CLIENT_URL', { infer: true }),
    credentials: true,
  });
  app.enableShutdownHooks();

  const port = configService.get('PORT', { infer: true });
  await app.listen(port);
}

void bootstrap();
