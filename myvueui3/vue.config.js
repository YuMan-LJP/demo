const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',//支持file协议
  transpileDependencies: true,
  lintOnSave: false,//避免出现Component name “xxx” should always be multi-word.
})
