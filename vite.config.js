import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Vitest config lives here so we do not need a separate vitest.config.js
  test: {
    environment: "jsdom",       // Simulates a browser environment for React tests
    globals: true,              // Lets us use expect/describe/it without importing them
    setupFiles: [],             // Add a setup file here later if needed (e.g. jest-dom matchers)
  },
});
