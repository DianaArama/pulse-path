const SummaryStat = ({ stat, label }: { stat: string; label: string }) => {
  return (
    <div className='flex flex-col items-center gap-1'>
      <p className='text-xs font-medium uppercase text-[#7a1f2b]'>{label}</p>
      <p className='text-2xl font-bold text-[#1e1a17]'>{stat}</p>
    </div>
  );
};

export default SummaryStat;
