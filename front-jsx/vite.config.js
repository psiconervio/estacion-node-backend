import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  preview: {
    port: 8080,
    allowedHosts: ['estacion-node-backend.onrender.com'], // Mover aquí
  },
});