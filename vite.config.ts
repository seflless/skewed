// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// import react from "@vitejs/plugin-react";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "skewed",
      fileName: "skewed",
    },
  },

  plugins: [
    // react(),
    dts(),
  ],
});
