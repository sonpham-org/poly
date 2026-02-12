import { GammaMarket, Orderbook, PricePoint, PolyTrade } from './types';
import { withCache } from './cache';

const GAMMA_API = 'https://gamma-api.polymarket.com';
const CLOB_API = 'https://clob.polymarket.com';
const DATA_API = 'https://data-api.polymarket.com';

// --- Gamma API (market metadata) ---

export async function getMarkets(params: {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  tag_slug?: string;
  order?: string;
  ascending?: boolean;
  text_query?: string;
}): Promise<GammaMarket[]> {
  const search = new URLSearchParams();
  if (params.limit) search.set('limit', String(params.limit));
  if (params.offset) search.set('offset', String(params.offset));
  if (params.active !== undefined) search.set('active', String(params.active));
  if (params.closed !== undefined) search.set('closed', String(params.closed));
  if (params.tag_slug) search.set('tag_slug', params.tag_slug);
  if (params.order) search.set('order', params.order);
  if (params.ascending !== undefined) search.set('ascending', String(params.ascending));
  if (params.text_query) search.set('_q', params.text_query);

  const key = `markets:${search.toString()}`;
  return withCache(key, 60_000, async () => {
    const res = await fetch(`${GAMMA_API}/markets?${search}`);
    if (!res.ok) throw new Error(`Gamma API error: ${res.status}`);
    return res.json();
  });
}

export async function getMarketBySlug(slug: string): Promise<GammaMarket | null> {
  return withCache(`market:${slug}`, 30_000, async () => {
    const res = await fetch(`${GAMMA_API}/markets?slug=${slug}`);
    if (!res.ok) throw new Error(`Gamma API error: ${res.status}`);
    const markets: GammaMarket[] = await res.json();
    return markets[0] || null;
  });
}

// --- CLOB API (orderbook + prices) ---

export async function getOrderbook(tokenId: string): Promise<Orderbook> {
  const res = await fetch(`${CLOB_API}/book?token_id=${tokenId}`);
  if (!res.ok) throw new Error(`CLOB API error: ${res.status}`);
  return res.json();
}

export async function getPriceHistory(
  tokenId: string,
  startTs?: number,
  endTs?: number,
  fidelity?: number
): Promise<PricePoint[]> {
  const search = new URLSearchParams({ market: tokenId, interval: 'all' });
  if (startTs) search.set('startTs', String(startTs));
  if (endTs) search.set('endTs', String(endTs));
  if (fidelity) search.set('fidelity', String(fidelity));

  const key = `prices:${search.toString()}`;
  return withCache(key, 60_000, async () => {
    const res = await fetch(`${CLOB_API}/prices-history?${search}`);
    if (!res.ok) throw new Error(`CLOB API error: ${res.status}`);
    const data = await res.json();
    return data.history || [];
  });
}

// --- Data API (trades) ---

export async function getTrades(
  conditionId: string,
  limit = 100
): Promise<PolyTrade[]> {
  const search = new URLSearchParams({
    market: conditionId,
    limit: String(limit),
  });

  const res = await fetch(`${DATA_API}/trades?${search}`);
  if (!res.ok) throw new Error(`Data API error: ${res.status}`);
  const data = await res.json();
  // Data API returns a plain array
  return Array.isArray(data) ? data : [];
}
