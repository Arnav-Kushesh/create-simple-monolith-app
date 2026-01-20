# Create Simple Monolith App

Goal: Provide a simple mechanism for doing SSR that requires minimal code frontend code manipulation

## How it works?

- Basically static site generation is done through puppeteer
- The advantage of this method is that the frontend code requires zero change to support static generation
- All you need to do is mention all the static routes
- At build time,the package will scrape all of those routes and cache it on the server
- When a user or bot tries to access that route, the rendered result in the cached is served, improving SEO & performance
- Bot can easily crawl the page without needing to execute JS
- Browsers can instantly show UI without needing to do CSR
- For creating the rendered cache of the static routes puppeteer is used, puppeteer only runs at build time. So, there is no impact on performance
- We call this method: scrapping based static generation & ssr
- If UI on the static page relies on api requests then that UI will also be saved during the build time
  - To ensure that this data is not loaded again by JS use the following setup
  - After making the api requests you only need to do `window.EXPORT_STATIC_PAGE_DATA= data `
  - Then this data will be saved at build time
  - After that you can use this saved data using the following logic
  - ```
        let preLoadedData = window.getPreLoadedData
          ? window.getPreLoadedData()
          : null;
    ```
  - The `getPreLoadedData` function is inject by the server, you don't need to import any library to use it
  - getPreLoadedData checks the page path and then provides the data you assigned to `window.EXPORT_STATIC_PAGE_DATA`

## How SSR works on dynamic routes are handled?

- Let's say you have post pages. In that case static generation can't be done.
- We will have to do server side rendering
- You will have to provide list of dynamic routes with a loader function and template
- For providing the template you need to create a route in the application that serve the template.
- For example /post-page-template, you can use handlebar syntax inside your react / vue component
- Make sure it is the same component structure that serves post pages
- Once the post-page-template has been cached, users & bots will be prevented from visiting that route
- data extracted from the loader function will be inserted in /post-page-template to serve users when they visit /post/123 page
- because the component itself it being used for templating, hydration won't be an issue
- hydration might break if non-deterministic logic is used like Math.random, in that case you can restrict SSR to BOT_ONLY by passing the config `dynamicRendering:BOT_ONLY`
- The data loaded from the loader function can be accessed by using the following logic

```
  let preLoadedData = window.getPreLoadedData
            ? window.getPreLoadedData()
            : null;

```

## Use Cases

### Add SSR to a capacitor project

- Capacitor requires a clean build folder to function but in frameworks like Next.js & Tanstack backend and frontend codebase is very closely interconnected
- Capacitor is only supposed to run frontend code.
- So it takes significant workarounds to make Next.js / Tanstack to work with Capacitor without compromising on the features of capacitor or Next.js / Tanstack
- With scrapping based static generation & ssr, the capacitor project requires little to no change

### Huge codebase

- If you have a big project, rewriting it in Remix / Next.js / Tanstack might not be economical
- With out implementation frontend code requires little to no change

## Benefits

- Minimal learning curve
- Minimal need to change frontend code
- Works with any frontend technology

## How to run dev server

`npm run dev` Starts the backend, frontend & SSR server using TurboRepo

## How to do deployment

`npm run backend` - For backend deployment
`npm run ssr` - For frontend deployment
`npm run build` - For generating build folder
