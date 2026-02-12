'use client';

import { useEffect, useState, useCallback } from 'react';
import { Orderbook, OrderbookEntry } from '@/lib/types';

interface OrderbookTableProps {
  yesTokenId: string;
}

export function OrderbookTable({ yesTokenId }: OrderbookTableProps) {
  const [book, setBook] = useState<Orderbook | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = useCallback(async () => {
    try {
      const res = await fetch(`/api/book?token_id=${yesTokenId}`);
      if (!res.ok) throw new Error('Failed to fetch orderbook');
      const data: Orderbook = await res.json();
      setBook(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [yesTokenId]);

  useEffect(() => {
    fetchBook();
    const interval = setInterval(fetchBook, 5000);
    return () => clearInterval(interval);
  }, [fetchBook]);

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Orderbook</h2>
        <p className="text-sm text-red">Error: {error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Orderbook</h2>
        <div className="text-sm text-muted animate-pulse">Loading...</div>
      </div>
    );
  }

  // Take top N levels, sorted for display
  const bids = book.bids
    .map(parseEntry)
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  const asks = book.asks
    .map(parseEntry)
    .sort((a, b) => a.price - b.price)
    .slice(0, 10);

  const maxBidSize = Math.max(...bids.map((b) => b.size), 1);
  const maxAskSize = Math.max(...asks.map((a) => a.size), 1);

  const bestBid = bids[0]?.price ?? 0;
  const bestAsk = asks[0]?.price ?? 0;
  const spread = bestAsk - bestBid;
  const midpoint = (bestBid + bestAsk) / 2;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Orderbook</h2>
        <span className="text-xs text-muted">YES token &middot; auto-refresh 5s</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Bids */}
        <div>
          <div className="flex justify-between text-xs text-muted uppercase tracking-wider mb-2 px-2">
            <span>Price</span>
            <span>Size</span>
          </div>
          <div className="space-y-0.5">
            {bids.map((bid, i) => (
              <div key={i} className="relative flex justify-between items-center px-2 py-1 rounded">
                <div
                  className="absolute inset-y-0 right-0 bg-green/10 rounded"
                  style={{ width: `${(bid.size / maxBidSize) * 100}%` }}
                />
                <span className="relative text-green font-mono text-xs">
                  {bid.price.toFixed(2)}
                </span>
                <span className="relative text-muted font-mono text-xs">
                  {formatBookSize(bid.size)}
                </span>
              </div>
            ))}
            {bids.length === 0 && (
              <div className="text-xs text-muted px-2 py-1">No bids</div>
            )}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="flex justify-between text-xs text-muted uppercase tracking-wider mb-2 px-2">
            <span>Price</span>
            <span>Size</span>
          </div>
          <div className="space-y-0.5">
            {asks.map((ask, i) => (
              <div key={i} className="relative flex justify-between items-center px-2 py-1 rounded">
                <div
                  className="absolute inset-y-0 left-0 bg-red/10 rounded"
                  style={{ width: `${(ask.size / maxAskSize) * 100}%` }}
                />
                <span className="relative text-red font-mono text-xs">
                  {ask.price.toFixed(2)}
                </span>
                <span className="relative text-muted font-mono text-xs">
                  {formatBookSize(ask.size)}
                </span>
              </div>
            ))}
            {asks.length === 0 && (
              <div className="text-xs text-muted px-2 py-1">No asks</div>
            )}
          </div>
        </div>
      </div>

      {/* Spread / midpoint */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border text-xs">
        <span className="text-muted">
          Spread: <span className="text-foreground font-mono">{spread.toFixed(3)}</span>
        </span>
        <span className="text-muted">
          Mid: <span className="text-foreground font-mono">{midpoint.toFixed(3)}</span>
        </span>
        <span className="text-muted">
          Bid: <span className="text-green font-mono">{bestBid.toFixed(2)}</span>
        </span>
        <span className="text-muted">
          Ask: <span className="text-red font-mono">{bestAsk.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}

function parseEntry(entry: OrderbookEntry): { price: number; size: number } {
  return {
    price: parseFloat(entry.price),
    size: parseFloat(entry.size),
  };
}

function formatBookSize(size: number): string {
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(1)}M`;
  if (size >= 1_000) return `${(size / 1_000).toFixed(1)}K`;
  return size.toFixed(0);
}
