import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Settings for 'npm run dev'
    server: {
      port: parseInt(env.PORT) || 3001,
      strictPort: true,
      host: true,
    },
    // Settings for 'npm run preview' <--- ADD THIS
    preview: {
      port: parseInt(env.PORT) || 3001,
      strictPort: true,
      host: true,
    },
    build: {
      chunkSizeWarningLimit: 1000,
    }
  }
})
