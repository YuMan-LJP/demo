1.新建本地文件夹 如 server
2.进入文件夹控制台执行：npm init -y 
3.在package.json同级文件夹下新建一个server.js (server 可以是其他名字)
npm i express
npm i connect-history-api-fallback
npm install express socket.io cors

4.在与server.js同级下创建一个static文件夹（Vue编译好的 文件放在这个文件夹里面）
app.use(express.static(__dirname+'/static'))


启动服务：node server