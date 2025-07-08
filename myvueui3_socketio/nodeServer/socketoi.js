const { Server } = require('socket.io')
const onlineServer = require('./onlineTest/onlineServer')
const url = require("url")

function initOnlineSetting() {
    //当前在线用户Id-socketIds，一个用户Id对应多个socketId，也就是一个用户可以打开多个页面，当这个用户的全部页面都关闭时，才算用户下线
    let onlineUserKey = {};//样例格式：{ "ID_1": ["socketId1","socketId2"], "ID_2": ["socketId3","socketId4"] }
    let onlineRoomKey = {};//样例格式：{ "ROOM_1": [{ "userId": 1, "socketId": "socketId1" }, { "userId": 2, "socketId": "socketId2" }] }
    function AddOnlineUserId(id, socketId) {
        if (!id) {
            return;
        }
        let key = 'ID_' + id;//转为字符串
        if (onlineUserKey.hasOwnProperty(key)) {
            if (onlineUserKey[key].findIndex(f => f == socketId) === -1) {
                onlineUserKey[key].push(socketId)
            }
        } else {
            onlineUserKey[key] = [socketId]
        }
    }
    function RemoveOnlineUserId(id, socketId) {
        if (!id) {
            return;
        }
        let key = 'ID_' + id;//转为字符串
        if (!onlineUserKey.hasOwnProperty(key)) {
            return
        }
        var index = onlineUserKey[key].findIndex(f => f == socketId);
        if (index !== -1) {
            onlineUserKey[key].splice(index, 1);
            if (onlineUserKey[key].length === 0) {
                Reflect.deleteProperty(onlineUserKey, key);
            }
        }
    }
    function GetOnlineUserIds() {
        let onlineUserIds = [];//当前在线用户Id
        for (var key in onlineUserKey) {
            onlineUserIds.push(key.replace('ID_', ''))
        }
        return onlineUserIds;
    }
    function GetOnlineUserKey() {
        return onlineUserKey
    }

    function AddOnlineRoomUserId(roomId, userId, socketId) {
        console.log('AddOnlineRoomUserId', roomId);
        if (roomId === null || roomId === '' || roomId === undefined || roomId === 'null') {
            return;
        }
        if (!userId) {
            return;
        }
        let key = 'ID_' + roomId;//转为字符串
        if (onlineRoomKey.hasOwnProperty(key)) {
            if (onlineRoomKey[key].findIndex(f => f.userId == userId && f.socketId == socketId) === -1) {
                onlineRoomKey[key].push({ userId: userId, socketId: socketId })
            }
        } else {
            onlineRoomKey[key] = [{ userId: userId, socketId: socketId }]
        }
    }
    function RemoveOnlineRoomUserId(roomId, userId, socketId) {
        if (roomId === null || roomId === '' || roomId === undefined || roomId === 'null') {
            return;
        }
        if (!userId) {
            return;
        }
        let key = 'ID_' + roomId;//转为字符串
        if (!onlineRoomKey.hasOwnProperty(key)) {
            return
        }
        var index = onlineRoomKey[key].findIndex(f => f.userId == userId && f.socketId == socketId);
        if (index !== -1) {
            onlineRoomKey[key].splice(index, 1);
            if (onlineRoomKey[key].length === 0) {
                Reflect.deleteProperty(onlineRoomKey, key);
            }
        }
    }
    function GetOnlineRoomUserIds(roomId) {
        if (!roomId) {
            return [];
        }
        let key = 'ID_' + roomId;//转为字符串
        if (!onlineRoomKey.hasOwnProperty(key)) {
            return [];
        }
        let onlineUserIds = [];//当前房间内用户Id
        for (let i = 0; i < onlineRoomKey[key].length; i++) {
            let userId = onlineRoomKey[key][i].userId
            if (!onlineUserIds.includes(userId)) {
                onlineUserIds.push(userId);
            }
        }
        return onlineUserIds;
    }
    function GetOnlineRoomKey() {
        return onlineRoomKey
    }

    return {
        addOnlineUserId: AddOnlineUserId,
        removeOnlineUserId: RemoveOnlineUserId,
        getOnlineUserIds: GetOnlineUserIds,
        getOnlineUserKey: GetOnlineUserKey,

        addOnlineRoomUserId: AddOnlineRoomUserId,
        removeOnlineRoomUserId: RemoveOnlineRoomUserId,
        getOnlineRoomUserIds: GetOnlineRoomUserIds,
        getOnlineRoomKey: GetOnlineRoomKey
    }
}

