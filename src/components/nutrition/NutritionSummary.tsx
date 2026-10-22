import type { NutritionSummary } from '@/types/nutrition';

const NutritionSummary = ({ summary }: { summary: NutritionSummary }) => {
  return (
    <div className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
        Nutrition summary
      </p>
      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
        <div className='rounded-[22px] bg-[#f7ecec] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
            Calories (kcal)
          </p>
          <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
            {summary.caloriesLogged} / {summary.calorieTarget}
          </p>
        </div>
        <div className='rounded-[22px] bg-[#f5ecec] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
            Protein (g)
          </p>
          <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
            {summary.proteinLogged} / {summary.proteinTarget}
          </p>
        </div>
        <div className='rounded-[22px] bg-[#f8efef] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
            Carbs (g)
          </p>
          <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
            {summary.carbsLogged} / {summary.carbsTarget}
          </p>
        </div>
        <div className='rounded-[22px] bg-[#f6e7e8] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
            Fat (g)
          </p>
          <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
            {summary.fatLogged} / {summary.fatTarget}
          </p>
        </div>
        <div className='rounded-[22px] bg-[#f7ecec] p-4 sm:col-span-2'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
            Water (L)
          </p>
          <p className='mt-2 text-lg font-semibold text-[#1e1a17]'>
            {summary.waterLogged} / {summary.waterTarget}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
