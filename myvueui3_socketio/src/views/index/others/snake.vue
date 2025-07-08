<template>
    <div>
        <h1>Snake</h1>
        <div>
            <p>支持3个用户同屏，A用户操作：↑ ↓← →；B用户：WSAF；C用户：8246（小键盘）</p>
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            <div class="score">
                <button @click="resetGame">重新开始</button>
                <span v-for="(val, key, index) in player" :style="'color:' + player[key].color">
                    {{ player[key].name }} : {{ player[key].score }} |
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Snake',
    data() {
        return {
            name: '',

            playerId: 1,//当前操作用户

            player: null,
            canvas: null,
            ctx: null,
            gridSize: 10,
            tileCount: 0,
            snake: null,
            food: [],
            direction: null,
            updateSpeed: 150,
        }
    },
    methods: {
        gameLoop() {
            let overPlayer = 0
            let tips = ""
            for (let key in this.player) {
                let isOver = this.update(key);
                if (isOver) {
                    overPlayer++;
                }
                tips += this.player[key].name + ':' + this.player[key].score + '|'
            }
            if (overPlayer === 3) {
                this.$swalInfo('系统提示', tips);//全部玩家出局游戏结束
                return;
            }
            this.draw();
            setTimeout(this.gameLoop, this.updateSpeed);
        },
        update(playerId) {
            if (this.player[playerId].isOver) {
                return true;
            }

            const head = { x: this.snake[playerId][0].x + this.direction[playerId].x, y: this.snake[playerId][0].y + this.direction[playerId].y };

            // 检查是否撞墙或撞到蛇
            let isExists = false;
            for (let key in this.snake) {
                if (this.snake[key].some(s => s.x === head.x && s.y === head.y) && this.player[playerId].isStart) {
                    isExists = true;
                }
            }
            if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount || isExists) {
                this.player[playerId].isOver = true;
                return true
            }

            this.snake[playerId].unshift(head);

            // 检查是否吃到食物
            var index = this.food.findIndex(f => f.x === head.x && f.y === head.y)
            if (index !== -1) {
                this.player[playerId].score++;
                this.food.splice(index, 1)
                this.placeFood();
            } else {
                this.snake[playerId].pop();
            }
            return false
        },
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
        placeFood() {
            if (this.food.length >= 3) {
                return;//最多3个食物
            }

            var newFood = this.clacFood();
            this.food.push(newFood);

            if (this.food.length < 3) {
                this.placeFood();
            }
        },
        clacFood() {
            var newFood = { x: 0, y: 0 }
            newFood.x = Math.floor(Math.random() * this.tileCount);
            newFood.y = Math.floor(Math.random() * this.tileCount);
            // 确保食物不会生成在蛇身上
            let isExists = false;
            for (let key in this.snake) {
                if (this.snake[key].some(s => s.x === newFood.x && s.y === newFood.y)) {
                    isExists = true;
                }
            }
            if (isExists) {
                return this.clacFood()
            }
            return newFood
        },
        resetGame() {
            this.initPlayer();
            this.placeFood();
            this.gameLoop();
        },
        initButton() {
            window.addEventListener('keydown', e => {
                console.log(e.key)
                switch (e.key) {
                    case 'ArrowUp':
                        if (this.direction['playerA'].y === 0) { this.direction['playerA'] = { x: 0, y: -1 }; this.player['playerA'].isStart = true }
                        break;
                    case 'ArrowDown':
                        if (this.direction['playerA'].y === 0) { this.direction['playerA'] = { x: 0, y: 1 }; this.player['playerA'].isStart = true }
                        break;
                    case 'ArrowLeft':
                        if (this.direction['playerA'].x === 0) { this.direction['playerA'] = { x: -1, y: 0 }; this.player['playerA'].isStart = true }
                        break;
                    case 'ArrowRight':
                        if (this.direction['playerA'].x === 0) { this.direction['playerA'] = { x: 1, y: 0 }; this.player['playerA'].isStart = true }
                        break;
                    case 'w':
                        if (this.direction['playerB'].y === 0) { this.direction['playerB'] = { x: 0, y: -1 }; this.player['playerB'].isStart = true }
                        break;
                    case 's':
                        if (this.direction['playerB'].y === 0) { this.direction['playerB'] = { x: 0, y: 1 }; this.player['playerB'].isStart = true }
                        break;
                    case 'a':
                        if (this.direction['playerB'].x === 0) { this.direction['playerB'] = { x: -1, y: 0 }; this.player['playerB'].isStart = true }
                        break;
                    case 'd':
                        if (this.direction['playerB'].x === 0) { this.direction['playerB'] = { x: 1, y: 0 }; this.player['playerB'].isStart = true }
                        break;
                    case '8':
                        if (this.direction['playerC'].y === 0) { this.direction['playerC'] = { x: 0, y: -1 }; this.player['playerC'].isStart = true }
                        break;
                    case '2':
                        if (this.direction['playerC'].y === 0) { this.direction['playerC'] = { x: 0, y: 1 }; this.player['playerC'].isStart = true }
                        break;
                    case '4':
                        if (this.direction['playerC'].x === 0) { this.direction['playerC'] = { x: -1, y: 0 }; this.player['playerC'].isStart = true }
                        break;
                    case '6':
                        if (this.direction['playerC'].x === 0) { this.direction['playerC'] = { x: 1, y: 0 }; this.player['playerC'].isStart = true }
                        break;
                }
                if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" ||
                    e.key === "e" || e.key === "s" || e.key === "a" || e.key === "d" ||
                    e.key === "8" || e.key === "2" || e.key === "4" || e.key === "6") {
                    e.preventDefault(); // 阻止默认行为
                }
            });
        },
        initPlayer() {
            this.player = {
                'playerA': { id: 1, name: 'A', color: 'red', isStart: false, isOver: false, score: 0 },
                'playerB': { id: 2, name: 'B', color: 'blue', isStart: false, isOver: false, score: 0 },
                'playerC': { id: 3, name: 'C', color: 'skyblue', isStart: false, isOver: false, score: 0 }
            };
            this.snake = {
                "playerA": [{ x: 10, y: 10 }],
                "playerB": [{ x: 30, y: 10 }],
                "playerC": [{ x: 20, y: 30 }]
            };
            this.direction = {
                "playerA": { x: 0, y: 0 },
                "playerB": { x: 0, y: 0 },
                "playerC": { x: 0, y: 0 }
            };
        }
    },
    mounted() {
        console.log("Snake mounted");

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileCount = this.canvas.width / this.gridSize;
        this.initPlayer();
        this.initButton();
        this.placeFood();
        this.gameLoop();
    },
}
</script>
  
<style scoped>
canvas {
    border: 1px solid #fff;
    background-color: #000;
}
</style>