const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
   pages: {
    index: {
      entry: 'src/main.js',
      title: 'Pronos Judo'
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
      })
    ]
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "https://data.ijf.org",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
})
