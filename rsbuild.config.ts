import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  output: {
    distPath: {
      root: 'dist', // Standard Netlify publish directory
    },
  },
  plugins: [
    pluginReact(),
  ],
  html: {
    template: './public/index.html',
  },
});