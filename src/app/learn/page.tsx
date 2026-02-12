import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  BookOpen,
  Coins,
  BarChart3,
  Layers,
  TrendingUp,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";

export const metadata = {
  title: "How Polymarket Works | Poly Replay",
  description:
    "Learn how prediction markets work — conditional tokens, orderbooks, minting, price discovery, and settlement explained.",
};

function SectionCard({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="bg-card border border-border rounded-xl p-6 md:p-8"
    >
      {children}
    </section>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
        {icon}
      </div>
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
    </div>
  );
}

function DiagramBox({
  label,
  sublabel,
  color = "border-border",
  bg = "bg-[#1a1a1a]",
}: {
  label: string;
  sublabel?: string;
  color?: string;
  bg?: string;
}) {
  return (
    <div
      className={`${bg} ${color} border rounded-lg px-4 py-3 text-center min-w-[80px]`}
    >
      <div className="font-semibold text-sm">{label}</div>
      {sublabel && <div className="text-xs text-muted mt-0.5">{sublabel}</div>}
    </div>
  );
}

function ArrowDivider({ direction = "right" }: { direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center py-2 text-muted">
        <ArrowDown className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="flex items-center px-2 text-muted">
      <ArrowRight className="w-5 h-5" />
    </div>
  );
}

