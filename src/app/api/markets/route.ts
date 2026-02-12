import { NextRequest, NextResponse } from 'next/server';
import { getMarkets } from '@/lib/polymarket';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;

    const markets = await getMarkets({
      limit: sp.has('limit') ? Number(sp.get('limit')) : 20,
      offset: sp.has('offset') ? Number(sp.get('offset')) : undefined,
      active: sp.has('active') ? sp.get('active') === 'true' : undefined,
      closed: sp.has('closed') ? sp.get('closed') === 'true' : undefined,
      tag_slug: sp.get('tag_slug') || undefined,
      text_query: sp.get('text_query') || undefined,
      order: sp.get('order') || undefined,
      ascending: sp.has('ascending') ? sp.get('ascending') === 'true' : undefined,
    });

    return NextResponse.json(markets);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
