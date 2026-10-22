type HomeCalloutProps = {
  label: string;
  value: string;
};

const HomeCallout = ({ label, value }: HomeCalloutProps) => {
  return (
    <div className='rounded-[18px] border border-[#e6d8ca] bg-white px-4 py-3 text-sm shadow-[0_10px_28px_rgba(126,74,35,0.08)]'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a1f2b]'>
        {label}
      </p>
      <p className='mt-1 font-semibold text-[#1e1a17]'>{value}</p>
    </div>
  );
};

export default HomeCallout;
