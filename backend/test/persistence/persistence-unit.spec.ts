import { describe, expect, it } from 'vitest';
import { mapProfilePrototypeToPersistence } from '../../src/persistence/profile-prototype-mapper.js';
import { replaceStressCheckInForDate } from '../../src/persistence/stress-checkin-updater.js';

describe('PP0009 persistence unit behavior', () => {
  it('UT-01 maps profile mock values to canonical units', () => {
    // Given display-unit profile fixtures, when mapped for persistence, then numeric cm/kg/bpm values are used and device statuses are excluded.
    const profileRecord = {
      id: 'alex-morgan',
      profile: {
        name: 'Alex Morgan',
        age: 40,
        activityLevel: 'Moderate',
        primaryGoal: 'Build strength',
        stress: 'Low',
      },
      bodyMetrics: {
        height: '178 cm',
        weight: '72 kg',
        targetWeight: '75 kg',
        restingHeartRate: '58 bpm',
      },
      goalSettings: {
        dailyMovement: '45',
        calorieTarget: '2300',
        proteinTarget: '140',
        sleepTarget: '8',
        stressGoal: 'Low',
      },
      connectedDevices: [{ name: 'Fitbit', status: 'Connected' }],
    };

    expect(mapProfilePrototypeToPersistence(profileRecord)).toEqual({
      profile: {
        name: 'Alex Morgan',
        ageYears: 40,
        activityLevel: 'Moderate',
        primaryGoal: 'Build strength',
        stressLevel: 'Low',
      },
      metrics: {
        heightCm: 178,
        weightKg: 72,
        targetWeightKg: 75,
        restingHeartRateBpm: 58,
      },
      goals: {
        dailyMovementMinutes: 45,
        calorieTargetKcal: 2300,
        proteinTargetGrams: 140,
        sleepTargetMinutes: 480,
        stressGoal: 'Low',
      },
    });
  });

  it('UT-02 enforces account ownership before profile data access', () => {
    // Given an account and profile, when the profile is missing or owned by another account, then access is denied before child reads or writes.
    expect.fail('UT-02 skeleton: implement profile ownership enforcement');
  });

  it('UT-03 validates reviewed numeric boundaries without closing category vocabularies', () => {
    const valid = {
      profile: {
        name: 'Boundary Profile',
        age: 0,
        activityLevel: 'Unlisted future category',
        primaryGoal: 'Unlisted future goal',
        stress: 'Unlisted future stress',
      },
      bodyMetrics: {
        height: '0.1 cm',
        weight: '0.1 kg',
        targetWeight: '0.1 kg',
        restingHeartRate: '0.1 bpm',
      },
      goalSettings: {
        dailyMovement: '0',
        calorieTarget: '0',
        proteinTarget: '0',
        sleepTarget: '0',
        stressGoal: 'Unlisted future goal',
      },
    };

    expect(mapProfilePrototypeToPersistence(valid)).toMatchObject({
      profile: { ageYears: 0, activityLevel: 'Unlisted future category' },
      metrics: { heightCm: 0.1, weightKg: 0.1, targetWeightKg: 0.1, restingHeartRateBpm: 0.1 },
      goals: {
        dailyMovementMinutes: 0,
        calorieTargetKcal: 0,
        proteinTargetGrams: 0,
        sleepTargetMinutes: 0,
      },
    });

    expect(() => mapProfilePrototypeToPersistence({ ...valid, profile: { ...valid.profile, age: -1 } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, bodyMetrics: { ...valid.bodyMetrics, height: '0 cm' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, bodyMetrics: { ...valid.bodyMetrics, weight: '0 kg' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, bodyMetrics: { ...valid.bodyMetrics, targetWeight: '0 kg' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, bodyMetrics: { ...valid.bodyMetrics, restingHeartRate: '0 bpm' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, goalSettings: { ...valid.goalSettings, dailyMovement: '-1' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, goalSettings: { ...valid.goalSettings, calorieTarget: '-1' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, goalSettings: { ...valid.goalSettings, proteinTarget: '-1' } })).toThrow();
    expect(() => mapProfilePrototypeToPersistence({ ...valid, goalSettings: { ...valid.goalSettings, sleepTarget: '-1' } })).toThrow();
  });

  it('UT-04 derives nutrition totals from meal and hydration source records', () => {
    // Given meal and hydration source records, when daily nutrition is summarized, then source values are derived and no writable aggregate is stored.
    expect.fail('UT-04 skeleton: implement derived nutrition behavior after RG-01');
  });

  it('UT-05 updates only the same-day stress check-in', () => {
    // Given check-ins on multiple dates, when one date is updated, then earlier dates remain unchanged.
    const earlier = { recordDate: '2026-11-02', stressLevel: 'Low', energyLevel: 'High' };
    const today = { recordDate: '2026-11-03', stressLevel: 'Medium', energyLevel: 'Medium' };
    const updatedToday = { recordDate: '2026-11-03', stressLevel: 'High', energyLevel: 'Low' };

    expect(replaceStressCheckInForDate([earlier, today], updatedToday)).toEqual([
      earlier,
      updatedToday,
    ]);
  });
});
