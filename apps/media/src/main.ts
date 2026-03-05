import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'media';

  const logger = new Logger('MediaBootstrap');

  const port = Number(process.env.MEDIA_TCP_PORT ?? 4013);
  //create a microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();

  logger.log(`Media microservice(TCP) running on port: ${port}`);
}

bootstrap();
