const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',//支持file协议
  transpileDependencies: true,
  lintOnSave: false,//避免出现Component name “xxx” should always be multi-word.
  outputDir: 'nodeServer/static',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.234:5005',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
