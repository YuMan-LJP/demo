const express = require('express')
const { createServer } = require('http')
const app = express()
const httpServer = createServer(app)

app.use(express.static(__dirname + '/static'));//配置静态资源文件，vue编译后的文件放这里

// 启动服务器
const PORT = 5005
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

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

//测试：启动服务：node server