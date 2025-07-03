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
        for(var userId of roomUserIds){
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

module.exports = {
    initDoudizhu: initDoudizhu
}