'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PricePoint, ReplayTrade } from '@/lib/types';
import { PriceTimeline } from '@/components/PriceTimeline';
import { ReplayControls } from '@/components/ReplayControls';
import { TradeReplay } from '@/components/TradeReplay';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { Loader2 } from 'lucide-react';

interface ReplayViewProps {
  slug: string;
  conditionId: string;
  yesTokenId: string;
  outcomes: string[];
}

export function ReplayView({ slug, conditionId, yesTokenId, outcomes }: ReplayViewProps) {
  const [trades, setTrades] = useState<ReplayTrade[]>([]);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replay state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch data
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [tradesRes, priceRes] = await Promise.all([
          fetch(`/api/trades?conditionId=${encodeURIComponent(conditionId)}`),
          fetch(`/api/price-history?token_id=${encodeURIComponent(yesTokenId)}&fidelity=60`),
        ]);

        if (!tradesRes.ok) throw new Error('Failed to fetch trades');
        if (!priceRes.ok) throw new Error('Failed to fetch price history');

        const rawTrades = await tradesRes.json();
        const priceData: PricePoint[] = await priceRes.json();

        if (cancelled) return;

        // Transform and sort trades
        const processed: ReplayTrade[] = (Array.isArray(rawTrades) ? rawTrades : [])
          .map((t: Record<string, unknown>, i: number) => {
            // Handle both PolyTrade (from API) and CachedTrade (from DB) shapes
            const price = Number(t.price || 0);
            const size = Number(t.size || 0);
            return {
              id: i,
              side: (t.side as 'BUY' | 'SELL') || 'BUY',
              outcome: (t.outcome as string) || outcomes[0] || 'YES',
              price,
              size,
              usdcAmount: price * size,
              timestamp: typeof t.timestamp === 'number'
                ? new Date((t.timestamp as number) * 1000)
                : new Date((t.match_time || t.timestamp || '') as string),
              maker: (t.maker_address || t.makerAddress || null) as string | null,
              taker: (t.owner || t.taker || null) as string | null,
              transactionHash: (t.transaction_hash || t.transactionHash || null) as string | null,
              isMint: (t.type === 'MINT') || (t.isMint === true),
            };
          })
          .filter((t: ReplayTrade) => !isNaN(t.timestamp.getTime()))
          .sort((a: ReplayTrade, b: ReplayTrade) => a.timestamp.getTime() - b.timestamp.getTime());

        // Calculate price impact
        for (let i = 1; i < processed.length; i++) {
          processed[i].priceImpact = processed[i].price - processed[i - 1].price;
        }

        setTrades(processed);
        setPriceHistory(priceData);
        setCurrentIndex(0);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [conditionId, yesTokenId, outcomes, slug]);

  // Play/pause logic
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && trades.length > 0) {
      const delayMs = Math.max(50, 500 / playSpeed);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= trades.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delayMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playSpeed, trades.length]);

  const handleTogglePlay = useCallback(() => {
    if (currentIndex >= trades.length - 1 && !isPlaying) {
      // Restart from beginning if at end
      setCurrentIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentIndex, trades.length, isPlaying]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(prev + 1, trades.length - 1));
  }, [trades.length]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleIndexChange = useCallback((index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaySpeed(speed);
  }, []);

  const currentTrade = trades[currentIndex] || null;
  const prevTrade = currentIndex > 0 ? trades[currentIndex - 1] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
        <span className="ml-3 text-muted text-sm">Loading market data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red/10 border border-red/20 rounded-lg p-6 text-center">
        <p className="text-red text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-accent hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted text-sm">No trades found for this market.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price chart */}
      <PriceTimeline
        priceHistory={priceHistory}
        trades={trades}
        currentIndex={currentIndex}
      />

      {/* Replay controls */}
      <ReplayControls
        currentIndex={currentIndex}
        totalTrades={trades.length}
        isPlaying={isPlaying}
        playSpeed={playSpeed}
        currentTimestamp={currentTrade?.timestamp || null}
        onIndexChange={handleIndexChange}
        onTogglePlay={handleTogglePlay}
        onSpeedChange={handleSpeedChange}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
      />

      {/* Trade feed + Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TradeReplay
            trades={trades}
            currentIndex={currentIndex}
            onSelectTrade={handleIndexChange}
          />
        </div>
        <div className="lg:col-span-2">
          <ExplanationPanel trade={currentTrade} prevTrade={prevTrade} />
        </div>
      </div>
    </div>
  );
}
