const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//避免出现Component name “xxx” should always be multi-word.
})
