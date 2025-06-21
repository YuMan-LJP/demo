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
                                <div v-if="item.messageType == '1'">
                                    <span style="font-weight:bold;color: blue;">{{ item.nickName }}发起了一个投票: </span>{{ item.message}}
                                    <br />
                                    <div v-if="!item.isConfirm">
                                        <el-button type="success" size="small" @click="votePassOrRefuse(item, true)">√</el-button>
                                        <el-button type="danger" size="small" @click="votePassOrRefuse(item, false)">×</el-button>
                                    </div>
                                </div>
                                <div v-else-if="item.messageType == '-1'">
                                    <span style="font-weight:bold;color: red;">系统消息: </span>{{ item.message}}
                                </div>
                                <div v-else>
                                    <span style="font-weight:bold;">{{ item.nickName }}: </span>{{ item.message }}
                                </div>
                            </div>
                        </div>
                    </el-main>
                    <el-footer
                        style="background-color: #e6e6fad4;border: 1px solid;border-radius: 5px;margin: 1px;padding: 0px;">
                        <div>
                            <el-input v-model="sendText" style="width: calc(100% - 50px)"
                                :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input">
                            </el-input>
                            <div style="float: right;width: 48px;">
                                <el-button type="success" size="small" @click="sendMessage">发送</el-button>
                                <el-dropdown>
                                    <el-button style="margin-left: 0px;margin-top: 2px;" type="primary"
                                        size="small">更多</el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="openRequestModal">投票</el-dropdown-item>
                                            <el-dropdown-item>Doudizhu</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
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

        <el-dialog v-model="requestModal.isVisible" title="投票" width="600">
            <el-form :model="requestForm">
                <el-form-item label="议题" label-width="140px">
                    <el-input v-model="requestForm.remark" autocomplete="off" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeRequestModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="sendRequestMessage">{{ $t("app.confirm") }}</el-button>
                </div>
            </template>
        </el-dialog>
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

            requestModal: {
                isVisible: false,
                userId: null,
                nickName: ''
            },
            requestForm: {
                remark: '',
            },

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
                for (var item of response.data.data) {
                    if (item.messageType == '1') {
                        //如果投票了会发出一条消息，该消息会标记来源的消息Id，如果来源是投票这条消息就说明当前用户已经投票了
                        item.isConfirm = response.data.data.findIndex(f => f.sendUserId == this.curUser.id && f.originMessageId == item.id + '') !== -1
                    }
                }
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
                messageType: null,
                originMessageId: null
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

        openRequestModal() {
            this.requestModal.isVisible = true;
            this.requestModal.userId = this.curUser.id;
            this.requestModal.nickName = this.curUser.nickName;
        },
        closeRequestModal() {
            this.requestModal.isVisible = false;
            this.requestModal.userId = null;
            this.requestModal.nickName = '';
            this.requestForm.remark = ""
        },
        sendRequestMessage() {
            var inputDto = {
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.requestForm.remark,
                messageType: '1',
                originMessageId: null
            }
            this.$post(`/api/addRoomMessage`, inputDto).then((response) => {
                if (response.data.isSuccess) {
                    inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                    this.socket.emit('send-RoomChatMessage', inputDto);
                    this.closeRequestModal();
                    this.scrollChatMessageDiv();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        votePassOrRefuse(row, isOk){
            var inputDto = {
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: isOk ? `对[${row.nickName}]"${row.message}"的投票通过` : `对[${row.nickName}]"${row.message}"的投票拒绝`,
                messageType: isOk ? '1=1' : '1=0',
                originMessageId: row.id
            }
            this.$post(`/api/addRoomMessage`, inputDto).then((response) => {
                if (response.data.isSuccess) {
                    row.isConfirm = true;
                    inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                    this.socket.emit('send-RoomChatMessage', inputDto);
                    this.scrollChatMessageDiv();

                    //t1.roomId,t1.userId,t2.message,t2.messageType
                    if(response.data.data.voteResult && response.data.data.voteResult.findIndex(f => f.message === null) === -1){
                        //都投票完了
                        this.voteComplete(row, response.data.data)
                    }
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        voteComplete(row, result){
            var inputDto = {
                sendUserId: -1,//系统
                receiveRoomId: this.curRoom.id,
                nickName: '系统消息',//触发消息的时候使用
                message: `[${row.nickName}]"${row.message}"的投票结束`,
                messageType: '-1',
                originMessageId: row.id
            }
            this.$post(`/api/addRoomMessage`, inputDto).then((response) => {
                if (response.data.isSuccess) {
                    inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                    this.socket.emit('send-RoomChatMessage', inputDto);
                    this.scrollChatMessageDiv();
                    console.log(inputDto.message, result)
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                this.$swalError('系统提示', err);
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
                //接收到新的消息时，刷新聊天窗口
                if (data.receiveRoomId == this.roomId) {
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
        },
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

<style scoped>
.el-header {
    height: 30px;
}
</style>