<template>
    <div>
        <h1>Online Tempalte(多人在线开发模板)</h1>
        <div>
            <el-container>
                <el-aside width="200px">
                    <div>
                        <p v-for="(item, index) of onlineUsers">
                            {{ index + 1 }}. {{ item.nickName }}
                        </p>
                    </div>
                    <div>
                        <el-button style="margin-right: 2px;" type="success" size="small" @click="playerReadyBtnEvent"
                            v-if="isPlayer">
                            {{ isReady ? '已准备' : '准备' }}
                        </el-button>
                        <el-button style="margin-right: 2px;" type="primary" size="small" @click="gameStartBtnEvent"
                            :disabled="isStart" v-if="isPlayer">
                            开始
                        </el-button>
                        <el-button style="margin-right: 2px;" type="danger" size="small" @click="quitPlayerBtnEvent"
                            :disabled="isStart || isReady || !isPlayer" v-if="isPlayer">
                            退出
                        </el-button>
                        <el-button style="margin-right: 10px;" type="success" size="small" @click="joinPlayerBtnEvent"
                            :disabled="isStart || isPlayer" v-if="!isPlayer">
                            加入
                        </el-button>
                        <p v-for="(val, key, index) in players" :style="'color:' + players[key].color">
                            {{ players[key].nickName }} :
                            <span v-if="isStart">{{ players[key].score }}</span>
                            <span v-else>{{ players[key].isReady ? '已准备' : '未准备' }}</span>
                        </p>
                    </div>
                </el-aside>
                <el-main>
                    <p>{{ timeRemaining }}</p>
                    <p>操作描述。。。</p>
                    <canvas id="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
                </el-main>
                <el-aside width="200px">
                    <div>
                        <p v-for="(item, index) in chatMessages">
                            [{{ index + 1 }}]{{ item.nickName }}: {{ item.message }}
                        </p>
                    </div>
                    <div>
                        <el-input v-model="sendText" type="text" placeholder="Please input">
                        </el-input>
                        <el-button type="success" size="small" @click="sendMessageBtnEvent">发送</el-button>
                    </div>
                </el-aside>
            </el-container>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
