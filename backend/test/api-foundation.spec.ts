import 'reflect-metadata';
import { Body, Controller, Get, INestApplication, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module.js';
import { IsString, MinLength } from 'class-validator';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { configureApp } from '../src/configure-app.js';

class SyntheticRequestDto {
  @ApiProperty({ minLength: 2, example: 'synthetic' })
  @IsString()
  @MinLength(2)
  value!: string;
}

class ApiErrorDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code!: string;
  @ApiProperty({ example: 'Request validation failed' })
  message!: string;
  @ApiProperty({
    required: false,
    type: 'array',
    items: { type: 'object', properties: { field: { type: 'string' }, code: { type: 'string' } } },
  })
  fieldErrors?: Array<{ field: string; code: string }>;
}

@ApiTags('test-support')
@Controller('test/echo')
class TestOnlyController {
  @Get('rate-limit')
  @ApiOperation({ summary: 'Test-only rate-limit request' })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  @ApiResponse({ status: 429, type: ApiErrorDto })
  rateLimit() {
    return { ok: true };
  }

  @Get('rate-limit-by-ip')
  @ApiOperation({ summary: 'Test-only rate-limit client isolation request' })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { ok: { type: 'boolean' } } } })
  @ApiResponse({ status: 429, type: ApiErrorDto })
  rateLimitByIp() {
    return { ok: true };
  }

  @Get('failure')
  @ApiOperation({ summary: 'Test-only unexpected error response' })
  @ApiResponse({ status: 500, type: ApiErrorDto })
  fail() {
    throw new Error('INTERNAL_EXCEPTION_SENTINEL');
  }

  @Post()
  @ApiOperation({ summary: 'Test-only shared DTO validation request' })
  @ApiBody({ type: SyntheticRequestDto })
  @ApiResponse({ status: 201, type: SyntheticRequestDto })
  @ApiResponse({ status: 400, type: ApiErrorDto })
  @ApiResponse({ status: 429, type: ApiErrorDto })
  echo(@Body() body: SyntheticRequestDto) {
    return body;
  }
}

describe('PP0008 REST foundation acceptance inventory', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestOnlyController],
    }).compile();
    app = module.createNestApplication(new ExpressAdapter());
    configureApp(app);
    // Test-only client-address fixture; production does not trust forwarded headers.
    app.use((rawRequest: unknown, _response: unknown, next: () => void) => {
      const testRequest = rawRequest as {
        headers: Record<string, unknown>;
        ip: string;
      };
      const testIp = testRequest.headers['x-test-client-ip'];
      if (typeof testIp === 'string') {
        Object.defineProperty(testRequest, 'ip', { configurable: true, value: testIp });
      }
      next();
    });
    await app.init();
  });

  afterAll(async () => app?.close());

  it('accepts a valid synthetic DTO request', () => {
    // Given a request containing only valid DTO fields, when submitted, then the handler accepts it.
    return request(app.getHttpServer())
      .post('/api/v1/test/echo')
      .send({ value: 'synthetic' })
      .expect(201)
      .expect({ value: 'synthetic' });
  });

  it('rejects invalid DTO values with a safe validation response', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test/echo')
      .send({ value: 42 })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fieldErrors: [{ field: 'value', code: 'INVALID_VALUE' }],
    });
    expect(JSON.stringify(response.body)).not.toContain('42');
  });

  it('rejects undeclared fields without echoing submitted values', async () => {
    const secret = 'TOP_SECRET_SENTINEL';
    const response = await request(app.getHttpServer())
      .post('/api/v1/test/echo')
      .send({ value: 'synthetic', extraField: secret })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fieldErrors: [{ field: 'extraField', code: 'INVALID_VALUE' }],
    });
    expect(JSON.stringify(response.body)).not.toContain(secret);
  });

  it('normalizes unexpected failures into a generic 500 response', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/test/echo/failure')
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
    expect(JSON.stringify(response.body)).not.toContain('INTERNAL_EXCEPTION_SENTINEL');
    expect(JSON.stringify(response.body)).not.toContain('stack');
  });

  it('allows requests through the configured rate limit and rejects the next request', async () => {
    const endpoint = '/api/v1/test/echo/rate-limit';
    for (let index = 0; index < 60; index += 1) {
      await request(app.getHttpServer()).get(endpoint).expect(200, { ok: true });
    }

    const response = await request(app.getHttpServer()).get(endpoint).expect(429);
    expect(response.body).toEqual({
      statusCode: 429,
      code: 'RATE_LIMITED',
      message: 'Too many requests',
    });
  });

  it('tracks rate limits independently for different client IPs', async () => {
    const endpoint = '/api/v1/test/echo/rate-limit-by-ip';
    for (let index = 0; index < 60; index += 1) {
      await request(app.getHttpServer())
        .get(endpoint)
        .set('x-test-client-ip', '192.0.2.10')
        .expect(200, { ok: true });
    }

    await request(app.getHttpServer())
      .get(endpoint)
      .set('x-test-client-ip', '192.0.2.11')
      .expect(200, { ok: true });
    await request(app.getHttpServer())
      .get(endpoint)
      .set('x-test-client-ip', '192.0.2.10')
      .expect(429);
  });

  it('allows CORS only for the configured local frontend origin', async () => {
    const response = await request(app.getHttpServer())
      .options('/api/v1/test/echo')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,authorization')
      .expect(204);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('does not grant CORS access to an unconfigured origin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test/echo')
      .set('Origin', 'https://attacker.example')
      .send({ value: 'synthetic' })
      .expect(201);

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('publishes OpenAPI paths and schemas for PP0008-owned test routes', async () => {
    const response = await request(app.getHttpServer()).get('/openapi.json').expect(200);
    const operation = response.body.paths['/api/v1/test/echo'].post;

    expect(response.body.openapi).toMatch(/^3\./);
    expect(operation.requestBody.content['application/json'].schema.$ref)
      .toBe('#/components/schemas/SyntheticRequestDto');
    expect(operation.responses['400'].content['application/json'].schema.$ref)
      .toBe('#/components/schemas/ApiErrorDto');
    expect(operation.responses['429'].content['application/json'].schema.$ref)
      .toBe('#/components/schemas/ApiErrorDto');
    expect(response.body.servers).toContainEqual({ url: '/api/v1' });
  });

});
