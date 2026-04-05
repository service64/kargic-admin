import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' loads all env variables regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Use PORT from .env, or default to 3001
      port: parseInt(env.PORT) || 3001,
      strictPort: true, 
      host: true, // Necessary for accessing the server via IP
    },
    build: {
      // Increases the limit to 1000kB to quiet the warning you received earlier
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Optional: Splits node_modules into separate chunks for better loading
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  }
})
