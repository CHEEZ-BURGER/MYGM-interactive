import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// GitHub Pages(프로젝트 페이지)에서도 경로가 깨지지 않도록 상대 경로로 빌드한다.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        poem: resolve(import.meta.dirname, 'poem.html'),
        novel: resolve(import.meta.dirname, 'novel.html'),
        play: resolve(import.meta.dirname, 'play.html'),
        critique: resolve(import.meta.dirname, 'critique.html'),
        listen: resolve(import.meta.dirname, 'listen.html'),
      },
    },
  },
});
