import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { ApiExceptionFilter } from './common/api-exception.filter.js';
import { loadConfig } from './config.js';

function validationErrors(errors: ValidationError[]): Array<{ field: string; code: string }> {
  return errors.map(({ property }) => ({ field: property, code: 'INVALID_VALUE' }));
}

export function configureApp(app: INestApplication): void {
  const config = loadConfig();

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException({
        fieldErrors: validationErrors(errors),
      }),
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  const openApiConfig = new DocumentBuilder()
    .setTitle('Pulse-path Backend API')
    .setDescription('Local API contract for the Pulse-path backend PoC.')
    .setVersion('1.0.0')
    .addServer('/api/v1')
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('docs', app, openApiDocument, { jsonDocumentUrl: 'openapi.json' });
}
