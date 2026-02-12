'use client';

import { useState, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { GammaMarket, MarketCardData } from '@/lib/types';
import { MarketCard } from './MarketCard';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';

function toCardData(m: GammaMarket): MarketCardData {
  let yesPrice = 0;
  let noPrice = 0;
  try {
    const prices: string[] = JSON.parse(m.outcomePrices || '[]');
    yesPrice = parseFloat(prices[0]) || 0;
    noPrice = parseFloat(prices[1]) || 0;
  } catch {
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

export function MarketBrowser({ initialMarkets }: { initialMarkets: MarketCardData[] }) {
  const [markets, setMarkets] = useState<MarketCardData[]>(initialMarkets);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialMarkets.length);
  const [hasMore, setHasMore] = useState(initialMarkets.length >= 40);

  const filtered = useMemo(() => {
    let result = markets;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q));
    }

    if (category) {
      result = result.filter(
        (m) => m.category.toLowerCase() === category.toLowerCase()
      );
    }

    return result;
  }, [markets, search, category]);

  const fetchMore = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '40',
        offset: String(offset),
        active: 'true',
        order: 'volume24hr',
        ascending: 'false',
      });
      const res = await fetch(`/api/markets?${params}`);
      if (res.ok) {
        const data: GammaMarket[] = await res.json();
        const newCards = data.map(toCardData);
        setMarkets((prev) => {
          const slugs = new Set(prev.map((m) => m.slug));
          const unique = newCards.filter((m) => !slugs.has(m.slug));
          return [...prev, ...unique];
        });
        setOffset((prev) => prev + data.length);
        setHasMore(data.length >= 40);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [offset]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Markets</h1>
        <p className="text-muted text-sm">
          Browse prediction markets and replay their history
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="mb-6">
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          ) : (
            <p>No markets found. Try adjusting your search or filters.</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((market) => (
              <MarketCard key={market.slug} market={market} />
            ))}
          </div>

          {hasMore && !search && !category && (
            <div className="mt-8 text-center">
              <button
                onClick={fetchMore}
                disabled={loading}
                className="px-6 py-2.5 bg-card border border-border rounded-lg text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load more markets'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
