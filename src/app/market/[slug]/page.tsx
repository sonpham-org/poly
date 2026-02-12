import { notFound } from 'next/navigation';
import { getMarketBySlug } from '@/lib/polymarket';
import { MarketHeader } from '@/components/MarketHeader';
import { OrderbookTable } from '@/components/OrderbookTable';
import { RecentTrades } from '@/components/RecentTrades';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);
  if (!market) return { title: 'Market Not Found' };
  return {
    title: `${market.question} | Poly Replay`,
    description: market.description?.slice(0, 160),
  };
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);

  if (!market) notFound();

  // Parse clobTokenIds: index 0 = YES, index 1 = NO
  let yesTokenId = '';
  try {
    const tokenIds: string[] = JSON.parse(market.clobTokenIds || '[]');
    yesTokenId = tokenIds[0] ?? '';
  } catch {
    // clobTokenIds may not be valid JSON
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <MarketHeader market={market} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {yesTokenId ? (
          <OrderbookTable yesTokenId={yesTokenId} />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2">Orderbook</h2>
            <p className="text-sm text-muted">No token data available for this market.</p>
          </div>
        )}

        <RecentTrades conditionId={market.conditionId} />
      </div>
    </div>
  );
}
