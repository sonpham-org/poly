'use client';

import { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TradeData = Record<string, any>;
import { timeAgo, formatSize } from '@/lib/format';

interface RecentTradesProps {
  conditionId: string;
}

export function RecentTrades({ conditionId }: RecentTradesProps) {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await fetch(`/api/trades?conditionId=${conditionId}`);
      if (!res.ok) throw new Error('Failed to fetch trades');
      const data: TradeData[] = await res.json();
      setTrades(data.slice(0, 50));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [conditionId]);

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, [fetchTrades]);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Recent Trades</h2>
        <span className="text-xs text-muted">{trades.length} trades</span>
      </div>

      {error && <p className="text-sm text-red mb-2">Error: {error}</p>}

      {loading && !error && (
        <div className="text-sm text-muted animate-pulse">Loading...</div>
      )}

      {!loading && trades.length === 0 && !error && (
        <p className="text-sm text-muted">No trades found</p>
      )}

      {trades.length > 0 && (
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-4 gap-2 text-xs text-muted uppercase tracking-wider px-2 pb-2 border-b border-border">
            <span>Side</span>
            <span className="text-right">Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Time</span>
          </div>

          {/* Rows */}
          <div className="max-h-[400px] overflow-y-auto">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="grid grid-cols-4 gap-2 text-xs px-2 py-1.5 hover:bg-card-hover transition-colors"
              >
                <span
                  className={
                    trade.side === 'BUY'
                      ? 'text-green font-medium'
                      : 'text-red font-medium'
                  }
                >
                  {trade.side}
                </span>
                <span className="text-right font-mono">
                  {Number(trade.price).toFixed(2)}
                </span>
                <span className="text-right font-mono text-muted">
                  {formatSize(Number(trade.size))}
                </span>
                <span className="text-right text-muted">
                  {timeAgo(typeof trade.timestamp === 'number'
                    ? new Date(trade.timestamp * 1000)
                    : (trade.match_time || trade.timestamp))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
