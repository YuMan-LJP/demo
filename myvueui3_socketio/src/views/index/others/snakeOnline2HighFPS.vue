<template>
    <div>
        <h1>Snake Online2 (High FPS)</h1>
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
                    <p :style="timeRemaining < 10 ? 'color:red' : 'color:blue'">{{ timeRemaining }}</p>
                    <p>方向键上下左右操作({{ counter_fps }})</p>
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

            animationId: null,
            update_lastTime: 0,// 上一帧的时间
            update_snakeSpeed: 8,//速度：每秒移动指定数量格子

            counter_fps: 0,
            counter_callCount: 0,//计算器，判断方法执行了多少次，统计刷新率
            counter_lastSecond: 0,

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
                //     speed: 10,
                //     direction: { x: 0, y: 0 },//玩家发出的方向指令
                //     snakeHead: { x: 0, y: 0 },
                //     snakeBodys: [],
                // }
            },
            foods: [],

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


        initCountDown() {//初始化倒计时
            if (this.setIntervalId !== 0) {
                return;
            }
            this.timeRemaining = 60;
            this.setIntervalId = setInterval(() => {
                this.timeRemaining--
                if (this.timeRemaining <= 0) {
                    clearInterval(this.setIntervalId)
                    this.socket.emit(`back-OtherMessage-${this.otherId}`, {
                        type: 'gameOver',
                        userId: this.curUser.id,
                        nickName: this.curUser.nickName,
                    });
                }
            }, 1000)
        },
        createFood(maxCount = 3) {
            if (this.foods.length >= maxCount) {
                return;//最多3个食物
            }

            var newFood = this.clacEmptyLocation();
            this.foods.push(newFood);

            if (this.foods.length < maxCount) {
                this.createFood();
            }
        },
        clacEmptyLocation() {//计算空位置，没有食物和玩家占用的空位置
            var newFood = { x: 0, y: 0 }
            newFood.x = Math.floor(Math.random() * this.gridWidth);
            newFood.y = Math.floor(Math.random() * this.gridHeight);

            let isEixstFood = this.foods.some(s => s.x === newFood.x && s.y === newFood.y)
            let isEixstSnake = false;
            for (let key in this.players) {
                if (this.players[key].snakeHead.x === newFood.x && this.players[key].snakeHead.y === newFood.y) {
                    isEixstSnake = true;
                    break;
                }
                if (this.players[key].snakeBodys.some(s => s.x === newFood.x && s.y === newFood.y)) {
                    isEixstSnake = true;
                    break;
                }
            }
            if (isEixstFood || isEixstSnake) {//是否占用了已经存在的食物和用户蛇的位置
                return this.clacEmptyLocation()
            }
            return newFood
        },
        clacSnakePosition(playerId, deltaTime) {
            const moveDistance = deltaTime * this.players[playerId].speed;
            const newHead = {
                x: this.players[playerId].snakeHead.x + moveDistance * this.players[playerId].direction.x,
                y: this.players[playerId].snakeHead.y + moveDistance * this.players[playerId].direction.y
            };

            let isEixstSnake = false;
            for (let key in this.players) {
                if (this.players[key].isStart && key !== playerId && this.checkCollision(this.players[key].snakeHead, newHead)) {
                    isEixstSnake = true;
                }
                if (this.players[key].isStart && this.players[key].snakeBodys.some(s => this.checkCollision(s, newHead))) {
                    isEixstSnake = true;
                }
            }
            if (newHead.x < 0 || newHead.x >= this.gridWidth || newHead.y < 0 || newHead.y >= this.gridHeight || isEixstSnake) {
                this.resetPlayerLocation(playerId)
                return;
            }

            //this.players[playerId].snakes.unshift(newHead)
            this.players[playerId].snakeHead = newHead
            // this.players[playerId].snakeBodys.forEach(f => {
            //     f.x += (moveDistance * f.direction.x)
            //     f.y += (moveDistance * f.direction.y)
            // })

            let index = this.foods.findIndex(s => this.checkCollision(s, newHead))
            if (index !== -1) {
                this.players[playerId].score++
                this.foods.splice(index, 1)
                this.createFood()
            } else {
                //this.players[playerId].snakes.pop();
            }
        },
        checkCollision(fixedPoint, movingPoint) {//碰撞检测
            // 在canvas中，坐标原点在左上角，x轴向右，y轴向下
            // 两个矩形发生碰撞的条件是：
            // 矩形A的左边界 < 矩形B的右边界
            // 矩形A的右边界 > 矩形B的左边界
            // 矩形A的上边界 < 矩形B的下边界
            // 矩形A的下边界 > 矩形B的上边界
            const fixedLeft = fixedPoint.x * this.scaleSize;
            const fixedRight = fixedPoint.x * this.scaleSize + this.scaleSize;
            const fixedTop = fixedPoint.y * this.scaleSize;
            const fixedBottom = fixedPoint.y * this.scaleSize + this.scaleSize;
            const movingLeft = movingPoint.x * this.scaleSize;
            const movingRight = movingPoint.x * this.scaleSize + this.scaleSize;
            const movingTop = movingPoint.y * this.scaleSize;
            const movingBottom = movingPoint.y * this.scaleSize + this.scaleSize;
            if (
                movingLeft < fixedRight &&
                movingRight > fixedLeft &&
                movingTop < fixedBottom &&
                movingBottom > fixedTop
            ) {
                return true; // 发生碰撞
            }
            return false; // 无碰撞
        },
        update(timestamp) {
            if (!this.update_lastTime) this.update_lastTime = timestamp;

            // 计算时间差（秒）
            const deltaTime = (timestamp - this.update_lastTime) / 1000;
            this.update_lastTime = timestamp;

            // 计算当前移动的距离
            for (let key in this.players) {
                this.clacSnakePosition(key, deltaTime)
            }

            // 绘制场景
            this.draw();

            if (this.isStart) {
                this.animationId = requestAnimationFrame(this.update);
            } else {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            }
        },
        draw() {
            //统计刷新率
            this.counter_callCount++;// 更新调用计数器
            const currentSecond = Math.floor(Date.now() / 1000);
            if (currentSecond !== this.counter_lastSecond) { // 检查是否进入新的一秒
                //console.log(`上一秒调用次数：${this.counter_callCount}`);
                this.counter_fps = this.counter_callCount;
                this.counter_callCount = 0;  // 重置计数器
                this.counter_lastSecond = currentSecond;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 绘制蛇
            for (let key in this.players) {
                this.ctx.fillStyle = this.players[key].color;
                this.ctx.fillRect(this.players[key].snakeHead.x * this.scaleSize, this.players[key].snakeHead.y * this.scaleSize, this.scaleSize, this.scaleSize)
                this.players[key].snakeBodys.forEach(f => this.ctx.fillRect(f.x * this.scaleSize, f.y * this.scaleSize, this.scaleSize, this.scaleSize));
            }

            // 绘制食物
            this.ctx.fillStyle = 'green';
            this.foods.forEach(f => this.ctx.fillRect(f.x * this.scaleSize, f.y * this.scaleSize, this.scaleSize, this.scaleSize));
        },
        resetPlayerLocation(playerId) {
            var snake = this.clacEmptyLocation()
            this.players[playerId].isStart = false;
            this.players[playerId].score = 0;
            this.players[playerId].speed = this.update_snakeSpeed,//默认速度
            this.players[playerId].snakeHead = snake;//随机在空位置生成
            this.players[playerId].snakeBodys = [];
            this.players[playerId].direction = { x: 0, y: 0 };
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
                        speed: this.update_snakeSpeed,//默认速度
                        direction: { x: 0, y: 0 },//玩家发出的方向指令
                        snakeHead: { x: 0, y: 0 },
                        snakeBodys: []
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
                        this.resetPlayerLocation(key)
                    }
                    this.createFood()
                    this.initCountDown()

                    //绘制画布
                    requestAnimationFrame(this.update)
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
                }
                if (data.type === 'playerInput') {
                    //玩家输入
                    if (this.isStart) {
                        const playerKey = `player_${data.userId}`;
                        if (data.keyboard === 'UP') {
                            if (this.players[playerKey].direction.y === 0) {
                                this.players[playerKey].direction = { x: 0, y: -1 };
                                this.players[playerKey].isStart = true
                            }
                        }
                        if (data.keyboard === 'DOWN') {
                            if (this.players[playerKey].direction.y === 0) {
                                this.players[playerKey].direction = { x: 0, y: 1 };
                                this.players[playerKey].isStart = true
                            }
                        }
                        if (data.keyboard === 'LEFT') {
                            if (this.players[playerKey].direction.x === 0) {
                                this.players[playerKey].direction = { x: -1, y: 0 };
                                this.players[playerKey].isStart = true
                            }
                        }
                        if (data.keyboard === 'RIGHT') {
                            if (this.players[playerKey].direction.x === 0) {
                                this.players[playerKey].direction = { x: 1, y: 0 };
                                this.players[playerKey].isStart = true
                            }
                        }
                    }
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
    created() {
        // // 兼容旧版浏览器
        // window.requestAnimFrame = (function () {
        //     return window.requestAnimationFrame ||
        //         window.webkitRequestAnimationFrame ||
        //         function (callback) {
        //             window.setTimeout(callback, 1000 / 60);
        //         };
        // })();
    },
    mounted() {
        console.log("Snake Online HFPS mounted");

        //特别注意：
        //目前存在技术问题未解决，现在这个demo，只实现了单个人操作，多人时有BUG，而且每个人的位置生成没有同步
        //1.贪吃蛇游戏本身是已格子为单位的，现在改为60帧无格子，导致蛇身很难控制，每帧渲染时移动的距离跟蛇吃掉食物身体增加的距离不一致
        //2.60帧没办法在服务端去计算返回前端刷新这种模式，网络请求太频繁，现在放到前端去计算，但是又要保证多人游戏时每个人的位置生成是一样的，又必须通知广播才行，再加上碰撞计算，也使用广播就很难精准控制

        //流程：
        //1.用户进入页面，显示在在线用户列表
        //2.可以申请加入游戏，等其他人准备好了可以开局，或者自己一个人也可以直接开局
        //3.其他用户加入之后，需要准备，准备好了，随便一个用户可以开局
        //4.开始游戏后，对每个玩家生成随机位置的蛇，食物也随机生成，然后在1分钟之后，看哪位玩家吃的多
        //  每吃一个食物，分数+1，身体长度+1，中途撞到边界或者其他玩家身体，将会清空分数，身体变回最开始的长度随机复活在空余位置
        //  （可以改进的玩法，玩家死后，身体部分化作食物）
        //5.1分钟结束之后，总结所有玩家分数，分数高者获胜，并清空区域，重置所有玩家状态，玩家重新开始准备，重新开局
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
        console.log('Snake Online HFPS beforeUnmount');
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
        console.log("Snake Online HFPS beforeDestroy");
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