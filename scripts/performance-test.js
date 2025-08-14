#!/usr/bin/env node

/**
 * Performance Test Script
 * This script analyzes the built application for performance metrics
 */

const fs = require("fs");
const path = require("path");

function analyzeBundle() {
  const buildPath = path.join(__dirname, "../.next");

  if (!fs.existsSync(buildPath)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log("🔍 Analyzing bundle performance...\n");

  // Analyze static chunks
  const staticPath = path.join(buildPath, "static/chunks");
  if (fs.existsSync(staticPath)) {
    const chunks = fs.readdirSync(staticPath);
    let totalSize = 0;

    console.log("📦 Chunk Analysis:");
    console.log("─".repeat(60));

    chunks.forEach((chunk) => {
      const chunkPath = path.join(staticPath, chunk);
      const stats = fs.statSync(chunkPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;

      let status = "✅";
      if (stats.size > 500 * 1024) {
        // > 500KB
        status = "⚠️  LARGE";
      } else if (stats.size > 1024 * 1024) {
        // > 1MB
        status = "❌ TOO LARGE";
      }

      console.log(`${status} ${chunk.padEnd(40)} ${sizeKB.padStart(8)} KB`);
    });

    console.log("─".repeat(60));
    console.log(
      `📊 Total Bundle Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`
    );

    // Performance recommendations
    console.log("💡 Performance Recommendations:");
    if (totalSize > 2 * 1024 * 1024) {
      // > 2MB
      console.log("⚠️  Bundle size is large. Consider:");
      console.log("   - More aggressive code splitting");
      console.log("   - Remove unused dependencies");
      console.log("   - Use dynamic imports");
    } else if (totalSize > 1 * 1024 * 1024) {
      // > 1MB
      console.log("✨ Bundle size is acceptable but can be optimized");
    } else {
      console.log("✅ Excellent bundle size!");
    }
  }

  // Check for performance assets
  const performanceChecks = {
    "Service Worker": path.join(buildPath, "sw.js"),
    Manifest: path.join(__dirname, "../public/manifest.webmanifest"),
    "Performance Monitor": path.join(
      __dirname,
      "../src/components/PerformanceMonitor.tsx"
    ),
    "Data Prefetcher": path.join(
      __dirname,
      "../src/components/DataPrefetcher.tsx"
    ),
    "React Query Config": path.join(__dirname, "../src/lib/react-query.ts"),
  };

  console.log("\n🔧 Performance Features:");
  console.log("─".repeat(50));

  Object.entries(performanceChecks).forEach(([feature, filePath]) => {
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? "✅" : "❌"} ${feature}`);
  });

  console.log("\n🚀 Performance Tips:");
  console.log("─".repeat(40));
  console.log("1. Monitor Core Web Vitals in production");
  console.log("2. Use React Query DevTools in development");
  console.log("3. Run lighthouse audits regularly");
  console.log("4. Monitor bundle size in CI/CD");
  console.log("5. Test on slow networks and devices");

  console.log("\n✨ Performance optimization completed!");
}

// Check if this is run directly
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
