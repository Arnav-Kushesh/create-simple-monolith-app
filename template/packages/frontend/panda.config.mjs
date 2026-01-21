import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "styled-system",

  globalCss: {
    ":root": {
      "--font-doto": "'Doto', sans-serif",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      lineHeight: "1.5",
      fontWeight: "400",
      colorScheme: "light",
      color: "#1d1d1f",
      backgroundColor: "#ffffff",
      fontSynthesis: "none",
      textRendering: "optimizeLegibility",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    body: {
      margin: "0",
      display: "flex",
      placeItems: "center",
      minWidth: "320px",
      minHeight: "100vh",
      flexDirection: "column",
    },
    "#root": {
      width: "100%",
      maxWidth: "980px",
      margin: "0 auto",
      padding: "4rem 2rem",
      textAlign: "left",
    },
    h1: {
      fontFamily: "var(--font-doto)",
      fontSize: "3.5rem",
      lineHeight: "1.1",
      fontWeight: "700",
      marginBottom: "1.5rem",
      color: "#000000",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "600",
      color: "#1d1d1f",
      marginTop: "3rem",
      marginBottom: "1.5rem",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#1d1d1f",
    },
    "p, li": {
      fontSize: "1.0625rem",
      color: "#1d1d1f",
      lineHeight: "1.47059",
      letterSpacing: "-0.022em",
    },
  },

  theme: {
    extend: {
      tokens: {
        fonts: {
          doto: { value: "'Doto', sans-serif" },
        },
      },
    },
  },
});
