<template>
    <div>
        <el-container style="min-height: calc(100vh - 150px);">
            <el-header>Chat Room [<span v-html="curRoom != null ? curRoom.name : ''"></span>]</el-header>
            <el-container>
                <el-container @click="debounceClickChatDiv">
                    <el-main style="border: 1px solid;border-radius: 5px;margin: 1px;padding: 5px;" id="chatMessageDiv">
                        <div style="max-height: calc(100vh - 400px)">
                            <div v-for="item in chatMessages"
                                style="margin: 5px 10px;background-color: blanchedalmond;padding: 5px;border-radius: 5px;width: fit-content;">
                                <span>{{ item.nickName }}:</span>{{ item.message }}
                            </div>
                        </div>
                    </el-main>
                    <el-footer
                        style="background-color: #e6e6fad4;border: 1px solid;border-radius: 5px;margin: 1px;padding: 0px;">
                        <div>
                            <el-input v-model="sendText" style="width: calc(100% - 50px)"
                                :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input">
                            </el-input>
                            <el-button type="success" size="small" @click="sendMessage">发送</el-button>
                        </div>
                    </el-footer>
                </el-container>
                <el-aside width="200px"
                    style="background-color: lavender;border: 1px solid;border-radius: 5px;margin: 1px;">
                    <div>
                        群成员
                        <div v-for="item in roomUsers" class="roomUser">
                            <span :style="'color:' + item.onlineStatus">{{ item.nickName }}</span>

                            <el-button @click="removeUserFromRoom(item.userId)"
                                v-if="curRoom.createUserId === curUser.id && item.userId !== curUser.id"
                                style="float: right;" type="danger" size="small" circle><el-icon>
                                    <Delete />
                                </el-icon></el-button>
                        </div>
                    </div>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import { useRoute } from 'vue-router';
export default {
    name: 'ChatRoom',
    data() {
        return {
            roomId: null,
            curRoom: null,
            roomUsers: [],
            curUser: null,
            socket: null,
            socketid: '',

            sendText: '',
            chatMessages: [],

            onlineUserIds: [],

            debounceClickChatDiv: () => { },//防抖
        }
    },
    methods: {
        loadRoomInfo(callback) {
            if (this.roomId == null) {
                this.$swalError('系统提示', '找不到群ID');
                return;
            }
            this.$get(`/api/getRoomInfo?roomId=${this.roomId}`).then((response) => {
                this.curRoom = response.data.data;
                this.roomUsers = response.data.data.users;
                if (callback) {
                    callback();
                }
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        scrollChatMessageDiv() {
            try {
                this.$nextTick(() => {
                    //将聊天窗口滚到到底部
                    var div = document.querySelector("#chatMessageDiv")
                    div.scrollTop = div.scrollHeight
                })
            }
            catch (ex) { console.error(ex) }
        },
        loadMessage() {
            if (this.roomId == null) {
                return;
            }
            this.$get(`/api/getRoomMessages?myselfId=${this.curUser.id}&roomId=${this.roomId}`).then((response) => {
                this.chatMessages = response.data.data;
                this.$bus.emit('messageChange')
                this.scrollChatMessageDiv();
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        sendMessage() {
            if (this.roomId == null) {
                return;
            }
            if (!this.sendText) {
                this.$swalError('系统提示', '消息不能为空');
                return;
            }

            var inputDto = {
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.sendText,
            }

            this.$post(`/api/addRoomMessage`, inputDto).then((response) => {
                if (response.data.isSuccess) {
                    inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                    this.socket.emit('send-RoomChatMessage', inputDto);
                    this.sendText = ""
                    this.scrollChatMessageDiv();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        clickChatDiv() {
            //点击聊天区域时，直接设置当前聊天对象已读
            if (this.roomId == null) {
                return;
            }
            this.loadMessage()
        },
        removeUserFromRoom(userId) {
            this.$swalConfirm(this.$t("app.systemTips"), "确定要移除这个用户吗？", (isConfirmed) => {
                if (isConfirmed) {
                    this.$post("/api/quitRoom", { id: this.roomId, userId: userId }).then((response) => {
                        if (response.data.isSuccess) {
                            var index = this.roomUsers.findIndex(f => f.userId == userId);
                            this.roomUsers.splice(index, 1);
                        }
                        else {
                            this.$swalError('系统提示', response.data.error);
                        }
                    }).catch((err) => {
                        this.$swalError('系统提示', err);
                    })
                }
            })
        },

        initSocket() {
            if (this.roomId == null) {
                return;
            }
            //服务器地址
            this.socket = io('http://192.168.1.234:5005/', {
                query: {
                    userId: this.curUser.id,
                    userName: this.curUser.userName,
                    roomId: this.roomId
                }
            });

            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket.connected, this.socket.id);
                this.socketid = this.socket.id
            });
            // 接收消息
            this.socket.on('chat-RoomChatMessage', (data) => {
                //接收到新的消息时，如果发送人和接收人是当前聊天窗口的人，就追加消息到聊天窗口
                if (data.receiveRoomId == this.roomId) {
                    this.chatMessages.push({
                        sendUserId: data.sendUserId,
                        receiveRoomId: data.receiveRoomId,
                        nickName: data.nickName,
                        message: data.message
                    });
                    this.scrollChatMessageDiv();
                }
                //接收到新的消息时，如果发送人不是自己，就刷新当前聊天消息
                if (data.sendUserId != this.curUser.id) {
                    this.loadMessage()//主要就是为了设置已读
                }
            });
            // 错误处理
            this.socket.on('connect_error', (err) => {
                console.error('连接失败:', err.message)
            })

            this.socket.on("disconnect", () => {
                console.log('断开连接', this.socket.id);
            });
        },

        refreshOnlineStatus(rows) {
            rows.forEach(element => {
                if (this.onlineUserIds.findIndex(f => f == element.userId) !== -1) {
                    element.onlineStatus = 'green'
                } else {
                    element.onlineStatus = 'red'
                }
            })
        },
        getOnlineUserIds() {
            this.$get(`/api/getOnlineUserIds`).then((response) => {
                this.onlineUserIds = response.data.data
                this.refreshOnlineStatus(this.roomUsers);
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        }
    },
    mounted() {
        console.log("ChatRoom mounted");
        this.debounceClickChatDiv = this.$debounce(this.clickChatDiv, 500);//防抖
        this.curUser = JSON.parse(sessionStorage.getItem('user'));
        let params = useRoute().query;
        this.roomId = params.roomId
        this.loadRoomInfo(this.getOnlineUserIds)
        this.loadMessage()
        this.initSocket();

        this.$bus.on('refreshOnlineUserIds', (data) => {
            this.onlineUserIds = data
            this.refreshOnlineStatus(this.roomUsers);
        })
    },
    beforeUnmount() {
        console.log('ChatRoom beforeUnmount');
        // 组件卸载前断开连接
        if (this.socket) {
            this.socket.off('chat-RoomChatMessage') // 移除事件监听
            this.socket.disconnect()
        }
        this.$bus.off('refreshOnlineUserIds');
    },
    beforeDestroy() {
        console.log("ChatRoom beforeDestroy");
        // 组件销毁前断开连接
        if (this.socket) {
            this.socket.off('chat-RoomChatMessage') // 移除事件监听
            this.socket.disconnect()
        }
        this.$bus.off('refreshOnlineUserIds');
    }
}
</script>
  
<style scoped>
.roomUser {
    background-color: white;
    border: 1px solid;
    margin: 1px;
    border-radius: 5px;
    padding: 5px;
}
</style>