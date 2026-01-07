import express from "express";
import path from "path";
import cors from "cors"; // Add CORS
import doSSR from "./doSSR.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors()); // Enable CORS for all routes

// Middleware to detect bots
const isBot = (userAgent) => {
  const bots = [
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "twitterbot",
    "facebookexternalhit",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "developers.google.com/+/web/snippet",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "redditbot",
    "applebot",
    "whatsapp",
    "flipboard",
    "tumblr",
    "bitlybot",
    "skypeuripreview",
    "nuzzel",
    "discordbot",
    "google page speed",
    "qwantify",
    "pinterest",
    "wordpress",
    "x-bufferbot",
  ];
  const lowerUA = userAgent.toLowerCase();
  // Check if it contains specific bot strings OR just "bot"
  return bots.some((bot) => lowerUA.includes(bot)) || lowerUA.includes("bot");
};

// Serve static files for real users
const frontendDist = path.resolve(__dirname, "../frontend/dist");

// API Endpoint for SSR Console
app.get("/ssr-console-endpoint", async (req, res) => {
  const targetPath = req.query.url;
  const userAgent = req.query.ua || req.get("User-Agent");

  if (!targetPath) {
    return res.status(400).send("Missing url query parameter");
  }
  const html = await doSSR(targetPath, userAgent);
  res.send(html);
});

// Main handler
app.use(async (req, res, next) => {
  const userAgent = req.get("User-Agent") || "";

  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json|svg)$/)) {
    return next();
  }

  if (isBot(userAgent)) {
    console.log(`Bot detected (${userAgent}). Serving SSR...`);
    const html = await doSSR(req.url, userAgent); // Pass the path and UA
    res.send(html);
  } else {
    console.log(`User detected. Serving static app.`);
    next();
  }
});

// Serve static files
app.use(express.static(frontendDist));

// Fallback for SPA routing (for users)
app.get("*", (req, res) => {
  // If it's a bot that fell through (shouldn't happen with logic above but safety net), render
  const userAgent = req.get("User-Agent") || "";
  if (isBot(userAgent)) {
    doSSR(req.url).then((html) => res.send(html));
    return;
  }

  // Send index.html for React Router
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend SSR Service running on http://localhost:${PORT}`);
  console.log(`Serving static files from: ${frontendDist}`);
});
