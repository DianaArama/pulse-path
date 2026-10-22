import { cookies } from 'next/headers';

import { activeProfileCookieName, getProfileById } from '@/data/profile';
import type { UserProfileRecord } from '@/types/profile';

export const resolveActiveProfile = async (): Promise<UserProfileRecord> => {
  const cookieStore = await cookies();
  const selectedProfileId = cookieStore.get(activeProfileCookieName)?.value;

  return getProfileById(selectedProfileId);
};
