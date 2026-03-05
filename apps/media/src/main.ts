import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'media';

  const logger = new Logger('MediaBootstrap');

  // const port = Number(process.env.MEDIA_TCP_PORT ?? 4013); //for tcp
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.MEDIA_QUEUE ?? 'media_queue';
  //create a microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();

  logger.log(`Media RMQ listening on queue: ${queue} via ${rmqUrl}`);
}

bootstrap();
