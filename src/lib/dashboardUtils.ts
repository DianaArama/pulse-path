import type {
  BaseDashboardMetric,
  DashboardMetric,
  MetricStatus,
} from '@/types/dashboard';

export const calculateProgress = (current: number, target: number) => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

export const getMetricStatus = (progress: number): MetricStatus => {
  if (progress === 100) return 'Completed';
  return 'In Progress';
};

export const getDisplayStatus = (
  metricId: string,
  current: number,
  target: number,
): MetricStatus => {
  switch (metricId) {
    case 'recovery': {
      const recoveryStatus = current >= target ? 'Good' : 'Needs Improvement';
      return recoveryStatus;
    }
    default:
      return getMetricStatus(calculateProgress(current, target));
  }
};

export const buildDashboardMetrics = (
  metrics: BaseDashboardMetric[],
): DashboardMetric[] =>
  metrics.map((metric) => {
    const progress = calculateProgress(metric.current, metric.target);

    return {
      ...metric,
      progress,
      status: getDisplayStatus(metric.metricId, metric.current, metric.target),
      completed: progress === 100,
    };
  });
