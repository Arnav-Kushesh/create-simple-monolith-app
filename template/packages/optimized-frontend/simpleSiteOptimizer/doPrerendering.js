import express from "express";
import puppeteer from "puppeteer";
import { open } from "lmdb";
import cors from "cors";
import { match } from "path-to-regexp";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import preventTextNodeMerge from "./utils/preventTextNodeMerge.js";

/**
 * simpleSSR function
 * @param {Object} options
 * @param {string} options.buildFolder - Absolute path to the build folder
 * @param {string[]} options.staticRoutes - List of static routes to prerender
 * @param {Array<{loader: Function, templateRoute: string, path: string}>} options.dynamicRoutes - List of dynamic routed
 * @param {number} options.port - Main server port
 * @param {number} [options.prerenderingPort=4050] - Port for prerendering server
 * @param {'BOT_ONLY' | 'ALL_REQUESTS'} [options.dynamicRendering='ALL_REQUESTS'] - Prerendering strategy for dynamic routes
 */
export default async function doPrerendering({
  buildFolder,
  staticRoutes,
  dynamicRoutes,
  port,
  prerenderingPort = 4050,
}) {
  // 1. Validation
  if (port === prerenderingPort) {
    throw new Error("Main port and prerendering port cannot be the same");
  }

  // 2. Initialize LMDB
  // Using a temporary path or a specific path inside the package?
  // Let's use a standard cache path or just 'ssr-cache' in the current working directory for now
  const db = open({
    path: "pre-rendered-data",
    compression: true,
  });

  // Helper to start a server serving the build folder
  const startServer = (p) => {
    const app = express();
    app.use(cors());
    app.use(express.static(buildFolder));
    // Fallback for SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(buildFolder, "index.html"));
    });
    return new Promise((resolve, reject) => {
      const server = app.listen(p, () => {
        resolve({ app, server });
      });
      server.on("error", (err) => reject(err));
    });
  };

  let prerenderServer;
  let browser;

  try {
    console.log(`Starting prerendering server on port ${prerenderingPort}...`);
    const result = await startServer(prerenderingPort);
    prerenderServer = result.server;

    // 3. Prerendering logic
    console.log("Starting Puppeteer for prerendering...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Helper to visit and store
    const visitAndStore = async (routePath, storageKey) => {
      const url = `http://localhost:${prerenderingPort}${routePath}`;
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 50000 });

        await preventTextNodeMerge(page);

        // Extract STATIC_PAGE_DATA
        const staticData = await page.evaluate(
          () => window.EXPORT_STATIC_PAGE_DATA,
        );

        const content = await page.content();

        // Store object in LMDB
        await db.put(storageKey, { html: content, data: staticData });
      } catch (err) {
        console.error(`Failed to prerender ${routePath}:`, err);
      }
    };

    // Visit all static routes
    for (const route of staticRoutes) {
      await visitAndStore(route, route);
    }

    // Visit all unique template routes from dynamic routes
    // dynamicRoutes = [{loader, templateRoute, path}]
    const uniqueTemplates = [
      ...new Set(dynamicRoutes.map((r) => r.templateRoute)),
    ];
    for (const templateRoute of uniqueTemplates) {
      // For template routes, we store them by their template route path
      await visitAndStore(templateRoute, templateRoute);
    }

    // Calculate total size and list routes
    let totalSize = 0;
    console.log("\n--- Prerendered Routes ---");
    for (const { key, value } of db.getRange()) {
      let size = 0;
      if (typeof value === "string") {
        size = Buffer.byteLength(value, "utf8");
      } else if (value && typeof value === "object") {
        // Approximate size of stored object
        size = Buffer.byteLength(JSON.stringify(value), "utf8");
      }
      totalSize += size;
      console.log(`Route: ${key} | Size: ${(size / 1024).toFixed(2)} KB`);
    }
    console.log("--------------------------");
    console.log(`Total cached size: ${(totalSize / 1024).toFixed(2)} KB\n`);
  } catch (err) {
    console.error("Prerendering failed:", err);
    // We might want to rethrow or just continue if prerendering is optional?
    // But for this task, let's rethrow properly or let it bubble up, but ensure cleanup happens.
    throw err;
  } finally {
    if (browser) await browser.close();
    if (prerenderServer) prerenderServer.close();
  }
}
