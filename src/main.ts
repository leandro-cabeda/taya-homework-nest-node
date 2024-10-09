import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API TAYA BACKEND HOMEWORK')
    .setDescription('Esta api envolve em uma criação de um aplicativo Node.js/NestJS que fornecerá uma API REST para controle de crédito. Esperamos que você dedique cerca de 3 horas para implementar este recurso.')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3005);
}
bootstrap();
