export type DeviceStatus = 'Connected' | 'Sync needed' | 'Disconnected';
export type Device = { name: string; status: DeviceStatus };
export type BodyMetrics = {
  height: string;
  weight: string;
  targetWeight: string;
  restingHeartRate: string;
};
export type GoalSettings = {
  dailyMovement: string;
  calorieTarget: string;
  proteinTarget: string;
  sleepTarget: string;
  stressGoal: string;
};
export type Profile = {
  name: string;
  age: number;
  activityLevel: string;
  primaryGoal: string;
  stress: string;
};

export type ProfileId = 'alex-morgan' | 'sara-ionescu' | 'matei-popa';

export type ProfileSummary = Profile & {
  id: string;
};

export type UserProfileRecord = {
  id: string;
  profile: Profile;
  bodyMetrics: BodyMetrics;
  goalSettings: GoalSettings;
  connectedDevices: Device[];
};
