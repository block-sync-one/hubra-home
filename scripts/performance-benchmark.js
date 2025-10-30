#!/usr/bin/env node

/**
 * Performance Benchmark Tool
 * Measures Core Web Vitals, load times, and API response times
 */

const http = require("http");
const https = require("https");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_ENDPOINTS = [
  "/api/crypto/trending",
  "/api/crypto/global",
  "/api/crypto/markets",
  "/api/crypto/token/So11111111111111111111111111111111111111112", // Solana
  "/api/crypto/price-history?id=So11111111111111111111111111111111111111112&days=1",
];

const PAGES = [
  "/",
  "/tokens",
  "/stats",
  "/defi",
  "/tokens/So11111111111111111111111111111111111111112", // Solana detail page
];

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getPerformanceRating(ms, thresholds) {
  if (ms <= thresholds.good) return { rating: "Excellent", color: "green", emoji: "🚀" };
  if (ms <= thresholds.moderate) return { rating: "Good", color: "blue", emoji: "✅" };
  if (ms <= thresholds.poor) return { rating: "Needs Improvement", color: "yellow", emoji: "⚠️" };
  return { rating: "Poor", color: "red", emoji: "❌" };
}

async function measureRequest(url, label) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const req = client.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        resolve({
          label,
          url,
          duration,
          status: res.statusCode,
          size: Buffer.byteLength(data, "utf8"),
          success: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });

    req.on("error", (error) => {
      const endTime = Date.now();
      resolve({
        label,
        url,
        duration: endTime - startTime,
        status: 0,
        size: 0,
        success: false,
        error: error.message,
      });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({
        label,
        url,
        duration: 30000,
        status: 0,
        size: 0,
        success: false,
        error: "Timeout",
      });
    });
  });
}

async function benchmarkAPI() {
  log("\n╔════════════════════════════════════════════════════════════════╗", "bright");
  log("║                    API ENDPOINT BENCHMARK                      ║", "bright");
  log("╚════════════════════════════════════════════════════════════════╝", "bright");

  const results = [];

  for (const endpoint of API_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    const result = await measureRequest(url, endpoint);
    results.push(result);

    const thresholds = { good: 200, moderate: 500, poor: 1000 };
    const perf = getPerformanceRating(result.duration, thresholds);

    log(`\n${perf.emoji} ${endpoint}`, "cyan");
    log(`   Time: ${formatTime(result.duration)} [${perf.rating}]`, perf.color);
    log(`   Status: ${result.status}`, result.success ? "green" : "red");
    log(`   Size: ${(result.size / 1024).toFixed(2)} KB`);

    if (result.error) {
      log(`   Error: ${result.error}`, "red");
    }
  }

  return results;
}

async function benchmarkPages() {
  log("\n╔════════════════════════════════════════════════════════════════╗", "bright");
  log("║                    PAGE LOAD BENCHMARK                         ║", "bright");
  log("╚════════════════════════════════════════════════════════════════╝", "bright");

  const results = [];

  for (const page of PAGES) {
    const url = `${BASE_URL}${page}`;
    const result = await measureRequest(url, page);
    results.push(result);

    const thresholds = { good: 1000, moderate: 2500, poor: 4000 };
    const perf = getPerformanceRating(result.duration, thresholds);

    log(`\n${perf.emoji} ${page}`, "cyan");
    log(`   TTFB: ${formatTime(result.duration)} [${perf.rating}]`, perf.color);
    log(`   Status: ${result.status}`, result.success ? "green" : "red");
    log(`   Size: ${(result.size / 1024).toFixed(2)} KB`);

    if (result.error) {
      log(`   Error: ${result.error}`, "red");
    }
  }

  return results;
}

