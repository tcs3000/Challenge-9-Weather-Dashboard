import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../server/client/dist', 
    assetsDir: 'assets',
    rollupOptions: {
      input: './index.html',
    },
    emptyOutDir: true, 
},
  
});
