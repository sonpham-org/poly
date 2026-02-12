import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, Play } from 'lucide-react';
import { GammaMarket } from '@/lib/types';
import { formatDate, formatUsd, formatPercent } from '@/lib/format';

export function MarketHeader({ market }: { market: GammaMarket }) {
  let yesPrice = 0;
  let noPrice = 0;
  try {
    const prices: string[] = JSON.parse(market.outcomePrices || '[]');
    yesPrice = parseFloat(prices[0]) || 0;
    noPrice = parseFloat(prices[1]) || 0;
  } catch {
    if (market.tokens?.length >= 2) {
      yesPrice = market.tokens[0].price;
      noPrice = market.tokens[1].price;
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Top row: image + question */}
      <div className="flex gap-4 mb-6">
        {market.image && (
          <Image
            src={market.image}
            alt=""
            width={80}
            height={80}
            className="rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mb-2">
            {market.question}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {market.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {market.category}
              </span>
            )}
            {market.endDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Ends {formatDate(market.endDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green/10 border border-green/30 rounded-lg p-4 text-center">
          <div className="text-green font-bold text-2xl font-mono">
            {formatPercent(yesPrice)}
          </div>
          <div className="text-sm text-foreground mt-1 font-medium">YES</div>
        </div>
        <div className="bg-red/10 border border-red/30 rounded-lg p-4 text-center">
          <div className="text-red font-bold text-2xl font-mono">
            {formatPercent(noPrice)}
          </div>
          <div className="text-sm text-foreground mt-1 font-medium">NO</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
        <div>
          <span className="text-muted">Volume</span>{' '}
          <span className="font-mono font-medium">{formatUsd(market.volume)}</span>
        </div>
        <div>
          <span className="text-muted">24h</span>{' '}
          <span className="font-mono font-medium">{formatUsd(market.volume24hr)}</span>
        </div>
        <div>
          <span className="text-muted">Liquidity</span>{' '}
          <span className="font-mono font-medium">{formatUsd(market.liquidity)}</span>
        </div>
        {market.closed && (
          <span className="text-xs bg-red/10 text-red px-2 py-0.5 rounded-full font-medium">
            Closed
          </span>
        )}
        {market.active && !market.closed && (
          <span className="text-xs bg-green/10 text-green px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        )}
      </div>

      {/* Description */}
      {market.description && (
        <p className="text-sm text-muted leading-relaxed mb-6 line-clamp-3">
          {market.description}
        </p>
      )}

      {/* Replay link */}
      <Link
        href={`/replay/${market.slug}`}
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        <Play className="w-4 h-4" />
        Replay this Market
      </Link>
    </div>
  );
}
