const express = require('express')
const sqlite3 = require("sqlite3").verbose();
const url = require("url")
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser');

//初始化数据库
const db = new sqlite3.Database("mydb.sqlite");
function initSqlite() {
  db.serialize(() => {
    const createTable = `
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
  );
  `;
    db.run(createTable);
  })
}
initSqlite();

const app = express()
const httpServer = createServer(app)

// 配置 CORS
app.use(cors({
  //origin: 'http://192.168.1.234:5005/',//正式环境
  origin: 'http://192.168.1.234:8080/',//开发环境
  credentials: true
}))
//配置静态资源文件，vue编译后的文件放这里
app.use(express.static(__dirname + '/static'))
function initApi() {
  //app.use(express.json());// 允许解析 JSON 数据
  app.use(bodyParser.json());// 使用 body-parser 中间件来解析请求体

  app.get("/api/getusers", (req, res) => {
    const obj = url.parse(req.url, true)
    console.log("/api/getusers", obj.query);
    var conditions = []
    var conditionSql = ""
    if (obj.query.limit !== undefined && obj.query.offset !== undefined) {
      conditions.push(obj.query.limit);
      conditions.push(obj.query.offset);
      conditionSql += 'LIMIT ? OFFSET ?'//OFFSET必须在LIMIT后面使用，如果只需要跳过几条的话，就把LIMIT的值设的非常大即可
    }
    if (obj.query.limit === undefined && obj.query.offset !== undefined) {
      res.json({
        isSuccess: true,
        error: 'offset不能单独使用，必须配合limit',
        data: null
      })
      return;
    }
    const query = 'SELECT * FROM users ' + conditionSql;
    db.all(query, conditions, (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json({
        isSuccess: true,
        error: null,
        data: rows
      })
    });
  })
  app.get("/api/getuserbyid", (req, res) =>{
    const obj = url.parse(req.url, true)
    const query = 'SELECT * FROM users where id=?'
    db.all(query, [obj.query.id], (err, rows) =>{
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json({
        isSuccess: true,
        error: null,
        data: rows
      })
    })
  })
  app.get("/api/getuserbyusername", (req, res) =>{
    const obj = url.parse(req.url, true)
    const query = 'SELECT * FROM users where username=?'
    db.all(query, [obj.query.username], (err, rows) =>{
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json({
        isSuccess: true,
        error: null,
        data: rows
      })
    })
  })
  app.post("/api/adduser", (req, res) => {
    try {
      console.log("/api/adduser", req.body);
      if(req.body === undefined){
        throw '参数不能为空'
      }
      const { username, email, password } = req.body;
      if (username === '' || username === null || username === undefined) throw "username不能为空"
      if (email === '' || email === null || email === undefined) throw "username不能为空"
      if (password === '' || password === null || password === undefined) throw "username不能为空"
      const insert = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      db.run(insert, [username, email, password], (err) => {
        if (err) {
          console.log(err);
        }
        res.json({
          isSuccess: err === null,
          error: err,
          data: null
        });
      });
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/updateuser", (req, res) => {
    try {
      console.log("/api/updateuser", req.body);
      if(req.body === undefined){
        throw '参数不能为空'
      }
      const { id, username, email, password } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      if (username === '' || username === null || username === undefined) throw "username不能为空"
      if (email === '' || email === null || email === undefined) throw "username不能为空"
      if (password === '' || password === null || password === undefined) throw "username不能为空"
      const update = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
      db.run(update, [username, email, password, id], (err) => {
        if (err) {
          console.log(err);
        }
        res.json({
          isSuccess: err === null,
          error: err,
          data: null
        });
      });
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/deleteuser", (req, res) => {
    try {
      console.log("/api/deleteuser", req.body);
      if(req.body === undefined){
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM users WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          console.log(err);
        }
        res.json({
          isSuccess: err === null,
          error: err,
          data: null
        });
      });
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })




  // 方法传入两个数组，第一个数组为key，第二个数组对应位置为value，此方法在Python中为zip()函数。
  const ArraytoObj = (keys = [], values = []) => {
    if (keys.length === 0 || values.length === 0) return {};
    const len = keys.length > values.length ? values.length : keys.length;
    const obj = {};
    for (let i = 0; i < len; ++i) {
      obj[keys[i]] = values[i]
    }
    return obj;
  };
  // 转驼峰表示：func.camel('USER_ROLE',true) => UserRole
  // 转驼峰表示：func.camel('USER_ROLE',false) => userRole
  const camel = (str, firstUpper = false) => {
    let ret = str.toLowerCase();
    ret = ret.replace(/_([\w+])/g, function (all, letter) {
      return letter.toUpperCase();
    });
    if (firstUpper) {
      ret = ret.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toUpperCase() + $2;
      });
    }
    return ret;
  };
  // 把数组里面的所有转化为驼峰命名
  const camelArr = (arrs = []) => {
    let _arrs = [];
    arrs.map(function (item) {
      _arrs.push(camel(item));
    });
    return _arrs;
  };

  // 读取数据库
  // 1.把columns转化为驼峰；
  // 2.把columns和values进行组合；
  const dbToObj = (_data = {}) => {
    let _res = [];
    _data.map(function (item) {
      let _columns = camelArr(item.columns);
      item.values.map(function (values) {
        _res.push(ArraytoObj(_columns, values));
      });
    });
    return _res;
  };
}
//配置api接口
initApi();

function initSocket() {
  // 创建 Socket.IO 实例
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // 开发时可放宽限制
      methods: ['GET', 'POST']
    }
  })
  // Socket 连接监听
  io.on('connection', (socket) => {
    console.log('客户端已连接:', socket.id)

    // 接收客户端消息
    socket.on('send-message', (message) => {
      console.log('收到消息:', message)

      // 广播给所有客户端（包括发送者）
      io.emit('chat-message', message)

      // 如果只想广播给其他客户端：
      // socket.broadcast.emit('message', message)
    })

    // 断开连接处理
    socket.on('disconnect', () => {
      console.log('客户端断开:', socket.id)
    })
  })
}
//初始化 Socket.IO
initSocket();

// 启动服务器
const PORT = 5005
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// 在需要关闭服务器时调用
// httpServer.close(() => {
//   console.log('Server closed');
//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
// });