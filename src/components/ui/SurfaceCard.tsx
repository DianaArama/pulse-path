import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

const SurfaceCard = ({ children, className = '' }: SurfaceCardProps) => {
  return (
    <section
      className={`rounded-[30px] border border-[#e6d8ca] bg-[#fffdf9] p-5 shadow-[0_18px_40px_rgba(126,74,35,0.10)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
};

export default SurfaceCard;
