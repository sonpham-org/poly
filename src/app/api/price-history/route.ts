import { NextRequest, NextResponse } from 'next/server';
import { getPriceHistory } from '@/lib/polymarket';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const tokenId = sp.get('token_id');

    if (!tokenId) {
      return NextResponse.json({ error: 'token_id is required' }, { status: 400 });
    }

    const startTs = sp.has('startTs') ? Number(sp.get('startTs')) : undefined;
    const endTs = sp.has('endTs') ? Number(sp.get('endTs')) : undefined;
    const fidelity = sp.has('fidelity') ? Number(sp.get('fidelity')) : undefined;

    const history = await getPriceHistory(tokenId, startTs, endTs, fidelity);
    return NextResponse.json(history);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
