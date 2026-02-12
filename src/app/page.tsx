import { GammaMarket, MarketCardData } from '@/lib/types';
import { getMarkets } from '@/lib/polymarket';
import { MarketBrowser } from '@/components/MarketBrowser';

function toCardData(m: GammaMarket): MarketCardData {
  let yesPrice = 0;
  let noPrice = 0;
  try {
    const prices: string[] = JSON.parse(m.outcomePrices || '[]');
    yesPrice = parseFloat(prices[0]) || 0;
    noPrice = parseFloat(prices[1]) || 0;
  } catch {
    // fallback to token prices
    if (m.tokens?.length >= 2) {
      yesPrice = m.tokens[0].price;
      noPrice = m.tokens[1].price;
    }
  }

  return {
    slug: m.slug,
    question: m.question,
    image: m.image || m.icon || '',
    yesPrice,
    noPrice,
    volume: m.volume ?? 0,
    volume24hr: m.volume24hr ?? 0,
    category: m.category || '',
    active: m.active,
    closed: m.closed,
  };
}

export default async function Home() {
  let initialMarkets: MarketCardData[] = [];

  try {
    const data = await getMarkets({
      limit: 40,
      active: true,
      closed: false,
      order: 'volume24hr',
      ascending: false,
    });
    initialMarkets = data.map(toCardData);
  } catch {
    // SSR fetch may fail during build; client will retry
  }

  return <MarketBrowser initialMarkets={initialMarkets} />;
}
