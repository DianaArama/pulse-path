import { NextResponse } from 'next/server';

import { getProfileSummaries } from '@/data/profile';

export async function GET() {
  return NextResponse.json({
    profiles: getProfileSummaries(),
  });
}
