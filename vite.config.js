import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [vue(), checker({ typescript: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
