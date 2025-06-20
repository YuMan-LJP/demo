const sqlite3 = require("sqlite3").verbose();

function dbGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            err ? reject(err) : resolve(row);
        })
    })
}
function dbAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            err ? reject(err) : resolve(rows);
        })
    })
}
function dbRun(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            err ? reject(err) : resolve(this);
        });
    });
}
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

module.exports = {

    initSqlite: () => {
        const db = new sqlite3.Database("mydb.sqlite");
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
CREATE TABLE IF NOT EXISTS roomMessages (
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
originId INTEGER NOT NULL,  --消息来源的人或群
type TEXT(100) NOT NULL,  --requestcontact联系人申请/requestroom群申请/chatcontact联系人聊天/chatroom群聊天
createTime NUMERIC NOT NULL
);

--初始化数据库时，插入一条管理员数据
--INSERT INTO users (userName,nickName,email,password,userType)VALUES ('admin','admin','admin@ljp.com','123qwe!Q','admin');
`;
        dbRun(db, createTable).then(() => console.log('数据库初始化完成')).catch(err => console.log('数据库初始化异常', err))
    },

    //样例格式
    testAsync: async () => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = null
        try {
            //TODO...
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },


    getUsersAsync: async (limit, offset) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = { data: [], count: 0 }
        try {
            var conditions = []
            var conditionSql = ""
            if (limit !== undefined && offset !== undefined) {
                conditions.push(limit);
                conditions.push(offset);
                conditionSql += 'LIMIT ? OFFSET ?'//OFFSET必须在LIMIT后面使用，如果只需要跳过几条的话，就把LIMIT的值设的非常大即可
            }
            if (limit === undefined && offset !== undefined) {
                throw new Error('offset不能单独使用, 必须配合limit')
            }

            await dbAll(db, 'SELECT * FROM users ' + conditionSql, conditions)
                .then((rows) => {
                    result.data = rows
                })
                .catch((err) => {
                    throw err
                })

            await dbGet(db, "SELECT COUNT(*) as count FROM users")
                .then((row) => {
                    result.count = row
                })
                .catch((err) => {
                    throw err
                })
        }
        catch (err) {
            throw err
        } finally {
            db.close();
        }

        return result
    },
    getUserByUserNameOrEmailAsync: async (userNameOrEmail, myselfId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            var conditions = []
            var conditionSql = ""
            if (userNameOrEmail) {
                conditionSql += ` where (userName like ? or email like ?)`
                conditions = [`%${userNameOrEmail}%`, `%${userNameOrEmail}%`]
            }
            if (myselfId) {
                if (conditionSql != "") {
                    conditionSql += ` and exists(select * from contacts where contacts.myselfId=? and contacts.friendId=users.id)`
                } else {
                    conditionSql += ` where exists(select * from contacts where contacts.myselfId=? and contacts.friendId=users.id)`
                }
                conditions.push(myselfId)
            }
            await dbAll(db, `SELECT id,userName,nickName,email FROM users ` + conditionSql, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                })
        }
        catch (err) {
            throw err
        } finally {
            db.close();
        }

        return result
    },
    checkUserPasswordAsync: async (userName, password) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = {}
        try {
            await dbGet(db, `select id,userName,nickName,email,userType from users where userName = ? and password = ?`, [userName, password])
                .then((data) => {
                    result = data
                })
                .catch((err) => {
                    throw err
                })
        }
        catch (err) {
            throw err
        } finally {
            db.close();
        }

        return result
    },
    addUserAsync: async (userName, nickName, email, password, userType) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = {}
        try {
            await dbGet(db, `select userName from users where userName = ?`, [userName])
                .then((data) => {
                    if (data) {
                        throw new Error(`[${userName}]已存在相同User Name`)
                    }
                })
                .catch((err) => { throw err })

            await dbRun(db,
                `INSERT INTO users (userName, nickName, email, password, userType) VALUES (?, ?, ?, ?, ?)`,
                [userName, nickName, email, password, userType])
                .catch((err) => { throw err })

            await dbGet(db, 'SELECT * FROM users where username=?', [userName])
                .then((data) => {
                    result = data
                })
                .catch((err) => { throw err })
        }
        catch (err) {
            throw err
        } finally {
            db.close();
        }

        return result
    },
    updateUserAsync: async (id, userName, nickName, email, password, userType) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = {}
        try {
            await dbGet(db, `select userName from users where userName = ? and id != ?`, [userName, id])
                .then((data) => {
                    if (data) {
                        throw new Error(`[${userName}]已存在相同User Name`)
                    }
                })
                .catch((err) => { throw err })

            await dbRun(db,
                `UPDATE users SET username=?, nickName=?, email=?, password=?, userType=? WHERE id=?`,
                [userName, nickName, email, password, userType, id])
                .catch((err) => { throw err })

            await dbGet(db, 'SELECT * FROM users where username=?', [userName])
                .then((data) => {
                    result = data
                })
                .catch((err) => { throw err })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    deleteUserAsync: async (id) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            await dbRun(db,
                'DELETE FROM users WHERE id = ?',
                [id])
                .catch((err) => { throw err })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    },


    getContactsAsync: async (myselfId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {

            var conditions = []
            var conditionSql = ""
            if (myselfId !== undefined) {
                conditionSql += " where t1.myselfId=? "
                conditions.push(myselfId)
            }
            const query = `
            select t1.*,t2.nickName,t2.email,t3.id is null as 'isInvalid'
            from contacts as t1
            left join users as t2 on t2.id=t1.friendId
            left join contacts as t3 on t3.myselfId=t1.friendId and t3.friendId=t1.myselfId
            ` + conditionSql;

            await dbAll(db, query, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                })

        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    getContactAndCountAsync: async (myselfId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = null
        try {
            var conditions = []
            var conditionSql = ""
            if (myselfId !== undefined) {
                conditionSql += " where t1.myselfId=? "
                conditions.push(myselfId)
            }

            const query = `
            select t1.*,t2.nickName,t2.email,IFNULL(t3.count, 0) as 'count',t4.id is null as 'isInvalid'
            from contacts as t1
            left join users as t2 on t2.id=t1.friendId
            left join (
                select userId,originId,Count(*) as 'count' from messageQueues 
                where type='chatcontact'
                group by userId,originId
            ) as t3 on t3.userId=t1.myselfId and t3.originId=t1.friendId
            left join contacts as t4 on t4.myselfId=t1.friendId and t4.friendId=t1.myselfId
            ` + conditionSql;
            await dbAll(db, query, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addContactAsync: async (requestId, myselfId, friendId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = null
        try {
            var chatKey = `chatcontact_${myselfId}_${friendId}`;

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                //双方都各插入一条联系人数据，如果A先删除了B，只删除A自己这边的，B的不删除，B还是可以看到A，等A再次加回来B的时候注意已经有了就不重复插入了（A删了B，B再发送消息给A时，就会提示对方已将你删除了）
                await dbRun(db, `INSERT INTO contacts (myselfId, friendId, chatKey) SELECT ?, ?, ? where not exists(select * from contacts where myselfId=? and friendId=?)`, [myselfId, friendId, chatKey, myselfId, friendId])
                await dbRun(db, `INSERT INTO contacts (myselfId, friendId, chatKey) SELECT ?, ?, ? where not exists(select * from contacts where myselfId=? and friendId=?)`, [friendId, myselfId, chatKey, friendId, myselfId])

                await dbRun(db, `UPDATE requests SET progress='pass' WHERE id=?`, [requestId])

                await dbRun(db, `DELETE FROM messageQueues WHERE userId=? and originId=? and type='requestcontact'`, [myselfId, friendId])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    deleteContactAsync: async (id) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            await dbRun(db, 'DELETE FROM contacts WHERE id = ?', [id]).catch((err) => { throw err })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    },


    getRequestsAsync: async (userId, type) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            var conditions = []
            var conditionSql = ""
            if (userId !== undefined) {
                conditionSql += " where (t1.sendUserId=? or t1.receiveUserId=?) "
                conditions.push(userId)
                conditions.push(userId)
            }
            if (type !== undefined) {
                if (conditionSql != "") {
                    conditionSql += " and t1.type=? "
                } else {
                    conditionSql += " where t1.type=? "
                }
                conditions.push(type)
            }

            const query = `
            SELECT t1.*,t2.nickName as 'sendUserName',t3.nickName as 'receiveUserName',t4.name as 'roomName',t4.description
            FROM requests as t1
            left join users as t2 on t2.id=t1.sendUserId
            left join users as t3 on t3.id=t1.receiveUserId
            left join rooms as t4 on t4.id=t1.receiveRoomId and t1.type='room'
            ` + conditionSql;
            await dbAll(db, query, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                });
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addRequestByContactAsync: async (sendUserId, receiveUserId, remark) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            //校验是否已经申请过，如果申请被拒绝了可以重复申请，注意A发给B或B发给A，都算重复了
            await dbAll(db, `SELECT * FROM requests WHERE ((sendUserId=? and receiveUserId=?) or (sendUserId=? and receiveUserId=?)) and type='contact' and progress!='refuse'`, [sendUserId, receiveUserId, receiveUserId, sendUserId])
                .then((rows) => {
                    if (rows && rows.length > 0) {
                        throw new Error('已经申请过了，不能重复申请')
                    }
                })
                .catch((err) => {
                    throw err
                })

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `INSERT INTO requests (sendUserId, receiveUserId, receiveRoomId, type, remark, progress, createTime) VALUES (?, ?, ?, 'contact', ?, 'waiting', dateTime('now'));`, [sendUserId, receiveUserId, null, remark])

                await dbRun(db, `INSERT INTO messageQueues (userId, originId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`, [receiveUserId, sendUserId, 'requestcontact'])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }

            result = true
        }
        catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },
    setRequestToRefuseAsync: async (id, userId, originUserId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `UPDATE requests SET progress='refuse' WHERE id=?`, [id])

                await dbRun(db, `DELETE FROM messageQueues WHERE userId=? and originId=? and type='requestcontact'`, [userId, originUserId])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }

            result = true
        }
        catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },
    deleteRequestAsync: async (id) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            await dbRun(db, 'DELETE FROM requests WHERE id = ?', [id]).catch((err) => { throw err })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    },


    getMessageQueuesAsync: async (userId, type) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            var conditions = []
            var conditionSql = ""
            if (userId !== undefined) {
                conditionSql += " where userId=? "
                conditions.push(userId)
            }
            if (type !== undefined) {
                if (conditionSql != "") {
                    conditionSql += " and type=? "
                } else {
                    conditionSql += " where type=? "
                }
                conditions.push(type)
            }

            const query = 'SELECT * FROM messageQueues ' + conditionSql;
            await dbAll(db, query, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                });
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    deleteMessageQueuesAsync: async (ids = []) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            await dbRun(db, 'DELETE FROM messageQueues WHERE id in (?)', [ids.join(",")]).catch((err) => { throw err })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    },


    getContactMessagesAsync: async (myselfId, friendId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            await dbRun(db, "DELETE FROM messageQueues WHERE userId=? and originId=? and type='chatcontact'", [myselfId, friendId])
                .catch((err) => {
                    throw err
                });
            const query = `
                SELECT t1.*,t2.nickName
                FROM contactMessages as t1
                left join users as t2 on t2.id=t1.sendUserId
                where (t1.sendUserId=? and t1.receiveUserId=?) or (t1.sendUserId=? and t1.receiveUserId=?)
                order by t1.createTime`;//查询发送人是自己或他人，接收人是自己或他人
            await dbAll(db, query, [myselfId, friendId, friendId, myselfId])
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                });
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addContactMessageAsync: async (sendUserId, receiveUserId, message) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            //校验是否已经申请过，如果申请被拒绝了可以重复申请
            await dbAll(db, `SELECT * FROM contacts WHERE myselfId=? and friendId=?`, [receiveUserId, sendUserId])
                .then((rows) => {
                    if (!rows || rows.length == 0) {
                        throw new Error('无法发送消息给对方，您已被对方从联系人中删除')
                    }
                })
                .catch((err) => {
                    throw err
                })

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `INSERT INTO contactMessages (sendUserId, receiveUserId, message, createTime) VALUES (?, ?, ?, dateTime('now'));`, [sendUserId, receiveUserId, message])
                await dbRun(db, `INSERT INTO messageQueues (userId, originId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`, [receiveUserId, sendUserId, 'chatcontact'])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }

            result = true
        }
        catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },


    getRoomsAsync: async (myselfId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            const query = `
            select t1.*,t2.nickName,IFNULL(t3.count, 0) as 'count'
            from rooms as t1
            left join users as t2 on t2.id=t1.createUserId
            left join (
                select userId,originId,Count(*) as 'count' from messageQueues 
                where type='chatroom'
                group by userId,originId
            ) as t3 on t3.originId=t1.id and t3.userId=?
            where exists(
                select * from roomUsers as w1 where w1.roomId=t1.id and w1.userId=?
            )
            `;
            await dbAll(db, query, [myselfId, myselfId])
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                })

        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    getRoomByNameAsync: async (name) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {

            var conditions = []
            var conditionSql = ""
            if (name !== undefined) {
                conditionSql += " where t1.name=? "
                conditions.push(name)
            }
            const query = `
            select t1.*,t2.nickName
            from rooms as t1
            left join users as t2 on t2.id=t1.createUserId
            ` + conditionSql;

            await dbAll(db, query, conditions)
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                })

        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    getRoomInfoAsync: async (roomId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = {}
        try {
            await dbGet(db, `select * from rooms where id=?`, [roomId])
                .then((row) => {
                    result = row
                })
                .catch((err) => {
                    throw err
                })

            await dbAll(db, `select t1.userId,t2.userName,t2.nickName,t2.email 
            from roomUsers as t1
            left join users as t2 on t2.id=t1.userId
            where t1.roomId=?`, [roomId])
                .then((rows) => {
                    result.users = rows
                })
                .catch((err) => {
                    throw err
                })
        } catch (err) {
            throw err
        } finally {
            db.close();
        }

        return result
    },
    addRoomAsync: async (myselfId, friendIds = []) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = true
        try {
            var names = []
            var ids = friendIds.concat([myselfId])
            var userSql = 'SELECT nickName FROM users where id in (';
            for (var id of ids) {
                userSql += '?,'
            }
            userSql = userSql.slice(0, -1) + ")"
            await dbAll(db, userSql, ids)
                .then((rows) => {
                    names = rows
                })
                .catch((err) => {
                    throw err
                })
            if (names.length === 0 || names.length !== ids.length) {
                throw new Error('找不到用户')
            }

            var roomName = ''//房间名默认是所有人的昵称用逗号拼接
            names.forEach(f => { roomName += (roomName != "" ? "," + f.nickName : f.nickName) })

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                var roomId = 0
                await dbRun(db, `INSERT INTO rooms (name, description, type, createUserId, createTime) VALUES (?, ?, ?, ?, dateTime('now'));`, [roomName, '', '', myselfId])
                await dbGet(db, `select last_insert_rowId() as 'rowId';`)//获取刚刚插入的自增id
                    .then((row) => {
                        roomId = row.rowId
                    })
                    .catch((err) => {
                        throw err
                    });

                await dbRun(db, `INSERT INTO roomUsers (roomId, userId) VALUES (?, ?);`, [roomId, myselfId])
                for (var friendId of friendIds) {
                    await dbRun(db, `INSERT INTO roomUsers (roomId, userId) VALUES (?, ?);`, [roomId, friendId])
                }

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
        } catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addRequestByRoomAsync: async (sendUserId, receiveUserId, receiveRoomId, remark) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            //校验是否已经申请过，如果申请被拒绝了可以重复申请，注意A发给B或B发给A，都算重复了
            await dbAll(db, `SELECT * FROM requests WHERE ((sendUserId=? and receiveRoomId=?) or (sendUserId=? and receiveRoomId=?)) and type='room' and progress!='refuse'`, [sendUserId, receiveRoomId, receiveRoomId, sendUserId])
                .then((rows) => {
                    if (rows && rows.length > 0) {
                        throw new Error('已经申请过了，不能重复申请')
                    }
                })
                .catch((err) => {
                    throw err
                })

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `INSERT INTO requests (sendUserId, receiveUserId, receiveRoomId, type, remark, progress, createTime) VALUES (?, ?, ?, 'room', ?, 'waiting', dateTime('now'));`, [sendUserId, receiveUserId, receiveRoomId, remark])

                await dbRun(db, `INSERT INTO messageQueues (userId, originId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`, [receiveUserId, sendUserId, 'requestroom'])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }

            result = true
        }
        catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addRoomUserAsync: async (requestId, roomId, myselfId, friendId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `INSERT INTO roomUsers (roomId, userId) SELECT ?, ? where not exists(select * from roomUsers where roomId=? and userId=?)`, [roomId, friendId, roomId, friendId])

                await dbRun(db, `UPDATE requests SET progress='pass' WHERE id=?`, [requestId])

                await dbRun(db, `DELETE FROM messageQueues WHERE userId=? and originId=? and type='requestroom'`, [myselfId, friendId])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
            result = true
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    updateRoomAsync: async (roomId, name, description) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = null
        try {
            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `UPDATE rooms set name=?,description=? where id=?`, [name, description, roomId])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
            result = true
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },

    getRoomMessagesAsync: async (myselfId, roomId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = []
        try {
            await dbRun(db, "DELETE FROM messageQueues WHERE userId=? and originId=? and type='chatroom'", [myselfId, roomId])
                .catch((err) => {
                    throw err
                });
            const query = `
                SELECT t1.*,t2.nickName
                FROM roomMessages as t1
                left join users as t2 on t2.id=t1.sendUserId
                where t1.receiveRoomId=?
                order by t1.createTime`;
            await dbAll(db, query, [roomId])
                .then((rows) => {
                    result = rows
                })
                .catch((err) => {
                    throw err
                });
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
        return result
    },
    addRoomMessageAsync: async (sendUserId, receiveRoomId, message) => {
        const db = new sqlite3.Database("mydb.sqlite");

        var result = false
        try {
            var roomUsers = []
            await dbAll(db, `SELECT * FROM roomUsers WHERE roomId=?`, [receiveRoomId])
                .then((rows) => {
                    if (!rows || rows.length == 0) {
                        throw new Error('无法发送消息，您已不再群聊中')
                    }
                    roomUsers = rows
                })
                .catch((err) => {
                    throw err
                })
            if (roomUsers.findIndex(f => f.userId == sendUserId) === -1) {
                throw new Error('无法发送消息，您已不再群聊中')
            }

            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                await dbRun(db, `INSERT INTO roomMessages (sendUserId, receiveRoomId, message, createTime) VALUES (?, ?, ?, dateTime('now'));`, [sendUserId, receiveRoomId, message])
                for (var roomUser of roomUsers) {//给这个房间的所有人，除了发送人自己，都发送消息
                    if (roomUser.userId != sendUserId) {
                        await dbRun(db, `INSERT INTO messageQueues (userId, originId, type, createTime) VALUES (?, ?, ?, dateTime('now'));`, [roomUser.userId, receiveRoomId, 'chatroom'])
                    }
                }

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }

            result = true
        }
        catch (err) {
            result = false
            throw err
        } finally {
            db.close();
        }
        return result
    },
    deleteRoomAsync: async (id) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                //删除队列通知、房间人员、房间，不用删除聊天记录
                await dbRun(db, 'DELETE FROM messageQueues WHERE originId=?', [id])
                await dbRun(db, 'DELETE FROM roomUsers WHERE roomId=?', [id])
                await dbRun(db, 'DELETE FROM rooms WHERE id=?', [id])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    },
    quitRoomAsync: async (id, userId) => {
        const db = new sqlite3.Database("mydb.sqlite");

        try {
            try {
                await dbRun(db, 'BEGIN TRANSACTION')// 开始事务

                //删除当前人的队列通知、房间人员，不用删除聊天记录
                await dbRun(db, 'DELETE FROM messageQueues WHERE originId=? and userId=?', [id, userId])
                await dbRun(db, 'DELETE FROM roomUsers WHERE roomId=? and userId=?', [id, userId])

                await dbRun(db, 'COMMIT')// 提交事务
            }
            catch (err) {
                await dbRun(db, "ROLLBACK");// 错误时回滚
                result = false
                throw err
            }
        } catch (err) {
            throw err
        } finally {
            db.close();
        }
    }
}