import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3000, // Removed to allow Vite to find a free port
    // open: true // Disabled to prevent automatic browser opening
  }
})
