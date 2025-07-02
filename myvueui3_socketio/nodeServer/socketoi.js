const { Server } = require('socket.io')
const onlineServer = require('./onlineTest/onlineServer')

function initOnlineSetting() {
    //当前在线用户Id-socketIds，一个用户Id对应多个socketId，也就是一个用户可以打开多个页面，当这个用户的全部页面都关闭时，才算用户下线
    let onlineUserKey = {};
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
    return {
        addOnlineUserId: AddOnlineUserId,
        removeOnlineUserId: RemoveOnlineUserId,
        getOnlineUserIds: GetOnlineUserIds,
        getOnlineUserKey: GetOnlineUserKey
    }
}

function initSocket(app, httpServer, onlineSetting) {

    // 创建 Socket.IO 实例
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // 开发时可放宽限制
            methods: ['GET', 'POST']
        }
    })
    // Socket 连接监听
    io.on('connection', (socket) => {
        console.log('客户端已连接:', socket.id, "userId:" + socket.handshake.query.userId, "userName:" + socket.handshake.query.userName, "roomId:" + socket.handshake.query.roomId)

        onlineSetting.addOnlineUserId(socket.handshake.query.userId, socket.id);

        if (socket.handshake.query.roomId) {
            socket.join(socket.handshake.query.roomId)
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
            // 如果只想广播给其他客户端：
            socket.broadcast.emit('getuserquit', onlineSetting.getOnlineUserIds())
        })
        // 断开连接处理
        socket.on('disconnect', () => {
            console.log('客户端断开:', socket.handshake.query.userId)
            onlineSetting.removeOnlineUserId(socket.handshake.query.userId, socket.id);
            // 如果只想广播给其他客户端：
            socket.broadcast.emit('getdisconnect', onlineSetting.getOnlineUserIds())
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
            if(data.messageType == '3-2'){
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
}

module.exports = {
    initSocket: initSocket,
    initOnlineSetting: initOnlineSetting
}