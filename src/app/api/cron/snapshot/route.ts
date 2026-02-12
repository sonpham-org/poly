import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrderbook, getTrades } from '@/lib/polymarket';

export async function GET() {
  try {
    const tracked = await prisma.trackedMarket.findMany({
      where: { active: true },
    });

    const results: { slug: string; snapshotSaved: boolean; tradesCached: number }[] = [];

    for (const market of tracked) {
      try {
        // Fetch and store orderbook snapshot
        const book = await getOrderbook(market.tokenIdYes);

        const bids = book.bids.map((b) => ({ price: Number(b.price), size: Number(b.size) }));
        const asks = book.asks.map((a) => ({ price: Number(a.price), size: Number(a.size) }));

        const bestBid = bids.length > 0 ? bids[0].price : 0;
        const bestAsk = asks.length > 0 ? asks[0].price : 1;
        const spread = bestAsk - bestBid;
        const midpoint = (bestBid + bestAsk) / 2;

        await prisma.orderbookSnapshot.create({
          data: {
            tokenId: market.tokenIdYes,
            marketSlug: market.slug,
            timestamp: new Date(),
            bids,
            asks,
            spread,
            midpoint,
          },
        });

        // Fetch and cache recent trades
        const trades = await getTrades(market.conditionId);
        let tradesCached = 0;

        for (const t of trades) {
          try {
            await prisma.cachedTrade.upsert({
              where: {
                transactionHash_conditionId: {
                  transactionHash: t.transactionHash || t.transaction_hash || '',
                  conditionId: market.conditionId,
                },
              },
              update: {},
              create: {
                conditionId: market.conditionId,
                marketSlug: market.slug,
                side: t.side,
                outcome: t.outcome,
                price: Number(t.price),
                size: Number(t.size),
                usdcAmount: Number(t.price) * Number(t.size),
                timestamp: typeof t.timestamp === 'number'
                  ? new Date(t.timestamp * 1000)
                  : new Date(t.match_time || t.timestamp),
                maker: t.proxyWallet || t.maker_address || null,
                taker: t.proxyWallet || t.owner || null,
                transactionHash: t.transactionHash || t.transaction_hash,
              },
            });
            tradesCached++;
          } catch {
            // Skip duplicate trades
          }
        }

        results.push({ slug: market.slug, snapshotSaved: true, tradesCached });
      } catch (err) {
        results.push({
          slug: market.slug,
          snapshotSaved: false,
          tradesCached: 0,
        });
        console.error(`Snapshot error for ${market.slug}:`, err);
      }
    }

    return NextResponse.json({ tracked: tracked.length, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
