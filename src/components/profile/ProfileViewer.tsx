'use client';

import { useActiveProfile } from '@/lib/store/use-active-profile';
import SurfaceCard from '../ui/SurfaceCard';

const ProfileViewer = () => {
  const activeUser = useActiveProfile((state) => state.activeProfile);

  return (
    <SurfaceCard>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>
          Active user
        </p>
        <h2 className='text-lg font-bold text-slate-900'>
          {activeUser?.profile?.name}
        </h2>
        <p className='mt-1 text-sm text-slate-600'>
          {activeUser?.profile?.primaryGoal}
        </p>
      </div>
      <div className='mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3'>
        <p>
          <span className='font-semibold text-slate-900'>Age:</span>{' '}
          {activeUser?.profile?.age}
        </p>
        <p>
          <span className='font-semibold text-slate-900'>Activity:</span>{' '}
          {activeUser?.profile?.activityLevel}
        </p>
        <p>
          <span className='font-semibold text-slate-900'>Stress:</span>{' '}
          {activeUser?.profile?.stress}
        </p>
      </div>
    </SurfaceCard>
  );
};

export default ProfileViewer;

