const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  configureWebpack: {
    entry: './frontend/src/main.js',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'frontend/src'),
      },
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
});
