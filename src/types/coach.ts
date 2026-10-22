import type { BaseDashboardMetric } from '@/types/dashboard';
import type { Profile } from '@/types/profile';

export type CoachInsight = {
  title: string;
  message: string;
};

export type CoachResponse = {
  summary: string;
  nextAction: string;
  insights: CoachInsight[];
};

export type CoachRequestBody = {
  profile?: Profile;
  metrics?: BaseDashboardMetric[];
};
