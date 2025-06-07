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
  --用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT NOT NULL UNIQUE,  --登录名唯一
    nickName TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    userType TEXT(100) NOT NULL  --general普通用户/admin管理员
  );
  --联系人消息表
  CREATE TABLE IF NOT EXISTS contactMessages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sendUserId INTEGER NOT NULL,
    receiveUserId INTEGER NOT NULL,
    message TEXT NOT NULL,
    createTime NUMERIC NOT NULL
  );
  --群消息表
  CREATE TABLE IF NOT EXISTS contactRooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sendUserId INTEGER NOT NULL,
    receiveRoomId INTEGER NOT NULL,
    message TEXT NOT NULL,
    createTime NUMERIC NOT NULL
  );
  --房间表
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT(100) NOT NULL,  --群类型，默认是空，后续待开发
    createUserId INTEGER NOT NULL,
    createTime NUMERIC NOT NULL
  );
  --房间用户表（展示这个房间有哪些人）
  CREATE TABLE IF NOT EXISTS roomUsers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomId INTEGER NOT NULL,
    userId INTEGER NOT NULL
  );
  --联系人表
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    myselfId INTEGER NOT NULL,
    friendId INTEGER NOT NULL,
    chatKey TEXT NOT NULL  --自动生成的聊天通讯用的key，保证两个人在同一个房间
  );
  --请求表（申请添加联系人或申请加入群）
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sendUserId INTEGER NOT NULL,
    receiveUserId INTEGER NOT NULL,  --如果是添加联系人那这个就是对方Id，如果是添加群那这个就是房主Id
    receiveRoomId INTEGER,  --添加群的时候才有
    type TEXT(100) NOT NULL,  --contact联系人/room群
    remark TEXT NOT NULL,
    progress TEXT NOT NULL,  --waiting等待/pass通过/refuse拒绝
    createTime NUMERIC NOT NULL
  );
  --消息队列表，一有消息就插入，用于页面右上角消息提醒
  CREATE TABLE IF NOT EXISTS messageQueues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,  --要通知的人
    originUserId INTEGER NOT NULL,  --消息来源的人
    type TEXT(100) NOT NULL,  --requestcontact联系人申请/requestroom群申请/chatcontact联系人聊天/chatroom群聊天
    createTime NUMERIC NOT NULL
  );

  --初始化数据库时，插入一条管理员数据
  --INSERT INTO users (userName,nickName,email,password,userType)VALUES ('admin','admin','admin@ljp.com','123qwe!Q','admin');
  `;
    db.run(createTable, (err) => {
      console.log('数据库初始化', err);
    });
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

  app.get("/api/getUsers", (req, res) => {
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
  app.get("/api/getUserById", (req, res) => {
    const obj = url.parse(req.url, true)
    const query = 'SELECT * FROM users where id=?'
    db.get(query, [obj.query.id], (err, row) => {
      if (err) {
        throw err;
      }
      console.log(row);
      res.json({
        isSuccess: err == null,
        error: null,
        data: row
      })
    })
  })
  app.get("/api/getUserByUserName", (req, res) => {
    const obj = url.parse(req.url, true)
    const query = 'SELECT * FROM users where userName=?'
    db.get(query, [obj.query.userName], (err, row) => {
      if (err) {
        throw err;
      }
      console.log(row);
      res.json({
        isSuccess: err == null,
        error: null,
        data: row
      })
    })
  })
  app.get("/api/getUserByUserNameOrEmail", (req, res) => {
    const obj = url.parse(req.url, true)
    const query = 'SELECT id,userName,nickName,email FROM users where userName=? or email=?'
    db.all(query, [obj.query.userNameOrEmail, obj.query.userNameOrEmail], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json({
        isSuccess: err == null,
        error: null,
        data: rows
      })
    })
  })
  app.post("/api/checkUserPassword", (req, res) => {
    try {
      console.log("/api/checkuserpassword", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { userName, password } = req.body;
      if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
      if (password === '' || password === null || password === undefined) throw "username不能为空"

      db.get(`select id,userName,nickName,email,userType from users where userName = ? and password = ?`, [userName, password], (err, row) => {
        if (err) {
          throw err;
        }
        res.json({
          isSuccess: err === null,
          error: err,
          data: row
        });
      })
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/addUser", (req, res) => {
    try {
      console.log("/api/adduser", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { userName, nickName, email, password, userType } = req.body;
      if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
      if (nickName === '' || nickName === null || nickName === undefined) throw "nickName不能为空"
      if (email === '' || email === null || email === undefined) throw "email不能为空"
      if (password === '' || password === null || password === undefined) throw "password不能为空"
      if (userType === '' || userType === null || userType === undefined) throw "userType不能为空"

      db.get(`select userName from users where userName = ?`, [userName], (err, row) => {
        if (err) {
          throw err;
        }

        if (row) {
          throw `[${userName}]已存在相同User Name`
        }

        const insert = `INSERT INTO users (userName, nickName, email, password, userType) VALUES (?, ?, ?, ?, ?)`;
        db.run(insert, [userName, nickName, email, password, userType], (err2) => {
          if (err2) {
            throw err2;
          }

          db.get('SELECT * FROM users where username=?', [userName], (err3, row2) => {
            if (err3) {
              throw err3;
            }

            res.json({
              isSuccess: true,
              error: null,
              data: row2
            });
          })
        });
      })
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/updateUser", (req, res) => {
    try {
      console.log("/api/updateuser", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id, userName, nickName, email, password, userType } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
      if (nickName === '' || nickName === null || nickName === undefined) throw "nickName不能为空"
      if (email === '' || email === null || email === undefined) throw "email不能为空"
      if (password === '' || password === null || password === undefined) throw "password不能为空"
      if (userType === '' || userType === null || userType === undefined) throw "userType不能为空"

      db.get(`select userName from users where userName = ? and id != ?`, [userName, id], (err, row) => {
        if (err) {
          throw err;
        }

        if (row) {
          throw `[${userName}]已存在相同User Name`
        }

        const update = `UPDATE users SET username=?, nickName=?, email=?, password=?, userType=? WHERE id=?`;
        db.run(update, [userName, nickName, email, password, userType, id], (err2) => {
          if (err2) {
            throw err2;
          }

          db.get('SELECT * FROM users where username=?', [userName], (err3, row2) => {
            if (err3) {
              throw err3;
            }

            res.json({
              isSuccess: true,
              error: null,
              data: row2
            });
          })
        });
      })
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/deleteUser", (req, res) => {
    try {
      console.log("/api/deleteuser", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM users WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
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

  app.get("/api/getRooms", (req, res) => {
    const obj = url.parse(req.url, true)
    console.log("/api/getRooms", obj.query);
    var conditions = []
    var conditionSql = ""
    if (obj.query.name !== undefined) {
      conditionSql += " where name=? "
      conditions.push(obj.query.name)
    }

    const query = 'SELECT * FROM rooms ' + conditionSql;
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
  app.post("/api/addRoom", (req, res) => {
    try {
      console.log("/api/addRoom", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { name, description, type, createUserId } = req.body;
      if (name === '' || name === null || name === undefined) throw "name不能为空"
      if (description === '' || description === null || description === undefined) throw "description不能为空"
      if (type === '' || type === null || type === undefined) throw "type不能为空"
      if (createUserId === '' || createUserId === null || createUserId === undefined) throw "createUserId不能为空"

      const insert = `INSERT INTO rooms (name, description, type, createUserId, createTime) VALUES (?, ?, ?, ?, dateTime('now'))`;
      db.run(insert, [name, description, type, createUserId], (err) => {
        if (err) {
          throw err;
        }
        res.json({
          isSuccess: true,
          error: null,
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
  app.post("/api/deleteRoom", (req, res) => {
    try {
      console.log("/api/deleteRoom", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM rooms WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
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

  app.get("/api/getRoomUsers", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getRoomUsers", obj.query);
      var conditions = []
      var conditionSql = ""
      if (obj.query.roomId !== undefined) {
        conditionSql += " where roomId=? "
        conditions.push(obj.query.roomId)
      }

      const query = 'SELECT * FROM roomUsers ' + conditionSql;
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
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/addRoomUser", (req, res) => {
    try {
      console.log("/api/addRoomUser", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { roomId, userId } = req.body;
      const insert = `INSERT INTO roomUsers (roomId, userId) VALUES (?, ?)`;
      db.run(insert, [roomId, userId], (err) => {
        if (err) {
          throw err;
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
  app.post("/api/deleteRoomUser", (req, res) => {
    try {
      console.log("/api/deleteRoomUser", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM roomUsers WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
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

  app.get("/api/getContacts", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getContacts", obj.query);
      var conditions = []
      var conditionSql = ""
      if (obj.query.myselfId !== undefined) {
        conditionSql += " where myselfId=? "
        conditions.push(obj.query.myselfId)
      }

      const query = `
    select t1.*,t2.nickName,t2.email
    from contacts as t1
    left join users as t2 on t2.id=t1.friendId 
    ` + conditionSql;
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
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.get("/api/getContactAndCount", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getContactAndCount", obj.query);
      var conditions = []
      var conditionSql = ""
      if (obj.query.myselfId !== undefined) {
        conditionSql += " where myselfId=? "
        conditions.push(obj.query.myselfId)
      }

      const query = `
      select t1.*,t2.nickName,t2.email,IFNULL(t3.count, 0) as 'count'
      from contacts as t1
      left join users as t2 on t2.id=t1.friendId
      left join (
          select userId,originUserId,Count(*) as 'count' from messageQueues 
          where type='chatcontact'
          group by userId,originUserId
      ) as t3 on t3.userId=t1.myselfId and t3.originUserId=t1.friendId
      ` + conditionSql;
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
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/addContact", (req, res) => {
    try {
      console.log("/api/addContact", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { requestId, myselfId, friendId } = req.body;

      var chatKey = `chatcontact_${myselfId}_${friendId}`;
      db.serialize(() => {
        // 开始事务
        db.run('BEGIN TRANSACTION');

        var stmt = db.prepare(`INSERT INTO contacts (myselfId, friendId, chatKey) VALUES (?, ?, ?),(?, ?, ?)`)
        stmt.run(myselfId, friendId, chatKey, friendId, myselfId, chatKey)

        var stmt2 = db.prepare(`UPDATE requests SET progress='pass' WHERE id=?`)
        stmt2.run(requestId)

        var stmt3 = db.prepare(`DELETE FROM messageQueues WHERE userId=? and originUserId=? and type='requestcontact'`)
        stmt3.run(myselfId, friendId)

        // 提交事务
        db.run('COMMIT');
      })
      res.json({
        isSuccess: true,
        error: null,
        data: null
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
  app.post("/api/deleteContact", (req, res) => {
    try {
      console.log("/api/deleteContact", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM contacts WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
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

  app.get("/api/getRequests", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getRequests", obj.query);
      var conditions = []
      var conditionSql = ""
      if (obj.query.sendUserId !== undefined) {
        conditionSql += " where sendUserId=? "
        conditions.push(obj.query.sendUserId)
      }
      if (obj.query.receiveUserId !== undefined) {
        if (conditionSql != "") {
          conditionSql += " and receiveUserId=? "
        } else {
          conditionSql += " where receiveUserId=? "
        }
        conditions.push(obj.query.receiveUserId)
      }
      if (obj.query.receiveRoomId !== undefined) {
        if (conditionSql != "") {
          conditionSql += " and receiveRoomId=? "
        } else {
          conditionSql += " where receiveRoomId=? "
        }
        conditions.push(obj.query.receiveRoomId)
      }
      if (obj.query.type !== undefined) {
        if (conditionSql != "") {
          conditionSql += " and type=? "
        } else {
          conditionSql += " where type=? "
        }
        conditions.push(obj.query.type)
      }

      const query = `
      SELECT t1.*,t2.userName,t2.nickName,t2.email,t3.name,t3.description
      FROM requests as t1
      left join users as t2 on t2.id=t1.sendUserId
      left join rooms as t3 on t3.id=t1.receiveRoomId and t1.type='room'
      ` + conditionSql;
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
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/addRequests", (req, res) => {
    try {
      console.log("/api/addRequests", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      // 开始事务
      db.serialize(() => {
        // 开始事务
        db.run('BEGIN TRANSACTION');

        // 使用循环将数据逐条插入到数据表中（body是集合，前端请传集合过来）
        for (let user of req.body) {
          let stmt = db.prepare(`INSERT INTO requests (sendUserId, receiveUserId, receiveRoomId, type, remark, progress, createTime) VALUES (?, ?, ?, ?, ?, ?, dateTime('now'));`)
          stmt.run(user.sendUserId, user.receiveUserId, user.receiveRoomId, user.type, user.remark, user.progress)
          let stmt2 = db.prepare(`INSERT INTO messageQueues (userId, originUserId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`)
          stmt2.run(user.receiveUserId, user.sendUserId, 'requestcontact')
        }

        // 提交事务
        db.run('COMMIT');
      })

      res.json({
        isSuccess: true,
        error: null,
        data: null
      })
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/setRequestToRefuse", (req, res) => {
    try {
      console.log("/api/setRequestToRefuse", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id, userId, originUserId } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";

      db.serialize(() => {
        // 开始事务
        db.run('BEGIN TRANSACTION');

        var stmt = db.prepare("UPDATE requests SET progress='refuse' WHERE id=?")
        stmt.run(id)

        var stmt2 = db.prepare(`DELETE FROM messageQueues WHERE userId=? and originUserId=? and type='requestcontact'`)
        stmt2.run(userId, originUserId)

        // 提交事务
        db.run('COMMIT');
      })
      res.json({
        isSuccess: true,
        error: null,
        data: null
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
  app.post("/api/deleteRequest", (req, res) => {
    try {
      console.log("/api/deleteRequest", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      const { id } = req.body;
      if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
      const deleteQuery = 'DELETE FROM requests WHERE id = ?';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
        }
        res.json({
          isSuccess: true,
          error: null,
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

  app.get("/api/getMessageQueues", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getMessageQueues", obj.query);
      var conditions = []
      var conditionSql = ""
      if (obj.query.userId !== undefined) {
        conditionSql += " where userId=? "
        conditions.push(obj.query.userId)
      }
      if (obj.query.type !== undefined) {
        if (conditionSql != "") {
          conditionSql += " and type=? "
        } else {
          conditionSql += " where type=? "
        }
        conditions.push(obj.query.type)
      }

      const query = 'SELECT * FROM messageQueues ' + conditionSql;
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
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
  app.post("/api/deleteMessageQueues", (req, res) => {
    try {
      console.log("/api/deleteMessageQueues", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      if (req.body.length) throw "id不能为0或空";
      let id = req.body.join(",")

      const deleteQuery = 'DELETE FROM messageQueues WHERE id in (?)';
      db.run(deleteQuery, [id], (err) => {
        if (err) {
          throw err;
        }
        res.json({
          isSuccess: true,
          error: null,
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

  app.get("/api/getContactMessages", (req, res) => {
    try {
      const obj = url.parse(req.url, true)
      console.log("/api/getContactMessages", obj.query);

      if (obj.query.myselfId === 0 || obj.query.myselfId === '' || obj.query.myselfId === null || obj.query.myselfId === undefined) throw "myselfId不能为0或空";
      if (obj.query.friendId === 0 || obj.query.friendId === '' || obj.query.friendId === null || obj.query.friendId === undefined) throw "friendId不能为0或空";

      db.run("DELETE FROM messageQueues WHERE userId=? and originUserId=? and type='chatcontact'", [obj.query.myselfId, obj.query.friendId], (err) => {
        if (err) {
          throw err;
        }
        const query = `
        SELECT t1.*,t2.nickName
        FROM contactMessages as t1
        left join users as t2 on t2.id=t1.sendUserId
        where (t1.sendUserId=? and t1.receiveUserId=?) or (t1.sendUserId=? and t1.receiveUserId=?)
        order by t1.createTime`;//查询发送人是自己或他人，接收人是自己或他人
        db.all(query, [obj.query.myselfId, obj.query.friendId, obj.query.friendId, obj.query.myselfId], (err2, rows) => {
          if (err2) {
            throw err2;
          }

          res.json({
            isSuccess: true,
            error: null,
            data: rows
          })
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
  app.post("/api/addContactMessages", (req, res) => {
    try {
      console.log("/api/addContactMessages", req.body);
      if (req.body === undefined) {
        throw '参数不能为空'
      }
      // 开始事务
      db.serialize(() => {
        // 开始事务
        db.run('BEGIN TRANSACTION');

        // 使用循环将数据逐条插入到数据表中（body是集合，前端请传集合过来）
        for (let item of req.body) {
          let stmt = db.prepare(`INSERT INTO contactMessages (sendUserId, receiveUserId, message, createTime) VALUES (?, ?, ?, dateTime('now'));`)
          stmt.run(item.sendUserId, item.receiveUserId, item.message)
          let stmt2 = db.prepare(`INSERT INTO messageQueues (userId, originUserId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`)
          stmt2.run(item.receiveUserId, item.sendUserId, 'chatcontact')
        }

        // 提交事务
        db.run('COMMIT');
      })

      res.json({
        isSuccess: true,
        error: null,
        data: null
      })
    }
    catch (ex) {
      res.json({
        isSuccess: false,
        error: ex,
        data: null
      });
    }
  })
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
    console.log('客户端已连接:', socket.id, "userName:" + socket.handshake.query.userName, "roomId:" + socket.handshake.query.roomId)

    if (socket.handshake.query.roomId) {
      socket.join(socket.handshake.query.roomId)
    }

    // 接收客户端消息
    socket.on('send-message', (message) => {
      console.log('收到消息:', message)

      // 广播给所有客户端（包括发送者）
      io.emit('chat-message', message)

      // 如果只想广播给其他客户端：
      // socket.broadcast.emit('message', message)
    })

    socket.on('send-ContactChatMessage', (data) => {
      console.log('send-ContactChatMessage收到消息:', data)
      if (socket.handshake.query.roomId) {
        io.to(socket.handshake.query.roomId).emit('chat-ContactMessage', data)
      } else {
        io.emit('chat-ContactMessage', data)
      }
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