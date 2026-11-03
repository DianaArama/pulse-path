import { loadConfig } from '../src/config.js';
import { describe, expect, it } from 'vitest';

describe('backend configuration', () => {
  it('provides explicit local defaults', () => {
    expect(loadConfig({})).toEqual({
      port: 3001,
      corsOrigins: ['http://localhost:3000'],
      throttleLimit: 60,
      throttleTtlMs: 60_000,
    });
  });

  it('parses explicit local overrides', () => {
    expect(loadConfig({
      PORT: '3100',
      CORS_ORIGINS: 'http://localhost:3000,https://localhost:3443',
      THROTTLE_LIMIT: '12',
      THROTTLE_TTL_MS: '15000',
    })).toEqual({
      port: 3100,
      corsOrigins: ['http://localhost:3000', 'https://localhost:3443'],
      throttleLimit: 12,
      throttleTtlMs: 15_000,
    });
  });

  it('rejects invalid ports and unsafe CORS origins', () => {
    expect(() => loadConfig({ PORT: 'invalid' })).toThrow('PORT');
    expect(() => loadConfig({ CORS_ORIGINS: '*' })).toThrow('CORS_ORIGINS');
    expect(() => loadConfig({ CORS_ORIGINS: 'http://localhost:3000/path' })).toThrow('CORS_ORIGINS');
  });
});
