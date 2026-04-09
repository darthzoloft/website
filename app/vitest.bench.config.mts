import codspeed from '@codspeed/vitest-plugin';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [codspeed()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './components'),
      '@constants': path.resolve(__dirname, './constants'),
      '@lib': path.resolve(__dirname, './lib'),
      '@mcpCatalog': path.resolve(__dirname, './app/mcp-catalog'),
    },
  },
  test: {
    benchmark: {
      include: ['**/*.bench.ts'],
    },
  },
});
