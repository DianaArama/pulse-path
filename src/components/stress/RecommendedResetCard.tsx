import type { RecommendedReset } from '@/types/stress';

type RecommendedResetCardProps = {
  recommendedReset: RecommendedReset;
};

const RecommendedResetCard = ({
  recommendedReset,
}: RecommendedResetCardProps) => {
  return (
    <div className='mb-6 rounded-xl border border-[#e6d8ca] bg-white p-4 shadow-[0_10px_24px_rgba(126,74,35,0.08)]'>
      <h2 className='text-lg font-bold text-[#1e1a17]'>Recommended Reset</h2>
      <p className='mt-2 text-sm text-[#6d665f]'>
        {recommendedReset.duration} minutes | {recommendedReset.intensity}
      </p>
      <ul className='mt-4 list-disc space-y-1 pl-5 text-[#6d665f]'>
        {recommendedReset.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedResetCard;
