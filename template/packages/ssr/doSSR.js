import puppeteer from "puppeteer";

const FRONTEND_PORT = 3000;
// Function to scrape the local frontend using Puppeteer
const doSSR = async (url, userAgent) => {
  console.log(`Rendering via SSR for: ${url} (UA: ${userAgent})`);
  const browser = await puppeteer.launch({ headless: "new" });
  try {
    const page = await browser.newPage();

    // Optimize for speed by disabling unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (["image", "stylesheet", "font"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    if (userAgent) {
      await page.setUserAgent(userAgent);
    }

    // Check if absolute URL (started with http)
    const targetUrl = url.startsWith("http")
      ? url
      : `http://localhost:${FRONTEND_PORT}${url}`;

    await page.goto(targetUrl);
    await page.waitForNetworkIdle({ idleTime: 2000, timeout: 5000 });

    const html = await page.content();
    return html;
  } catch (err) {
    console.error("SSR Error:", err);
    return `<h1>SSR Error</h1><pre>${err.message}</pre>`;
  } finally {
    await browser.close();
  }
};

export default doSSR;
