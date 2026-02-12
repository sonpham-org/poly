import { NextRequest, NextResponse } from 'next/server';
import { getOrderbook } from '@/lib/polymarket';

export async function GET(req: NextRequest) {
  try {
    const tokenId = req.nextUrl.searchParams.get('token_id');

    if (!tokenId) {
      return NextResponse.json({ error: 'token_id is required' }, { status: 400 });
    }

    const book = await getOrderbook(tokenId);
    return NextResponse.json(book);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
