import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  plugins: [
    // MDX must run before the React plugin so its JSX output gets transformed.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: undefined }) },
    react({ include: /\.(mdx|tsx|ts|jsx|js)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Relative base so the build works from Tauri's custom protocol / file system.
  base: './',
  // Tauri: it waits on this exact port in dev, and keeps its own Rust output on screen.
  clearScreen: false,
  server: { port: 5173, strictPort: true },
  build: {
    // three.js lives in lazily-loaded tome chunks (~1 MB raw); that's expected for an offline app.
    chunkSizeWarningLimit: 1500,
  },
})
