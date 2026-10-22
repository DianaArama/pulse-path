import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  activeProfileCookieName,
  getProfileById,
} from '@/data/profile';

type ActiveProfileBody = {
  profileId?: string;
};

export async function GET() {
  const cookieStore = await cookies();
  const selectedProfileId = cookieStore.get(activeProfileCookieName)?.value;
  const activeProfile = getProfileById(selectedProfileId);

  return NextResponse.json({
    profileId: activeProfile.id,
    profile: activeProfile.profile,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as ActiveProfileBody;
  const activeProfile = getProfileById(body.profileId);
  const cookieStore = await cookies();

  cookieStore.set(activeProfileCookieName, activeProfile.id, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({
    profileId: activeProfile.id,
    profile: activeProfile.profile,
  });
}
