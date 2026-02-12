import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMarketBySlug } from '@/lib/polymarket';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    // Check if already tracked
    const existing = await prisma.trackedMarket.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(existing);
    }

    // Fetch market data from Gamma API
    const market = await getMarketBySlug(slug);
    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }

    // Parse token IDs: clobTokenIds is a JSON string like '["id1","id2"]'
    let tokenIds: string[];
    try {
      tokenIds = JSON.parse(market.clobTokenIds);
    } catch {
      return NextResponse.json({ error: 'Could not parse token IDs' }, { status: 500 });
    }

    if (tokenIds.length < 2) {
      return NextResponse.json({ error: 'Market must have at least 2 tokens' }, { status: 400 });
    }

    const tracked = await prisma.trackedMarket.create({
      data: {
        slug: market.slug,
        question: market.question,
        conditionId: market.conditionId,
        tokenIdYes: tokenIds[0],
        tokenIdNo: tokenIds[1],
      },
    });

    return NextResponse.json(tracked, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
