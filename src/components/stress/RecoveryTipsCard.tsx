import type { RecoveryTip } from '@/types/stress';

type RecoveryTipsCardProps = {
  tips: RecoveryTip[];
};

const RecoveryTipsCard = ({ tips }: RecoveryTipsCardProps) => {
  return (
    <div className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
        Recovery tips
      </p>
      <ul className='mt-4 space-y-3'>
        {tips.map((tip) => (
          <li
            key={tip.id}
            className='rounded-[22px] border border-[#e6d8ca] bg-[#fbf7f2] p-4'
          >
            <p className='font-semibold text-[#1e1a17]'>{tip.title}</p>
            <p className='mt-1 text-sm text-[#6d665f]'>{tip.description}</p>
        <p className='mt-2 text-xs uppercase text-[#7a1f2b]'>
              {tip.duration} min
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecoveryTipsCard;
