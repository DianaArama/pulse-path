export type StressLevel = 'Low' | 'Moderate' | 'High';
export type EnergyLevel = 'Low' | 'Good' | 'Strong';
export type SleepQuality = 'Poor' | 'Okay' | 'Great';

export interface StressCheckInOptions {
  stressLevels: StressLevel[];
  energyLevels: EnergyLevel[];
  sleepQuality: SleepQuality[];
}

export type ResetIntensity = 'Gentle' | 'Moderate' | 'Intense';

export interface RecommendedReset {
  title: string;
  duration: number;
  intensity: ResetIntensity;
  steps: string[];
}

export interface StressHabit {
  id: string;
  label: string;
  completed: boolean;
}

export interface RecoveryTip {
  id: string;
  title: string;
  description: string;
  duration: number;
}
