import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters';
import { JwtAuthGuard } from './modules/auth/jwt.auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('gateway');

  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAuthGuard(jwtService));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('Document GateWAY')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const server = await app.listen(3000);
  server.setTimeout(10 * 60 * 1000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
