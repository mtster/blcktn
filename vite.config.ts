
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // We are now using import.meta.env for VITE_ prefixed variables.
    // Keeping this mostly empty or for legacy compat if needed.
  }
});
