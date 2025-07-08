function initDoudizhu(roomUserIds) {
    //初始化3个用户的数据结构
    if (!roomUserIds) {
        return;
    }
    if (roomUserIds.length !== 3) {
        return;
    }

    try {
        let output = {
            players: {},
            landlordCards: [],
            deckInfo: {}
        }
        var deck = [];//牌组：花色/数值/颜色
        for (var userId of roomUserIds) {
            output.players['Id_' + userId] = { decks: [], count: 0 };
        }

        function createDeck() {
            const suits = ["♠", "♥", "♦", "♣"];
            const values = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];

            // 创建普通牌
            for (let suit of suits) {
                let index = 1;
                for (let value of values) {
                    var newCard = {
                        suit,
                        value,
                        color: suit === "♥" || suit === "♦" ? "red" : "black",
                        index
                    }
                    newCard.key = newCard.suit + '_' + newCard.value + '_' + newCard.color
                    deck.push(newCard);
                    output.deckInfo[newCard.key] = newCard;//记录一下全部原始牌型信息
                    index++
                }
            }

            // 添加大小王
            var smallKing = { suit: "小王", value: "小王", color: "black", key: "小王_小王_black", index: 14 }
            var bigKing = { suit: "大王", value: "大王", color: "red", key: "大王_大王_red", index: 15 }
            deck.push(smallKing);
            deck.push(bigKing);
            output.deckInfo[smallKing.key] = smallKing;
            output.deckInfo[bigKing.key] = bigKing;
        }

        // 洗牌
        function shuffleDeck() {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        // 发牌
        function dealCards() {
            // 发牌给三位玩家（每人17张）
            for (let i = 0; i < 51; i++) {
                const userId = roomUserIds[i % 3];
                output.players['Id_' + userId].decks.push(deck[i]);
                output.players['Id_' + userId].count++;
            }

            // 剩余3张作为地主牌
            output.landlordCards = deck.slice(51, 54);
        }

        createDeck();
        shuffleDeck();
        dealCards();
        return output;
    }
    catch (ex) {
        console.log(ex);
        return { players: null, landlordCards: null }
    }
}

