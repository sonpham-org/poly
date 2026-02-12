// Polymarket Gamma API types
export interface GammaMarket {
  id: string;
  question: string;
  slug: string;
  conditionId: string;
  description: string;
  outcomes: string[];
  outcomePrices: string;
  volume: number;
  volume24hr: number;
  liquidity: number;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  resolvedBy: string;
  category: string;
  tags: { label: string; slug: string }[];
  clobTokenIds: string;
  tokens: GammaToken[];
}

export interface GammaToken {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

// CLOB API types
export interface OrderbookEntry {
  price: string;
  size: string;
}

export interface Orderbook {
  market: string;
  asset_id: string;
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  hash: string;
  timestamp: string;
}

export interface PricePoint {
  t: number; // timestamp in seconds
  p: number; // price
}

// Data API types
export interface PolyTrade {
  proxyWallet: string;
  side: 'BUY' | 'SELL';
  asset: string;
  conditionId: string;
  size: number;
  price: number;
  timestamp: number; // epoch seconds
  title: string;
  slug: string;
  outcome: string;
  outcomeIndex: number;
  transactionHash: string;
  pseudonym: string;
  // Older API format (for backwards compat)
  match_time?: string;
  owner?: string;
  maker_address?: string;
  transaction_hash?: string;
  type?: string;
}

// Internal types
export interface MarketCardData {
  slug: string;
  question: string;
  image: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  volume24hr: number;
  category: string;
  active: boolean;
  closed: boolean;
}

export interface ReplayTrade {
  id: number;
  side: 'BUY' | 'SELL';
  outcome: string;
  price: number;
  size: number;
  usdcAmount: number;
  timestamp: Date;
  maker: string | null;
  taker: string | null;
  transactionHash: string | null;
  isMint: boolean;
  priceImpact?: number;
}

export interface SnapshotData {
  timestamp: Date;
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
  spread: number;
  midpoint: number;
}
