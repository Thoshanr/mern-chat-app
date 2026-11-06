import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:5000' },
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
});
