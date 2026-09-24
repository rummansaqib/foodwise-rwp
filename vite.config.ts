import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is configurable via the VITE_BASE_PATH env var so this project
// can be deployed to GitHub Pages under a repository sub-path, e.g.:
//   VITE_BASE_PATH=/foodwise-rwp/ npm run build
// Defaults to '/' for local dev and root-domain hosting.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
