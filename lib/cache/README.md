# Redis Caching Implementation

## Overview

This application uses Redis for server-side caching to improve performance and reduce API calls to external services like Birdeye.

## Setup

### 1. Environment Variable

Add your Redis URL to `.env.local`:

```env
REDIS_URL=redis://localhost:6379
# Or for Redis Cloud/Upstash:
# REDIS_URL=rediss://default:password@your-redis-host:6379
```

### 2. Local Development (Optional)

Run Redis locally with Docker:

```bash
docker run -d --name redis -p 6379:6379 redis:latest
```

Or install Redis:

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

## Usage

### Basic Cache Operations

```typescript
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

// Get from cache
const data = await redis.get<YourType>(cacheKeys.search("bitcoin"));

// Set in cache
await redis.set(cacheKeys.tokenDetail("address"), tokenData, CACHE_TTL.TOKEN_DETAIL);

// Delete from cache
await redis.del(cacheKeys.search("bitcoin"));

// Delete pattern (clear all searches)
await redis.delPattern("search:*");
```

### Cache Keys

Predefined cache key generators:

- `cacheKeys.search(keyword)` - Search results
- `cacheKeys.marketData(limit, offset)` - Market data listings
- `cacheKeys.tokenDetail(address)` - Token details
- `cacheKeys.priceHistory(address, days)` - Price history charts
- `cacheKeys.trending(limit)` - Trending tokens
- `cacheKeys.globalStats()` - Global market stats

### TTL (Time To Live)

Default cache durations:

- `CACHE_TTL.SEARCH` - 60 seconds
- `CACHE_TTL.MARKET_DATA` - 120 seconds
- `CACHE_TTL.TOKEN_DETAIL` - 120 seconds
- `CACHE_TTL.PRICE_HISTORY` - 300 seconds (5 minutes)
- `CACHE_TTL.TRENDING` - 180 seconds (3 minutes)
- `CACHE_TTL.GLOBAL_STATS` - 300 seconds (5 minutes)

## Architecture

### Singleton Pattern

The Redis client uses a singleton pattern to maintain a single connection pool:

```typescript
const redis = RedisClient.getInstance();
```

### Connection Management

- Automatic reconnection with exponential backoff
- Connection pooling via ioredis
- Graceful error handling
- Health checks via ping

### Cache Strategy

1. **Check Redis** - Try to get data from cache
2. **On Cache Hit** - Return cached data immediately
3. **On Cache Miss** - Fetch from external API
4. **Store Result** - Cache the result for future requests

## Monitoring

Check cache effectiveness via response headers:

- `X-Cache: HIT` - Data served from Redis
- `X-Cache: MISS` - Data fetched from external API

## Best Practices

### ✅ DO

- Use appropriate TTL for each data type
- Always handle cache errors gracefully
- Normalize keys (lowercase, trim)
- Use typed data with generics
- Monitor cache hit/miss ratios

### ❌ DON'T

- Store sensitive data without encryption
- Use overly long TTL for volatile data
- Cache user-specific authenticated data
- Forget to handle cache failures
- Use cache for critical real-time data

## Error Handling

The Redis client handles errors gracefully:

```typescript
// If Redis fails, operations return null/false
const data = await redis.get("key"); // Returns null on error
const success = await redis.set("key", value); // Returns false on error
```

This ensures your app continues working even if Redis is unavailable.

## Cache Invalidation

### Manual Invalidation

```typescript
// Clear specific search
await redis.del(cacheKeys.search("bitcoin"));

// Clear all searches
await redis.delPattern("search:*");

// Clear everything (use with caution)
await redis.flushAll();
```

### Automatic Invalidation

Cache entries automatically expire based on their TTL.

## Performance

**Benefits:**

- Reduces API calls by ~80-90% for popular searches
- Response time: <10ms (cache hit) vs 200-500ms (API call)
- Lower costs for metered APIs
- Better rate limit compliance

## Production Deployment

### Recommended Redis Providers

- **Upstash** - Serverless Redis with per-request pricing
- **Redis Cloud** - Managed Redis with free tier
- **AWS ElastiCache** - For AWS deployments
- **Vercel KV** - Built-in Redis for Vercel

### Environment Setup

```env
# Production
REDIS_URL=rediss://default:password@production-redis.com:6379

# Staging
REDIS_URL=rediss://default:password@staging-redis.com:6379
```

## Troubleshooting

### Connection Issues

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Check Redis info
redis-cli info
```

### Debug Logging

The client logs connection events to console:

- "Redis Client Connected"
- "Redis Client Ready"
- "Redis Client Error"

### Clear Cache

If data seems stale:

```bash
# Clear all cache
redis-cli FLUSHALL

# Or target specific pattern
redis-cli KEYS "search:*" | xargs redis-cli DEL
```

## Migration from Next.js Cache

Previous Next.js `revalidate` has been replaced with Redis:

```typescript
// Before (Next.js cache)
fetch(url, { next: { revalidate: 60 } });

// After (Redis cache)
const cached = await redis.get(key);
if (!cached) {
  const data = await fetch(url);
  await redis.set(key, data, 60);
}
```

## Metrics

Monitor these metrics in production:

- Cache hit rate (target: >80%)
- Average response time
- Redis memory usage
- Connection pool statistics
- Error rate
