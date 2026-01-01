import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // In-repo dev: make `import { ... } from "skewed"` resolve to source.
      skewed: resolve(__dirname, "../../src/index.ts"),
    },
  },
});


