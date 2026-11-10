import { describe, expect, it } from 'vitest';

import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from 'pg';

let nextSyntheticId = 1;
const syntheticUuid = (): string =>
  '00000000-0000-4000-8000-' + String(nextSyntheticId++).padStart(12, '0');

describe('PP0009 PostgreSQL and Prisma persistence', () => {
  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-01 migrates a fresh isolated database to the reviewed schema',
    async () => {
      // Given an empty loopback PP0009 test database, when checked-in migrations are applied, then core models and constraints exist.
      const databaseUrl = process.env.PP0009_TEST_DATABASE_URL!;
      const parsedUrl = new URL(databaseUrl);
      expect(['127.0.0.1', 'localhost', '::1']).toContain(parsedUrl.hostname);
      expect(parsedUrl.pathname).toBe('/pp0009_test');

      const pool = new Pool({ connectionString: databaseUrl });
      try {
        await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public');
        const migrationSql = await readFile(
          resolve(
            process.cwd(),
            'prisma/migrations/20261106180000_initial_profile_persistence/migration.sql',
          ),
          'utf8',
        );
        await pool.query(migrationSql);

        const tables = await pool.query<{ table_name: string }>(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        );
        const tableNames = tables.rows.map((row) => row.table_name);
        expect(tableNames).toEqual(
          expect.arrayContaining([
            'accounts',
            'profiles',
            'profile_metrics',
            'profile_goals',
            'movement_daily_records',
            'stress_check_ins',
          ]),
        );

        const constraints = await pool.query<{ constraint_type: string; delete_rule: string }>(`
          SELECT tc.constraint_type, rc.delete_rule
          FROM information_schema.table_constraints tc
          LEFT JOIN information_schema.referential_constraints rc
            ON rc.constraint_name = tc.constraint_name AND rc.constraint_schema = tc.constraint_schema
          WHERE tc.table_schema = 'public' AND tc.table_name = 'profiles'
        `);
        expect(constraints.rows.filter((row) => row.constraint_type === 'FOREIGN KEY')).toEqual(
          expect.arrayContaining([expect.objectContaining({ delete_rule: 'RESTRICT' })]),
        );

        const uniqueMovementKey = await pool.query<{ indexdef: string }>(`
          SELECT indexdef FROM pg_indexes
          WHERE schemaname = 'public' AND tablename = 'movement_daily_records' AND indexdef LIKE 'CREATE UNIQUE%'
        `);
        expect(uniqueMovementKey.rows.some((row) => row.indexdef.includes('(profile_id, record_date)'))).toBe(true);
      } finally {
        await pool.end();
      }
    },
  );

  it.skip('IT-02 persists one account with multiple profiles, metrics, and goals', () => {
    // Given a synthetic account with multiple profiles, when records are persisted, then ownership and current metrics/goals round-trip.
    // Deferred until the PP0012 account-context contract is approved.
  });

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-03 persists movement using canonical active minutes and record date',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();
      const movementId = syntheticUuid();
      const recordDate = '2026-11-09';

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-03 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        await client.query(
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
            'VALUES ($1, $2, $3::date, $4)',
          [movementId, profileId, recordDate, 138],
        );

        const result = await client.query<{
          active_minutes: number;
          record_date: string;
        }>(
          'SELECT active_minutes, record_date::text ' +
            'FROM movement_daily_records WHERE id = $1',
          [movementId],
        );

        expect(result.rows).toEqual([
          { active_minutes: 138, record_date: recordDate },
        ]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-04 rejects duplicate movement records for a profile date',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();
      const firstMovementId = syntheticUuid();
      const duplicateMovementId = syntheticUuid();
      const recordDate = '2026-11-09';

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-04 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        const insertMovement =
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
          'VALUES ($1, $2, $3::date, $4)';

        await client.query(insertMovement, [
          firstMovementId,
          profileId,
          recordDate,
          138,
        ]);
        await client.query('SAVEPOINT duplicate_movement');
        await expect(
          client.query(insertMovement, [
            duplicateMovementId,
            profileId,
            recordDate,
            139,
          ]),
        ).rejects.toMatchObject({ code: '23505' });
        await client.query('ROLLBACK TO SAVEPOINT duplicate_movement');

        const result = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM movement_daily_records ' +
            'WHERE profile_id = $1 AND record_date = $2::date',
          [profileId, recordDate],
        );
        expect(result.rows).toEqual([{ row_count: 1 }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skip('IT-05 persists meal plans with ordered profile-owned items', () => {
    // Given a profile-owned meal plan, when its items are persisted, then their order and ownership are preserved.
    // Deferred until the meal plan parent and ordered-item schema decisions are approved.
  });

  it.skip('IT-06 preserves meal log nutrient snapshots after plan edits', () => {
    // Given a meal plan item and a logged meal, when the plan item changes, then the consumed meal snapshot remains unchanged.
    // Deferred until RG-01 resolves meal snapshots and nutrition behavior.
  });

  it.skip('IT-07 persists hydration in milliliters and derives daily totals', () => {
    // Given hydration entries for a profile/day, when summarized, then totals derive from source entries stored in milliliters.
    // Deferred until RG-01 resolves hydration and derived totals.
  });

  it.skip('IT-08 persists recovery records with approved score semantics', () => {
    // Given approved recovery score/source rules, when a daily record is persisted, then sleep minutes and score retain those semantics.
    // Deferred until RG-02 resolves recovery score semantics.
  });

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-09 retains prior stress dates while updating the same-day record',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();
      const previousCheckInId = syntheticUuid();
      const currentCheckInId = syntheticUuid();

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-09 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        await client.query(
          'INSERT INTO stress_check_ins ' +
            '(id, profile_id, record_date, stress_level, energy_level, sleep_quality) ' +
            'VALUES ($1, $2, $3::date, $4, $5, $6), ($7, $2, $8::date, $9, $10, $11)',
          [
            previousCheckInId,
            profileId,
            '2026-11-08',
            'moderate',
            'steady',
            'good',
            currentCheckInId,
            '2026-11-09',
            'low',
            'high',
            'good',
          ],
        );
        await client.query(
          'UPDATE stress_check_ins ' +
            'SET stress_level = $3, energy_level = $4, sleep_quality = $5 ' +
            'WHERE profile_id = $1 AND record_date = $2::date',
          [profileId, '2026-11-09', 'elevated', 'low', 'fair'],
        );

        const result = await client.query<{
          record_date: string;
          stress_level: string;
        }>(
          'SELECT record_date::text, stress_level FROM stress_check_ins ' +
            'WHERE profile_id = $1 ORDER BY record_date',
          [profileId],
        );
        expect(result.rows).toEqual([
          { record_date: '2026-11-08', stress_level: 'moderate' },
          { record_date: '2026-11-09', stress_level: 'elevated' },
        ]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skip('IT-10 persists ordered workout plans and approved session history', () => {
    // Given a plan and approved session details, when linked and unlinked sessions are persisted, then order, UTC instants, duration, and status round-trip.
    // Deferred until RG-03 workout details and RG-04 time handling are approved.
  });

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-11 rejects a child record with a nonexistent profile without partial writes',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const movementId = syntheticUuid();
      const missingProfileId = syntheticUuid();

      try {
        await client.query('BEGIN');
        await client.query('SAVEPOINT missing_profile');
        await expect(
          client.query(
            'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
              'VALUES ($1, $2, $3::date, $4)',
            [movementId, missingProfileId, '2026-11-09', 20],
          ),
        ).rejects.toMatchObject({ code: '23503' });
        await client.query('ROLLBACK TO SAVEPOINT missing_profile');

        const result = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM movement_daily_records WHERE id = $1',
          [movementId],
        );
        expect(result.rows).toEqual([{ row_count: 0 }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skip('IT-12 denies access to a profile owned by another account', () => {
    // Given two accounts and a profile owned by the second, when the first account reads or writes it, then access is denied with no data change.
    // Deferred until the PP0012 account-context contract is approved.
  });

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-13 rejects duplicate profile-date keys for approved daily records',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();
      const recordDate = '2026-11-09';

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-13 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );

        const firstMovementId = syntheticUuid();
        await client.query(
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
            'VALUES ($1, $2, $3::date, $4)',
          [firstMovementId, profileId, recordDate, 45],
        );
        await client.query('SAVEPOINT duplicate_movement_daily');
        await expect(
          client.query(
            'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
              'VALUES ($1, $2, $3::date, $4)',
            [syntheticUuid(), profileId, recordDate, 46],
          ),
        ).rejects.toMatchObject({ code: '23505' });
        await client.query('ROLLBACK TO SAVEPOINT duplicate_movement_daily');

        const movementCount = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM movement_daily_records ' +
            'WHERE profile_id = $1 AND record_date = $2::date',
          [profileId, recordDate],
        );
        expect(movementCount.rows).toEqual([{ row_count: 1 }]);

        await client.query(
          'INSERT INTO stress_check_ins ' +
            '(id, profile_id, record_date, stress_level, energy_level, sleep_quality) ' +
            "VALUES ($1, $2, $3::date, 'low', 'steady', 'good')",
          [syntheticUuid(), profileId, recordDate],
        );
        await client.query('SAVEPOINT duplicate_stress_daily');
        await expect(
          client.query(
            'INSERT INTO stress_check_ins ' +
              '(id, profile_id, record_date, stress_level, energy_level, sleep_quality) ' +
              "VALUES ($1, $2, $3::date, 'moderate', 'low', 'fair')",
            [syntheticUuid(), profileId, recordDate],
          ),
        ).rejects.toMatchObject({ code: '23505' });
        await client.query('ROLLBACK TO SAVEPOINT duplicate_stress_daily');

        const stressCount = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM stress_check_ins ' +
            'WHERE profile_id = $1 AND record_date = $2::date',
          [profileId, recordDate],
        );
        expect(stressCount.rows).toEqual([{ row_count: 1 }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-14 restricts account and profile deletion while dependent rows exist',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-14 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        await client.query(
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
            'VALUES ($1, $2, $3::date, $4)',
          [syntheticUuid(), profileId, '2026-11-09', 30],
        );

        await client.query('SAVEPOINT delete_profile');
        await expect(
          client.query('DELETE FROM profiles WHERE id = $1', [profileId]),
        ).rejects.toMatchObject({ code: '23503' });
        await client.query('ROLLBACK TO SAVEPOINT delete_profile');

        const profileAfterDeleteAttempt = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM profiles WHERE id = $1',
          [profileId],
        );
        const movementAfterProfileDeleteAttempt = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM movement_daily_records WHERE profile_id = $1',
          [profileId],
        );
        expect(profileAfterDeleteAttempt.rows).toEqual([{ row_count: 1 }]);
        expect(movementAfterProfileDeleteAttempt.rows).toEqual([{ row_count: 1 }]);

        await client.query('SAVEPOINT delete_account');
        await expect(
          client.query('DELETE FROM accounts WHERE id = $1', [accountId]),
        ).rejects.toMatchObject({ code: '23503' });
        await client.query('ROLLBACK TO SAVEPOINT delete_account');

        const accountAfterDeleteAttempt = await client.query<{ row_count: number }>(
          'SELECT COUNT(*)::integer AS row_count FROM accounts WHERE id = $1',
          [accountId],
        );
        expect(accountAfterDeleteAttempt.rows).toEqual([{ row_count: 1 }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-15 rejects values outside approved numeric lower bounds',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();

      try {
        await client.query('BEGIN');
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-15 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );

        const invalidCases: Array<{
          savepoint: string;
          sql: string;
          values: unknown[];
        }> = [
          {
            savepoint: 'invalid_age',
            sql:
              'INSERT INTO profiles ' +
              '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
              "VALUES ($1, $2, 'Invalid age', -1, 'moderate', 'general', 'low', NOW())",
            values: [syntheticUuid(), accountId],
          },
          {
            savepoint: 'invalid_height',
            sql:
              'INSERT INTO profile_metrics ' +
              '(profile_id, height_cm, weight_kg, target_weight_kg, resting_heart_rate_bpm, updated_at) ' +
              'VALUES ($1, 0, 70, 65, 60, NOW())',
            values: [profileId],
          },
          {
            savepoint: 'invalid_weight',
            sql:
              'INSERT INTO profile_metrics ' +
              '(profile_id, height_cm, weight_kg, target_weight_kg, resting_heart_rate_bpm, updated_at) ' +
              'VALUES ($1, 170, 0, 65, 60, NOW())',
            values: [profileId],
          },
          {
            savepoint: 'invalid_target_weight',
            sql:
              'INSERT INTO profile_metrics ' +
              '(profile_id, height_cm, weight_kg, target_weight_kg, resting_heart_rate_bpm, updated_at) ' +
              'VALUES ($1, 170, 70, 0, 60, NOW())',
            values: [profileId],
          },
          {
            savepoint: 'invalid_heart_rate',
            sql:
              'INSERT INTO profile_metrics ' +
              '(profile_id, height_cm, weight_kg, target_weight_kg, resting_heart_rate_bpm, updated_at) ' +
              'VALUES ($1, 170, 70, 65, 0, NOW())',
            values: [profileId],
          },
          {
            savepoint: 'invalid_movement_goal',
            sql:
              'INSERT INTO profile_goals ' +
              '(profile_id, daily_movement_minutes, calorie_target_kcal, protein_target_grams, sleep_target_minutes, stress_goal, updated_at) ' +
              "VALUES ($1, -1, 2000, 100, 480, 'reduce', NOW())",
            values: [profileId],
          },
          {
            savepoint: 'invalid_calorie_goal',
            sql:
              'INSERT INTO profile_goals ' +
              '(profile_id, daily_movement_minutes, calorie_target_kcal, protein_target_grams, sleep_target_minutes, stress_goal, updated_at) ' +
              "VALUES ($1, 30, -1, 100, 480, 'reduce', NOW())",
            values: [profileId],
          },
          {
            savepoint: 'invalid_protein_goal',
            sql:
              'INSERT INTO profile_goals ' +
              '(profile_id, daily_movement_minutes, calorie_target_kcal, protein_target_grams, sleep_target_minutes, stress_goal, updated_at) ' +
              "VALUES ($1, 30, 2000, -1, 480, 'reduce', NOW())",
            values: [profileId],
          },
          {
            savepoint: 'invalid_sleep_goal',
            sql:
              'INSERT INTO profile_goals ' +
              '(profile_id, daily_movement_minutes, calorie_target_kcal, protein_target_grams, sleep_target_minutes, stress_goal, updated_at) ' +
              "VALUES ($1, 30, 2000, 100, -1, 'reduce', NOW())",
            values: [profileId],
          },
          {
            savepoint: 'invalid_active_minutes',
            sql:
              'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
              'VALUES ($1, $2, $3::date, -1)',
            values: [syntheticUuid(), profileId, '2026-11-09'],
          },
        ];

        for (const invalidCase of invalidCases) {
          await client.query('SAVEPOINT ' + invalidCase.savepoint);
          await expect(
            client.query(invalidCase.sql, invalidCase.values),
          ).rejects.toMatchObject({ code: '23514' });
          await client.query('ROLLBACK TO SAVEPOINT ' + invalidCase.savepoint);
        }

        const persistedInvalidRows = await client.query<{ row_count: string }>(
          'SELECT (SELECT COUNT(*) FROM profiles WHERE account_id = $1 AND age_years < 0) +' +
            '(SELECT COUNT(*) FROM profile_metrics WHERE profile_id = $2) +' +
            '(SELECT COUNT(*) FROM profile_goals WHERE profile_id = $2) +' +
            '(SELECT COUNT(*) FROM movement_daily_records WHERE profile_id = $2) AS row_count',
          [accountId, profileId],
        );
        expect(persistedInvalidRows.rows).toEqual([{ row_count: '0' }]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it.skipIf(!process.env.PP0009_TEST_DATABASE_URL)(
    'IT-16 preserves explicit record dates without session-time-zone conversion',
    async () => {
      const pool = new Pool({ connectionString: process.env.PP0009_TEST_DATABASE_URL });
      const client = await pool.connect();
      const accountId = syntheticUuid();
      const profileId = syntheticUuid();
      const movementId = syntheticUuid();
      const recordDate = '2026-11-09';

      try {
        await client.query('BEGIN');
        await client.query("SET LOCAL TIME ZONE 'Pacific/Honolulu'");
        await client.query(
          'INSERT INTO accounts (id, updated_at) VALUES ($1, NOW())',
          [accountId],
        );
        await client.query(
          'INSERT INTO profiles ' +
            '(id, account_id, name, age_years, activity_level, primary_goal, stress_level, updated_at) ' +
            "VALUES ($1, $2, 'Synthetic IT-16 profile', 30, 'moderate', 'general', 'low', NOW())",
          [profileId, accountId],
        );
        await client.query(
          'INSERT INTO movement_daily_records (id, profile_id, record_date, active_minutes) ' +
            'VALUES ($1, $2, $3::date, $4)',
          [movementId, profileId, recordDate, 60],
        );

        const result = await client.query<{
          record_date: string;
          storage_type: string;
        }>(
          'SELECT record_date::text, pg_typeof(record_date)::text AS storage_type ' +
            'FROM movement_daily_records WHERE id = $1',
          [movementId],
        );
        expect(result.rows).toEqual([
          { record_date: recordDate, storage_type: 'date' },
        ]);
      } finally {
        await client.query('ROLLBACK');
        client.release();
        await pool.end();
      }
    },
  );

  it('IT-17 uses one shared schema and excludes PP0009 audit payload models', async () => {
    const prismaDirectory = resolve(process.cwd(), 'prisma');
    const prismaEntries = await readdir(prismaDirectory, { withFileTypes: true });
    const schemaFiles = prismaEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.prisma'))
      .map((entry) => entry.name)
      .sort();
    expect(schemaFiles).toEqual(['schema.prisma']);
    expect(
      prismaEntries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    ).toEqual(['migrations']);

    const schema = await readFile(resolve(prismaDirectory, 'schema.prisma'), 'utf8');
    const migrationFolders = await readdir(resolve(prismaDirectory, 'migrations'), {
      withFileTypes: true,
    });
    const migrationSql = await Promise.all(
      migrationFolders
        .filter((entry) => entry.isDirectory())
        .map((entry) =>
          readFile(
            resolve(prismaDirectory, 'migrations', entry.name, 'migration.sql'),
            'utf8',
          ),
        ),
    );

    expect(schema).not.toMatch(/\bmodel\s+AuditEvent\b/i);
    expect(schema + '\n' + migrationSql.join('\n')).not.toMatch(
      /audit_events|audit_event_payload/i,
    );
  });
});
