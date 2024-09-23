import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS con la IP externa y otros dominios permitidos
  app.enableCors({
    origin: ['http://34.41.100.138:3000', 'https://8b49-181-36-147-222.ngrok-free.app'], // Agregamos la IP del servidor
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir el uso de cookies/autenticación
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validación global con la lista blanca de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Puerto configurado en las variables de entorno
  await app.listen(envs.port);
  console.log(`Application is running on: ${envs.port}`);
}

bootstrap();
