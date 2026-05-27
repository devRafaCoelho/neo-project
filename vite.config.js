import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// https://vite.dev/config/
// Produção: GitHub Pages em https://devRafaCoelho.github.io/neo-project/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        if (mode === 'production') {
          copyFileSync('dist/index.html', 'dist/404.html')
        }
      },
    },
  ],
  base: mode === 'production' ? '/neo-project/' : '/',
}))