export default {
    name: 'Snake',
    data() {
        return {
            otherId: 'snake002HighFPS',
            socket: null,
            socketid: '',
            curUser: null,//当前操作用户

            setIntervalId: 0,
            timeRemaining: 60,//剩余时间

            isPlayer: false,//当前操作人是否是玩家
            isReady: false,//当前操作人是否已准备
            isStart: false,//当局是否已经开始/结束

            canvas: null,//画布
            ctx: null,//2d内容
            canvasWidth: 400,//画布宽度
            canvasHeight: 400,//画布高度
            scaleSize: 10,//缩放大小
            gridWidth: 0,//格子宽度，缩放后的大小
            gridHeight: 0,//格子高度，缩放后的大小
            updateSpeed: 150,

            onlineUsers: [//在线用户，支持多人
                // {
                //     id: 0,
                //     nickName: '',
                //     isPlayer: false,//是否是玩家/观战
                // }
            ],
            players: {//玩家对象（由在线用户转换而来，有玩家退出，在线用户可以加入，最多设置4名）
                // 'player_id': {
                //     id: 0,
                //     nickName: 'nickName',
                //     color: 'red',//red/blue/skyblue/orange
                //     isReady: false,//是否准备好了
                //     isStart: false,//是否开始游戏/结束或中断游戏
                //     score: 0,//分数
                //     direction: { x: 0, y: 0 },//玩家发出的方向指令
                //     object: null,//操作的对象
                // }
            },

            sendText: '',
            chatMessages: [
                //{ id: 0, nickName: '', message: '', sendTime: '' }
            ],//公共聊天消息
        }
    },
    methods: {
        joinPlayerBtnEvent() {
            var keys = Object.keys(this.players)
            if (keys.length > 4) {
                this.$swalWarn('系统提示', '最多4人同时游玩')
                return;
            }
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'joinPlayer',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
        },
        quitPlayerBtnEvent() {
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'quitPlayer',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
        },
        playerReadyBtnEvent() {
            if (this.isReady) {
                return;
            }
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'playerReady',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
            this.isReady = true
        },
        createPlayerColor(length) {
            //red/blue/skyblue/orange
            if (length === 0) {
                return 'red'
            }
            else if (length === 1) {
                return 'blue'
            }
            else if (length === 2) {
                return 'skyblue'
            }
            else if (length === 3) {
                return 'orange'
            }
            else {
                return ''
            }
        },
        gameStartBtnEvent() {
            //全部玩家都准备好了才能开始
            var keys = Object.keys(this.players)
            if (keys.length === 0) {
                this.$swalWarn('系统提示', '没有玩家')
                return;
            }
            let noReadyPlayerNames = [];
            for (var key in this.players) {
                if (!this.players[key].isReady) {
                    noReadyPlayerNames.push(`[${this.players[key].nickName}]`)
                }
            }
            if (noReadyPlayerNames.length > 0) {
                this.$swalWarn('系统提示', `${noReadyPlayerNames.join(',')}未准备`)
                return;
            }
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'gameStart',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
        },
        sendMessageBtnEvent() {
            if (this.sendText === '' || this.sendText === null) {
                return;
            }
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'sendMessage',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
                message: this.sendText,
                sendTime: new Date()
            });
            this.sendText = ''
        },


        //玩法待实现
        initCountDown() {//初始化倒计时
            if (this.setIntervalId !== 0) {
                return;
            }
            setIntervalId = setInterval(() => {
                this.timeRemaining--
                if (this.timeRemaining <= 0) {
                    clearInterval(this.setIntervalId)
                }
            }, 1000)
        },


        initCanvas() {//初始化画布
            this.canvas = document.getElementById('gameCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.gridWidth = this.canvas.width / this.scaleSize;
            this.gridHeight = this.canvas.height / this.scaleSize;
        },
        initButton() {
            window.addEventListener('keydown', e => {
                let keyboard = "";
                switch (e.key) {
                    case 'ArrowUp':
                        keyboard = 'UP'
                        break;
                    case 'ArrowDown':
                        keyboard = 'DOWN'
                        break;
                    case 'ArrowLeft':
                        keyboard = 'LEFT'
                        break;
                    case 'ArrowRight':
                        keyboard = 'RIGHT'
                        break;
                }
                if (keyboard !== "") {
                    this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                        type: 'playerInput',
                        userId: this.curUser.id,
                        nickName: this.curUser.nickName,
                        keyboard: keyboard
                    });
                }
                if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault(); // 阻止默认行为
                }
            });
        },
        initSocket() {
            // 服务器地址
            this.socket = io('http://192.168.1.234:5005/', {
                query: {
                    userId: this.curUser.id,
                    userName: this.curUser.userName,
                    roomId: null,
                    otherId: this.otherId
                }
            });
            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket.connected, this.socket.id);
                this.socketid = this.socket.id
            });
            // 接收消息
            this.socket.on(`front-OtherMessage-${this.otherId}`, (data) => {
                console.log(`front-OtherMessage-${this.otherId}`, data)
                if (data.type === 'userIn') {
                    //用户进入页面
                    let index = this.onlineUsers.findIndex(f => f.id == data.userId)
                    if (index === -1) {
                        this.onlineUsers.push({
                            id: data.userId,
                            nickName: data.nickName,
                            isPlayer: false,//是否是玩家/观战
                        });
                        this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                            type: 'refreshOnlineUsers',
                            userId: this.curUser.id,
                            nickName: this.curUser.nickName,
                            onlineUsers: this.onlineUsers
                        });
                    }
                }
                if (data.type === 'userOut') {
                    //用户离开页面
                    let index = this.onlineUsers.findIndex(f => f.id == data.userId)
                    if (index != -1) {
                        this.onlineUsers.splice(index, 1);
                        this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                            type: 'refreshOnlineUsers',
                            userId: this.curUser.id,
                            nickName: this.curUser.nickName,
                            onlineUsers: this.onlineUsers
                        });
                    }
                    const playerKey = `player_${data.userId}`;
                    if (this.players.hasOwnProperty(playerKey)) {
                        Reflect.deleteProperty(this.players, playerKey)
                    }
                }
                if (data.type === 'refreshOnlineUsers' && data.onlineUsers) {
                    //刷新全部人的在线用户列表，可能有人后进入，需要看到其他人的在线信息
                    data.onlineUsers.forEach(f => {
                        if (!this.onlineUsers.some(s => s.id == f.id)) {
                            this.onlineUsers.push({
                                id: f.id,
                                nickName: f.nickName,
                                isPlayer: false,//是否是玩家/观战
                            });
                        }
                    })
                }
                if (data.type === 'joinPlayer') {
                    //加入玩家
                    if (this.curUser.id == data.userId) {
                        this.isPlayer = true;
                    }
                    const playerKey = `player_${data.userId}`;
                    var keys = Object.keys(this.players)
                    this.players[playerKey] = {
                        id: data.userId,
                        nickName: data.nickName,
                        color: this.createPlayerColor(keys.length),//red/blue/skyblue/orange
                        isReady: false,//是否准备好了
                        isStart: false,//是否开始游戏/结束或中断游戏
                        score: 0,//分数
                        direction: { x: 0, y: 0 },//玩家发出的方向指令
                        object: null,//操作的对象
                    }
                }
                if (data.type === 'quitPlayer') {
                    //退出玩家，即返回观战
                    if (this.curUser.id == data.userId) {
                        this.isPlayer = false;
                    }
                    const playerKey = `player_${data.userId}`;
                    if (this.players.hasOwnProperty(playerKey)) {
                        Reflect.deleteProperty(this.players, playerKey)
                    }
                }
                if (data.type === 'playerReady') {
                    //玩家准备
                    const playerKey = `player_${data.userId}`;
                    if (this.players.hasOwnProperty(playerKey)) {
                        this.players[playerKey].isReady = true
                    }
                    this.$notitySuccess('系统提示', `[${data.nickName}]已准备`)
                }
                if (data.type === 'gameStart') {
                    //游戏开始
                    this.isStart = true;
                    for (var key in this.players) {
                        this.players[key].isStart = true
                        this.players[key].score = 0
                        this.players[key].direction = { x: 0, y: 0 }
                    }

                    //TODO...绘制画布
                }
                if (data.type === 'gameOver') {
                    //游戏结束
                    let tipList = []
                    this.isStart = false;
                    for (var key in this.players) {
                        tipList.push(this.players[key].nickName + ':' + this.players[key].score)
                        this.players[key].isReady = false
                        this.players[key].isStart = false
                    }

                    this.$swalInfo('系统提示', tipList.join('|'))

                    //TODO...
                }
                if (data.type === 'playerInput') {
                    //玩家输入
                }
                if (data.type === 'sendMessage') {
                    this.chatMessages.push({
                        id: data.userId,
                        nickName: data.nickName,
                        message: data.message,
                        sendTime: data.sendTime
                    })
                }
            })
            // 错误处理
            this.socket.on('connect_error', (err) => {
                console.error('连接失败:', err.message)
            })

            this.socket.on("disconnect", () => {
                console.log('断开连接', this.socket.id);
            });
        }
    },
    mounted() {
        console.log("Online Tempalte mounted");

        //特别注意，碰撞计算，位置计算都在服务器上计算，不要在前端计算，不用60帧
        //流程：
        //1.用户进入页面，显示在在线用户列表
        //2.可以申请加入游戏，等其他人准备好了可以开局，或者自己一个人也可以直接开局
        //3.其他用户加入之后，需要准备，准备好了，随便一个用户可以开局
        //4.开始游戏......
        //5.游戏结束后，重置所有玩家状态，玩家重新开始准备，重新开局
        //  或者选择退出游戏变为在线用户观战

        this.curUser = JSON.parse(sessionStorage.getItem('user'));
        this.initCanvas();
        this.initSocket();
        this.initButton();

        //触发刷新在线人数统计
        this.socket.emit(`back-OtherMessage-${this.otherId}`, {
            type: 'userIn',
            userId: this.curUser.id,
            nickName: this.curUser.nickName,
        });
    },
    beforeUnmount() {
        console.log('Online Tempalte beforeUnmount');
        // 组件卸载前断开连接
        if (this.socket) {
            //触发刷新在线人数统计
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'userOut',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
            this.socket.off(`front-OtherMessage-${this.otherId}`) // 移除事件监听
            this.socket.disconnect()
        }
    },
    beforeDestroy() {
        console.log("Online Tempalte beforeDestroy");
        // 组件销毁前断开连接
        if (this.socket) {
            //触发刷新在线人数统计
            this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                type: 'userOut',
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
            });
            this.socket.off(`front-OtherMessage-${this.otherId}`) // 移除事件监听
            this.socket.disconnect()
        }
    }
}
</script>
  
<style scoped>
canvas {
    border: 1px solid #fff;
    background-color: #000;
}
</style>