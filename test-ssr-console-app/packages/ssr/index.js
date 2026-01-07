const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors'); // Add CORS

const app = express();
const PORT = 8080;
const FRONTEND_PORT = 3000;

app.use(cors()); // Enable CORS for all routes

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

        // Check if absolute URL (started with http)
        const targetUrl = url.startsWith('http')
            ? url
            : `http://localhost:${FRONTEND_PORT}${url}`;

        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
        });

        const html = await page.content();
        return html;
    } catch (err) {
        console.error('SSR Error:', err);
        return `<h1>SSR Error</h1><pre>${err.message}</pre>`;
    } finally {
        await browser.close();
    }
};

// Serve static files for real users
const frontendDist = path.resolve(__dirname, '../frontend/dist');

// API Endpoint for SSR Console
app.get('/render', async (req, res) => {
    const targetPath = req.query.url;
    if (!targetPath) {
        return res.status(400).send('Missing url query parameter');
    }
    const html = await ssr(targetPath);
    res.send(html);
});

// Main handler
app.use(async (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';

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

// Serve static files
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
