import type { BaseDashboardMetric } from '@/types/dashboard';
import type { ProfileId } from '@/types/profile';

type ActiveDayMock = {
  greeting: string;
  banner: {
    label: string;
    title: string;
    description: string;
  };
  overallScore: number;
  sleep: string;
  recovery: number;
  stress: 'Low' | 'Moderate' | 'High';
  protein: string;
  hydration: string;
  focusNotes: string[];
  metricInputs: BaseDashboardMetric[];
};

export const activeDayMocks: Record<ProfileId, ActiveDayMock> = {
  'alex-morgan': {
    greeting: 'Strong start today',
    banner: {
      label: 'Today',
      title: 'Push strength, protect recovery',
      description:
        'One lift left, then a calm evening and a protein-heavy dinner.',
    },
    overallScore: 78,
    sleep: '7 h 40 m',
    recovery: 82,
    stress: 'Low',
    protein: '112 / 140 g',
    hydration: '1.9 / 2.5 L',
    focusNotes: [
      'Strength session completed at lunch',
      'Protein is slightly behind target',
      'Keep evening recovery light',
    ],
    metricInputs: [
      {
        metricId: 'movement',
        title: 'Movement',
        current: 36,
        target: 45,
        unit: 'min',
        goal: '45 active minutes',
      },
      {
        metricId: 'nutrition',
        title: 'Nutrition',
        current: 1780,
        target: 2300,
        unit: 'kcal',
        goal: '2,300 kcal',
      },
      {
        metricId: 'stress',
        title: 'Stress',
        current: 2,
        target: 5,
        unit: 'min',
        goal: '5 minutes breathing',
      },
      {
        metricId: 'recovery',
        title: 'Recovery',
        current: 82,
        target: 85,
        unit: 'score',
        goal: '85 recovery score',
      },
    ],
  },
  'sara-ionescu': {
    greeting: 'Endurance day in motion',
    banner: {
      label: 'Today',
      title: 'Endurance up, keep the fuel steady',
      description:
        'Training volume is high, so carbs and hydration matter more today.',
    },
    overallScore: 91,
    sleep: '8 h 10 m',
    recovery: 88,
    stress: 'Moderate',
    protein: '98 / 120 g',
    hydration: '2.3 / 2.8 L',
    focusNotes: [
      'Morning run hit the target pace',
      'Hydration is on track',
      'A short mobility block will close the day well',
    ],
    metricInputs: [
      {
        metricId: 'movement',
        title: 'Movement',
        current: 62,
        target: 60,
        unit: 'min',
        goal: '60 active minutes',
      },
      {
        metricId: 'nutrition',
        title: 'Nutrition',
        current: 1985,
        target: 2200,
        unit: 'kcal',
        goal: '2,200 kcal',
      },
      {
        metricId: 'stress',
        title: 'Stress',
        current: 6,
        target: 5,
        unit: 'min',
        goal: '5 minutes breathing',
      },
      {
        metricId: 'recovery',
        title: 'Recovery',
        current: 88,
        target: 90,
        unit: 'score',
        goal: '90 recovery score',
      },
    ],
  },
  'matei-popa': {
    greeting: 'Good momentum today',
    banner: {
      label: 'Today',
      title: 'Keep it simple and steady',
      description:
        'A small walk, a protein-heavy dinner, and an early wind-down will help.',
    },
    overallScore: 64,
    sleep: '6 h 50 m',
    recovery: 69,
    stress: 'High',
    protein: '104 / 130 g',
    hydration: '1.4 / 2.3 L',
    focusNotes: [
      'Steps are low, so a walk would help',
      'Stress is elevated, breathing will help the most',
      'Try an earlier, lighter dinner',
    ],
    metricInputs: [
      {
        metricId: 'movement',
        title: 'Movement',
        current: 24,
        target: 30,
        unit: 'min',
        goal: '30 active minutes',
      },
      {
        metricId: 'nutrition',
        title: 'Nutrition',
        current: 1625,
        target: 2100,
        unit: 'kcal',
        goal: '2,100 kcal',
      },
      {
        metricId: 'stress',
        title: 'Stress',
        current: 3,
        target: 5,
        unit: 'min',
        goal: '5 minutes breathing',
      },
      {
        metricId: 'recovery',
        title: 'Recovery',
        current: 69,
        target: 80,
        unit: 'score',
        goal: '80 recovery score',
      },
    ],
  },
};
