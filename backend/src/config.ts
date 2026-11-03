export interface BackendConfig {
  port: number;
  corsOrigins: string[];
  throttleLimit: number;
  throttleTtlMs: number;
}

const DEFAULTS = {
  port: 3001,
  corsOrigins: ['http://localhost:3000'],
  throttleLimit: 60,
  throttleTtlMs: 60_000,
};

function positiveInteger(name: string, value: string | undefined, fallback: number, max: number): number {
  if (value === undefined || value.trim() === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new Error(`${name} must be an integer between 1 and ${max}`);
  }
  return parsed;
}

function parseOrigins(value: string | undefined): string[] {
  if (value === undefined) return [...DEFAULTS.corsOrigins];
  const origins = value.split(',').map((origin) => origin.trim()).filter(Boolean);
  if (origins.length === 0) throw new Error('CORS_ORIGINS must contain at least one origin');
  return origins.map((origin) => {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error('CORS_ORIGINS must contain valid HTTP or HTTPS origins');
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error('CORS_ORIGINS must contain valid HTTP or HTTPS origins without paths or wildcards');
    }
    return parsed.origin;
  });
}

export function loadConfig(env: Record<string, string | undefined> = process.env): BackendConfig {
  return {
    port: positiveInteger('PORT', env.PORT, DEFAULTS.port, 65_535),
    corsOrigins: parseOrigins(env.CORS_ORIGINS),
    throttleLimit: positiveInteger('THROTTLE_LIMIT', env.THROTTLE_LIMIT, DEFAULTS.throttleLimit, 1_000_000),
    throttleTtlMs: positiveInteger('THROTTLE_TTL_MS', env.THROTTLE_TTL_MS, DEFAULTS.throttleTtlMs, 86_400_000),
  };
}
