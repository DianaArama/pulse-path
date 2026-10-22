type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => {
  return (
    <header className='rounded-[30px] border border-[#e6d8ca] bg-[#fffdf9] px-5 py-4 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.36em] text-[#7a1f2b]'>
        {eyebrow}
      </p>
      <h1 className='mt-2 text-3xl font-semibold text-[#1e1a17]'>{title}</h1>
      <p className='mt-2 max-w-2xl text-sm leading-7 text-[#665e56]'>
        {description}
      </p>
    </header>
  );
};

export default PageHeader;
