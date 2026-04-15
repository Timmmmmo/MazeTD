import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    target: 'esnext',
    // 单文件输出，保持部署简单
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'game.js',
        assetFileNames: 'game.[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
