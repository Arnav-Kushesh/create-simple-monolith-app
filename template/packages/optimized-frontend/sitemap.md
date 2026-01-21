# Sitemap Generation Feature

The `optimized-frontend` package includes a built-in sitemap generator that supports handling large numbers of dynamic pages through pagination.

## Configuration

To enable sitemap generation, you need to update your `config.js` file.

### 1. Add Domain

Add the `domain` property to your exported config object. This is used to construct absolute URLs in the sitemap.

```javascript
let config = {
  // ... other config options
  domain: "https://your-domain.com",
};
```

### 2. Configure Dynamic Routes

For each dynamic route that you want to include in the sitemap, add a `sitemapGenerator` function.

The `sitemapGenerator` function should return an object with:
- `uniqueName`: A unique string identifier for this route (e.g., "posts", "products").
- `total`: The total number of items available for this route.
- `loader`: A function that fetches the data for a specific page of the sitemap.

#### Loader Function

The `loader` function receives an object with:
- `limit`: The maximum number of items to return (default is 50,000).
- `itemsToSkip`: The number of items to skip (for pagination).

It should return an array of objects, each containing:
- `url`: The relative or absolute URL of the page.
- `lastUpdatedAt` (optional): ISO date string of when the page was last modified.

### Example

Here is a complete example of how to configure a dynamic route for blog posts:

```javascript
const dynamicRoutes = [
  {
    path: "/post/:id",
    templateRoute: "/post-page-template",
    // ... normal loader for the page ...
    
    // SITEMAP CONFIGURATION
    sitemapGenerator: async () => {
      // Fetch total count from your DB
      const totalPosts = 100000; 

      return {
        uniqueName: "post",
        total: totalPosts,
        loader: async ({ limit, itemsToSkip }) => {
          // Fetch batch of posts from your DB
          // const posts = await db.getPosts({ offset: itemsToSkip, limit });
          
          // Map to sitemap format
          return posts.map(post => ({
            url: `/post/${post.id}`,
            lastUpdatedAt: post.updatedAt // e.g. "2024-03-20T10:00:00Z"
          }));
        },
      };
    },
  },
];
```

## How it Works

Once configured, the following endpoints will be available:

- `/sitemap.xml`: The main sitemap index. It lists the static routes sitemap and all dynamic route sitemaps.
- `/sitemap-static.xml`: Contains all the static routes defined in your `staticRoutes` config.
- `/sitemap-<uniqueName>.xml`: An index sitemap for a specific dynamic route (e.g., `/sitemap-post.xml`). It lists the paginated sub-sitemaps.
- `/sitemap-<uniqueName>-<page>.xml`: The actual sitemap files containing the URLs (e.g., `/sitemap-post-1.xml`). Each file contains up to 50,000 URLs.
