'use client';

import { useState } from 'react';
import type { StressHabit } from '@/types/stress';

type StressHabitsCardProps = {
  initialHabits: StressHabit[];
};

const StressHabitsCard = ({ initialHabits }: StressHabitsCardProps) => {
  const [habits, setHabits] = useState<StressHabit[]>(initialHabits);

  const onToggle = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  return (
    <div className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6a1b75]'>
        Stress habits
      </p>
      <fieldset className='mt-4 flex flex-col gap-2'>
        {habits.map((habit) => (
          <label
            key={habit.id}
            className={`flex cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3 text-sm font-medium transition ${
              habit.completed
                ? 'border-[#6a1b75]/20 bg-[#f6e7e8] text-[#1e1a17]'
                : 'border-[#e6d8ca] bg-[#fbf7f2] text-[#6d665f] hover:border-[#d1a54a]/40 hover:bg-[#fbf3dd]'
            }`}
          >
            <input
              type='checkbox'
              checked={habit.completed}
              onChange={() => onToggle(habit.id)}
              className='h-4 w-4 rounded border-slate-500 accent-[#6a1b75]'
            />
            <span>{habit.label}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default StressHabitsCard;
