'use client';

import { ReplayTrade } from '@/lib/types';
import { formatPrice, formatSize, formatUsd, formatTime } from '@/lib/format';

interface TradeCardProps {
  trade: ReplayTrade;
  isCurrent: boolean;
}

export function TradeCard({ trade, isCurrent }: TradeCardProps) {
  const isBuy = trade.side === 'BUY';

  return (
    <div
      className={`px-3 py-2.5 border-l-2 transition-colors ${
        isCurrent
          ? 'bg-accent/10 border-l-accent'
          : 'border-l-transparent hover:bg-card-hover'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isBuy
                ? 'bg-green/15 text-green'
                : 'bg-red/15 text-red'
            }`}
          >
            {trade.side}
          </span>
          {trade.isMint && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/15 text-accent">
              MINT
            </span>
          )}
          <span className="text-xs text-muted truncate">{trade.outcome}</span>
        </div>
        <span className="text-[11px] text-muted whitespace-nowrap">
          {formatTime(trade.timestamp)}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1.5 gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-mono font-medium">
            {formatPrice(trade.price)}
          </span>
          <span className="text-xs text-muted font-mono">
            {formatSize(trade.size)} shares
          </span>
          <span className="text-xs text-muted font-mono">
            {formatUsd(trade.usdcAmount)}
          </span>
        </div>
        {trade.priceImpact !== undefined && trade.priceImpact !== 0 && (
          <span
            className={`text-[11px] font-mono ${
              trade.priceImpact > 0 ? 'text-green' : 'text-red'
            }`}
          >
            {trade.priceImpact > 0 ? '+' : ''}
            {(trade.priceImpact * 100).toFixed(2)}¢
          </span>
        )}
      </div>
    </div>
  );
}
