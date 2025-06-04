<template>
    <div>
        <h1>Chat Room</h1>
        昵称：<input type="text" v-model="message.name">（有昵称才能发送消息）
        消息：<input type="text" v-model="message.text">
        <button @click="sendMessage" :disabled="message.name==''">发送</button>
        <div style="min-width: calc(100vw - 250px); min-height: calc(100vh - 250px);text-align: left;background-color: powderblue;padding: 10px;border-radius: 5px;">
            <div v-for="item in messages" style="margin: 5px 10px;background-color: blanchedalmond;padding: 5px;border-radius: 5px;width: fit-content;">
                <span>{{item.name}}:</span>{{ item.text }}
            </div>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
export default {
    name: 'ChatRoom',
    data() {
        return {
            name: '',
            socket: {},
            socketid: '',
            message: {
                name: '',
                text: '',
            },
            messages: [],
        }
    },
    methods: {
        init() {
            this.socket = io('http://192.168.1.234:5005/');//服务器地址

            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket.id);
                this.socketid = this.socket.id
            });
            
            // 接收消息
            this.socket.on('chat-message', (data) => {
                console.log('Received message:', data);
                this.messages.push(data);
            });
            // 错误处理
            this.socket.on('connect_error', (err) => {
                console.error('连接失败:', err.message)
            })
        },
        sendMessage() {
            this.socket.emit('send-message', this.message);
            this.message.text = ""
        },
        joinRoom(roomId) {
            // 加入房间
            this.socket.on('join-room', (roomId) => {
                this.socket.join(roomId)
            })
        },
        sendMessageByRoom(roomId) {
            // 向房间发送消息
            socket.on('room-message', ({ roomId, message = this.message }) => {
                io.to(roomId).emit('room-message', this.message)
                this.message.text = ""
            })
        }
    },
    mounted() {
        console.log("ChatRoom mounted");
        this.init();
    },
    beforeUnmount() {
        console.log('ChatRoom beforeUnmount');
        // 组件卸载前断开连接
        if (this.socket) {
            this.socket.off('chat-message') // 移除事件监听
            this.socket.disconnect()
        }
    },
    beforeDestroy() {
        console.log("ChatRoom beforeDestroy");
        // 组件销毁前断开连接
        if (this.socket) {
            this.socket.off('chat-message') // 移除事件监听
            this.socket.disconnect()
        }
    }
}
</script>
  