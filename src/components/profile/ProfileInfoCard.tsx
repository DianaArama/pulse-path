import { BodyMetrics, Profile } from '@/types/profile';
import SurfaceCard from '../ui/SurfaceCard';

type ProfileInfoCardProps = {
  title: string;
  infoCard: Profile | BodyMetrics | Record<string, never>; // Allow empty object
};

const ProfileInfoCard = ({ title, infoCard }: ProfileInfoCardProps) => {
  return (
    <SurfaceCard>
      <h2 className='text-lg font-bold text-slate-900'>{title}</h2>
      <ul className='mt-2 text-slate-700'>
        {(Object.keys(infoCard) as Array<keyof Profile | BodyMetrics>).map(
          (key) => {
            const label = String(key);
            const capitalizedLabel = (
              label.charAt(0).toUpperCase() + label.slice(1)
            ).replace(/[A-Z]/g, ' $&');

            return (
              <li key={label}>
                <span className='font-semibold text-slate-900'>
                  {capitalizedLabel}:
                </span>{' '}
                {infoCard[key as keyof typeof infoCard]}
              </li>
            );
          },
        )}
      </ul>
    </SurfaceCard>
  );
};

export default ProfileInfoCard;

