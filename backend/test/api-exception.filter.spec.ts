import { BadRequestException, HttpException } from '@nestjs/common';
import { normalizeApiException } from '../src/common/api-exception.filter.js';
import { describe, expect, it } from 'vitest';

describe('API exception normalization', () => {
  it('hides unexpected exception messages and stacks', () => {
    const normalized = normalizeApiException(new Error('database password sentinel'));
    expect(normalized).toEqual({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
    expect(JSON.stringify(normalized)).not.toContain('database password sentinel');
    expect(JSON.stringify(normalized)).not.toContain('stack');
  });

  it('maps validation errors to sanitized field names and stable codes', () => {
    const normalized = normalizeApiException(new BadRequestException({
      fieldErrors: [
        { field: 'email', code: 'INVALID_VALUE', value: 'private@example.com' },
        { field: '../secrets', code: 'INVALID_VALUE', value: 'private-value' },
      ],
    }));
    expect(normalized).toEqual({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fieldErrors: [
        { field: 'email', code: 'INVALID_VALUE' },
        { field: 'request', code: 'INVALID_VALUE' },
      ],
    });
    expect(JSON.stringify(normalized)).not.toContain('private');
  });

  it('maps throttling errors to the shared safe response', () => {
    expect(normalizeApiException(new HttpException('Too many requests', 429))).toEqual({
      statusCode: 429,
      code: 'RATE_LIMITED',
      message: 'Too many requests',
    });
  });
});
