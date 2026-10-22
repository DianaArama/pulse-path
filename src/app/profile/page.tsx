'use client';

import ConnectedDevicesCard from '@/components/profile/ConnectedDevicesCard';
import PageHeader from '@/components/ui/PageHeader';
import ProfileGoalsForm from '@/components/profile/ProfileGoalsForm';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ProfileViewer from '@/components/profile/ProfileViewer';
import { useActiveProfile } from '@/lib/store/use-active-profile';

const ProfilePage = () => {
  const activeProfile = useActiveProfile((state) => state.activeProfile);

  return (
    <main className='flex min-w-0 flex-col gap-4'>
      <PageHeader
        eyebrow='Identity'
        title='Profile'
        description='Your personal health profile and goals.'
      />

      <section className='space-y-4'>
        <ProfileViewer />

        <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='flex flex-col gap-4'>
            <ProfileGoalsForm />
            <ProfileInfoCard
              title='Body metrics'
              infoCard={activeProfile?.bodyMetrics || {}}
            />
          </div>
          <aside className='space-y-4'>
            <ProfileInfoCard
              title='User overview'
              infoCard={activeProfile?.profile || {}}
            />
            <ConnectedDevicesCard
              devices={activeProfile?.connectedDevices || []}
            />
          </aside>
        </section>
      </section>
    </main>
  );
};

export default ProfilePage;

