const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const api = require('./api')
const socketoi = require('./socketoi.js')
const app = express()
const httpServer = createServer(app)

// 配置 CORS
app.use(cors({
  //origin: 'http://192.168.1.234:5005/',//正式环境
  origin: 'http://192.168.1.234:8080/',//开发环境
  credentials: true
}))
app.use(express.static(__dirname + '/static'));//配置静态资源文件，vue编译后的文件放这里
var onlineSetting = socketoi.initOnlineSetting();//初始化存储当前在线用户记录
api.initApip(app, onlineSetting);//配置api接口
socketoi.initSocket(httpServer, onlineSetting);//初始化 Socket.IO

// 启动服务器
const PORT = 5005
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// 在需要关闭服务器时调用
// httpServer.close(() => {
//   console.log('Server closed');
//   const db = new sqlite3.Database("mydb.sqlite");
//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
// });

// 捕获未处理的 Promise 异常
process.on('unhandledRejection', (err) => {
  console.error('全局捕获 [unhandledRejection]:', err);
});

// 捕获未处理的同步异常
process.on('uncaughtException', (err) => {
  console.error('全局捕获 [uncaughtException]:', err);
  // 注意：此处应记录日志并优雅退出，避免状态不一致
  process.exit(1);
});