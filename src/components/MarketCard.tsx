import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketCardData } from '@/lib/types';
import { formatPercent, formatUsd } from '@/lib/format';

export function MarketCard({ market }: { market: MarketCardData }) {
  const yesPercent = market.yesPrice * 100;

  return (
    <Link
      href={`/market/${market.slug}`}
      className="block bg-card border border-border rounded-xl p-4 hover:bg-card-hover hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        {market.image ? (
          <Image
            src={market.image}
            alt=""
            width={40}
            height={40}
            className="rounded-lg object-cover shrink-0"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-accent/10 shrink-0" />
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {market.question}
        </h3>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-muted mb-1">YES</div>
          <div
            className={`text-lg font-bold ${
              yesPercent >= 50 ? 'text-green' : 'text-red'
            }`}
          >
            {formatPercent(market.yesPrice)}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-muted mb-1">
            {market.volume24hr > 0 ? (
              <TrendingUp className="w-3 h-3 text-green" />
            ) : (
              <TrendingDown className="w-3 h-3 text-muted" />
            )}
            <span>{formatUsd(market.volume24hr)} 24h</span>
          </div>
          <div className="text-xs text-muted">
            {formatUsd(market.volume)} vol
          </div>
        </div>
      </div>

      {market.closed && (
        <div className="mt-3 text-xs text-muted bg-border/50 rounded px-2 py-1 w-fit">
          Resolved
        </div>
      )}
    </Link>
  );
}
