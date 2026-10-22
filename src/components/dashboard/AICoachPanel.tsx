'use client';

import { useState, useEffect } from 'react';
import type { BaseDashboardMetric } from '@/types/dashboard';
import type { CoachResponse } from '@/types/coach';
import Loading from '../ui/Loading';
import type { Profile } from '@/types/profile';

type AICoachPanelProps = {
  profile: Profile | undefined;
  metrics: BaseDashboardMetric[];
};

const AICoachPanel = ({ profile, metrics }: AICoachPanelProps) => {
  const [coachResponse, setCoachResponse] = useState<CoachResponse>({
    summary: '',
    nextAction: '',
    insights: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getInsights() {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch('/api/coach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profile, metrics }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch coach insights');
        }
        const data = await response.json();
        setCoachResponse({
          summary:
            typeof data.summary === 'string'
              ? data.summary
              : 'Your coach is ready.',
          nextAction:
            typeof data.nextAction === 'string'
              ? data.nextAction
              : 'Check your next best step.',
          insights: Array.isArray(data.insights) ? data.insights : [],
        });
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getInsights();
  }, [profile, metrics]);

  return (
    <section className='w-full rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a1b75]'>
        AI Coach
      </p>
      <h2 className='mt-1 text-xl font-semibold text-[#1e1a17]'>
        Today&apos;s coaching plan
      </h2>
      {isError ? (
        <p className='mt-2 text-sm leading-6 text-[#6d665f]'>
          Coach insights are unavailable right now.
        </p>
      ) : (
        <>
          <div className='mt-3 rounded-3xl bg-[#f9f5ef] p-4'>
            {isLoading ? (
              <Loading />
            ) : coachResponse.insights.length === 0 ? (
              <p className='text-sm leading-6 text-[#6d665f]'>
                {coachResponse.summary ||
                  "You're on track today. Keep the plan steady."}
              </p>
            ) : (
              <div className='space-y-2'>
                <p className='text-sm leading-6 text-[#6d665f]'>
                  {coachResponse.summary}
                </p>
                <p className='text-sm font-medium text-[#1e1a17]'>
                  Next action: {coachResponse.nextAction}
                </p>
              </div>
            )}
          </div>
          <div className='mt-4 grid gap-3'>
            {coachResponse.insights.map((insight, index) => {
              return (
                <article
                  key={insight.title}
                  className={`rounded-[22px] p-4 ${
                    [
                      'bg-[#f6e7e8] text-[#6a1b75]',
                      'bg-[#fbf3dd] text-[#8b4f39]',
                      'bg-[#e4edd8] text-[#4f6f35]',
                    ][index % 3]
                  }`}
                >
                  <div className='mb-2 flex items-center justify-between gap-3'>
                    <h3 className='text-sm font-semibold'>{insight.title}</h3>
                    <span className='text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70'>
                      Insight
                    </span>
                  </div>

                  <p className='text-sm leading-6'>{insight.message}</p>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default AICoachPanel;

