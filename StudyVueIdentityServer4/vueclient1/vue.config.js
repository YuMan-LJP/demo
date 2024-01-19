const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port: 5003,//端口
    //https: true,//是否开启https
    // 代理
    proxy: {
      '/api': {
          target: 'https://localhost:5001/', // 代理后台服务器地址
          changeOrigin: true, //允许跨域            
          pathRewrite: {
            '/api': ''//将地址中标记的/api都替换掉
          }
      }
    }
  },
})
