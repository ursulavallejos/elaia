import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración específica para migración desde Create React App
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Asegurar compatibilidad con navegadores
    target: 'es2015'
  },
  server: {
    port: 3000,
    open: true
  },
  // Resolver rutas absolutas para compatibilidad con CRA
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Asegurar que Vite procese archivos JSX correctamente
  esbuild: {
    jsx: 'automatic'
  },
  // Definir variables globales para compatibilidad con CRA
  define: {
    // Polyfill para process.env en caso de que algún código legacy lo use
    'process.env': 'import.meta.env'
  }
})
