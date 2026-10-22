'use client';

import AICoachPanel from '@/components/dashboard/AICoachPanel';
import HomeCallout from '@/components/ui/HomeCallout';
import HomeStatCard from '@/components/ui/HomeStatCard';
import FocusTask from '@/components/dashboard/FocusTask';
import MetricCard from '@/components/dashboard/MetricCard';
import { activeDayMocks } from '@/data/activeDayMocks';
import { defaultProfileRecord } from '@/data/profile';
import type { FocusTaskItem } from '@/types/dashboard';
import { buildDashboardMetrics } from '@/lib/dashboardUtils';
import { useActiveProfile } from '@/lib/store/use-active-profile';

const focusTasks: FocusTaskItem[] = [
  { task: 'Complete planned workout', metricId: 'movement' },
  { task: 'Hit nutrition target', metricId: 'nutrition' },
  { task: 'Do 5 minutes of breathing', metricId: 'stress' },
];

export default function Home() {
  const activeProfile = useActiveProfile((state) => state.activeProfile);
  const profileId = activeProfile?.id || 'alex-morgan';
  const activeDayData = activeDayMocks[profileId];
  const metricsWithStatus = buildDashboardMetrics(activeDayData.metricInputs);
  const averageProgress = Math.round(
    metricsWithStatus.reduce((sum, metric) => sum + metric.progress, 0) /
      metricsWithStatus.length,
  );

  return (
    <div className='grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_380px]'>
      <section className='rounded-[34px] border border-[#e6d8ca] bg-white p-5 shadow-[0_18px_48px_rgba(126,74,35,0.10)] backdrop-blur sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <p className='text-[10px] font-semibold uppercase tracking-[0.36em] text-[#6a1b75]'>
              {activeDayData.greeting}
            </p>
            <h2 className='mt-2 text-3xl font-semibold tracking-tight text-[#1e1a17] sm:text-4xl'>
              {activeDayData.banner.title}
            </h2>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#665e56] sm:text-base'>
              {activeDayData.banner.description}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:max-w-sm'>
            <HomeStatCard
              label='Overall score'
              value={activeDayData.overallScore}
              caption={activeDayData.banner.label}
            />
            <HomeStatCard
              label='Recovery'
              value={activeDayData.recovery}
              caption={`${activeDayData.stress} stress`}
            />
          </div>
        </div>

        <div className='mt-6 grid gap-6 2xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]'>
          <div className='relative mx-auto flex aspect-square w-full max-w-130 items-center justify-center'>
            <div className='absolute inset-0 rounded-full border border-[#e6d8ca] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.98),rgba(249,242,236,0.96)_45%,rgba(237,223,212,0.68)_72%,rgba(79,111,53,0.10)_100%)] shadow-[inset_0_0_0_24px_rgba(255,255,255,0.35)]' />
            <div className='absolute inset-[14%] rounded-[42%_58%_36%_64%/46%_39%_61%_54%] bg-linear-to-br from-[rgba(79,111,53,0.18)] via-[rgba(79,111,53,0.55)] to-[rgba(145,172,121,0.92)] shadow-[0_28px_60px_rgba(126,74,35,0.20)]' />
            <div className='absolute inset-[20%] rounded-full border border-[#e6d8ca] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(250,246,240,0.92)_56%,rgba(236,225,214,0.82)_100%)] p-5 text-center shadow-[0_12px_30px_rgba(126,74,35,0.10)] backdrop-blur'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d77e2c]'>
                Daily balance
              </p>
              <p className='mt-2 text-4xl font-semibold text-[#1e1a17]'>
                {averageProgress}%
              </p>
              <p className='mt-1 text-sm text-[#665e56]'>
                Movement + nutrition + recovery
              </p>
            </div>
            <div className='absolute inset-[10%] rounded-full border border-[rgba(79,111,53,0.18)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]' />
            <div className='absolute inset-[5%] rounded-full border border-[rgba(79,111,53,0.10)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]' />

            <div className='absolute left-4 top-12'>
              <HomeCallout label='Sleep' value={activeDayData.sleep} />
            </div>
            <div className='absolute right-6 top-16'>
              <HomeCallout
                label='Hydration'
                value={activeDayData.hydration}
              />
            </div>
            <div className='absolute bottom-14 left-10'>
              <HomeCallout label='Stress' value={activeDayData.stress} />
            </div>
            <div className='absolute bottom-10 right-12'>
              <HomeCallout label='Protein' value={activeDayData.protein} />
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1'>
            {metricsWithStatus.map(
              ({ metricId, title, goal, current, unit, status, progress }) => (
                <MetricCard
                  key={metricId}
                  title={title}
                  goal={goal}
                  current={current}
                  unit={unit}
                  progress={progress}
                  status={status}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <aside className='space-y-4'>
        <section className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6a1b75]'>
            Active profile
          </p>
          <h3 className='mt-2 text-xl font-semibold text-[#1e1a17]'>
            {activeProfile?.profile?.name}
          </h3>
          <p className='mt-1 text-sm text-[#665e56]'>
            {activeProfile?.profile?.activityLevel} activity, aiming to{' '}
            {activeProfile?.profile?.primaryGoal?.toLowerCase()}.
          </p>

          <div className='mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1'>
            <div className='rounded-[22px] bg-[#f4efe6] p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#d1a54a]'>
                Stress goal
              </p>
              <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
                {activeProfile?.profile?.stress}
              </p>
            </div>
            <div className='rounded-[22px] bg-[#f7f0e5] p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#6a1b75]'>
                Weight target
              </p>
              <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
                {activeProfile?.bodyMetrics?.targetWeight}
              </p>
            </div>
          </div>
        </section>

        <section className='rounded-[30px] border border-[#e6d8ca] bg-[linear-gradient(180deg,rgba(79,111,53,0.05)_0%,rgba(255,255,255,0.98)_100%)] p-5 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.32em] text-[#4f6f35]'>
            Today&apos;s focus
          </p>
          <div className='mt-4 space-y-3'>
            {focusTasks.map(({ task, metricId }) => (
              <FocusTask
                key={metricId}
                task={task}
                completed={
                  metricsWithStatus.find(
                    (metric) => metric.metricId === metricId,
                  )?.completed || false
                }
              />
            ))}
          </div>
        </section>

        <section className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.32em] text-[#4f6f35]'>
            Today&apos;s notes
          </p>
          <ul className='mt-4 space-y-2 text-sm text-[#665e56]'>
            {activeDayData.focusNotes.map((note) => (
              <li key={note} className='rounded-[18px] bg-[#f5efe7] px-4 py-3'>
                {note}
              </li>
            ))}
          </ul>
        </section>

        <AICoachPanel
          profile={activeProfile?.profile ?? defaultProfileRecord.profile}
          metrics={activeDayData.metricInputs}
        />
      </aside>
    </div>
  );
}

