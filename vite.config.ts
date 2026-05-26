import path from "path"
import { copyFileSync } from "fs"
import { createRequire } from "module"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { VitePWA } from "vite-plugin-pwa"

const require = createRequire(import.meta.url)

// Copies the PDF.js worker with a .js extension so any server serves it with the correct MIME type
function copyPdfWorkerPlugin(): Plugin {
  const src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs")
  const dest = path.resolve(__dirname, "public/pdf.worker.min.js")
  return {
    name: "copy-pdf-worker",
    buildStart() { copyFileSync(src, dest) },
    configureServer() { copyFileSync(src, dest) },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    copyPdfWorkerPlugin(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      quoteStyle: "double",
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "logo-small.png"],
      manifest: {
        name: "Plannify Driver",
        short_name: "Plannify",
        description: "Plannify Driver Application",
        theme_color: "#4F6CE8",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\/locales\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "i18n-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
