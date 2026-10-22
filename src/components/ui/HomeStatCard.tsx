type HomeStatCardProps = {
  label: string;
  value: string | number;
  caption: string;
};

const HomeStatCard = ({ label, value, caption }: HomeStatCardProps) => {
  return (
    <div className='rounded-[22px] border border-[#e6d8ca] bg-white p-4 shadow-[0_10px_28px_rgba(126,74,35,0.08)]'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.26em] text-[#7a1f2b]'>
        {label}
      </p>
      <p className='mt-2 text-3xl font-semibold text-[#1e1a17]'>{value}</p>
      <p className='mt-1 text-sm text-[#6d665f]'>{caption}</p>
    </div>
  );
};

export default HomeStatCard;