export default function LearnPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12 md:py-16">
        <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 bg-accent/10 px-3 py-1.5 rounded-full">
          <BookOpen className="w-4 h-4" />
          Educational Guide
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          How Polymarket Works
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
          A clear guide to prediction markets — how shares are created, traded,
          priced, and settled.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. What are Prediction Markets? */}
        <SectionCard id="what">
          <SectionHeading
            icon={<BarChart3 className="w-5 h-5" />}
            title="What are Prediction Markets?"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              A prediction market lets you buy and sell shares based on the
              outcome of real-world events. If you think an event will happen,
              you buy <strong className="text-foreground">YES</strong> shares.
              If you think it won&apos;t, you buy{" "}
              <strong className="text-foreground">NO</strong> shares.
            </p>
            <p>
              Share prices range from{" "}
              <strong className="text-foreground">$0.00</strong> to{" "}
              <strong className="text-foreground">$1.00</strong>. The price
              reflects the crowd&apos;s estimated probability. A YES share
              trading at $0.70 means the market thinks there&apos;s roughly a
              70% chance the event happens.
            </p>
            <p>
              When the event resolves, winning shares pay out{" "}
              <strong className="text-foreground">$1.00</strong> each, and
              losing shares become worthless. The difference between what you
              paid and the payout is your profit.
            </p>
          </div>

          {/* Diagram: example market */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5">
            <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">
              Example: &quot;Will it rain tomorrow?&quot;
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green/10 border border-green/30 rounded-lg p-4 text-center">
                <div className="text-green font-bold text-2xl">$0.70</div>
                <div className="text-sm text-foreground mt-1 font-medium">YES share</div>
                <div className="text-xs text-muted mt-1">
                  Pays $1 if it rains
                </div>
              </div>
              <div className="bg-red/10 border border-red/30 rounded-lg p-4 text-center">
                <div className="text-red font-bold text-2xl">$0.30</div>
                <div className="text-sm text-foreground mt-1 font-medium">NO share</div>
                <div className="text-xs text-muted mt-1">
                  Pays $1 if it doesn&apos;t
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-muted mt-3">
              YES + NO always equals $1.00
            </div>
          </div>
        </SectionCard>

        {/* 2. Conditional Tokens */}
        <SectionCard id="tokens">
          <SectionHeading
            icon={<Coins className="w-5 h-5" />}
            title="Conditional Tokens"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Polymarket uses{" "}
              <strong className="text-foreground">conditional tokens</strong>{" "}
              built on the blockchain. For every market, there are exactly two
              token types: YES and NO. These tokens are backed by{" "}
              <strong className="text-foreground">USDC</strong>, a stablecoin
              pegged to the US dollar.
            </p>
            <p>
              The key rule: one YES token and one NO token can always be
              combined (merged) back into exactly{" "}
              <strong className="text-foreground">$1.00 USDC</strong>. And
              conversely, $1.00 USDC can always be split into one YES token
              plus one NO token. This guarantees the prices stay anchored.
            </p>
            <p>
              You don&apos;t need to worry about the blockchain details — the
              platform handles it. But understanding the split/merge mechanism
              is key to grasping how the market stays efficient.
            </p>
          </div>

          {/* Diagram: split and merge */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5 space-y-6">
            {/* Split */}
            <div>
              <div className="text-xs text-muted uppercase tracking-wider mb-3 font-medium">
                Split: USDC to tokens
              </div>
              <div className="flex flex-col items-center gap-0">
                <DiagramBox
                  label="$1.00 USDC"
                  color="border-accent/40"
                  bg="bg-accent/10"
                />
                <ArrowDivider direction="down" />
                <div className="flex items-center gap-3">
                  <DiagramBox
                    label="1 YES"
                    color="border-green/40"
                    bg="bg-green/10"
                  />
                  <span className="text-muted font-bold">+</span>
                  <DiagramBox
                    label="1 NO"
                    color="border-red/40"
                    bg="bg-red/10"
                  />
                </div>
              </div>
            </div>

            {/* Merge */}
            <div className="border-t border-border pt-5">
              <div className="text-xs text-muted uppercase tracking-wider mb-3 font-medium">
                Merge: Tokens back to USDC
              </div>
              <div className="flex flex-col items-center gap-0">
                <div className="flex items-center gap-3">
                  <DiagramBox
                    label="1 YES"
                    color="border-green/40"
                    bg="bg-green/10"
                  />
                  <span className="text-muted font-bold">+</span>
                  <DiagramBox
                    label="1 NO"
                    color="border-red/40"
                    bg="bg-red/10"
                  />
                </div>
                <ArrowDivider direction="down" />
                <DiagramBox
                  label="$1.00 USDC"
                  color="border-accent/40"
                  bg="bg-accent/10"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 3. The Orderbook */}
        <SectionCard id="orderbook">
          <SectionHeading
            icon={<ArrowLeftRight className="w-5 h-5" />}
            title="The Orderbook"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Like a stock exchange, Polymarket uses an{" "}
              <strong className="text-foreground">orderbook</strong> to match
              buyers and sellers. Traders place orders at prices they&apos;re
              willing to trade, and the system matches compatible orders
              together.
            </p>
            <p>
              The <strong className="text-foreground">bid</strong> is the
              highest price someone is willing to pay. The{" "}
              <strong className="text-foreground">ask</strong> is the lowest
              price someone is willing to sell at. The gap between them is the{" "}
              <strong className="text-foreground">spread</strong>. A tight
              spread means high liquidity — it&apos;s easy to trade at a fair
              price.
            </p>
            <p>
              When you place a market order, it fills against existing limit
              orders in the book. When you place a limit order, it sits in the
              book until someone takes the other side.
            </p>
          </div>

          {/* Diagram: orderbook */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5">
            <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">
              YES share orderbook
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Bids */}
              <div>
                <div className="text-green text-xs font-medium mb-2 uppercase tracking-wider">
                  Bids (buy orders)
                </div>
                <div className="space-y-1.5">
                  {[
                    { price: "$0.68", size: "500" },
                    { price: "$0.67", size: "1,200" },
                    { price: "$0.65", size: "800" },
                    { price: "$0.63", size: "2,000" },
                  ].map((row) => (
                    <div
                      key={row.price}
                      className="flex justify-between items-center bg-green/5 border border-green/10 rounded px-3 py-1.5"
                    >
                      <span className="text-green font-mono">{row.price}</span>
                      <span className="text-muted font-mono text-xs">
                        {row.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Asks */}
              <div>
                <div className="text-red text-xs font-medium mb-2 uppercase tracking-wider">
                  Asks (sell orders)
                </div>
                <div className="space-y-1.5">
                  {[
                    { price: "$0.70", size: "300" },
                    { price: "$0.72", size: "900" },
                    { price: "$0.75", size: "1,500" },
                    { price: "$0.78", size: "600" },
                  ].map((row) => (
                    <div
                      key={row.price}
                      className="flex justify-between items-center bg-red/5 border border-red/10 rounded px-3 py-1.5"
                    >
                      <span className="text-red font-mono">{row.price}</span>
                      <span className="text-muted font-mono text-xs">
                        {row.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border text-xs">
              <span className="text-muted">
                Bid: <span className="text-green font-mono">$0.68</span>
              </span>
              <span className="text-muted">
                Ask: <span className="text-red font-mono">$0.70</span>
              </span>
              <span className="text-muted">
                Spread: <span className="text-foreground font-mono">$0.02</span>
              </span>
            </div>
          </div>
        </SectionCard>

        {/* 4. Share Creation (Minting) */}
        <SectionCard id="minting">
          <SectionHeading
            icon={<Layers className="w-5 h-5" />}
            title="Share Creation (Minting)"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              What happens when someone wants to buy YES shares but there are
              no sellers? This is where{" "}
              <strong className="text-foreground">minting</strong> comes in.
              Instead of needing a direct counterparty, the system can create
              new shares by splitting USDC.
            </p>
            <p>
              Here&apos;s how it works: $1.00 USDC gets split into 1 YES token
              + 1 NO token. The buyer keeps the YES token and the NO token gets
              offered to the market. If someone else wants to buy NO shares,
              the same process happens in reverse — the buyer keeps NO, and YES
              goes to market.
            </p>
            <p>
              This mechanism means there&apos;s always a way to enter a
              position, even in a brand-new market with no existing shares. It
              also keeps YES and NO prices tethered to $1.00 total, preventing
              arbitrage opportunities.
            </p>
          </div>

          {/* Diagram: minting flow */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5">
            <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">
              Minting: A buyer wants YES at $0.70
            </div>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground font-medium">
                    Buyer puts up $0.70
                  </div>
                  <div className="text-xs text-muted">
                    Wants 1 YES share at $0.70
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground font-medium">
                    A NO buyer puts up $0.30
                  </div>
                  <div className="text-xs text-muted">
                    Wants 1 NO share at $0.30
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground font-medium">
                    $0.70 + $0.30 = $1.00 USDC gets split
                  </div>
                  <div className="text-xs text-muted">
                    Creates 1 YES + 1 NO token
                  </div>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green/20 text-green text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground font-medium">
                    Each buyer gets their side
                  </div>
                  <div className="text-xs text-muted">
                    YES buyer gets YES token, NO buyer gets NO token
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="border-t border-border pt-4 mt-2">
                <div className="flex flex-col items-center gap-0">
                  <div className="flex items-center gap-3">
                    <DiagramBox
                      label="$0.70"
                      sublabel="YES buyer"
                      color="border-green/40"
                      bg="bg-green/10"
                    />
                    <span className="text-muted font-bold">+</span>
                    <DiagramBox
                      label="$0.30"
                      sublabel="NO buyer"
                      color="border-red/40"
                      bg="bg-red/10"
                    />
                  </div>
                  <ArrowDivider direction="down" />
                  <DiagramBox
                    label="$1.00 USDC"
                    sublabel="combined"
                    color="border-accent/40"
                    bg="bg-accent/10"
                  />
                  <ArrowDivider direction="down" />
                  <div className="flex items-center gap-3">
                    <DiagramBox
                      label="1 YES"
                      sublabel="to buyer"
                      color="border-green/40"
                      bg="bg-green/10"
                    />
                    <span className="text-muted font-bold">+</span>
                    <DiagramBox
                      label="1 NO"
                      sublabel="to buyer"
                      color="border-red/40"
                      bg="bg-red/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 5. Price Discovery */}
        <SectionCard id="price-discovery">
          <SectionHeading
            icon={<TrendingUp className="w-5 h-5" />}
            title="Price Discovery"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              As traders buy and sell based on their beliefs, the market price
              adjusts to reflect the{" "}
              <strong className="text-foreground">collective estimate</strong>{" "}
              of the probability. If new information makes an outcome more
              likely, traders rush to buy YES shares, pushing the price up.
            </p>
            <p>
              This process is called{" "}
              <strong className="text-foreground">price discovery</strong>.
              Prediction markets are powerful because they incentivize people to
              put money behind their beliefs. Unlike polls or expert opinions,
              markets reward accuracy — those with better information profit,
              and those who are wrong lose money.
            </p>
            <p>
              Over time, the price converges toward the &quot;true&quot;
              probability as informed traders correct mispricings. Studies have
              shown prediction markets often outperform traditional forecasting
              methods.
            </p>
          </div>

          {/* Diagram: price movement */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5">
            <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">
              How news moves prices
            </div>
            <div className="space-y-3">
              {[
                {
                  time: "9:00 AM",
                  event: "Market opens",
                  price: 50,
                  label: "$0.50",
                },
                {
                  time: "10:30 AM",
                  event: "Positive poll released",
                  price: 65,
                  label: "$0.65",
                },
                {
                  time: "2:00 PM",
                  event: "Insider leak hints otherwise",
                  price: 55,
                  label: "$0.55",
                },
                {
                  time: "5:00 PM",
                  event: "Official report confirms outcome",
                  price: 92,
                  label: "$0.92",
                },
              ].map((row) => (
                <div key={row.time} className="flex items-center gap-3">
                  <div className="text-xs text-muted font-mono w-16 shrink-0">
                    {row.time}
                  </div>
                  <div className="flex-1">
                    <div className="relative h-7 bg-[#1a1a1a] rounded overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-accent/20 border-r-2 border-accent rounded-l transition-all"
                        style={{ width: `${row.price}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs text-foreground font-mono">
                          {row.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted w-44 shrink-0 hidden md:block">
                    {row.event}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted md:hidden space-y-1">
              <div>9:00 AM — Market opens</div>
              <div>10:30 AM — Positive poll released</div>
              <div>2:00 PM — Insider leak hints otherwise</div>
              <div>5:00 PM — Official report confirms outcome</div>
            </div>
          </div>
        </SectionCard>

        {/* 6. Settlement */}
        <SectionCard id="settlement">
          <SectionHeading
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Settlement"
          />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              When the event occurs (or the deadline passes), the market is{" "}
              <strong className="text-foreground">resolved</strong>. An oracle
              or resolution source determines the outcome, and the market
              settles.
            </p>
            <p>
              If the outcome is YES, every YES share pays out{" "}
              <strong className="text-foreground">$1.00 USDC</strong> and every
              NO share becomes{" "}
              <strong className="text-foreground">worthless ($0.00)</strong>.
              Vice versa if the outcome is NO. Your profit is the payout minus
              what you paid for the shares.
            </p>
            <p>
              For example, if you bought YES at $0.30 and the market resolves
              YES, you profit $0.70 per share — a{" "}
              <strong className="text-foreground">233% return</strong>. This is
              what makes prediction markets exciting: the earlier you&apos;re
              right, the more you can make.
            </p>
          </div>

          {/* Diagram: settlement outcomes */}
          <div className="mt-6 bg-[#0e0e0e] border border-border rounded-lg p-5">
            <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">
              Settlement outcomes
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resolves YES */}
              <div className="border border-green/30 rounded-lg p-4">
                <div className="text-green font-bold text-sm mb-3">
                  Market resolves YES
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">YES shares</span>
                    <span className="text-green font-mono font-medium">
                      pay $1.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">NO shares</span>
                    <span className="text-red font-mono font-medium">
                      worth $0.00
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="text-xs text-muted">
                      Bought YES at $0.30
                    </div>
                    <div className="text-green font-mono font-bold">
                      Profit: +$0.70 per share
                    </div>
                  </div>
                </div>
              </div>
              {/* Resolves NO */}
              <div className="border border-red/30 rounded-lg p-4">
                <div className="text-red font-bold text-sm mb-3">
                  Market resolves NO
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">YES shares</span>
                    <span className="text-red font-mono font-medium">
                      worth $0.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">NO shares</span>
                    <span className="text-green font-mono font-medium">
                      pay $1.00
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="text-xs text-muted">
                      Bought NO at $0.30
                    </div>
                    <div className="text-green font-mono font-bold">
                      Profit: +$0.70 per share
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* CTA */}
        <div className="text-center py-10">
          <p className="text-muted mb-4">
            Ready to see these mechanics in action?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse Markets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
