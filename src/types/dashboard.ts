export type MetricStatus =
  | 'Completed'
  | 'Good'
  | 'In Progress'
  | 'Needs Improvement';

export type BaseDashboardMetric = {
  metricId: string;
  title: string;
  current: number;
  target: number;
  unit?: string;
  goal: string;
};

export type DashboardMetric = BaseDashboardMetric & {
  progress: number;
  status: MetricStatus;
  completed: boolean;
};

export type FocusTaskItem = {
  task: string;
  metricId: string;
};
