
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Safely replace process.env.API_KEY with the actual string value
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent other libraries from crashing when checking process.env.NODE_ENV
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  };
});
