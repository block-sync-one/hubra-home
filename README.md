# Hubra - Solana Token Analytics

Real-time cryptocurrency analytics platform built with Next.js 15.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-red)](https://upstash.com/)

## Features

- Real-time token prices & market data
- Interactive charts with multiple timeframes
- Multi-layer caching (Redis + Browser)
- Mobile-first responsive design
- SEO optimized (SSR)
- Instant navigation with prefetch

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + HeroUI
- Redis (Upstash) for caching
- Birdeye API (data source)

## Quick Start

### Prerequisites
- Node.js 18.17+
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```bash
BIRDEYE_API_KEY=your_key
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_SITE_URL=https://hubra.app
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run format       # Format with Prettier
```

## Project Structure

```
app/                 # Next.js pages & API routes
components/          # React components
lib/                 # Utilities, hooks, data fetching
public/              # Static assets
styles/              # Global styles
```

## Performance

- LCP: ~1.5s (Target: <2.5s)
- FCP: ~1.2s (Target: <1.8s)
- Cache Hit Rate: ~92%

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hubra-home)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## License

MIT
