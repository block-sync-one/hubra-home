# Market Data Architecture

## Overview

This module provides efficient, scalable, and type-safe data fetching for Solana token market data using the Birdeye API.

## Key Files

### `market-data.ts`
Core module for fetching market data with Redis caching and batch processing.

**Features:**
- ✅ Redis caching with customizable keys
- ✅ Automatic spam token filtering (< $10k market cap)
- ✅ Batch API requests for large datasets (> 100 tokens)
- ✅ Async individual token caching for detail pages
- ✅ Server-side stats calculation (market cap, volume, FDV)
- ✅ Configurable query parameters

**Usage:**
```typescript
// Fetch default market data
const result = await fetchMarketData(100, 0);

// Fetch with custom params
const result = await fetchMarketData(
  100, 
  0, 
  { sort_by: "volume_24h_usd", sort_type: "desc" }
);

// Fetch with custom cache key
const result = await fetchMarketData(
  100, 
  0, 
  customParams,
  "my-custom-key"
);
```

### `newly-listed-tokens.ts`
Dedicated service for fetching newly listed tokens.

**Features:**
- ✅ Time-window based filtering (default: 24 hours)
- ✅ Volume-based sorting
- ✅ Dedicated cache keys
- ✅ Error handling with fallback

**Usage:**
```typescript
// Fetch tokens listed in last 24 hours
const result = await fetchNewlyListedTokens(400, 0, 24);

// Fetch tokens listed in last 12 hours
const result = await fetchNewlyListedTokens(400, 0, 12);
```

## Constants (`/lib/constants/market.ts`)

### Token Limits
```typescript
TOKEN_LIMITS = {
  DEFAULT: 100,
  TOKENS_PAGE: 400,
  HOT_TOKENS: 4,
  SEARCH_MAX: 50,
}
```

### Time Windows
```typescript
TIME_WINDOWS = {
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_MONTH: 2592000,
}
```

### Market Cap Filters
```typescript
MARKET_CAP_FILTERS = {
  MIN_VIABLE: 10_000,     // $10k - filters spam
  SMALL_CAP: 100_000,     // $100k
  MID_CAP: 1_000_000,     // $1M
  LARGE_CAP: 100_000_000, // $100M
}
```

### Query Presets
```typescript
BIRDEYE_QUERY_PRESETS = {
  DEFAULT: { sort_by: "holder", ... },
  NEWLY_LISTED: { sort_by: "volume_24h_usd", ... },
  HIGH_VOLUME: { sort_by: "volume_24h_usd", min_volume: "1000", ... },
  TOP_GAINERS: { sort_by: "price_change_24h_percent", sort_type: "desc" },
  TOP_LOSERS: { sort_by: "price_change_24h_percent", sort_type: "asc" },
}
```

## Performance Optimizations

### 1. **Parallel Fetching**
```typescript
const [marketData, newlyListed] = await Promise.all([
  fetchMarketData(400, 0),
  fetchNewlyListedTokens(400, 0, 24),
]);
```

### 2. **Batch API Requests**
For requests > 100 tokens, automatically splits into parallel batches of 100.

### 3. **Redis Caching**
- **Market data**: 16 minutes TTL
- **Newly listed**: 16 minutes TTL (separate key)
- **Individual tokens**: 16 minutes TTL (async caching)

### 4. **Spam Filtering**
Filters tokens with market cap < $10k to reduce noise and improve performance.

### 5. **Async Token Caching**
Individual tokens cached asynchronously in chunks of 50 to avoid blocking response.

## Scalability Considerations

### Current Architecture
- ✅ Handles 400+ token requests efficiently
- ✅ Supports custom pagination (limit/offset)
- ✅ Batch processing for large datasets
- ✅ Separate cache keys for different data types
- ✅ Async operations don't block main response

### Future Improvements
- [ ] Implement incremental loading (virtual scrolling)
- [ ] Add cursor-based pagination
- [ ] Implement weighted market cap change calculation
- [ ] Add request rate limiting
- [ ] Consider GraphQL for complex queries

## Readability Improvements

### Before
```typescript
// Magic numbers everywhere
const tokens = await fetchMarketData(400, 0);
const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

// Hardcoded query params
const params = {
  sort_by: "volume_24h_usd",
  sort_type: "desc",
  min_recent_listing_time: twentyFourHoursAgo.toString(),
};
```

### After
```typescript
// Named constants
const tokens = await fetchMarketData(TOKEN_LIMITS.TOKENS_PAGE, 0);

// Dedicated function with clear intent
const newlyListed = await fetchNewlyListedTokens(
  TOKEN_LIMITS.TOKENS_PAGE, 
  0, 
  24 // hours
);
```

## Error Handling

All data fetching functions return a safe fallback:

```typescript
{
  data: [],
  stats: {
    totalMarketCap: 0,
    totalVolume: 0,
    totalFDV: 0,
    marketCapChange: 0,
  },
}
```

Errors are logged but don't crash the application.

## Cache Key Strategy

### Standard Market Data
`market:{limit}:{offset}` → `market:400:0`

### Newly Listed
`newly-listed:{limit}:{offset}` → `newly-listed:400:0`

### Custom Queries (without explicit key)
`market:{limit}:{offset}:{JSON.stringify(params)}`

### Custom Keys
Any string you provide directly

## Best Practices

### ✅ Do
- Use named constants from `/lib/constants/market`
- Use dedicated functions (`fetchNewlyListedTokens`)
- Provide custom cache keys for predictable caching
- Leverage parallel fetching with `Promise.all`
- Filter data server-side when possible

### ❌ Don't
- Hardcode numbers (use constants)
- Fetch same data twice
- Create custom query params inline (use presets)
- Block main thread with long operations
- Ignore error cases

## Examples

### Fetching Multiple Data Types
```typescript
// Efficient parallel fetching
const [market, newlyListed, trending] = await Promise.all([
  fetchMarketData(TOKEN_LIMITS.TOKENS_PAGE, 0),
  fetchNewlyListedTokens(TOKEN_LIMITS.TOKENS_PAGE, 0, 24),
  fetchMarketData(100, 0, BIRDEYE_QUERY_PRESETS.HIGH_VOLUME, "trending-tokens"),
]);
```

### Custom Time Windows
```typescript
// Last 12 hours
const recent = await fetchNewlyListedTokens(100, 0, 12);

// Last 48 hours
const twoDay = await fetchNewlyListedTokens(100, 0, 48);
```

### Pagination
```typescript
// Page 1
const page1 = await fetchMarketData(100, 0);

// Page 2
const page2 = await fetchMarketData(100, 100);

// Page 3
const page3 = await fetchMarketData(100, 200);
```

## Monitoring & Debugging

Check logs for cache performance:
```
✓ HIT: market:400:0                    // Cache hit
✓ MISS: Fetching 400 tokens from Birdeye  // Cache miss
✓ Returning 387/400 tokens with stats     // Filtered count
✓ Cached 400 individual tokens (async)    // Async caching
```

