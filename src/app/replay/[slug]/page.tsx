import { getMarketBySlug } from '@/lib/polymarket';
import { notFound } from 'next/navigation';
import { ReplayView } from './ReplayView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);
  return {
    title: market ? `Replay: ${market.question}` : 'Market Replay',
  };
}

export default async function ReplayPage({ params }: PageProps) {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);

  if (!market) notFound();

  // Parse YES token ID from clobTokenIds
  let yesTokenId = '';
  try {
    const tokenIds: string[] = JSON.parse(market.clobTokenIds);
    yesTokenId = tokenIds[0] || '';
  } catch {
    // fallback: try tokens array
    yesTokenId = market.tokens?.[0]?.token_id || '';
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Market header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <span>{market.category}</span>
          <span className="text-border">|</span>
          <span>{market.active ? 'Active' : market.closed ? 'Resolved' : 'Inactive'}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold leading-tight">
          {market.question}
        </h1>
      </div>

      <ReplayView
        slug={slug}
        conditionId={market.conditionId}
        yesTokenId={yesTokenId}
        outcomes={market.outcomes}
      />
    </div>
  );
}
