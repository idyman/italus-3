import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['lucide-react', 'sonner'],
          // Split Radix UI components into separate chunk
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-dropdown-menu',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets < 4kb as base64
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server start
    include: [
      'react',
      'react-dom',
      'motion',
      '@supabase/supabase-js',
      'lucide-react',
      'sonner',
    ],
    // Exclude large dependencies that should be loaded on demand
    exclude: ['jspdf'],
  },
  // Enable HTTP/2 server push hints
  server: {
    warmup: {
      // Pre-transform these files on server start for faster initial load
      clientFiles: [
        './src/app/App.tsx',
        './src/app/components/PortfolioPage.tsx',
      ],
    },
  },
})