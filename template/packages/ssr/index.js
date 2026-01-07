const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;
const FRONTEND_PORT = 3000; // Port where the React app runs in dev or is served internally

// Middleware to detect bots
const isBot = (userAgent) => {
    const bots = [
        'googlebot',
        'bingbot',
        'yandexbot',
        'duckduckbot',
        'baiduspider',
        'twitterbot',
        'facebookexternalhit',
        'rogerbot',
        'linkedinbot',
        'embedly',
        'quora link preview',
        'showyoubot',
        'outbrain',
        'pinterest/0.',
        'developers.google.com/+/web/snippet',
        'slackbot',
        'vkshare',
        'w3c_validator',
        'redditbot',
        'applebot',
        'whatsapp',
        'flipboard',
        'tumblr',
        'bitlybot',
        'skypeuripreview',
        'nuzzel',
        'discordbot',
        'google page speed',
        'qwantify',
        'pinterest',
        'wordpress',
        'x-bufferbot',
    ];
    const lowerUA = userAgent.toLowerCase();
    return bots.some(bot => lowerUA.includes(bot));
};

// Function to scrape the local frontend using Puppeteer
const ssr = async (url) => {
    console.log(`Rendering via SSR for: ${url}`);
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        const page = await browser.newPage();

        // In a real production setup, access the frontend internal URL
        // For this demo, we assume the frontend is running on localhost:3000 from the dev copmmand
        const targetUrl = `http://localhost:${FRONTEND_PORT}${url}`;

        await page.goto(targetUrl, {
            waitUntil: 'networkidle0', // Wait until network is idle (data loaded)
        });

        const html = await page.content(); // Get full HTML
        return html;
    } catch (err) {
        console.error('SSR Error:', err);
        return '<h1>SSR Error</h1>';
    } finally {
        await browser.close();
    }
};

// Serve static files for real users
// We assume 'frontend' package is built into 'packages/frontend/dist'
const frontendDist = path.resolve(__dirname, '../frontend/dist');

// Route for testing SSR (Dev only)
if (process.env.NODE_ENV !== 'production') {
    app.get('/test-ssr', async (req, res) => {
        const targetPath = req.query.path || '/';
        const html = await ssr(targetPath);
        res.send(html);
    });
}

// Main handler
app.use(async (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';

    // Ignore static assets (js, css, etc) from bot check
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json|svg)$/)) {
        return next();
    }

    if (isBot(userAgent)) {
        console.log(`Bot detected (${userAgent}). Serving SSR...`);
        const html = await ssr(req.url); // Pass the path
        res.send(html);
    } else {
        console.log(`User detected. Serving static app.`);
        next();
    }
});

// Serve static files (if not bot or if bot requested asset)
app.use(express.static(frontendDist));

// Fallback for SPA routing (for users)
app.get('*', (req, res) => {
    // If it's a bot that fell through (shouldn't happen with logic above but safety net), render
    const userAgent = req.get('User-Agent') || '';
    if (isBot(userAgent)) {
        ssr(req.url).then(html => res.send(html));
        return;
    }

    // Send index.html for React Router
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend SSR Service running on http://localhost:${PORT}`);
    console.log(`Serving static files from: ${frontendDist}`);
});
