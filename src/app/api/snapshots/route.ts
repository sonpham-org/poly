import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const { prisma } = await import('@/lib/prisma');
    const sp = req.nextUrl.searchParams;
    const marketSlug = sp.get('marketSlug');

    if (!marketSlug) {
      return NextResponse.json({ error: 'marketSlug is required' }, { status: 400 });
    }

    const from = sp.get('from');
    const to = sp.get('to');

    const where: { marketSlug: string; timestamp?: { gte?: Date; lte?: Date } } = {
      marketSlug,
    };

    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from);
      if (to) where.timestamp.lte = new Date(to);
    }

    const snapshots = await prisma.orderbookSnapshot.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json(snapshots);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
