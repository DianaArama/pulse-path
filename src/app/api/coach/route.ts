import OpenAI from 'openai';
import { metrics as defaultMetrics } from '@/data/dashboard';
import { generateCoachInsights } from '@/lib/coachInsights';
import { buildDashboardMetrics } from '@/lib/dashboardUtils';
import type { CoachRequestBody, CoachResponse } from '@/types/coach';
import type { BaseDashboardMetric } from '@/types/dashboard';
import type { Profile } from '@/types/profile';
import { defaultProfileRecord } from '@/data/profile';
import { resolveActiveProfile } from '@/lib/profileSelection';

const openai = new OpenAI();
const useMockCoach = process.env.USE_MOCK_COACH !== 'false';

const coachResponseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: {
      type: 'string',
    },
    nextAction: {
      type: 'string',
    },
    insights: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['title', 'message'],
      },
    },
  },
  required: ['summary', 'nextAction', 'insights'],
} as const;

const createCoachResponse = async (
  profile: Profile,
  metrics: BaseDashboardMetric[],
) => {
  const dashboardMetrics = buildDashboardMetrics(metrics);
  const fallbackInsights = generateCoachInsights(dashboardMetrics);
  const fallbackResponse: CoachResponse = {
    summary:
      fallbackInsights.length > 0
        ? 'Your coach found a few small wins for today.'
        : 'You are on track today.',
    nextAction:
      fallbackInsights[0]?.message ??
      'Keep the plan steady and check in again tomorrow.',
    insights: fallbackInsights,
  };

  if (useMockCoach) {
    return Response.json(fallbackResponse);
  }

  try {
    const response = await openai.responses.create({
      model: 'gpt-5.2',
      instructions:
        'You are PulsePath, a concise AI habit coach. Use the user profile and metrics to personalize advice. If the user is a beginner, keep the advice gentle. If their primary goal is strength, emphasize protein, recovery, and planned workouts. Do not give medical diagnosis.',
      input: JSON.stringify({
        profile: {
          name: profile.name,
          age: profile.age,
          activityLevel: profile.activityLevel,
          primaryGoal: profile.primaryGoal,
          stressGoal: profile.stressGoal,
        },
        metrics: dashboardMetrics,
      }),
      text: {
        format: {
          type: 'json_schema',
          name: 'coach_response',
          strict: true,
          schema: coachResponseSchema,
        },
      },
    });

    const parsedResponse = JSON.parse(response.output_text) as Partial<CoachResponse>;

    return Response.json({
      summary: parsedResponse.summary ?? fallbackResponse.summary,
      nextAction: parsedResponse.nextAction ?? fallbackResponse.nextAction,
      insights: Array.isArray(parsedResponse.insights)
        ? parsedResponse.insights
        : fallbackResponse.insights,
    });
  } catch (error) {
    console.error(error);

    return Response.json(fallbackResponse);
  }
};

export async function GET() {
  const activeProfile = await resolveActiveProfile();

  return createCoachResponse(activeProfile.profile, defaultMetrics);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CoachRequestBody;
    const activeProfile = await resolveActiveProfile();
    const profile = body.profile ?? activeProfile.profile;
    const metrics = Array.isArray(body.metrics) ? body.metrics : defaultMetrics;

    return createCoachResponse(profile, metrics);
  } catch {
    return createCoachResponse(defaultProfileRecord.profile, defaultMetrics);
  }
}
