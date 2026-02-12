import { NextRequest, NextResponse } from 'next/server';
import { getTrades } from '@/lib/polymarket';

export async function GET(req: NextRequest) {
  try {
    const conditionId = req.nextUrl.searchParams.get('conditionId');

    if (!conditionId) {
      return NextResponse.json({ error: 'conditionId is required' }, { status: 400 });
    }

    // Try DB cache first, fall back to API
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('@/lib/prisma');
        const cached = await prisma.cachedTrade.findMany({
          where: { conditionId },
          orderBy: { timestamp: 'desc' },
        });
        if (cached.length > 0) {
          return NextResponse.json(cached);
        }
      } catch {
        // DB not available, fall through to API
      }
    }

    const trades = await getTrades(conditionId);
    return NextResponse.json(trades);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
