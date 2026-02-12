'use client';

import { useEffect, useRef } from 'react';
import { ReplayTrade } from '@/lib/types';
import { TradeCard } from './TradeCard';
import { List } from 'lucide-react';

interface TradeReplayProps {
  trades: ReplayTrade[];
  currentIndex: number;
  onSelectTrade: (index: number) => void;
}

export function TradeReplay({ trades, currentIndex, onSelectTrade }: TradeReplayProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current trade visible
  useEffect(() => {
    if (currentRef.current && listRef.current) {
      const container = listRef.current;
      const element = currentRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (
        elementRect.top < containerRect.top ||
        elementRect.bottom > containerRect.bottom
      ) {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const visibleTrades = trades.slice(0, currentIndex + 1);

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <List className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold">Trade Feed</h3>
        <span className="text-[11px] text-muted ml-auto">
          {visibleTrades.length} / {trades.length}
        </span>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto divide-y divide-border/50"
        style={{ maxHeight: '400px' }}
      >
        {visibleTrades.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted">
            No trades yet. Press play or step forward to begin.
          </div>
        ) : (
          visibleTrades.map((trade, i) => (
            <div
              key={trade.id}
              ref={i === currentIndex ? currentRef : undefined}
              onClick={() => onSelectTrade(i)}
              className="cursor-pointer"
            >
              <TradeCard trade={trade} isCurrent={i === currentIndex} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
