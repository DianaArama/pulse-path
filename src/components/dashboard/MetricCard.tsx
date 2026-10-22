import type { MetricStatus } from '@/types/dashboard';

type StatusTone = {
  Completed: string;
  Good: string;
  'In Progress': string;
  'Needs Improvement': string;
};

export default function MetricCard({
  title,
  current,
  unit,
  goal,
  progress,
  status,
}: {
  title: string;
  current: number;
  unit?: string;
  goal: string;
  progress: number;
  status: MetricStatus;
}) {
  const statusTone: StatusTone = {
    Completed: 'bg-[#6a1b75] text-[#fffaf4]',
    Good: 'bg-[#fbf3dd] text-[#8b5a2d]',
    'In Progress': 'bg-[#f6e7e8] text-[#7a1f2b]',
    'Needs Improvement': 'bg-[#e4edd8] text-[#4f6f35]',
  };

  return (
    <article className='rounded-3xl border border-[#e6d8ca] bg-white p-4 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <div className='flex items-start justify-between gap-3'>
        <div>
      <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a1b75]'>
            {title}
          </p>
          <p className='mt-2 text-2xl font-semibold text-[#1e1a17]'>
            {unit ? `${current} ${unit}` : current}
          </p>
          <p className='mt-1 text-sm text-[#6d665f]'>{goal}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[status]}`}
        >
          {status}
        </span>
      </div>

      <div className='mt-4 h-2 rounded-full bg-[#efe4d8]'>
        <div
        className='h-2 rounded-full bg-linear-to-r from-[#6a1b75] via-[#d1a54a] to-[#7a1f2b]'
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
}