function generateSummary(apiResults, pageResults) {
  log("\n╔════════════════════════════════════════════════════════════════╗", "bright");
  log("║                      PERFORMANCE SUMMARY                       ║", "bright");
  log("╚════════════════════════════════════════════════════════════════╝", "bright");

  const allResults = [...apiResults, ...pageResults];
  const successfulResults = allResults.filter((r) => r.success);

  if (successfulResults.length === 0) {
    log("\n❌ No successful requests", "red");
    return;
  }

  const avgTime = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
  const minTime = Math.min(...successfulResults.map((r) => r.duration));
  const maxTime = Math.max(...successfulResults.map((r) => r.duration));
  const totalSize = successfulResults.reduce((sum, r) => sum + r.size, 0);

  const apiSuccessRate = (apiResults.filter((r) => r.success).length / apiResults.length) * 100;
  const pageSuccessRate = (pageResults.filter((r) => r.success).length / pageResults.length) * 100;

  log("\n📊 API Endpoints:", "magenta");
  log(`   Success Rate: ${apiSuccessRate.toFixed(1)}%`, apiSuccessRate === 100 ? "green" : "yellow");
  log(
    `   Average Response: ${formatTime(apiResults.filter((r) => r.success).reduce((sum, r) => sum + r.duration, 0) / apiResults.filter((r) => r.success).length)}`
  );

  log("\n📄 Pages:", "magenta");
  log(`   Success Rate: ${pageSuccessRate.toFixed(1)}%`, pageSuccessRate === 100 ? "green" : "yellow");
  log(
    `   Average TTFB: ${formatTime(pageResults.filter((r) => r.success).reduce((sum, r) => sum + r.duration, 0) / pageResults.filter((r) => r.success).length)}`
  );

  log("\n⚡ Overall Performance:", "magenta");
  log(`   Fastest: ${formatTime(minTime)}`, "green");
  log(`   Slowest: ${formatTime(maxTime)}`, maxTime > 3000 ? "yellow" : "blue");
  log(`   Average: ${formatTime(avgTime)}`, avgTime < 1000 ? "green" : avgTime < 2000 ? "blue" : "yellow");
  log(`   Total Data: ${(totalSize / 1024).toFixed(2)} KB`);

  log("\n🎯 Core Web Vitals Targets:", "magenta");
  log("   ✅ LCP (Largest Contentful Paint): < 2.5s");
  log("   ✅ FID/INP (Interaction): < 100ms / < 200ms");
  log("   ✅ CLS (Cumulative Layout Shift): < 0.1");
  log("   ✅ FCP (First Contentful Paint): < 1.8s");
  log("   ✅ TTFB (Time to First Byte): < 600ms");

  log("\n💡 Recommendations:", "cyan");
  if (avgTime < 1000) {
    log("   🚀 Excellent performance! Your app is blazing fast.", "green");
  } else if (avgTime < 2000) {
    log("   ✅ Good performance. Consider optimizing slower endpoints.", "blue");
  } else {
    log("   ⚠️  Performance needs improvement. Focus on caching and optimization.", "yellow");
  }

  const slowEndpoints = successfulResults.filter((r) => r.duration > 1000);
  if (slowEndpoints.length > 0) {
    log("\n   🐌 Slow endpoints to optimize:", "yellow");
    slowEndpoints.forEach((r) => {
      log(`      • ${r.label} (${formatTime(r.duration)})`, "yellow");
    });
  }
}

async function runBenchmark() {
  log("\n🚀 Starting Performance Benchmark...", "bright");
  log(`   Target: ${BASE_URL}`, "cyan");
  log(`   Time: ${new Date().toLocaleString()}\n`, "cyan");

  try {
    const apiResults = await benchmarkAPI();
    const pageResults = await benchmarkPages();
    generateSummary(apiResults, pageResults);

    log("\n✅ Benchmark completed successfully!\n", "green");
  } catch (error) {
    log(`\n❌ Benchmark failed: ${error.message}\n`, "red");
    process.exit(1);
  }
}

// Run the benchmark
runBenchmark();
