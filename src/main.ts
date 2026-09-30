import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 const config = new DocumentBuilder()
    .setTitle('Chat API Docs')
    .setDescription('The core API description and endpoints')
    .setVersion('1.0')
    .addTag('users') // Optional: group your endpoints by tags
    .addBearerAuth() // Optional: add JWT Bearer authentication if needed
    .build();

  // 2. Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the Swagger UI route (e.g., available at /api)
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
