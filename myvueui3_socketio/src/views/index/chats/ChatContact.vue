<template>
    <div>
        <el-container style="min-height: calc(100vh - 150px);">
            <el-header>Chat Contact</el-header>
            <el-container>
                <el-aside width="200px"
                    style="background-color: lavender;border: 1px solid;border-radius: 5px;margin: 1px;">
                    <div>
                        联系人
                        <div v-for="item in contacts" @click="showMessage(item)"
                            :class="curContact != null && curContact.friendId == item.friendId ? 'contactActive' : 'contactNoActive'">
                            <el-badge :value="item.count" class="item" :offset="[20, 0]" :hidden="item.count == 0">
                                <span :style="'color:' + item.onlineStatus">{{ item.nickName }}</span>
                                <el-icon v-if="curContact != null && curContact.friendId == item.friendId">
                                    <ChatLineRound />
                                </el-icon>
                            </el-badge>
                        </div>
                    </div>
                </el-aside>
                <el-container @click="debounceClickChatDiv">
                    <el-main style="border: 1px solid;border-radius: 5px;margin: 1px;padding: 5px;" id="chatMessageDiv">
                        <div style="max-height: calc(100vh - 400px)">
                            <div v-for="item in chatMessages"
                                style="margin: 5px 10px;background-color: blanchedalmond;padding: 5px;border-radius: 5px;width: fit-content;">
                                <span>{{ item.nickName }}:</span>{{ item.message }}
                            </div>
                            <p v-if="curContact != null && curContact.isInvalid == 1" style="color: red">您已被对方从联系人中删除</p>
                        </div>
                    </el-main>
                    <el-footer
                        style="background-color: #e6e6fad4;border: 1px solid;border-radius: 5px;margin: 1px;padding: 0px;">
                        <div>
                            <el-input v-model="sendText" style="width: calc(100% - 50px)"
                                :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input">
                            </el-input>
                            <el-button type="success" size="small" @click="sendMessage"
                                :disabled="this.curContact == null">发送</el-button>
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
export default {
    name: 'ChatContact',
    data() {
        return {
            sendText: '',
            contacts: [],
            curContact: null,
            chatMessages: [],

            curUser: null,
            socket: null,
            socketid: '',

            onlineUserIds: [],

            debounceClickChatDiv: () => { },//防抖
        }
    },
    methods: {
        loadContacts(isSelectOne = false, callback = null) {
            this.$get(`/api/getContactAndCount?myselfId=${this.curUser.id}`).then((response) => {
                this.contacts = response.data.data;

                //是否默认选中第一个
                if (isSelectOne && this.contacts.length > 0) {
                    this.showMessage(this.contacts[0]);
                }

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
        showMessage(item) {
            this.curContact = item;
            this.$get(`/api/getContactMessages?myselfId=${item.myselfId}&friendId=${item.friendId}`).then((response) => {
                this.chatMessages = response.data.data;
                item.count = 0;
                this.$bus.emit('messageChange')
                this.scrollChatMessageDiv();
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        sendMessage() {
            if (this.curContact == null) {
                this.$swalError('系统提示', '请先选择联系人');
                return;
            }
            if (!this.sendText) {
                this.$swalError('系统提示', '消息不能为空');
                return;
            }

            var inputDto = {
                sendUserId: this.curContact.myselfId,
                receiveUserId: this.curContact.friendId,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.sendText,
            }

            this.$post(`/api/addContactMessage`, inputDto).then((response) => {
                if (response.data.isSuccess) {
                    this.socket.emit('send-ContactChatMessage', inputDto);
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
            if (this.curContact == null) {
                return;
            }
            this.showMessage(this.curContact);
            var index = this.contacts.findIndex(f => f.id == this.curContact.id)
            if (index !== -1) {
                this.contacts[index].count = 0
            }
        },
        initSocket() {
            //服务器地址
            this.socket = io('http://192.168.1.234:5005/', {
                query: {
                    userId: this.curUser.id,
                    userName: this.curUser.userName,
                    roomId: null
                }
            });

            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket.connected, this.socket.id);
                this.socketid = this.socket.id
            });
            // 接收消息
            this.socket.on('chat-ContactMessage', (data) => {
                //接收到新的消息时，如果发送人和接收人是当前聊天窗口的人，就追加消息到聊天窗口
                if ((data.receiveUserId == this.curContact.myselfId && data.sendUserId == this.curContact.friendId) ||
                    (data.receiveUserId == this.curContact.friendId && data.sendUserId == this.curContact.myselfId)) {
                    this.chatMessages.push({
                        sendUserId: data.sendUserId,
                        receiveUserId: data.receiveUserId,
                        nickName: data.nickName,
                        message: data.message
                    });
                    this.scrollChatMessageDiv();
                }
                //接收到新的消息时，如果接收人就是自己触发刷新左边联系人的数量
                if (data.receiveUserId == this.curUser.id) {
                    this.loadContacts()
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
                if (this.onlineUserIds.findIndex(f => f == element.friendId) !== -1) {
                    element.onlineStatus = 'green'
                } else {
                    element.onlineStatus = 'red'
                }
            })
        },
        getOnlineUserIds() {
            this.$get(`/api/getOnlineUserIds`).then((response) => {
                this.onlineUserIds = response.data.data
                this.refreshOnlineStatus(this.contacts);
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        }
    },
    mounted() {
        console.log("ChatContact mounted");
        this.debounceClickChatDiv = this.$debounce(this.clickChatDiv, 500);//防抖
        this.curUser = JSON.parse(sessionStorage.getItem('user'));
        this.loadContacts(true, this.getOnlineUserIds);
        this.initSocket();

        this.$bus.on('refreshOnlineUserIds', (data) => {
            this.onlineUserIds = data
            this.refreshOnlineStatus(this.contacts);
        })
    },
    beforeUnmount() {
        console.log('ChatContact beforeUnmount');
        if (this.socket) {
            this.socket.off('chat-ContactMessage') // 移除事件监听
            this.socket.disconnect()
        }
        this.$bus.off('refreshOnlineUserIds');
    },
    beforeDestroy() {
        console.log('ChatContact beforeDestroy');
        if (this.socket) {
            this.socket.off('chat-ContactMessage') // 移除事件监听
            this.socket.disconnect()
        }
        this.$bus.off('refreshOnlineUserIds');
    },
}
</script>
  
<style scoped>
.contactNoActive {
    background-color: white;
    border: 1px solid;
    margin: 1px;
    border-radius: 5px;
    padding: 15px;
    cursor: pointer;
}

.contactActive {
    background-color: #d5d4d2;
    border: 1px solid;
    margin: 1px;
    border-radius: 5px;
    padding: 15px;
    cursor: pointer;
}
</style>
