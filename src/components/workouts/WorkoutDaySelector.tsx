'use client';

import type { Workout, WorkoutDay } from '@/types/workout';
import { useState } from 'react';
import WorkoutCard from './WorkoutCard';

const weekDays: WorkoutDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WorkoutDaySelector = ({ workouts }: { workouts: Workout[] }) => {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>(weekDays[0]);

  const selectedDayWorkouts = workouts.find((w) => w.day === selectedDay);

  return (
    <section className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <div className='flex flex-wrap gap-2'>
        {weekDays.map((day) => (
          <button
            type='button'
            aria-pressed={selectedDay === day}
            key={day}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedDay === day
                ? 'bg-linear-to-r from-[rgba(79,111,53,0.88)] via-[rgba(79,111,53,0.62)] to-[rgba(145,172,121,0.95)] text-white shadow-sm'
                : 'bg-[rgba(79,111,53,0.08)] text-[#5f5a51] hover:bg-[rgba(79,111,53,0.14)] hover:text-[#4f6f35]'
            }`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className='mt-4'>
        {selectedDayWorkouts && <WorkoutCard workout={selectedDayWorkouts} />}
      </div>
    </section>
  );
};

export default WorkoutDaySelector;
