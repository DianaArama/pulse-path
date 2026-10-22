import type { BaseDashboardMetric } from '@/types/dashboard';

export const metrics: BaseDashboardMetric[] = [
  {
    metricId: 'movement',
    title: 'Movement',
    current: 35,
    target: 45,
    unit: 'min',
    goal: '45 active minutes',
  },
  {
    metricId: 'nutrition',
    title: 'Nutrition',
    current: 1800,
    target: 2000,
    unit: 'kcal',
    goal: '2,000 kcal',
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
    current: 80,
    target: 85,
    goal: '85 recovery score',
  },
];
