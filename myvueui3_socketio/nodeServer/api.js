const bodyParser = require('body-parser');
const url = require("url")
const dal = require('./dal')

function initApi(app) {
    //初始化数据库
    dal.initSqlite();

    //app.use(express.json());// 允许解析 JSON 数据
    app.use(bodyParser.json());// 使用 body-parser 中间件来解析请求体

    app.get("/api/getUsers", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getusers", obj.query);

            dal.getUsersAsync(obj.query.limit, obj.query.offset)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (error) {
            res.json({
                isSuccess: false,
                error: error.message,
                data: null
            });
        }
    })
    app.get("/api/getUserByUserNameOrEmail", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getusers", obj.query);

            dal.getUserByUserNameOrEmailAsync(obj.query.userNameOrEmail, obj.query.myselfId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (error) {
            res.json({
                isSuccess: false,
                error: error.message,
                data: null
            });
        }
    })
    app.post("/api/checkUserPassword", (req, res) => {
        try {
            console.log("/api/checkuserpassword", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { userName, password } = req.body;
            if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
            if (password === '' || password === null || password === undefined) throw "password不能为空"

            dal.checkUserPasswordAsync(userName, password)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addUser", (req, res) => {
        try {
            console.log("/api/adduser", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { userName, nickName, email, password, userType } = req.body;
            if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
            if (nickName === '' || nickName === null || nickName === undefined) throw "nickName不能为空"
            if (email === '' || email === null || email === undefined) throw "email不能为空"
            if (password === '' || password === null || password === undefined) throw "password不能为空"
            if (userType === '' || userType === null || userType === undefined) throw "userType不能为空"

            dal.addUserAsync(userName, nickName, email, password, userType)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/updateUser", (req, res) => {
        try {
            console.log("/api/updateuser", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id, userName, nickName, email, password, userType } = req.body;
            if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";
            if (userName === '' || userName === null || userName === undefined) throw "userName不能为空"
            if (nickName === '' || nickName === null || nickName === undefined) throw "nickName不能为空"
            if (email === '' || email === null || email === undefined) throw "email不能为空"
            if (password === '' || password === null || password === undefined) throw "password不能为空"
            if (userType === '' || userType === null || userType === undefined) throw "userType不能为空"

            dal.updateUserAsync(id, userName, nickName, email, password, userType)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/deleteUser", (req, res) => {
        try {
            console.log("/api/deleteuser", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id } = req.body;
            if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";

            dal.deleteUserAsync(id)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })

    app.get("/api/getContacts", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getContacts", obj.query);

            dal.getContactsAsync(obj.query.myselfId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.get("/api/getContactAndCount", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getContactAndCount", obj.query);

            dal.getContactAndCountAsync(obj.query.myselfId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addContact", (req, res) => {
        try {
            console.log("/api/addContact", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { requestId, myselfId, friendId } = req.body;

            dal.addContactAsync(requestId, myselfId, friendId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/deleteContact", (req, res) => {
        try {
            console.log("/api/deleteContact", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id } = req.body;
            if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";

            dal.deleteContactAsync(id)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })

    app.get("/api/getRequests", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getRequests", obj.query);

            dal.getRequestsAsync(obj.query.userId, obj.query.type)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addRequestByContact", (req, res) => {
        try {
            console.log("/api/addRequestByContact", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { sendUserId, receiveUserId, remark } = req.body;
            if (sendUserId === 0 || sendUserId === '' || sendUserId === null || sendUserId === undefined) throw "sendUserId不能为0或空";
            if (receiveUserId === 0 || receiveUserId === '' || receiveUserId === null || receiveUserId === undefined) throw "receiveUserId不能为0或空";
            if (remark === 0 || remark === '' || remark === null || remark === undefined) throw "remark不能为空";

            dal.addRequestByContactAsync(sendUserId, receiveUserId, remark)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/setRequestToRefuse", (req, res) => {
        try {
            console.log("/api/setRequestToRefuse", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id, userId, originUserId } = req.body;
            if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";

            dal.setRequestToRefuseAsync(id, userId, originUserId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/deleteRequest", (req, res) => {
        try {
            console.log("/api/deleteRequest", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id } = req.body;
            if (id === 0 || id === '' || id === null || id === undefined) throw "id不能为0或空";

            dal.deleteRequestAsync(id)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })

    app.get("/api/getMessageQueues", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getMessageQueues", obj.query);

            dal.getMessageQueuesAsync(obj.query.userId, obj.query.type)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/deleteMessageQueues", (req, res) => {
        try {
            console.log("/api/deleteMessageQueues", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            if (req.body.length === 0) throw new Error("参数不能为空");//body是一个集合，如：[1,2,3]

            dal.deleteMessageQueuesAsync(req.body)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
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

            dal.getContactMessagesAsync(obj.query.myselfId, obj.query.friendId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addContactMessage", (req, res) => {
        try {
            console.log("/api/addContactMessage", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }

            const { sendUserId, receiveUserId, message } = req.body;
            if (sendUserId === 0 || sendUserId === '' || sendUserId === null || sendUserId === undefined) throw "sendUserId不能为0或空";
            if (receiveUserId === 0 || receiveUserId === '' || receiveUserId === null || receiveUserId === undefined) throw "receiveUserId不能为0或空";
            if (message === '' || message === null || message === undefined) throw "message不能为空";

            dal.addContactMessageAsync(sendUserId, receiveUserId, message)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })

    app.get("/api/getRooms", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getRooms", obj.query);

            dal.getRoomsAsync(obj.query.myselfId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.get("/api/getRoomByName", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getRoomByName", obj.query);

            if (!obj.query.name) throw "name不能为0或空";

            dal.getRoomByNameAsync(obj.query.name)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.get("/api/getRoomInfo", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getRoomInfo", obj.query);

            if (!obj.query.roomId) throw "roomId不能为0或空";

            dal.getRoomInfoAsync(obj.query.roomId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addRoom", (req, res) => {
        try {
            console.log("/api/addRoom", req.body);
            if (req.body === undefined) {
                throw '参数不能为空'
            }
            const { myselfId, friendIds } = req.body;
            if (!myselfId) throw "myselfId不能为空"
            if (!friendIds || friendIds.length == 0) throw "friendIds不能为空"

            dal.addRoomAsync(myselfId, friendIds)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addRequestByRoom", (req, res) => {
        try {
            console.log("/api/addRequestByRoom", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { sendUserId, receiveUserId, receiveRoomId, remark } = req.body;
            if (!sendUserId) throw "sendUserId不能为0或空";
            if (!receiveUserId) throw "receiveUserId不能为0或空";
            if (!receiveRoomId) throw "receiveRoomId不能为0或空";
            if (!remark) throw "remark不能为空";

            dal.addRequestByRoomAsync(sendUserId, receiveUserId, receiveRoomId, remark)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addRoomUser", (req, res) => {
        try {
            console.log("/api/addRoomUser", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { requestId, roomId, myselfId, friendId } = req.body;

            dal.addRoomUserAsync(requestId, roomId, myselfId, friendId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post('/api/updateRoom', (req, res) => {
        try {
            console.log("/api/updateRoom", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { roomId, name, description } = req.body;

            dal.updateRoomAsync(roomId, name, description)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })

    app.get("/api/getRoomMessages", (req, res) => {
        try {
            const obj = url.parse(req.url, true)
            console.log("/api/getRoomMessages", obj.query);

            if (!obj.query.myselfId) throw "myselfId不能为0或空";
            if (!obj.query.roomId) throw "roomId不能为0或空";

            dal.getRoomMessagesAsync(obj.query.myselfId, obj.query.roomId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/addRoomMessage", (req, res) => {
        try {
            console.log("/api/addRoomMessage", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }

            const { sendUserId, receiveRoomId, message, messageType, originMessageId } = req.body;
            if (!sendUserId) throw "sendUserId不能为0或空";
            if (!receiveRoomId) throw "receiveRoomId不能为0或空";
            if (!message) throw "message不能为空";

            dal.addRoomMessageAsync(sendUserId, receiveRoomId, message, messageType, originMessageId)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    });
                });
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/deleteRoom", (req, res) => {
        try {
            console.log("/api/deleteRoom", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id } = req.body;
            if (!id) throw "id不能为0或空";

            dal.deleteRoomAsync(id)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    app.post("/api/quitRoom", (req, res) => {
        try {
            console.log("/api/quitRoom", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { id, userId } = req.body;
            if (!id) throw "id不能为0或空";
            if (!userId) throw "userId不能为0或空";

            dal.quitRoomAsync(id, userId)
                .then(() => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: null
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
    
    app.post("/api/setMessageRead", (req, res) => {
        try {
            console.log("/api/setMessageRead", req.body);
            if (req.body === undefined) {
                throw new Error('参数不能为空')
            }
            const { userId, originId, type } = req.body;
            if (!userId) throw "userId不能为0或空";
            if (!originId) throw "originId不能为0或空";
            if (!type) throw "type不能为0或空";

            dal.setMessageReadAsync(userId, originId, type)
                .then((data) => {
                    res.json({
                        isSuccess: true,
                        error: null,
                        data: data
                    })
                })
                .catch((error) => {
                    res.json({
                        isSuccess: false,
                        error: error.message,
                        data: null
                    })
                })
        }
        catch (err) {
            res.json({
                isSuccess: false,
                error: err.message,
                data: null
            });
        }
    })
}

module.exports = {
    initApi: initApi
}