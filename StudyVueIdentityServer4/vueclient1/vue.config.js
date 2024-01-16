const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port: 5003,//端口
    //https: true,//是否开启https
    // 代理
    // proxy: {
    //   '/api': {
    //       target: 'https://localhost:5001/', // 代理后台服务器地址
    //       changeOrigin: true, //允许跨域
    //       ws: true,//是否代理 websockets
    //       secure: true,//是否https接口               
    //       pathRewrite: {
    //         '^/api': ''  //路径替换，将/api替换成空字符串
    //       }
    //   }
    // }
  },
})
