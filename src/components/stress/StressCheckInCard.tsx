'use client';

import { useState } from 'react';
import type {
  EnergyLevel,
  SleepQuality,
  StressCheckInOptions,
  StressLevel,
} from '@/types/stress';

type StressCheckInCardProps = {
  checkInOptions: StressCheckInOptions;
};

const checkInButtonBase =
  'min-w-24 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(79,111,53,0.28)] focus-visible:ring-offset-2';

const checkInButtonSelected =
  'border-[rgba(79,111,53,0.28)] bg-[rgba(79,111,53,0.18)] text-[#24402a] shadow-sm';

const checkInButtonIdle =
  'border-[#e6d8ca] bg-white text-[#6d665f] hover:border-[rgba(79,111,53,0.28)] hover:bg-[rgba(79,111,53,0.08)] hover:text-[#4f6f35]';

const checkInRowClass =
  'mt-3 flex flex-wrap items-center justify-between gap-4';

const checkInLabelClass = 'text-sm font-semibold text-slate-700';

const StressCheckInCard = ({ checkInOptions }: StressCheckInCardProps) => {
  const [selectedStressLevel, setSelectedStressLevel] =
    useState<StressLevel | null>(null);
  const [selectedEnergyLevel, setSelectedEnergyLevel] =
    useState<EnergyLevel | null>(null);
  const [selectedSleepQuality, setSelectedSleepQuality] =
    useState<SleepQuality | null>(null);

  return (
    <div className='mb-6 rounded-xl border border-[#e6d8ca] bg-white p-4 shadow-[0_10px_24px_rgba(126,74,35,0.08)]'>
      <h2 className='text-lg font-bold text-[#1e1a17]'>
        Today&apos;s Check-in
      </h2>
      <div className='flex flex-col'>
        <div className={checkInRowClass}>
          <h4 className='text-sm font-semibold text-[#1e1a17]'>Stress level:</h4>
          <div className='flex flex-wrap items-center justify-end gap-2'>
            {checkInOptions.stressLevels.map((option) => (
              <button
                key={option}
                type='button'
                aria-pressed={selectedStressLevel === option}
                onClick={() => setSelectedStressLevel(option)}
                className={`${checkInButtonBase} ${
                  selectedStressLevel === option
                    ? checkInButtonSelected
                    : checkInButtonIdle
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={checkInRowClass}>
          <h4 className='text-sm font-semibold text-[#1e1a17]'>Energy:</h4>
          <div className='flex flex-wrap items-center justify-end gap-2'>
            {checkInOptions.energyLevels.map((option) => (
              <button
                key={option}
                type='button'
                aria-pressed={selectedEnergyLevel === option}
                onClick={() => setSelectedEnergyLevel(option)}
                className={`${checkInButtonBase} ${
                  selectedEnergyLevel === option
                    ? checkInButtonSelected
                    : checkInButtonIdle
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={checkInRowClass}>
          <h4 className='text-sm font-semibold text-[#1e1a17]'>Sleep quality:</h4>
          <div className='flex flex-wrap items-center justify-end gap-2'>
            {checkInOptions.sleepQuality.map((option) => (
              <button
                key={option}
                type='button'
                aria-pressed={selectedSleepQuality === option}
                onClick={() => setSelectedSleepQuality(option)}
                className={`${checkInButtonBase} ${
                  selectedSleepQuality === option
                    ? checkInButtonSelected
                    : checkInButtonIdle
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressCheckInCard;
