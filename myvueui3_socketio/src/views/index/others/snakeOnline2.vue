<template>
    <div>
        <h1>Snake2</h1>
        <div>
            <div style="float: left;">
                <span v-for="(item, index) of onlineUsers">
                    {{ index + 1 }}. {{ item.nickName }} ({{ item.isReady ? '已准备' : '未准备' }})
                </span>
                <br />
            </div>
            <div style="float: right;">
                <span>{{ timeRemaining }}</span>
            </div>
            <p>绿色是食物, 按键操作：↑ ↓← →/WSAF/小键盘8246 (撞墙或撞到其他对手马上随机复活, 1分钟内分数高者获胜)</p>
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            <div class="score">
                <el-button style="margin-right: 10px;" type="success" @click="readyGame">{{ isReady ? '已准备' : '准备'
                }}</el-button>
                <el-button style="margin-right: 10px;" type="primary" @click="resetGame"
                    :disabled="!isOver">重新开始</el-button>
                <span v-for="(val, key, index) in player" :style="'color:' + player[key].color">
                    {{ player[key].name }} : {{ player[key].score }} |
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ElNotification } from 'element-plus'
import io from 'socket.io-client';
export default {
    name: 'Snake',
    data() {
        return {
            name: '',

            socket: null,
            socketid: '',
            curUser: null,//当前操作用户

            onlineUsers: [],

            isReady: false,
            isStart: false,
            isOver: false,
            timeRemaining: 60,
            player: null,
            canvas: null,
            ctx: null,
            gridSize: 10,
            tileCount: 0,
            snake: null,
            food: [],
            direction: null,
        }
    },
    methods: {
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 绘制蛇
            for (let key in this.player) {
                this.ctx.fillStyle = this.player[key].color;
                this.snake[key].forEach(f => this.ctx.fillRect(f.x * this.gridSize, f.y * this.gridSize, this.gridSize, this.gridSize));
            }

            // 绘制食物
            this.ctx.fillStyle = 'green';
            this.food.forEach(f => this.ctx.fillRect(f.x * this.gridSize, f.y * this.gridSize, this.gridSize, this.gridSize));
        },
        readyGame() {
            if (this.isReady) {
                return;
            }
            this.socket.emit('back-OtherMessage', {
                timeRemaining: this.timeRemaining,
                canvasWidth: this.canvas.width,
                gridSize: this.gridSize,
                direction: null,
                userId: this.curUser.id,
                isResetGame: false,
                isReady: true
            });
            this.isReady = true
        },
        resetGame() {
            this.socket.emit('back-OtherMessage', {
                timeRemaining: this.timeRemaining,
                canvasWidth: this.canvas.width,
                gridSize: this.gridSize,
                direction: null,
                userId: this.curUser.id,
                nickName: this.curUser.nickName,
                isResetGame: true,
                isReady: false
            });
        },
        initButton() {
            window.addEventListener('keydown', e => {
                console.log(e.key)
                let btn = "";
                switch (e.key) {
                    case 'ArrowUp':
                        btn = 'W'
                        break;
                    case 'ArrowDown':
                        btn = 'S'
                        break;
                    case 'ArrowLeft':
                        btn = 'A'
                        break;
                    case 'ArrowRight':
                        btn = 'D'
                        break;
                    case 'w':
                        btn = 'W'
                        break;
                    case 's':
                        btn = 'S'
                        break;
                    case 'a':
                        btn = 'A'
                        break;
                    case 'd':
                        btn = 'D'
                        break;
                    case '8':
                        btn = 'W'
                        break;
                    case '2':
                        btn = 'S'
                        break;
                    case '4':
                        btn = 'A'
                        break;
                    case '6':
                        btn = 'D'
                        break;
                }
                if (btn !== "") {
                    this.socket.emit('back-OtherMessage', {
                        timeRemaining: this.timeRemaining,
                        canvasWidth: this.canvas.width,
                        gridSize: this.gridSize,
                        direction: btn,
                        userId: this.curUser.id,
                        nickName: this.curUser.nickName,
                        isResetGame: false,
                        isReady: false
                    });
                }
                if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" ||
                    e.key === "e" || e.key === "s" || e.key === "a" || e.key === "d" ||
                    e.key === "8" || e.key === "2" || e.key === "4" || e.key === "6") {
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
                    otherId: 'snake002'
                }
            });
            this.socket.on('connect', () => {
                console.log('Connected to server', this.socket.connected, this.socket.id);
                this.socketid = this.socket.id
            });
            // 接收消息
            this.socket.on('front-OtherMessage', (data) => {
                console.log('front-OtherMessage', data)
                if (data.type === 'snake002') {
                    this.timeRemaining = data.timeRemaining;
                    this.player = data.player;
                    this.snake = data.snake;
                    this.food = data.food;
                    this.direction = data.direction;
                    this.isOver = data.isOver;
                    if (this.isOver) {
                        this.isReady = false
                        this.$swalInfo('系统提示', data.tips);//全部玩家出局游戏结束
                        return;
                    }
                    this.draw();
                }
                if (data.type === 'snake002-userChange') {
                    console.log('snake002-userChange', data)
                    if (data.isReady) {
                        ElNotification({
                            title: '系统提示',
                            message: `[${data.nickName}]已准备`,
                            duration: 3000,//3秒后关闭
                        })
                    }
                    this.onlineUsers = data.onlineUsers
                }
                if (data.type === 'snake002-start') {
                    console.log('snake002-start', data)
                    this.isStart = true
                    ElNotification({
                        title: '系统提示',
                        message: "游戏开始",
                        duration: 3000,//3秒后关闭
                    })
                }
                if (data.type === 'snake002-restart') {
                    console.log('snake002-start', data)
                    this.timeRemaining = data.timeRemaining;
                    this.player = data.player;
                    this.snake = data.snake;
                    this.food = data.food;
                    this.direction = data.direction;
                    this.isStart = false
                    this.isReady = false
                    this.isOver = false
                    ElNotification({
                        title: '系统提示',
                        message: `[${data.nickName}]重新开始准备`,
                        duration: 3000,//3秒后关闭
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
        console.log("Snake mounted");
        this.curUser = JSON.parse(sessionStorage.getItem('user'));
        this.initSocket();

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileCount = this.canvas.width / this.gridSize;
        this.initButton();

        //触发刷新在线人数统计
        this.socket.emit('back-OtherMessage', {
            timeRemaining: this.timeRemaining,
            canvasWidth: this.canvas.width,
            gridSize: this.gridSize,
            direction: null,
            userId: this.curUser.id,
            nickName: this.curUser.nickName,
            isResetGame: false,
            isReady: false
        });
    },
    beforeUnmount() {
        console.log('ChatRoom beforeUnmount');
        // 组件卸载前断开连接
        if (this.socket) {
            this.socket.off('front-OtherMessage') // 移除事件监听
            this.socket.disconnect()
        }
    },
    beforeDestroy() {
        console.log("ChatRoom beforeDestroy");
        // 组件销毁前断开连接
        if (this.socket) {
            this.socket.off('front-OtherMessage') // 移除事件监听
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