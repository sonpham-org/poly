# Polymarket Replay Explorer

Replay and understand how prediction markets work. Travel back in time to see how markets evolved, how trades moved prices, and how the orderbook mechanism works.

**Live at [poly.sonpham.net](https://poly.sonpham.net)**

## Features

- **Market Browser** — Search and filter active prediction markets by category
- **Live Market View** — Real-time orderbook with depth bars, recent trades feed
- **Market Replay** — Step through historical trades with price chart, play/pause controls, and plain-language explanations of each trade
- **Learn** — Educational page explaining conditional tokens, orderbooks, share creation, and settlement

## Tech Stack

- **Next.js 16** (TypeScript, Tailwind, App Router)
- **PostgreSQL** + **Prisma** for orderbook snapshots and trade caching
- **lightweight-charts** for price timeline visualization
- **Railway** for deployment

## Data Sources

All Polymarket APIs are free and require no authentication:

| API | Purpose |
|-----|---------|
| Gamma API | Market metadata, search, categories |
| CLOB API | Live orderbook, historical prices |
| Data API | Trade history |

## Development

```bash
npm install
npm run dev
```

The app works without a database — API routes fall back to fetching directly from Polymarket. To enable trade caching and orderbook snapshots:

```bash
cp .env.example .env
# Set DATABASE_URL to a PostgreSQL connection string
npx prisma db push
```

## Deploy to Railway

1. Push to GitHub
2. Create a Railway project from the repo
3. Add a PostgreSQL plugin
4. Set `DATABASE_URL` environment variable
5. Deploy — Railway auto-detects Next.js via Nixpacks
6. Add CNAME `poly` to your domain DNS pointing to the Railway domain
