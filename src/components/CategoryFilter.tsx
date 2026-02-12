'use client';

const CATEGORIES = [
  { label: 'All', slug: '' },
  { label: 'Politics', slug: 'politics' },
  { label: 'Crypto', slug: 'crypto' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Pop Culture', slug: 'pop-culture' },
  { label: 'Business', slug: 'business' },
  { label: 'Science', slug: 'science' },
];

export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm transition-colors ${
            selected === cat.slug
              ? 'bg-accent text-white'
              : 'bg-card border border-border text-muted hover:text-foreground hover:border-accent/30'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
