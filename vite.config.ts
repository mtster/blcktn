import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid TypeScript errors with 'process' type
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the Google GenAI SDK and inject API_KEY
      'process.env': {
        API_KEY: env.API_KEY,
        NODE_ENV: mode
      }
    }
  };
});