function initSnake(io, canvasWidth, gridSize) {
    const myIO = io;
    let data = {
        type: 'snake001',
        player: null,
        tileCount: canvasWidth / gridSize,
        snake: null,
        food: [],
        direction: null,
        updateSpeed: 150,
        isOver: false,//是否结束了
        onlineUsers: []
    }

    function initPlayer() {
        data.player = {
            'playerA': { id: 0, name: 'playerA', color: 'red', isStart: false, isOver: false, score: 0 },
            'playerB': { id: 0, name: 'playerB', color: 'blue', isStart: false, isOver: false, score: 0 },
            'playerC': { id: 0, name: 'playerC', color: 'skyblue', isStart: false, isOver: false, score: 0 }
        };
        data.snake = {
            "playerA": [{ x: 10, y: 10 }],
            "playerB": [{ x: 30, y: 10 }],
            "playerC": [{ x: 20, y: 30 }]
        };
        data.direction = {
            "playerA": { x: 0, y: 0 },
            "playerB": { x: 0, y: 0 },
            "playerC": { x: 0, y: 0 }
        };
        if (data.onlineUsers.length > 0) {
            data.onlineUsers.forEach(f => addUserId(f.userId, f.nickName))
        }
    }
    function addUserId(userId, nickName) {
        userId = parseInt(userId)
        var playerId = getPlayerId(userId)
        if (playerId !== '') {
            return false
        }
        if (data.onlineUsers.findIndex(f => f.userId === userId) === -1) {
            data.onlineUsers.push({ userId: userId, nickName: nickName })
            myIO.emit('front-OtherMessage', { type: 'snake001-userChange', onlineUsers: data.onlineUsers })
        }
        for (let key in data.player) {
            if (data.player[key].id === 0) {
                data.player[key].id = userId
                data.player[key].name = nickName
                return true
            }
        }
        return false
    }
    function removeUserId(userId) {
        userId = parseInt(userId)
        var index = data.onlineUsers.findIndex(f => f.userId === userId)
        if (index !== -1) {
            data.onlineUsers.splice(index, 1)
            myIO.emit('front-OtherMessage', { type: 'snake001-userChange', onlineUsers: data.onlineUsers })
        }
        for (let key in data.player) {
            if (data.player[key].id === userId) {
                data.player[key].id = 0
                data.player[key].name = key
                return true
            }
        }
        return false
    }
    function getPlayerId(userId) {
        userId = parseInt(userId)
        for (let key in data.player) {
            if (data.player[key].id === userId) {
                return key
            }
        }
        return ''
    }

    function gameLoop() {
        let overPlayer = 0
        let tips = []
        data.isOver = false
        data.tips = ""
        for (let key in data.player) {
            let isOver = update(key);
            if (isOver) {
                overPlayer++;
            }
            tips.push(data.player[key].name + ':' + data.player[key].score)
        }
        data.tips = tips.join('|')
        if (overPlayer === data.onlineUsers.length && data.onlineUsers.length > 0) {
            data.isOver = true
            myIO.emit('front-OtherMessage', data)
            return;
        }
        myIO.emit('front-OtherMessage', data)
        setTimeout(gameLoop, data.updateSpeed);
    }
    function update(playerId) {
        if (data.player[playerId].isOver) {
            return true;
        }

        const head = { x: data.snake[playerId][0].x + data.direction[playerId].x, y: data.snake[playerId][0].y + data.direction[playerId].y };

        // 检查是否撞墙或撞到蛇
        let isExists = false;
        for (let key in data.snake) {
            if (data.snake[key].some(s => s.x === head.x && s.y === head.y) && data.player[playerId].isStart) {
                isExists = true;
            }
        }
        if (head.x < 0 || head.x >= data.tileCount || head.y < 0 || head.y >= data.tileCount || isExists) {
            data.player[playerId].isOver = true;
            return true
        }

        data.snake[playerId].unshift(head);

        // 检查是否吃到食物
        var index = data.food.findIndex(f => f.x === head.x && f.y === head.y)
        if (index !== -1) {
            data.player[playerId].score++;
            data.food.splice(index, 1)
            placeFood();
        } else {
            data.snake[playerId].pop();
        }
        return false
    }
    function placeFood() {
        if (data.food.length >= 3) {
            return;//最多3个食物
        }

        var newFood = clacFood();
        data.food.push(newFood);

        if (data.food.length < 3) {
            placeFood();
        }
    }
    function clacFood() {
        var newFood = { x: 0, y: 0 }
        newFood.x = Math.floor(Math.random() * data.tileCount);
        newFood.y = Math.floor(Math.random() * data.tileCount);
        // 确保食物不会生成在蛇身上
        let isExists = false;
        for (let key in data.snake) {
            if (data.snake[key].some(s => s.x === newFood.x && s.y === newFood.y)) {
                isExists = true;
            }
        }
        if (isExists) {
            return clacFood()
        }
        return newFood
    }
    function input(direction, userId) {
        var playerId = getPlayerId(userId);
        if (playerId === '') {
            return;
        }
        if (direction === 'W') {
            if (data.direction[playerId].y === 0) {
                data.direction[playerId] = { x: 0, y: -1 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'S') {
            if (data.direction[playerId].y === 0) {
                data.direction[playerId] = { x: 0, y: 1 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'A') {
            if (data.direction[playerId].x === 0) {
                data.direction[playerId] = { x: -1, y: 0 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'D') {
            if (data.direction[playerId].x === 0) {
                data.direction[playerId] = { x: 1, y: 0 };
                data.player[playerId].isStart = true
            }
        }
    }
    function resetGame() {
        initPlayer();
        placeFood();
        gameLoop();
    }

    resetGame();

    return {
        addUserId: addUserId,
        removeUserId: removeUserId,
        input: input,
        resetGame: resetGame
    }
}

function initSnake2(io, timeRemaining, canvasWidth, gridSize) {
    const myIO = io;
    const _timeRemaining = timeRemaining;
    let data = {
        isStart: false,//是否开始
        isOver: false,//是否结束了
        type: 'snake002',
        timeRemaining: _timeRemaining,//剩余时间(秒)
        player: null,
        tileCount: canvasWidth / gridSize,
        snake: null,
        food: [],
        direction: null,
        updateSpeed: 150,
        onlineUsers: []
    }
    let setIntervalId = 0;

    function initTime() {
        if (setIntervalId !== 0) {
            return;
        }
        setIntervalId = setInterval(() => {
            data.timeRemaining--
            if (data.timeRemaining <= 0) {
                clearInterval(setIntervalId)
            }
        }, 1000)
    }
    function initPlayer() {
        data.player = {
            'playerA': { id: 0, name: 'playerA', color: 'red', isReady: false, isStart: false, isOver: false, score: 0 },
            'playerB': { id: 0, name: 'playerB', color: 'blue', isReady: false, isStart: false, isOver: false, score: 0 },
            'playerC': { id: 0, name: 'playerC', color: 'skyblue', isReady: false, isStart: false, isOver: false, score: 0 }
        };
        data.snake = {
            "playerA": [{ x: 10, y: 10 }],
            "playerB": [{ x: 30, y: 10 }],
            "playerC": [{ x: 20, y: 30 }]
        };
        data.direction = {
            "playerA": { x: 0, y: 0 },
            "playerB": { x: 0, y: 0 },
            "playerC": { x: 0, y: 0 }
        };
        if (data.onlineUsers.length > 0) {
            data.onlineUsers.forEach(f => {
                f.isReady = false;
                addUserId(f.userId, f.nickName);
            })
        }
    }
    function readyUserId(userId) {
        userId = parseInt(userId)
        var playerId = getPlayerId(userId)
        if (playerId === '') {
            return
        }
        let isOk = true;
        for (let key in data.player) {
            if (data.player[key].id === userId) {
                data.player[key].isReady = true
            }
            if (!data.player[key].isReady && data.player[key].id !== 0) {
                isOk = false
            }
        }
        var index = data.onlineUsers.findIndex(f => f.userId === userId);
        console.log('readyUserId', index, isOk)
        if (index !== -1) {
            data.onlineUsers[index].isReady = true
            myIO.emit('front-OtherMessage', { type: 'snake002-userChange', onlineUsers: data.onlineUsers, isReady: true, nickName: data.onlineUsers[index].nickName })
        }
        if (isOk) {
            //全部用户准备好了就开始
            myIO.emit('front-OtherMessage', { type: 'snake002-start' })
            data.isStart = true
            initTime()
        }
    }
    function addUserId(userId, nickName) {
        userId = parseInt(userId)
        var playerId = getPlayerId(userId)
        if (playerId !== '') {
            return false
        }
        if (data.onlineUsers.findIndex(f => f.userId === userId) === -1) {
            data.onlineUsers.push({ userId: userId, nickName: nickName, isReady: false })
            myIO.emit('front-OtherMessage', { type: 'snake002-userChange', onlineUsers: data.onlineUsers })
        }
        for (let key in data.player) {
            if (data.player[key].id === 0) {
                data.player[key].id = userId
                data.player[key].name = nickName
                data.player[key].isReady = false
                return true
            }
        }
        return false
    }
    function removeUserId(userId) {
        userId = parseInt(userId)
        var index = data.onlineUsers.findIndex(f => f.userId === userId)
        if (index !== -1) {
            data.onlineUsers.splice(index, 1)
            myIO.emit('front-OtherMessage', { type: 'snake002-userChange', onlineUsers: data.onlineUsers })
        }
        for (let key in data.player) {
            if (data.player[key].id === userId) {
                data.player[key].id = 0
                data.player[key].name = key
                data.player[key].isReady = false
                return true
            }
        }
        return false
    }
    function getPlayerId(userId) {
        userId = parseInt(userId)
        for (let key in data.player) {
            if (data.player[key].id === userId) {
                return key
            }
        }
        return ''
    }

    function gameLoop() {
        let tips = []
        data.isOver = false
        data.tips = ""
        for (let key in data.player) {
            update(key);
            tips.push(data.player[key].name + ':' + data.player[key].score)
        }
        data.tips = tips.join('|')
        if (data.timeRemaining <= 0 && data.onlineUsers.length > 0) {
            data.isStart = false
            data.isOver = true
            myIO.emit('front-OtherMessage', data)//时间到了就结束了
            return;
        }
        myIO.emit('front-OtherMessage', data)
        setTimeout(gameLoop, data.updateSpeed);
    }
    function update(playerId) {
        if (data.player[playerId].isOver) {
            return true;
        }

        const head = { x: data.snake[playerId][0].x + data.direction[playerId].x, y: data.snake[playerId][0].y + data.direction[playerId].y };

        // 检查是否撞墙或撞到蛇
        let isExists = false;
        for (let key in data.snake) {
            if (data.snake[key].some(s => s.x === head.x && s.y === head.y) && data.player[playerId].isStart) {
                isExists = true;
            }
        }
        if (head.x < 0 || head.x >= data.tileCount || head.y < 0 || head.y >= data.tileCount || isExists) {
            data.player[playerId].isOver = true;
            resetPlayerLocation(playerId)
            return true;
        }

        data.snake[playerId].unshift(head);

        // 检查是否吃到食物
        var index = data.food.findIndex(f => f.x === head.x && f.y === head.y)
        if (index !== -1) {
            data.player[playerId].score++;
            data.food.splice(index, 1)
            placeFood();
        } else {
            data.snake[playerId].pop();
        }
        return false
    }
    function resetPlayerLocation(playerId) {
        var snake = clacEmptyLocation()
        data.player[playerId].score = 0;
        data.snake[playerId] = [snake];//随机在空位置生成
        data.direction[playerId] = { x: 0, y: 0 };
        
        data.player[playerId].isOver = false;
        data.player[playerId].isStart = false;
    }
    function placeFood() {
        if (data.food.length >= 3) {
            return;//最多3个食物
        }

        var newFood = clacEmptyLocation();
        data.food.push(newFood);

        if (data.food.length < 3) {
            placeFood();
        }
    }
    function clacEmptyLocation() {
        var newFood = { x: 0, y: 0 }
        newFood.x = Math.floor(Math.random() * data.tileCount);
        newFood.y = Math.floor(Math.random() * data.tileCount);
        // 确保食物不会生成在蛇身上
        let isExists = false;
        for (let key in data.snake) {
            if (data.snake[key].some(s => s.x === newFood.x && s.y === newFood.y)) {
                isExists = true;
            }
        }
        if (isExists) {
            return clacEmptyLocation()
        }
        return newFood
    }
    function input(direction, userId) {
        var playerId = getPlayerId(userId);
        if (playerId === '') {
            return;
        }
        if (!data.isStart) {
            return;
        }
        if (direction === 'W') {
            if (data.direction[playerId].y === 0) {
                data.direction[playerId] = { x: 0, y: -1 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'S') {
            if (data.direction[playerId].y === 0) {
                data.direction[playerId] = { x: 0, y: 1 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'A') {
            if (data.direction[playerId].x === 0) {
                data.direction[playerId] = { x: -1, y: 0 };
                data.player[playerId].isStart = true
            }
        }
        if (direction === 'D') {
            if (data.direction[playerId].x === 0) {
                data.direction[playerId] = { x: 1, y: 0 };
                data.player[playerId].isStart = true
            }
        }
    }
    function resetGame(nickName) {
        data.timeRemaining = _timeRemaining
        data.isStart = false
        data.isOver = false
        initPlayer();
        placeFood();
        gameLoop();
        myIO.emit('front-OtherMessage', { type: 'snake002-restart', onlineUsers: data.onlineUsers, nickName: nickName })
    }

    initPlayer();
    placeFood();
    gameLoop();

    return {
        readyUserId: readyUserId,
        addUserId: addUserId,
        removeUserId: removeUserId,
        input: input,
        resetGame: resetGame
    }
}

module.exports = {
    initDoudizhu: initDoudizhu,
    initSnake: initSnake,
    initSnake2: initSnake2
}