import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { CONSTANTS } from './contanst';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('gateway');
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway for microservices')
    .setVersion('1.0')
    .addTag(CONSTANTS.PREFIX_API)
    .build();
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAuthGuard(jwtService));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
