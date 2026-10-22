'use client';

import { useActiveProfile } from '@/lib/store/use-active-profile';
import type { GoalSettings } from '@/types/profile';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SurfaceCard from '../ui/SurfaceCard';

const emptyGoalSettings: GoalSettings = {
  dailyMovement: '',
  calorieTarget: '',
  proteinTarget: '',
  sleepTarget: '',
  stressGoal: 'Low',
};

const ProfileGoalsForm = () => {
  const [savedData, setSavedData] = useState<boolean>(false);
  const goalSettings = useActiveProfile(
    (state) => state.activeProfile?.goalSettings ?? emptyGoalSettings,
  );
  const {
    dailyMovement,
    calorieTarget,
    proteinTarget,
    sleepTarget,
    stressGoal,
  } = goalSettings;
  const setGoalsInStore = useActiveProfile((state) => state.setGoals);
  const user = useActiveProfile((state) => state.activeProfile);
  const updateGoal = (key: keyof GoalSettings, value: string) => {
    setSavedData(false);
    setGoalsInStore({ [key]: value });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSavedData(true);
    console.log('state', user);
  };

  const inputClass =
    'rounded-xl border border-slate-200 bg-[#f8f3ee] px-3 py-2 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9a5f45] focus:bg-white focus:ring-2 focus:ring-[#d8b7a4]';

  const labelClass =
    'flex flex-col gap-1.5 text-sm font-semibold text-slate-700';

  return (
    <SurfaceCard>
      <h2 className='text-lg font-bold text-slate-900'>Goal settings</h2>
      <p className='mt-1 text-sm text-slate-600'>
        Adjust the daily targets your coach will use for recommendations.
      </p>
      <form onSubmit={onSubmit}>
        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
          <label className={labelClass}>
            Daily movement (min):
            <input
              type='text'
              className={inputClass}
              placeholder='Insert minutes...'
              value={dailyMovement}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateGoal('dailyMovement', e.target.value)
              }
            />
          </label>
          <label className={labelClass}>
            Calorie target (kcal):
            <input
              type='text'
              className={inputClass}
              placeholder='Insert calories...'
              value={calorieTarget}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateGoal('calorieTarget', e.target.value)
              }
            />
          </label>
          <label className={labelClass}>
            Protein target (g):
            <input
              type='text'
              className={inputClass}
              placeholder='Insert grams...'
              value={proteinTarget}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateGoal('proteinTarget', e.target.value)
              }
            />
          </label>
          <label className={labelClass}>
            Sleep target (hrs):
            <input
              type='text'
              className={inputClass}
              placeholder='Insert hours...'
              value={sleepTarget}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateGoal('sleepTarget', e.target.value)
              }
            />
          </label>
          <label className={labelClass}>
            Stress goal:
            <div className='relative'>
              <select
                value={stressGoal}
                onChange={(e) => updateGoal('stressGoal', e.target.value)}
                className='w-full appearance-none rounded-xl border border-slate-200 bg-[#f8f3ee] px-3 py-2 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-[#a74d24] focus:bg-white focus:ring-2 focus:ring-[#d9a27a]'
              >
                <option value='Low'>Low</option>
                <option value='Moderate'>Moderate</option>
                <option value='High'>High</option>
              </select>
              <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#7e402d]'>
                <svg
                  viewBox='0 0 20 20'
                  className='h-4 w-4 fill-current'
                  aria-hidden='true'
                >
                  <path d='M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z' />
                </svg>
              </span>
            </div>
          </label>
        </div>
        <div className='mt-2 flex flex-col items-center border-t border-slate-100 pt-4'>
          <button
            type='submit'
            className='rounded-full bg-linear-to-r from-[#8b4f39] to-[#b06e4e] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-[#7d4330] hover:to-[#a65f40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b7a4] focus-visible:ring-offset-2'
          >
            Save goals
          </button>
          {savedData && (
            <p className='text-xs text-slate-500'>
              Changes are saved locally for now.
            </p>
          )}
        </div>
      </form>
    </SurfaceCard>
  );
};

export default ProfileGoalsForm;

