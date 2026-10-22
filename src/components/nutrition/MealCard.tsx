'use client';

import type { MealRecommendation } from '@/types/nutrition';
import Image from 'next/image';
import { useState } from 'react';
import MealPanel from './MealPanel';

const MealCard = ({ meal }: { meal: MealRecommendation }) => {
  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  const togglePanel = () => {
    setPanelOpened((prev) => !prev);
  };
  const panelId = `meal-panel-${meal.id}`;

  return (
    <section className='rounded-[26px] border border-[#e6d8ca] bg-white p-4 shadow-[0_12px_28px_rgba(126,74,35,0.08)]'>
      <div className='flex items-start gap-4'>
        <Image
          src={meal.image}
          alt={meal.imageAlt}
          width={80}
          height={80}
          className='h-20 w-20 rounded-2xl object-cover'
        />
        <div className='w-full'>
          <div className='flex w-full items-start justify-between gap-3'>
            <div>
        <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4f6f35]'>
                {meal.mealType}
              </p>
              <h3 className='mt-1 text-lg font-semibold text-[#1e1a17]'>
                {meal.name}
              </h3>
            </div>
            <button
              type='button'
              aria-label={`${panelOpened ? 'Close' : 'Open'} recipe and nutrition stats for ${meal.name}`}
              className='rounded-full border border-[rgba(79,111,53,0.22)] bg-[linear-gradient(180deg,rgba(79,111,53,0.16)_0%,rgba(79,111,53,0.08)_100%)] p-2 text-[#4f6f35] shadow-sm transition hover:border-[rgba(79,111,53,0.34)] hover:bg-[linear-gradient(180deg,rgba(79,111,53,0.22)_0%,rgba(79,111,53,0.12)_100%)]'
              onClick={togglePanel}
              aria-expanded={panelOpened}
              aria-controls={panelId}
            >
              <Image
                src={
                  panelOpened
                    ? '/images/arrow-up.svg'
                    : '/images/arrow-down.svg'
                }
                alt=''
                width={16}
                height={16}
                aria-hidden='true'
                className='h-5 w-5 cursor-pointer'
              />
            </button>
          </div>
          <div className='mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#6d665f]'>
            {meal.tags.slice(0, 3).map((tag) => (
          <span key={tag} className='rounded-full bg-[rgba(79,111,53,0.10)] px-3 py-1 text-[#4f6f35]'>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {panelOpened ? <MealPanel id={panelId} meal={meal} /> : null}
    </section>
  );
};
export default MealCard;