function initSocket(app, httpServer, onlineSetting) {
    var snakeServer = null;//snake实例
    var snakeServer2 = null;//snake实例

    // 创建 Socket.IO 实例
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // 开发时可放宽限制
            methods: ['GET', 'POST']
        }
    })
    // Socket 连接监听
    io.on('connection', (socket) => {
        console.log('客户端已连接:', socket.id, "userId:" + socket.handshake.query.userId, "userName:" + socket.handshake.query.userName, "roomId:" + socket.handshake.query.roomId, "otherId:" + socket.handshake.query.otherId)

        onlineSetting.addOnlineUserId(socket.handshake.query.userId, socket.id);

        if (socket.handshake.query.roomId !== null &&
            socket.handshake.query.roomId !== '' &&
            socket.handshake.query.roomId !== undefined &&
            socket.handshake.query.roomId !== 'null') {
            socket.join(socket.handshake.query.roomId)
            onlineSetting.addOnlineRoomUserId(socket.handshake.query.roomId, socket.handshake.query.userId, socket.id)
            // 如果只想广播给其他客户端：
            io.emit('joinroom', socket.handshake.query.roomId)
        }
        if (socket.handshake.query.otherId !== null &&
            socket.handshake.query.otherId !== '' &&
            socket.handshake.query.otherId !== undefined &&
            socket.handshake.query.otherId !== 'null') {

            if (socket.handshake.query.otherId === 'snake001') {
                socket.on('back-OtherMessage', (data) => {
                    console.log('back-OtherMessage收到消息:', socket.handshake.query.otherId, data)

                    //已经实例化过不重复实例化
                    if (snakeServer === null) {
                        snakeServer = onlineServer.initSnake(io, data.canvasWidth, data.gridSize);
                    }
                    if (data.isResetGame) {
                        snakeServer.resetGame();
                    }
                    else {
                        snakeServer.addUserId(data.userId, data.nickName);
                        snakeServer.input(data.direction, data.userId)
                    }
                    //io.emit('front-OtherMessage', {})
                })
            }

            if (socket.handshake.query.otherId === 'snake002') {
                socket.on('back-OtherMessage', (data) => {
                    console.log('back-OtherMessage收到消息:', socket.handshake.query.otherId, data)

                    //已经实例化过不重复实例化
                    if (snakeServer2 === null) {
                        snakeServer2 = onlineServer.initSnake2(io, data.timeRemaining, data.canvasWidth, data.gridSize);
                    }
                    if (data.isResetGame) {
                        snakeServer2.resetGame(data.nickName);
                    } 
                    else if (data.isReady){
                        snakeServer2.readyUserId(data.userId)
                    } 
                    else {
                        snakeServer2.addUserId(data.userId, data.nickName);
                        snakeServer2.input(data.direction, data.userId)
                    }
                    //io.emit('front-OtherMessage', {})
                })
            }
        }

        //用户登录
        socket.on('userlogin', (data) => {
            console.log('userlogin收到消息:', data)
            io.emit('getuserlogin', onlineSetting.getOnlineUserIds())
        })
        //用户退出
        socket.on('userquit', (data) => {
            console.log('userquit收到消息:', data)
            onlineSetting.removeOnlineUserId(data, socket.id);
            onlineSetting.removeOnlineRoomUserId(socket.handshake.query.roomId, socket.handshake.query.userId, socket.id)
            // 如果只想广播给其他客户端：
            socket.broadcast.emit('getuserquit', onlineSetting.getOnlineUserIds())
            if (socket.handshake.query.roomId !== null &&
                socket.handshake.query.roomId !== '' &&
                socket.handshake.query.roomId !== undefined &&
                socket.handshake.query.roomId !== 'null') {
                io.emit('quitroom', socket.handshake.query.roomId)
            }
        })
        // 断开连接处理
        socket.on('disconnect', () => {
            console.log('客户端断开:', socket.handshake.query.userId)
            onlineSetting.removeOnlineUserId(socket.handshake.query.userId, socket.id);
            onlineSetting.removeOnlineRoomUserId(socket.handshake.query.roomId, socket.handshake.query.userId, socket.id)
            // 如果只想广播给其他客户端：
            socket.broadcast.emit('getdisconnect', onlineSetting.getOnlineUserIds())
            if (socket.handshake.query.roomId !== null &&
                socket.handshake.query.roomId !== '' &&
                socket.handshake.query.roomId !== undefined &&
                socket.handshake.query.roomId !== 'null') {
                io.emit('quitroom', socket.handshake.query.roomId)
            }
            if (snakeServer !== null) {
                snakeServer.removeUserId(socket.handshake.query.userId);
            }
            if (snakeServer2 !== null) {
                snakeServer2.removeUserId(socket.handshake.query.userId);
            }
        })

        socket.on('send-ContactChatMessage', (data) => {
            console.log('send-ContactChatMessage收到消息:', socket.handshake.query.userName, data)
            io.emit('chat-ContactMessage', data)
        })
        socket.on('send-RoomChatMessage', (data) => {
            console.log('send-RoomChatMessage收到消息:', socket.handshake.query.userName, data)
            if (!socket.handshake.query.roomId) {
                return
            }
            if (data.messageType == '3-2') {
                //如果聊天是发的消息类型是3-2就是斗地主发牌
                data.doudizhu = onlineServer.initDoudizhu(data.roomUserIds)
            }
            io.to(socket.handshake.query.roomId).emit('chat-RoomChatMessage', data)
            if (data.roomUserIds && data.roomUserIds.length > 0) {
                io.emit('message-RoomChat', data.roomUserIds)//由于群聊的按roomId来发消息了，如果群聊的所有用户有的没有在房间内就没有任何的消息通知了，所以这里再发一个通知给前端刷新右上角
            }
        })
        socket.on('send-RefreshMessage', (data) => {
            console.log('send-RefreshMessage收到消息:', socket.handshake.query.userName, data)
            io.emit('message-Refresh', data)//用户Id集合
        })
    })

    app.get("/api/getOnlineUserIds", (req, res) => {
        var ids = onlineSetting.getOnlineUserIds();
        res.json({
            isSuccess: true,
            error: null,
            data: ids
        });
    })
    app.get("/api/getOnlineUserKey", (req, res) => {
        var key = onlineSetting.getOnlineUserKey();
        res.json({
            isSuccess: true,
            error: null,
            data: key
        });
    })
    app.get("/api/getOnlineRoomUserIds", (req, res) => {
        const obj = url.parse(req.url, true)
        var ids = onlineSetting.getOnlineRoomUserIds(obj.query.roomId);
        res.json({
            isSuccess: true,
            error: null,
            data: ids
        });
    })
    app.get("/api/getOnlineRoomKey", (req, res) => {
        var ids = onlineSetting.getOnlineRoomKey();
        res.json({
            isSuccess: true,
            error: null,
            data: ids
        });
    })
}

module.exports = {
    initSocket: initSocket,
    initOnlineSetting: initOnlineSetting
}