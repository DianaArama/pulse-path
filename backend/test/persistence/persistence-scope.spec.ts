import 'reflect-metadata';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../../src/configure-app.js';
import { AppModule } from '../../src/app.module.js';
import { Pool } from 'pg';
import { describe, expect, it } from 'vitest';

describe('PP0009 persistence scope and environment', () => {
  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'VC-01 uses isolated local PostgreSQL and deterministic synthetic data',
    async () => {
      const databaseUrl = process.env.PP0009_TEST_DATABASE_URL!;
      const parsedUrl = new URL(databaseUrl);
      expect(['127.0.0.1', 'localhost', '::1']).toContain(parsedUrl.hostname);
      expect(parsedUrl.pathname).toBe('/pp0009_test');

      const pool = new Pool({ connectionString: databaseUrl });
      const client = await pool.connect();
      const accountId = '00000000-0000-4000-8000-000000000901';
      const profileId = '00000000-0000-4000-8000-000000000902';
      const movementId = '00000000-0000-4000-8000-000000000903';

      try {
        const server = await client.query<{
          database_name: string;
          server_address: string;
        }>(
          'SELECT current_database() AS database_name, host(inet_server_addr()) AS server_address',
        );
        expect(server.rows[0]).toEqual({
          database_name: 'pp0009_test',
          server_address: expect.stringMatching(/^(127\.0\.0\.1|::1)$/),
        });

        const tables = await client.query<{ table_name: string }>(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        );
        expect(tables.rows.map((row) => row.table_name)).toEqual(
          expect.arrayContaining([
            'accounts',
            'profiles',
            'profile_metrics',
            'profile_goals',
            'movement_daily_records',
            'stress_check_ins',
          ]),
        );

        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic VC-01 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        await client.query(
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
            'VALUES ($1, $2, $3::date, $4)',
          [movementId, profileId, '2026-11-09', 12],
        );
        const fixture = await client.query<{ active_minutes: number }>(
          'SELECT active_minutes FROM movement_daily_records WHERE id = $1',
          [movementId],
        );
        expect(fixture.rows).toEqual([{ active_minutes: 12 }]);
        await client.query('ROLLBACK');

        const cleanup = await client.query<{ row_count: string }>(
          'SELECT COUNT(*)::text AS row_count FROM movement_daily_records WHERE id = $1',
          [movementId],
        );
        expect(cleanup.rows).toEqual([{ row_count: '0' }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it('VC-02 adds no API routes or excluded persistence behaviors', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app: INestApplication = testingModule.createNestApplication(
      new ExpressAdapter(),
    );

    try {
      configureApp(app);
      await app.init();
      const response = await request(app.getHttpServer())
        .get('/openapi.json')
        .expect(200);
      expect(Object.keys(response.body.paths)).toEqual([]);

      const appModule = await readFile(
        resolve(process.cwd(), 'src/app.module.ts'),
        'utf8',
      );
      expect(appModule).not.toMatch(/controllers\s*:/i);
      expect(appModule).not.toMatch(
        /AuthenticationModule|AuthModule|AuditEvent|AuditLog|ExportModule|ProviderSync|ReconciliationModule/i,
      );

      const schema = await readFile(
        resolve(process.cwd(), 'prisma/schema.prisma'),
        'utf8',
      );
      expect(schema).not.toMatch(
        /password|credential|refresh.?token|AuditEvent|AuditLog|Wearable|Device|Habit|Observation|Correction|CoachResponse/i,
      );
    } finally {
      await app.close();
    }
  });
});
