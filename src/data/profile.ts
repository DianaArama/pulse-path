import type {
  BodyMetrics,
  Device,
  GoalSettings,
  Profile,
  ProfileSummary,
  UserProfileRecord,
} from '@/types/profile';

export const activeProfileCookieName = 'pulsepath-active-profile';

export const profiles: UserProfileRecord[] = [
  {
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
    connectedDevices: [
      { name: 'Apple Health', status: 'Connected' },
      { name: 'Fitbit', status: 'Sync needed' },
      { name: 'Garmin', status: 'Disconnected' },
    ],
  },
  {
    id: 'sara-ionescu',
    profile: {
      name: 'Sara Ionescu',
      age: 33,
      activityLevel: 'High',
      primaryGoal: 'Improve endurance',
      stress: 'Moderate',
    },
    bodyMetrics: {
      height: '166 cm',
      weight: '60 kg',
      targetWeight: '59 kg',
      restingHeartRate: '54 bpm',
    },
    goalSettings: {
      dailyMovement: '60',
      calorieTarget: '2200',
      proteinTarget: '120',
      sleepTarget: '8',
      stressGoal: 'Low',
    },
    connectedDevices: [
      { name: 'WHOOP', status: 'Connected' },
      { name: 'Apple Health', status: 'Connected' },
      { name: 'Garmin', status: 'Sync needed' },
    ],
  },
  {
    id: 'matei-popa',
    profile: {
      name: 'Matei Popa',
      age: 28,
      activityLevel: 'Beginner',
      primaryGoal: 'Lose fat',
      stress: 'High',
    },
    bodyMetrics: {
      height: '181 cm',
      weight: '84 kg',
      targetWeight: '78 kg',
      restingHeartRate: '67 bpm',
    },
    goalSettings: {
      dailyMovement: '30',
      calorieTarget: '2100',
      proteinTarget: '130',
      sleepTarget: '7',
      stressGoal: 'Moderate',
    },
    connectedDevices: [
      { name: 'Fitbit', status: 'Connected' },
      { name: 'Google Fit', status: 'Sync needed' },
      { name: 'Apple Health', status: 'Disconnected' },
    ],
  },
];

export const defaultProfileRecord = profiles[0];
export const defaultProfileId = defaultProfileRecord.id;

export const profile: Profile = defaultProfileRecord.profile;
export const bodyMetrics: BodyMetrics[] = [defaultProfileRecord.bodyMetrics];
export const goalSettings: GoalSettings = defaultProfileRecord.goalSettings;
export const connectedDevices: Device[] = defaultProfileRecord.connectedDevices;

export const getProfileById = (profileId?: string | null) =>
  profiles.find((entry) => entry.id === profileId) ?? defaultProfileRecord;

export const getProfileSummaries = (): ProfileSummary[] =>
  profiles.map(({ id, profile: userProfile }) => ({
    id,
    ...userProfile,
  }));
