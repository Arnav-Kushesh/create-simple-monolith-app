import config from "./config.js";
import simpleSiteOptimizer from "./simpleSiteOptimizer/simpleSiteOptimizer.js";

// Start the SSR service
simpleSiteOptimizer(config).catch((err) => {
  console.error("Failed to start SSR service:", err);
  process.exit(1);
});
