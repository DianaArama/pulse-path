export type CoachInsight = {
  title: string;
  message: string;
};

type CoachMetric = {
  metricId: string;
  title: string;
  current: number;
  target: number;
  progress: number;
  unit?: string;
};

export const generateCoachInsights = (
  metrics: CoachMetric[],
): CoachInsight[] => {
  const insights: CoachInsight[] = [];

  const movement = metrics.find((metric) => metric.metricId === 'movement');
  const nutrition = metrics.find((metric) => metric.metricId === 'nutrition');
  const recovery = metrics.find((metric) => metric.metricId === 'recovery');
  const movementUnit = movement?.unit ?? 'min';

  if (movement && movement.progress < 100) {
    insights.push({
      title: 'Movement',
      message: `Add ${movement.target - movement.current} ${movementUnit} to close your movement gap today.`,
    });
  }

  if (nutrition && nutrition.progress < 100) {
    insights.push({
      title: 'Nutrition',
      message:
        'You are under your calorie target. Add a balanced meal or protein-rich snack.',
    });
  }

  if (recovery && recovery.current < recovery.target) {
    insights.push({
      title: 'Recovery',
      message:
        'Recovery is below target. Keep tonight low-stimulation and prioritize sleep.',
    });
  }

  return insights;
};
