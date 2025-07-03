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
                                    <span style="font-weight:bold;color: blue;">{{ item.nickName }}发起了一个投票: </span>
                                    {{ item.message }}
                                    <br />
                                    <div v-if="!item.isConfirm">
                                        <el-button type="success" size="small"
                                            @click="votePassOrRefuse(item, true)">√</el-button>
                                        <el-button type="danger" size="small"
                                            @click="votePassOrRefuse(item, false)">×</el-button>
                                    </div>
                                </div>
                                <div v-else-if="item.messageType == '2'">
                                    <span style="font-weight:bold;color: blue;">{{ item.nickName }}{{ item.originMessageId ?
                                        '接龙+1: ' : '发起了一个接龙: ' }}</span>
                                    {{ item.message }}
                                    <br />
                                    <div v-if="item.jielongUser && item.jielongUser.userId == curUser.id">
                                        <el-input v-model="jielongText" v-if="!item.isConfirm">
                                            <template #append>
                                                <el-button @click="jielongToNext(item, false)">发送</el-button>
                                            </template>
                                        </el-input>
                                        <el-button v-if="!item.isConfirm" @click="jielongToNext(item, true)">停止</el-button>
                                    </div>
                                    <div v-else>
                                        {{ item.jielongUser && !item.isConfirm ? item.jielongUser.nickName + '正在输入中' : '' }}
                                    </div>
                                </div>
                                <div v-else-if="item.messageType == '3-1'">
                                    <span style="font-weight:bold;color: blue;">[{{ item.nickName }}]{{ item.message
                                    }}</span>
                                    <br />
                                    <div v-if="!item.isConfirm">
                                        <el-button type="success" size="small"
                                            @click="doudizhuVotePassOrRefuse(item, true)">√</el-button>
                                        <el-button type="danger" size="small"
                                            @click="doudizhuVotePassOrRefuse(item, false)">×</el-button>
                                    </div>
                                </div>
                                <div v-else-if="item.messageType == '3-3'">
                                    <span>{{ item.jielongUser ? item.jielongUser.nickName + '正在选择是否做地主' : '' }}</span>
                                    <div
                                        v-if="item.jielongUser && item.jielongUser.userId == curUser.id && !item.isConfirm">
                                        <el-button type="success" size="small" round
                                            @click="doudizhuSelectLandlord(item, true)">抢</el-button>
                                        <el-button type="danger" size="small" round
                                            @click="doudizhuSelectLandlord(item, false)">不抢</el-button>
                                    </div>
                                </div>
                                <div v-else-if="item.messageType == '3-4' || item.messageType == '3-5=1'">
                                    <span style="font-weight:bold;color: blue;">
                                        {{ item.nickName }}
                                        {{ doudizhu.landlordPlayerId == item.sendUserId ? '(地主)' : '' }}:
                                    </span>
                                    {{ item.message }}
                                    <div v-if="item.htmlMessage" v-html="item.htmlMessage"></div>
                                </div>
                                <div v-else-if="item.messageType == '-1'">
                                    <span style="font-weight:bold;color: red;">系统消息: </span>{{ item.message }}
                                    <div v-if="item.htmlMessage" v-html="item.htmlMessage"></div>
                                </div>
                                <div v-else>
                                    <span style="font-weight:bold;">{{ item.nickName }}: </span>{{ item.message }}
                                </div>
                            </div>
                            <div v-if="doudizhu.isShow">
                                <div>
                                    <span style="margin-right: 10px;" v-if="doudizhu.currentPlayerName">
                                        轮到 {{ doudizhu.currentPlayerName }} 出牌</span>
                                    <span style="margin-right: 10px;color:red;" v-if="doudizhu.isCurrentPlayer">
                                        {{ doudizhu.timeRemaining }}</span>
                                    <el-button type="success" size="small" round
                                        :disabled="!doudizhu.isStart || !doudizhu.isCurrentPlayer || doudizhu.isOverTime"
                                        @click="doudizhuPlayCard">出牌</el-button>
                                    <el-button type="danger" size="small" round
                                        :disabled="!doudizhu.isStart || !doudizhu.isCurrentPlayer || doudizhu.isOverTime || doudizhu.lastPlayCardPlayerId == curUser.id"
                                        @click="doudizhuSkip">跳过</el-button>
                                    <el-button type="primary" size="small" round :disabled="!doudizhu.isStart"
                                        @click="doudizhuSort(doudizhu.myCards)">排序</el-button>
                                    <span style="margin-left: 10px;">(每张牌都是一个多选按钮，直接点击按钮选择出牌即可)</span>
                                </div>
                                <div>
                                    <el-checkbox-group v-model="doudizhu.selectCardKeys" size="small">
                                        <el-checkbox-button v-for="card in doudizhu.myCards" :key="card.key"
                                            :value="card.key">
                                            <span :style="'color:' + card.color">({{ card.suit }}){{ card.value }}</span>
                                        </el-checkbox-button>
                                    </el-checkbox-group>
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
                                            <el-dropdown-item @click="openRequestModal('1')">投票</el-dropdown-item>
                                            <el-dropdown-item @click="openRequestModal('2')">接龙</el-dropdown-item>
                                            <el-dropdown-item @click="sendDoudizhuMessage">斗地主</el-dropdown-item>
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
                            <span v-if="doudizhu.isShow">(手牌：{{ doudizhu.players['Id_' + item.userId].count }} 张)</span>
                            <span :style="'color:' + item.onlineStatus">{{ item.nickName }}</span>
                            <span v-if="doudizhu.isShow">{{ doudizhu.landlordPlayerId == item.userId ? '(地主)' : '' }}</span>

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

        <el-dialog v-model="requestModal.isVisible" title="讨论" width="600">
            <el-form :model="requestForm">
                <el-form-item label="主题" label-width="140px">
                    <el-input v-model="requestForm.remark" autocomplete="off" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeRequestModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="confirmRequestMessage">{{ $t("app.confirm") }}</el-button>
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
                nickName: '',
                type: '',//1-投票，2-接龙
            },
            requestForm: {
                remark: '',
            },

            jielongText: '',

            doudizhu: {
                sendUserId: null,//发起人
                isShow: false,

                voteGuid: '',
                voteResult: [],//投票结果

                myCards: [],
                players: {},
                landlordCards: [],
                deckInfo: {},

                isStart: false,
                currentPlayerId: null,
                currentPlayerName: null,
                isCurrentPlayer: false,
                landlordPlayerId: null,
                landlordPlayerName: null,
                timeRemaining: 60,//出牌剩余时间
                timeIntervalId: null,//计算Id
                isOverTime: false,//是否超时，超时之后3秒自动跳过，3秒内不能点出牌按钮，避免出牌按钮和自动跳过同时触发，预留3秒缓冲
                timeOutId: null,

                selectCardKeys: [],
                lastPlayCardPlayerId: null,//最后一次出牌的人，跳过不出的不记录，如果最后一次出牌人又是自己说明轮空了一轮
                lastSelectCardKeys: [],//最后一次出的牌，用于出牌规则校验
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

            this.$post2(`/api/addRoomMessage`, inputDto, (data) => {
                inputDto.id = data.newId
                inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                this.socket.emit('send-RoomChatMessage', inputDto);
                this.sendText = ""
                this.scrollChatMessageDiv();
            })
        },
        setMessageRead() {
            this.$post2(`/api/setMessageRead`, {
                userId: this.curUser.id,
                originId: this.curRoom.id,
                type: 'chatroom'
            }, () => {
                this.$bus.emit('messageChange')
            })
        },
        clickChatDiv() {
            if (this.roomId == null) {
                return;
            }
            if (this.doudizhu.sendUserId) {
                return;
            }
            //点击聊天区域时，直接设置当前聊天对象已读
            this.setMessageRead()
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

        openRequestModal(type) {
            this.requestModal.isVisible = true;
            this.requestModal.userId = this.curUser.id;
            this.requestModal.nickName = this.curUser.nickName;
            this.requestModal.type = type;
        },
        closeRequestModal() {
            this.requestModal.isVisible = false;
            this.requestModal.userId = null;
            this.requestModal.nickName = '';
            this.requestModal.type = '';
            this.requestForm.remark = ""
        },
        confirmRequestMessage() {
            if (this.requestModal.type == '1') {
                this.sendRequestMessage();
            } else if (this.requestModal.type == '2') {
                this.sendJielongMessage();
            } else {
                this.$swalError('系统提示', '暂不支持');
            }
        },

        sendRequestMessage() {
            //非实时投票（发出一个群内所有人可见的问答消息，大家参与，没有先后顺序，问答消息完提示结束）
            //可以先开投票后面再进入房间，不是实时参与也可以
            var inputDto = {
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.requestForm.remark,
                messageType: '1',
                originMessageId: null
            }
            this.$post2(`/api/addRoomMessage`, inputDto, (data) => {
                inputDto.id = data.newId
                inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                this.socket.emit('send-RoomChatMessage', inputDto);
                this.closeRequestModal();
                this.scrollChatMessageDiv();
            })
        },
        votePassOrRefuse(row, isOk) {
            var inputDto = {
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: isOk ? `对[${row.nickName}]"${row.message}"的投票通过` : `对[${row.nickName}]"${row.message}"的投票拒绝`,
                messageType: isOk ? '1=1' : '1=0',
                originMessageId: row.id
            }
            this.$post2(`/api/addRoomMessage`, inputDto, (data) => {
                inputDto.id = data.newId
                row.isConfirm = true;
                inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                this.socket.emit('send-RoomChatMessage', inputDto);
                this.scrollChatMessageDiv();

                //t1.roomId,t1.userId,t2.message,t2.messageType
                if (data.voteResult && data.voteResult.findIndex(f => f.message === null) === -1) {
                    //都投票完了
                    this.voteComplete(row, data)
                }
            })
        },
        voteComplete(row, result) {
            var inputDto = {
                sendUserId: -1,//系统
                receiveRoomId: this.curRoom.id,
                nickName: '系统消息',//触发消息的时候使用
                message: `[${row.nickName}]"${row.message}"的投票结束`,
                messageType: '-1',
                originMessageId: row.id
            }
            this.$post2(`/api/addRoomMessage`, inputDto, (data) => {
                inputDto.id = data.newId
                inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                this.socket.emit('send-RoomChatMessage', inputDto);
                this.scrollChatMessageDiv();
            })
        },

        sendJielongMessage() {
            //在线接龙（发出一个群内所有人可见的问答消息，选择在线的人参与，有先后顺序，等前面一个人完成之后再轮到下一个人，问答消息完提示结束）
            //如果其中有人离开房间，就当弃权
            var user = this.calcJielongNextUser(this.curUser.id);//开始循环，取第一个人
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.requestForm.remark,
                messageType: '2',
                originMessageId: null,
                jielongUser: user,//只有当前人可以回复
                isConfirm: false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            this.closeRequestModal();
        },
        jielongToNext(row, isStop) {
            var user = this.calcJielongNextUser(this.curUser.id);//取下一个人
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.jielongText,
                messageType: '2',
                originMessageId: row.id,
                jielongUser: isStop ? null : user,//只有当前人可以回复
                isConfirm: isStop ? true : false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);

            row.isConfirm = true;
            this.jielongText = '';
        },
        calcJielongNextUser(curUserId) {
            //计算下一个轮到的用户，如果轮完回到开头重新轮
            var total = this.roomUsers.length;
            var index = this.roomUsers.findIndex(f => f.userId == curUserId)
            if (index !== total - 1) {
                //不是最后一个就取下一个
                return this.roomUsers[index + 1]
            } else {
                //如果是最后一个就取回第一个
                return this.roomUsers[0]
            }
        },

        sendDoudizhuMessage() {
            //投票是否开启（3-1）
            //后台服务器开始发牌（3-2）
            //显示出地主牌，由发起人开始按用户顺序接龙询问是否做地主，确认地主后将地主牌加入地主手中（3-3）
            //地主先出牌。。轮流下一名用户出牌（3-4）
            //最后牌先出完一方获胜，显示所有用户剩余手中的牌（3-5）
            //投票是否开启下一局，下一局由上一局赢家开始选择是否做地主，弃权就轮流下一名用户选择是否做地主，大家都不做就默认赢家做（3-1）
            //依次类推

            if (this.roomUsers.length !== 3) {
                this.$swalError('系统提示', '必须是3个人的房间才能开启');
                return;
            }
            if (this.onlineUserIds.length !== this.roomUsers.length) {
                this.$swalError('系统提示', '有用户还没进入房间');
                return;
            }
            this.sendDoudizhuMessage_3_1(this.curUser.id);//由发起人开始，这局结束后，由赢家开始下一局
        },
        sendDoudizhuMessage_3_1(userId) {
            this.doudizhu.sendUserId = userId
            //投票是否开启（3-1）
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: '投票是否开启一局斗地主',
                messageType: '3-1',
                originMessageId: null,
                jielongUser: null,//只有当前人可以回复
                isConfirm: false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            this.doudizhu.voteGuid = inputDto.id
            this.doudizhu.voteResult = [];
        },
        doudizhuVotePassOrRefuse(row, isOk) {
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: isOk ? `同意开启斗地主` : `拒绝开启斗地主`,
                messageType: isOk ? '3-1=1' : '3-1=0',
                originMessageId: null,
                jielongUser: null,//只有当前人可以回复
                isConfirm: false,
                remark: row.id
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            row.isConfirm = true;
        },
        sendDoudizhuMessage_3_2() {
            //后台服务器开始发牌（3-2）
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: '开始发牌',
                messageType: '3-2',
                originMessageId: null,
                jielongUser: null,//只有当前人可以回复
                isConfirm: false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
        },
        sendDoudizhuMessage_3_3() {
            //显示出地主牌，由发起人开始按用户顺序接龙询问是否做地主，确认地主后将地主牌加入地主手中（3-3）
            var index = this.roomUsers.findIndex(f => f.userId == this.curUser.id)
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: '接龙询问是否做地主',
                messageType: '3-3',
                originMessageId: null,
                jielongUser: index !== -1 ? this.roomUsers[index] : null,//只有当前人可以回复
                isConfirm: false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
        },
        doudizhuSelectLandlord(row, isOk) {
            row.isConfirm = true;
            if (isOk) {
                this.doudizhuBeLandlord(this.curUser.id, this.curUser.nickName);
            } else {
                //不抢就轮到下一名用户，如果都轮完了，就默认发起者做
                var user = this.calcJielongNextUser(this.curUser.id);//取下一个人
                if (user.userId == this.doudizhu.sendUserId) {
                    //当又轮回发起人的时候，就代表没有人做，就默认发起人做
                    this.doudizhuBeLandlord(user.userId, user.nickName);
                } else {
                    var inputDto = {
                        id: this.$getGuid(),
                        sendUserId: this.curUser.id,
                        receiveRoomId: this.curRoom.id,
                        nickName: this.curUser.nickName,//触发消息的时候使用
                        message: `不抢地主`,
                        messageType: '3-3',
                        originMessageId: row.id,
                        jielongUser: user,//只有当前人可以回复
                        isConfirm: false,
                    }
                    inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
                    this.socket.emit('send-RoomChatMessage', inputDto);
                }
            }
        },
        doudizhuBeLandlord(userId, userName) {
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: userId,
                receiveRoomId: this.curRoom.id,
                nickName: userName,//触发消息的时候使用
                message: '做地主（地主牌加入该用户手中）由地主先出牌',
                messageType: '3-3=1',
                originMessageId: null,
                jielongUser: null,//只有当前人可以回复
                isConfirm: false,
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
        },
        sendDoudizhuMessage_3_4(userId, userName) {
            //地主先出牌。。轮流下一名用户出牌（3-4）
            this.doudizhu.isStart = true
            this.doudizhu.currentPlayerId = userId
            this.doudizhu.currentPlayerName = userName
            this.doudizhu.isCurrentPlayer = userId == this.curUser.id
            if (this.doudizhu.isCurrentPlayer) {
                this.playCardResetTime();//是当前操作的用户时，再进行计时
            }

            //出牌过程：
            //如果用户选择出牌：用户选择牌组，点出牌时校验是否符合，不符合提示错误，符合就出牌（相当于就是广播消息），然后手中的牌减去已经出的牌，排序，轮到下一家
            //如果用户选择不出：直接轮到下家
        },
        playCardResetTime() {
            this.doudizhu.timeRemaining = 60;
            this.doudizhu.timeIntervalId = setInterval(() => {
                this.doudizhu.timeRemaining--
                if (this.doudizhu.timeRemaining === 0) {
                    this.clearTimeInterval();

                    //如果还是当前出牌人，已经超过60秒，就算超时，自动跳过出牌，如果已经出牌会自动清掉该定时器
                    //超时之后，马上设置出牌按钮禁用，然后等3秒再跳过，避免出牌按钮和自动跳过同时触发
                    if (this.doudizhu.isCurrentPlayer) {
                        this.doudizhu.isOverTime = true;
                        this.doudizhu.timeOutId = setTimeout(() => { this.doudizhuSkip() }, 3000)
                    }
                }
            }, 1000)
        },
        clearTimeInterval() {
            if (this.doudizhu.timeIntervalId !== null) {
                clearInterval(this.doudizhu.timeIntervalId)
                this.doudizhu.timeIntervalId = null;
            }
        },
        clearMyTimeout() {
            if (this.doudizhu.timeOutId !== null) {
                clearTimeout(this.doudizhu.timeOutId)
                this.doudizhu.timeOutId = null;
            }
        },
        doudizhuPlayCard() {
            if (!this.doudizhu.isCurrentPlayer) {
                return;
            }

            if (this.doudizhu.selectCardKeys.length === 0) {
                this.$swalError('系统提示', '请选择要出的牌');
                return;
            }
            var isOK = this.checkSelectCards();
            if (!isOK) {
                this.$swalError('系统提示', '选择牌不符合出牌规则');
                return;
            }

            this.clearTimeInterval();
            this.clearMyTimeout();

            //表示这次出完牌就赢了
            var isOver = this.doudizhu.selectCardKeys.length === this.doudizhu.myCards.length;

            var selectCardTexts = [];
            this.doudizhu.selectCardKeys.forEach(f => {
                const card = this.doudizhu.deckInfo[f]
                selectCardTexts.push(`<span style="color:${card.color}">(${card.value})${card.suit}</span>`)
            })
            var remainingQty = this.doudizhu.myCards.length - selectCardTexts.length;//计算剩余手牌数量
            var user = this.calcJielongNextUser(this.curUser.id);//取下一个人
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: `出牌(剩余手牌:${remainingQty})`,
                htmlMessage: selectCardTexts.join(' | '),
                messageType: '3-4',
                originMessageId: null,
                jielongUser: isOver ? null : user,//设置当前人为激活
                isConfirm: false,
                remark: this.doudizhu.selectCardKeys
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            this.doudizhu.isOverTime = false;

            //手牌减去刚刚出的牌
            this.doudizhu.selectCardKeys.forEach(f => {
                let index = this.doudizhu.myCards.findIndex(f2 => f2.key === f)
                if (index !== -1) {
                    this.doudizhu.myCards.splice(index, 1)
                }
            })
            this.doudizhuSort(this.doudizhu.myCards);
            this.doudizhu.selectCardKeys = [];

            if (isOver) {
                this.sendDoudizhuMessage_3_5();
            }
        },
        checkSelectCards() {
            //校验是否符合出牌规则
            //当前选择的牌：this.doudizhu.selectCardKeys
            //上一次出牌人this.doudizhu.lastPlayCardPlayerId
            //上一次出的牌this.doudizhu.lastSelectCardKeys

            //首先必须校验出的牌必须符合规定：
            //单张
            //两张相同值的牌/王炸弹
            //三张相同值的牌  //三带一，三代二
            //四张相同值的牌  //四带一，四带二
            //顺子，五个连续的牌
            //连对：连续三对以上相同的两张牌
            //飞机：连续两对以上相同的三张牌  //三带一，三带二
            var cardNos = [];//牌序号
            var cardCount = []//统计出现次数
            this.doudizhu.selectCardKeys.forEach(f => {
                const card = this.doudizhu.deckInfo[f]
                cardNos.push(card.index);//转为序号

                let index = cardCount.findIndex(f => f.key === card.index);
                if (index !== -1) {
                    cardCount[index].count++
                } else {
                    cardCount.push({ key: card.index, count: 1 })
                }
            })
            cardNos.sort((a, b) => {
                return a - b;
            });
            var isOK = this.checkCard(cardNos, cardCount);
            if (!isOK) {
                return false;
            }

            //特别注意：如果其他两个人都不出，又轮回自己的时候，就不需要判断上一次的牌了，上一次的牌也是自己出的
            if (this.doudizhu.lastSelectCardKeys.length > 0 && this.doudizhu.lastPlayCardPlayerId !== this.curUser.id) {
                //上一次出牌比较，必须比上一次出牌大
                var lastCardNos = [];//牌序号
                var lastCardCount = []//统计出现次数
                this.doudizhu.lastSelectCardKeys.forEach(f => {
                    const card = this.doudizhu.deckInfo[f]
                    lastCardNos.push(card.index);

                    let index = lastCardCount.findIndex(f => f.key === card.index);
                    if (index !== -1) {
                        lastCardCount[index].count++
                    } else {
                        lastCardCount.push({ key: card.index, count: 1 })
                    }
                })
                lastCardNos.sort((a, b) => {
                    return a - b;
                });
                return this.checkLastCard(cardNos, cardCount, lastCardNos, lastCardCount)
            } else {
                return true
            }
        },
        checkCard(cardNos, cardCount) {
            const len = cardNos.length;

            //单张
            var oneCards = cardCount.filter(f => f.count === 1);
            //两对
            var twoCards = cardCount.filter(f => f.count === 2);
            //三张相同
            var threeCards = cardCount.filter(f => f.count === 3);
            //四张相同
            var fourCards = cardCount.filter(f => f.count === 4);

            // 单牌
            if (len === 1) return true;

            // 对子/王炸
            if (len === 2) {
                if (twoCards.length === 1) return true;
                else if (
                    (cardNos[0] === 14 && cardNos[1] === 15)
                    ||
                    (cardNos[0] === 15 && cardNos[1] === 14)) return true;
                else return false;
            }

            // 三张
            if (len === 3) {
                if (threeCards.length === 1) return true;
                else return false;
            }

            // 四张/三带一
            if (len === 4) {
                if (fourCards.length === 1) return true;
                else if (threeCards.length === 1 && oneCards.length === 1) {//可能三带一
                    return true;
                }
                else return false;
            }

            //34567
            //3456789[10]JQKA
            //顺子：由‌至少5张‌连续的单牌组成，且必须从3开始到A结束（A可视为1），中间不能包含2或双王
            if (twoCards.length === 0 && threeCards.length === 0 && fourCards.length === 0) {//都是单张牌
                if (cardNos.filter(f => f >= 13).length > 0) {
                    return false;//不能连到2或双王
                }
                return this.$areNumbersConsecutive(cardNos)//校验数字是否连续
            }

            //33+44+55+66
            //33+44+55+66+77+88...
            //连续出对，但必须是三对或三对以上的连续对子，且不包括2和双王
            if (twoCards.length >= 3 && threeCards.length < 3) {//含有3个以上的对子，且没有3个以上三顺（因为三顺可以搭对子）
                if (oneCards.length > 0) {
                    return false;//连对不能有单牌
                }
                var keys_2 = twoCards.map(m => m.key)
                if (keys_2.filter(f => f >= 13).length > 0) {
                    return false;//不能连到2或双王
                }
                return this.$areNumbersConsecutive(keys_2)//校验数字是否连续
            }

            //333+444
            //333+444+555+666...
            //飞机由两个或以上的连续三张牌组成，不能使用2和双王作为飞机的起点（最高点数可以连到2，但通常不使用2作为飞机的起点）。例如，444555666可以组成一个飞机，但222不能作为飞机的起点‌
            //三顺带出相同数量的单牌：333444+56（飞机带翅膀，翅膀没有顺序要求，任意单牌，也可以是2或大小王）
            //三顺带出相同数量的对子：333444+5566、777888999+445566（飞机带翅膀，翅膀没有顺序要求，任意单牌，也可以是对2或大小王）
            //注意不能又搭单牌的同时又搭对子
            if (threeCards.length >= 2) {//含有2个以上的三顺
                if (oneCards.length > 0 && twoCards.length > 0) {
                    return false;//不能又搭单牌的同时又搭对子
                }
                if (oneCards.length > 0 && threeCards.length !== oneCards.length) {
                    return false;//飞机与翅膀的数量必须一致
                }
                if (twoCards.length > 0 && threeCards.length !== twoCards.length) {
                    return false;//飞机与翅膀的数量必须一致
                }

                var keys_3 = threeCards.map(m => m.key)
                if (keys_3.filter(f => f >= 13).length > 0) {
                    return false;//不能连到2或双王
                }
                return this.$areNumbersConsecutive(keys_3)//校验数字是否连续
            }

            //炸弹也可以顺连：3333+4444
            //四带一：3333+4
            //四带二，二可以为单牌或对子，没有顺序牌型要求：33334444+58，33334444+5588
            if (fourCards.length > 0) {
                if (oneCards.length > 0 && twoCards.length > 0) {
                    return false;//不能又搭单牌的同时又搭对子
                }
                if (oneCards.length > 0 && fourCards.length !== oneCards.length) {
                    return false;//数量必须一致
                }
                if (twoCards.length > 0 && fourCards.length !== twoCards.length) {
                    return false;//数量必须一致
                }

                var keys_4 = fourCards.map(m => m.key)
                if (keys_4.filter(f => f >= 13).length > 0) {
                    return false;//不能连到2或双王
                }
                return this.$areNumbersConsecutive(keys_4)//校验数字是否连续
            }

            return false;
        },
        checkLastCard(cardNos, cardCount, lastCardNos, lastCardCount) {
            //比较大小即可，牌已经是校验过的了
            const len = cardNos.length;
            const lenLast = lastCardNos.length;

            //单张
            var oneCards = cardCount.filter(f => f.count === 1);
            //两对
            var twoCards = cardCount.filter(f => f.count === 2);
            //三张相同
            var threeCards = cardCount.filter(f => f.count === 3);
            //四张相同
            var fourCards = cardCount.filter(f => f.count === 4);

            //单张
            var oneCardsLast = lastCardCount.filter(f => f.count === 1);
            //两对
            var twoCardsLast = lastCardCount.filter(f => f.count === 2);
            //三张相同
            var threeCardsLast = lastCardCount.filter(f => f.count === 3);
            //四张相同
            var fourCardsLast = lastCardCount.filter(f => f.count === 4);

            // 单牌
            if (len === 1 && lenLast === 1) {
                return cardNos[0] > lastCardNos[0]
            }

            // 对子/王炸
            if (len === 2 && lenLast === 2) {
                var newTotal = cardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                var lastTotal = lastCardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                return newTotal > lastTotal
            }

            // 三张
            if (len === 3 && lenLast === 3) {
                var newTotal = cardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                var lastTotal = lastCardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                return newTotal > lastTotal
            }

            // 四张
            if (len === 4 && lenLast === 4) {
                if (threeCards.length === 1 && threeCardsLast.length === 1) {
                    return threeCards[0].key > threeCardsLast[0].key//三带一，只管三张相同牌即可，不用管附带牌
                }
                if (fourCards.length === 1 && fourCardsLast.length === 1) {
                    return fourCards[0].key > fourCardsLast[0].key
                }
            }

            //34567
            //3456789[10]JQKA
            //顺子：由‌至少5张‌连续的单牌组成，且必须从3开始到A结束（A可视为1），中间不能包含2或双王
            if (twoCards.length === 0 && threeCards.length === 0 && fourCards.length === 0 &&
                twoCardsLast.length === 0 && threeCardsLast.length === 0 && fourCardsLast.length === 0) {//都是单张牌
                var newTotal = cardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                var lastTotal = lastCardNos.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                return newTotal > lastTotal
            }

            //33+44+55+66
            //33+44+55+66+77+88...
            //连续出对，但必须是三对或三对以上的连续对子，且不包括2和双王
            if (twoCards.length >= 3 && threeCards.length < 3 &&
                twoCardsLast.length >= 3 && threeCardsLast.length < 3) {//含有3个以上的对子，且没有3个以上三顺（因为三顺可以搭对子）
                var newTotal = twoCards.reduce((sum, item) => sum + item.key, 0)
                var lastTotal = twoCardsLast.reduce((sum, item) => sum + item.key, 0)
                return newTotal > lastTotal
            }

            //333+444
            //333+444+555+666...
            //飞机由两个或以上的连续三张牌组成，不能使用2和双王作为飞机的起点（最高点数可以连到2，但通常不使用2作为飞机的起点）。例如，444555666可以组成一个飞机，但222不能作为飞机的起点‌
            //三顺带出相同数量的单牌：333444+56（飞机带翅膀，翅膀没有顺序要求，任意单牌，也可以是2或大小王）
            //三顺带出相同数量的对子：333444+5566、777888999+445566（飞机带翅膀，翅膀没有顺序要求，任意单牌，也可以是对2或大小王）
            //注意不能又搭单牌的同时又搭对子
            if (threeCards.length >= 2 && threeCardsLast.length >= 2) {//含有2个以上的三顺
                var newTotal = threeCards.reduce((sum, item) => sum + item.key, 0)
                var lastTotal = threeCardsLast.reduce((sum, item) => sum + item.key, 0)
                return newTotal > lastTotal
            }

            //3333+4444
            if (fourCards.length >= 2 && fourCardsLast.length >= 2) {
                var newTotal = fourCards.reduce((sum, item) => sum + item.key, 0)
                var lastTotal = fourCardsLast.reduce((sum, item) => sum + item.key, 0)
                return newTotal > lastTotal
            }

            //炸弹
            if (fourCards.length === 1 && fourCardsLast.length === 1){
                //炸弹可以炸比自己和双王小的所有牌
            }

            return false;
        },
        doudizhuSkip() {
            if (!this.doudizhu.isCurrentPlayer) {
                return;
            }
            this.clearTimeInterval();
            this.clearMyTimeout();

            var user = this.calcJielongNextUser(this.curUser.id);//取下一个人
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: this.doudizhu.isOverTime ? '超时自动跳过' : '不出',
                htmlMessage: null,
                messageType: '3-4',
                originMessageId: null,
                jielongUser: user,//设置当前人为激活
                isConfirm: false,
                remark: null
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            this.doudizhu.isOverTime = false;
        },
        sendDoudizhuMessage_3_5() {
            //最后牌先出完一方获胜，显示所有用户剩余手中的牌（3-5）
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,//这个用户是赢家
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: '胜利',
                htmlMessage: null,
                messageType: '3-5',
                originMessageId: null,
                jielongUser: null,//设置当前人为激活
                isConfirm: false,
                remark: null
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
        },
        showAllUserCards() {
            //显示所有人的手牌
            var showCardTexts = [];
            this.doudizhu.myCards.forEach(f => {
                showCardTexts.push(`<span style="color:${f.color}">(${f.suit})${f.value}</span>`)
            })
            var inputDto = {
                id: this.$getGuid(),
                sendUserId: this.curUser.id,
                receiveRoomId: this.curRoom.id,
                nickName: this.curUser.nickName,//触发消息的时候使用
                message: '剩余手牌',
                htmlMessage: showCardTexts.length > 0 ? showCardTexts.join(' | ') : '没有剩余手牌',
                messageType: '3-5=1',
                originMessageId: null,
                jielongUser: null,//设置当前人为激活
                isConfirm: true,
                remark: showCardTexts.length === 0 ? '1' : '0'//标记是否是赢家
            }
            inputDto.roomUserIds = this.roomUsers.map(m => m.userId)
            this.socket.emit('send-RoomChatMessage', inputDto);
            this.doudizhuReset();
        },
        doudizhuReset() {
            //重新开始，重置所有状态
            this.doudizhu.sendUserId = null;//发起人
            this.doudizhu.isShow = false;
            this.doudizhu.voteGuid = '';
            this.doudizhu.voteResult = [];//投票结果
            this.doudizhu.myCards = [];
            this.doudizhu.players = {};
            this.doudizhu.landlordCards = [];
            this.doudizhu.deckInfo = {};
            this.doudizhu.isStart = false;
            this.doudizhu.currentPlayerId = null;
            this.doudizhu.currentPlayerName = null;
            this.doudizhu.isCurrentPlayer = false;
            this.doudizhu.landlordPlayerId = null;
            this.doudizhu.landlordPlayerName = null;
            this.doudizhu.timeRemaining = 60;//出牌剩余时间
            this.doudizhu.timeIntervalId = null;//计算Id
            this.doudizhu.isOverTime = false;
            this.doudizhu.timeOutId = null;
            this.doudizhu.selectCardKeys = [];
            this.doudizhu.lastPlayCardPlayerId = null;
            this.doudizhu.lastSelectCardKeys = [];//最后一次出的牌，用于出牌规则校验
        },
        doudizhuSort(cards) {
            if (cards.length === 0) {
                return;
            }
            cards.sort((a, b) => {
                return a.index - b.index;
            });
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
                //接收到新的消息时，追加消息到聊天窗口
                if (data.receiveRoomId == this.roomId) {
                    this.chatMessages.push(data);
                    this.scrollChatMessageDiv();

                    console.log('chat-RoomChatMessage', data);
                    if (data.messageType == '3-1') {
                        this.doudizhu.sendUserId = data.sendUserId//标记发起人
                    }
                    if (data.messageType == '3-1=1' || data.messageType == '3-1=0') {
                        if (data.remark == this.doudizhu.voteGuid) {
                            this.doudizhu.voteResult.push(data.messageType)
                            if (this.doudizhu.voteResult.length === this.roomUsers.length) {
                                //如果都投完票了，判断有没有人投反对票，没有就继续下一步，有就停止
                                let index = this.doudizhu.voteResult.findIndex(f => f === "3-1=0");
                                if (index === -1) {
                                    this.sendDoudizhuMessage_3_2();//最后一个人投票完成之后就开始
                                } else {
                                    this.chatMessages.push({
                                        id: this.$getGuid(),
                                        sendUserId: null,
                                        receiveRoomId: this.curRoom.id,
                                        nickName: '',
                                        message: '有人反对启动斗地主, 结束',
                                        messageType: '-1',//系统提示
                                        originMessageId: null,
                                        jielongUser: null,
                                        isConfirm: true,
                                    });
                                }
                            }
                        }
                    }
                    if (data.messageType == '3-2') {
                        this.doudizhu.myCards = data.doudizhu.players['Id_' + this.curUser.id].decks
                        this.doudizhu.players = data.doudizhu.players
                        this.doudizhu.landlordCards = data.doudizhu.landlordCards
                        this.doudizhu.deckInfo = data.doudizhu.deckInfo
                        this.doudizhuSort(this.doudizhu.myCards)
                        this.doudizhu.isShow = true

                        //显示地主牌
                        var landlordCardTexts = [];
                        this.doudizhu.landlordCards.forEach(f => {
                            landlordCardTexts.push(`<span style="color:${f.color}">(${f.suit})${f.value}</span>`)
                        })
                        this.chatMessages.push({
                            id: this.$getGuid(),
                            sendUserId: null,
                            receiveRoomId: this.curRoom.id,
                            nickName: '',
                            message: '地主牌',
                            htmlMessage: landlordCardTexts.join(' | '),
                            messageType: '-1',//系统提示
                            originMessageId: null,
                            jielongUser: null,
                            isConfirm: true,
                        });

                        if (this.doudizhu.sendUserId == this.curUser.id) {
                            this.sendDoudizhuMessage_3_3();//由发起人开始接龙，是否抢地主
                        }
                    }
                    if (data.messageType == '3-3=1') {
                        if (data.sendUserId == this.curUser.id) {
                            //地主牌加入地主手中
                            this.doudizhu.landlordCards.forEach(f => this.doudizhu.myCards.push(f))
                            this.doudizhuSort(this.doudizhu.myCards)
                        }
                        this.doudizhu.players['Id_' + data.sendUserId].count += 3
                        //由地主先出牌
                        this.sendDoudizhuMessage_3_4(data.sendUserId, data.nickName);
                        this.doudizhu.landlordPlayerId = data.sendUserId//地主用户Id
                        this.doudizhu.landlordPlayerName = data.nickName//地主用户名
                    }
                    if (data.messageType == '3-4') {
                        if (data.remark) {
                            this.doudizhu.lastPlayCardPlayerId = data.sendUserId
                            this.doudizhu.lastSelectCardKeys = data.remark//标记最后一次的出牌，用于出牌规则校验
                            if (this.doudizhu.players['Id_' + data.sendUserId]) {
                                this.doudizhu.players['Id_' + data.sendUserId].count -= data.remark.length
                            }
                        }
                        if (data.jielongUser) {
                            this.sendDoudizhuMessage_3_4(data.jielongUser.userId, data.jielongUser.nickName);
                        }
                    }
                    if (data.messageType == '3-5') {
                        //结束，公布所有人的手牌，然后又开始投票开始下一局
                        this.showAllUserCards();
                    }
                    if (data.messageType == '3-5=1') {
                        //当前人是赢家时，由赢家进入下一轮开局
                        if (data.remark === '1' && data.sendUserId == this.curUser.id) {
                            this.sendDoudizhuMessage_3_1(data.sendUserId)
                        }
                    }

                    if (data.originMessageId) {
                        var index = this.chatMessages.findIndex(f => f.id == data.originMessageId)
                        if (index !== -1) {
                            this.chatMessages[index].isConfirm = true
                        }
                    }
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
            if (this.doudizhu.isStart && this.onlineUserIds.length !== this.roomUsers.length) {
                this.$swalError('系统提示', '有用户掉线了，自动结束这局');
                this.doudizhuReset();
            }
        },
        getOnlineUserIds() {
            // this.$get(`/api/getOnlineUserIds`).then((response) => {
            //     this.onlineUserIds = response.data.data
            //     this.refreshOnlineStatus(this.roomUsers);
            // }).catch((err) => {
            //     this.$swalError('系统提示', err);
            // })
            //改成用户进入房间才算在线
            this.$get(`/api/getOnlineRoomUserIds?roomId=${this.roomId}`).then((response) => {
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

        // this.$bus.on('refreshOnlineUserIds', (data) => {
        //     this.onlineUserIds = data
        //     this.refreshOnlineStatus(this.roomUsers);
        // })
        //改为统计房间内的用户在线
        this.$bus.on('refreshOnlineRoomUserIds', (roomId) => {
            if (roomId == this.roomId) {
                this.getOnlineUserIds()
            }
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
        this.$bus.off('refreshOnlineRoomUserIds');
    },
    beforeDestroy() {
        console.log("ChatRoom beforeDestroy");
        // 组件销毁前断开连接
        if (this.socket) {
            this.socket.off('chat-RoomChatMessage') // 移除事件监听
            this.socket.disconnect()
        }
        this.$bus.off('refreshOnlineUserIds');
        this.$bus.off('refreshOnlineRoomUserIds');
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