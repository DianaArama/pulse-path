export interface ProfilePrototypeRecord {
  profile: {
    name: string;
    age: number;
    activityLevel: string;
    primaryGoal: string;
    stress: string;
  };
  bodyMetrics: {
    height: string;
    weight: string;
    targetWeight: string;
    restingHeartRate: string;
  };
  goalSettings: {
    dailyMovement: string;
    calorieTarget: string;
    proteinTarget: string;
    sleepTarget: string;
    stressGoal: string;
  };
}

export interface MappedProfilePersistence {
  profile: {
    name: string;
    ageYears: number;
    activityLevel: string;
    primaryGoal: string;
    stressLevel: string;
  };
  metrics: {
    heightCm: number;
    weightKg: number;
    targetWeightKg: number;
    restingHeartRateBpm: number;
  };
  goals: {
    dailyMovementMinutes: number;
    calorieTargetKcal: number;
    proteinTargetGrams: number;
    sleepTargetMinutes: number;
    stressGoal: string;
  };
}

function parseNumber(value: string, field: string): number {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new Error(`${field} must be a non-negative number`);
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be finite`);
  return parsed;
}

function parseInteger(value: string, field: string): number {
  const parsed = parseNumber(value, field);
  if (!Number.isSafeInteger(parsed)) throw new Error(`${field} must be an integer`);
  return parsed;
}

function parseMeasurement(value: string, unit: string, field: string): number {
  const match = new RegExp(`^\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}\\s*$`, 'i').exec(value);
  if (!match) throw new Error(`${field} must include the ${unit} unit`);
  return parseNumber(match[1], field);
}

function parseSleepTargetMinutes(value: string): number {
  const minutes = parseNumber(value, 'sleepTarget') * 60;
  if (!Number.isSafeInteger(minutes)) {
    throw new Error('sleepTarget must convert to a whole number of minutes');
  }
  return minutes;
}

export function mapProfilePrototypeToPersistence(
  record: ProfilePrototypeRecord,
): MappedProfilePersistence {
  if (!Number.isSafeInteger(record.profile.age)) {
    throw new Error('age must be an integer');
  }

  return {
    profile: {
      name: record.profile.name,
      ageYears: record.profile.age,
      activityLevel: record.profile.activityLevel,
      primaryGoal: record.profile.primaryGoal,
      stressLevel: record.profile.stress,
    },
    metrics: {
      heightCm: parseMeasurement(record.bodyMetrics.height, 'cm', 'height'),
      weightKg: parseMeasurement(record.bodyMetrics.weight, 'kg', 'weight'),
      targetWeightKg: parseMeasurement(record.bodyMetrics.targetWeight, 'kg', 'targetWeight'),
      restingHeartRateBpm: parseMeasurement(
        record.bodyMetrics.restingHeartRate,
        'bpm',
        'restingHeartRate',
      ),
    },
    goals: {
      dailyMovementMinutes: parseInteger(record.goalSettings.dailyMovement, 'dailyMovement'),
      calorieTargetKcal: parseInteger(record.goalSettings.calorieTarget, 'calorieTarget'),
      proteinTargetGrams: parseNumber(record.goalSettings.proteinTarget, 'proteinTarget'),
      sleepTargetMinutes: parseSleepTargetMinutes(record.goalSettings.sleepTarget),
      stressGoal: record.goalSettings.stressGoal,
    },
  };
}
