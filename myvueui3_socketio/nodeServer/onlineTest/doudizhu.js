class DouDiZhuGame {
    constructor() {
        //默认一定要3名玩家参与
        this.players = {
            player1: { name: "玩家1", cards: [], isLandlord: false },
            player2: { name: "玩家2", cards: [], isLandlord: false },
            player3: { name: "玩家3", cards: [], isLandlord: false }
        };
        
        this.deck = [];//牌组：花色/数值/颜色
        this.landlordCards = [];//地主牌
        this.currentPlayer = "player1";//轮到当前玩家
        this.landlord = "";//地主玩家
        this.lastPlay = { player: null, cards: [] };//最后出牌
        this.gameStarted = false;
        this.gameOver = false;
        this.selectedCards = [];
    }
    
    // 创建一副扑克牌
    createDeck() {
        const suits = ["♠", "♥", "♦", "♣"];
        const values = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];
        
        // 创建普通牌
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit,
                    value,
                    color: suit === "♥" || suit === "♦" ? "red" : "black"
                });
            }
        }
        
        // 添加大小王
        this.deck.push({ suit: "小王", value: "小王", color: "black" });
        this.deck.push({ suit: "大王", value: "大王", color: "red" });
    }
    
    // 洗牌
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    // 发牌
    dealCards() {
        // 发牌给三位玩家（每人17张）
        for (let i = 0; i < 51; i++) {
            const player = Object.keys(this.players)[i % 3];
            this.players[player].cards.push(this.deck[i]);
        }
        
        // 剩余3张作为地主牌
        this.landlordCards = this.deck.slice(51, 54);
    }
    
    // 开始游戏
    startGame() {
        this.deck = [];
        this.landlordCards = [];
        this.lastPlay = { player: null, cards: [] };
        this.gameStarted = true;
        this.gameOver = false;
        this.selectedCards = [];
        
        // 重置玩家状态
        Object.keys(this.players).forEach(player => {
            this.players[player].cards = [];
            this.players[player].isLandlord = false;
        });
        
        // 创建牌堆、洗牌和发牌
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        
        // 排序玩家手牌
        this.sortPlayerCards();
        
        // 随机选择地主
        this.selectLandlord();
    }
    
    // 排序玩家手牌
    sortPlayerCards() {
        const cardOrder = {
            "3": 1, "4": 2, "5": 3, "6": 4, "7": 5, "8": 6, "9": 7, 
            "10": 8, "J": 9, "Q": 10, "K": 11, "A": 12, "2": 13, 
            "小王": 14, "大王": 15
        };
        
        Object.keys(this.players).forEach(player => {
            this.players[player].cards.sort((a, b) => {
                return cardOrder[a.value] - cardOrder[b.value];
            });
        });
    }
    
    // 选择地主
    selectLandlord() {
        // 随机选择一个玩家作为地主
        const players = Object.keys(this.players);
        const landlord = players[Math.floor(Math.random() * players.length)];
        
        this.landlord = landlord;
        this.players[landlord].isLandlord = true;
        
        // 地主获得三张地主牌
        this.players[landlord].cards = this.players[landlord].cards.concat(this.landlordCards);
        this.sortPlayerCards();
        
        // 地主先出牌
        this.currentPlayer = landlord;
    }
    
    // 玩家出牌
    playCards(player, cards) {
        // 从玩家手牌中移除
        this.players[player].cards = this.players[player].cards.filter(
            card => !cards.includes(card)
        );
        
        // 更新最后出牌
        this.lastPlay = { player, cards };
        
        // 检查游戏是否结束
        if (this.players[player].cards.length === 0) {
            this.gameOver = true;
            return true; // 游戏结束
        }
        
        // 轮到下一位玩家
        this.nextPlayer();
        return false;
    }
    
    // 轮到下一位玩家
    nextPlayer() {
        const players = Object.keys(this.players);
        const currentIndex = players.indexOf(this.currentPlayer);
        this.currentPlayer = players[(currentIndex + 1) % players.length];
    }
    
    // 检查出牌是否有效
    isValidPlay(cards) {
        if (cards.length === 0) return false;
        
        // 简单验证规则（简化版）
        const len = cards.length;
        
        // 单牌
        if (len === 1) return true;
        
        // 对子
        if (len === 2 && cards[0].value === cards[1].value) return true;
        
        // 三张
        if (len === 3 && 
            cards[0].value === cards[1].value && 
            cards[1].value === cards[2].value) return true;
        
        // 炸弹（四张相同）
        if (len === 4 && 
            cards[0].value === cards[1].value && 
            cards[1].value === cards[2].value && 
            cards[2].value === cards[3].value) return true;
        
        // 王炸
        if (len === 2 && 
            ((cards[0].value === "大王" && cards[1].value === "小王") || 
            (cards[0].value === "小王" && cards[1].value === "大王"))) return true;
        
        return false;
    }
    
    // 电脑自动出牌（简化版）
    computerPlay(player) {
        const cards = this.players[player].cards;
        
        // 简单策略：尝试出单牌或对子
        for (let i = 0; i < cards.length; i++) {
            // 尝试出单牌
            const play = [cards[i]];
            if (this.isValidPlay(play)) {
                this.playCards(player, play);
                return play;
            }
            
            // 尝试出对子
            if (i < cards.length - 1 && cards[i].value === cards[i+1].value) {
                const play = [cards[i], cards[i+1]];
                if (this.isValidPlay(play)) {
                    this.playCards(player, play);
                    return play;
                }
            }
        }
        
        // 没有合适的牌，选择不出
        this.nextPlayer();
        return [];
    }
}

export default DouDiZhuGame;