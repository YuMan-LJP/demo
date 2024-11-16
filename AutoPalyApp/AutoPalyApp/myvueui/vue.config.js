const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//避免出现Component name “xxx” should always be multi-word.
  // css: {
  //   loaderOptions: {
  //     sass: {// 配置scss全局变量，或者在main.js里面引入
  //       additionalData: `@import "@/styles/custom.scss";`// @为目录src的别名
  //     }
  //   }
  // },
  devServer:{
    client: {
      overlay: false,//解决页面弹出红色报错遮罩层
    }
  }
})
