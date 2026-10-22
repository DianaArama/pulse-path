'use client';

import { useState } from 'react';
import type { NutritionHabit } from '@/types/nutrition';

const NutritionHabits = ({ habits }: { habits: NutritionHabit[] }) => {
  const [nutritionHabits, setNutritionHabits] =
    useState<NutritionHabit[]>(habits);
  const onToggle = (id: string) => {
    setNutritionHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  return (
    <div className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
        Nutrition habits
      </p>
      <fieldset className='mt-4 flex flex-col gap-2'>
        {nutritionHabits.map((habit) => (
          <label
            key={habit.id}
            className={`flex cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3 text-sm font-medium transition ${
              habit.completed
                ? 'border-[#7a1f2b]/20 bg-[#f7ecec] text-[#1e1a17]'
                : 'border-[#e6d8ca] bg-[#fbf7f2] text-[#6d665f] hover:border-[#7a1f2b]/30 hover:bg-[#f9efef]'
            }`}
          >
            <input
              type='checkbox'
              id={habit.id}
              checked={habit.completed}
              onChange={() => onToggle(habit.id)}
              className='h-4 w-4 rounded border-slate-300 accent-[#7a1f2b]'
            />
            {habit.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default NutritionHabits;
