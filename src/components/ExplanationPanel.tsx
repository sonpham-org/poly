'use client';

import { ReplayTrade } from '@/lib/types';
import { formatPrice, formatSize, formatUsd } from '@/lib/format';
import { Info } from 'lucide-react';

interface ExplanationPanelProps {
  trade: ReplayTrade | null;
  prevTrade: ReplayTrade | null;
}

export function ExplanationPanel({ trade, prevTrade }: ExplanationPanelProps) {
  if (!trade) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">Trade Explanation</h3>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Use the replay controls above to step through trades. Select a trade to
          see a plain-language explanation of what happened.
        </p>
      </div>
    );
  }

  const isBuy = trade.side === 'BUY';
  const sharesText = `${formatSize(trade.size)} ${trade.outcome} shares`;
  const priceText = formatPrice(trade.price);
  const usdcText = formatUsd(trade.usdcAmount);

  let explanation: string;

  if (trade.isMint) {
    explanation = `New shares were created: ${usdcText} was split into ${formatSize(trade.size)} YES + ${formatSize(trade.size)} NO tokens. This is a "minting" event where USDC collateral is deposited to create new share pairs, adding liquidity to the market.`;
  } else if (isBuy) {
    explanation = `This BUY order purchased ${sharesText} at ${priceText} each, spending ${usdcText} total.`;
    if (prevTrade) {
      const prevPrice = formatPrice(prevTrade.price);
      if (trade.priceImpact && trade.priceImpact > 0) {
        explanation += ` The price moved up from ${prevPrice} to ${priceText} — this buyer's demand pushed the probability higher.`;
      } else if (trade.priceImpact && trade.priceImpact < 0) {
        explanation += ` Despite being a buy, the price dropped from ${prevPrice} to ${priceText}, likely due to other sell activity in between.`;
      } else {
        explanation += ` The price remained at ${priceText}, unchanged from the previous trade.`;
      }
    }
  } else {
    explanation = `This SELL order sold ${sharesText} at ${priceText} each, receiving ${usdcText} total.`;
    if (prevTrade) {
      const prevPrice = formatPrice(prevTrade.price);
      if (trade.priceImpact && trade.priceImpact < 0) {
        explanation += ` The price dropped from ${prevPrice} to ${priceText} — this seller's supply pushed the probability lower.`;
      } else if (trade.priceImpact && trade.priceImpact > 0) {
        explanation += ` Despite being a sell, the price rose from ${prevPrice} to ${priceText}, likely due to other buy activity in between.`;
      } else {
        explanation += ` The price remained at ${priceText}, unchanged from the previous trade.`;
      }
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold">Trade Explanation</h3>
      </div>
      <p className="text-sm text-muted leading-relaxed">{explanation}</p>
    </div>
  );
}
