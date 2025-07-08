<template>
  <div>
    <el-config-provider :locale="locale" v-if="isLogin">
      <el-container style="height: 100vh">
        <el-header>
          <el-menu mode="horizontal" :ellipsis="false" background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="0" @click="expandOrCollapseMenu">{{ $t('app.title') }}</el-menu-item>
            <el-sub-menu index="4">
              <template #title>
                <el-badge :value="messageAllCount" class="item" :offset="[10, 15]" :hidden="messageAllCount == 0">
                  消息
                </el-badge>
              </template>
              <el-menu-item index="4-1" @click="openRequsetModal('contact')">
                <el-badge :value="requestContactCount" class="item" :offset="[20, 15]" :hidden="requestContactCount == 0">
                  联系人申请
                </el-badge>
              </el-menu-item>
              <el-menu-item index="4-2" @click="openRequsetModal('room')">
                <el-badge :value="requestRoomCount" class="item" :offset="[20, 15]" :hidden="requestRoomCount == 0">
                  群申请
                </el-badge>
              </el-menu-item>
              <el-menu-item index="4-3" @click="linkToChatContact">
                <el-badge :value="chatContactCount" class="item" :offset="[20, 15]" :hidden="chatContactCount == 0">
                  联系人消息
                </el-badge>
              </el-menu-item>
              <el-menu-item index="4-4" @click="linkToChatRoom">
                <el-badge :value="chatRoomCount" class="item" :offset="[20, 15]" :hidden="chatRoomCount == 0">
                  群消息
                </el-badge>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="3" @click="toggleLang">{{ $t("app.switchLanguage") }}</el-menu-item>
            <el-menu-item index="2">
              <el-icon>
                <UserFilled :color="onlineStatus" />
              </el-icon>
              [<span v-html="sessionUserName"></span>]
            </el-menu-item>
            <el-menu-item index="1" @click="logout">退出</el-menu-item>
          </el-menu>
        </el-header>
        <el-container>
          <el-aside style="background-color:darkgray">
            <el-menu :router="true" :unique-opened="true" :default-active="activeIndex" @select="handleSelect"
              :collapse="isMenuCollapse">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>Admin</span>
                </template>
                <el-menu-item-group title="分组1">
                  <el-menu-item index="/">Home</el-menu-item>
                  <el-menu-item index="/about">About</el-menu-item>
                  <el-menu-item index="/help">Help</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="/tableSample">表格样例</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4" v-if="this.isAdmin">
                  <template #title>用户管理</template>
                  <el-menu-item index="/userInfo">用户信息</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>Chat</span>
                </template>
                <el-menu-item-group title="好友">
                  <el-menu-item index="/contact">联系人</el-menu-item>
                  <el-menu-item index="/chatContact">消息</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="群聊">
                  <el-menu-item index="/room">群聊</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>Other</span>
                </template>
                <el-menu-item-group title="分组1">
                  <el-menu-item index="/snake">Snake</el-menu-item>
                  <el-menu-item index="/snakeOnline">Snake Online</el-menu-item>
                  <el-menu-item index="/snakeOnline2">Snake Online 2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="/ddz">DDZ</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="3-4">
                  <template #title>选项4</template>
                  <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
        <el-footer height="40px">
          <span>©{{ (new Date()).getFullYear() }} {{ $t('app.title') }}</span>
        </el-footer>
      </el-container>
    </el-config-provider>

    <el-dialog v-model="requestModal.isVisible" title="申请" width="900">
      <div>
        <el-table ref="requestTable" stripe row-key="id" :data="requestTable.rows" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column label="Operations">
            <template #default="scope">
              <el-button size="small" v-if="scope.row.receiveUserId == sessionUserId"
                :disabled="scope.row.progress != 'waiting'" type="primary"
                @click="handleRequsetPass(scope.$index, scope.row)">
                同意
              </el-button>
              <el-button size="small" v-if="scope.row.receiveUserId == sessionUserId"
                :disabled="scope.row.progress != 'waiting'" type="danger"
                @click="handleRequsetRefuse(scope.$index, scope.row)">
                拒绝
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Progress" prop="progress" />
          <el-table-column label="Type" prop="type" />
          <el-table-column label="Send User Name" prop="sendUserName" />
          <el-table-column label="Receive User Name" prop="receiveUserName" />
          <el-table-column label="Room Name" prop="roomName" />
          <el-table-column label="Remark" prop="remark" />
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeRequsetModal">{{ $t("app.cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useRouter } from 'vue-router'
import io from 'socket.io-client';

//菜单图标：https://element-plus.org/zh-CN/component/icon
export default {
  setup() {
    const router = useRouter()//特别注意useRouter只能在setup里面引入，否则会是undefined
    return {
      router
    }
  },
  name: 'App',
  components: {
    ElConfigProvider
  },
  data() {
    return {
      isLogin: false,
      locale: zhCn,
      activeIndex: '/',//页面加载时默认激活菜单的 index
      isMenuCollapse: false,
      sessionUser: {},
      sessionUserId: '',
      sessionUserName: '',
      isAdmin: false,

      messageAllCount: 0,
      chatContactCount: 0,
      chatRoomCount: 0,
      requestContactCount: 0,
      requestRoomCount: 0,

      requestModal: {
        isVisible: false,
      },
      requestTable: {
        rows: [],
        disabled: false,
      },

      socket: null,
      onlineStatus: 'red'//green在线/red离线
    }
  },
  methods: {
    toggleLang() {
      this.$i18n.locale = this.$i18n.locale === 'zh' ? 'en' : 'zh'
      this.locale = this.$i18n.locale === 'zh' ? zhCn : en;//设置element组件当前语言
      localStorage.setItem('lang', this.$i18n.locale)
      this.$swalSuccess(this.$t('app.systemTips'), this.$t('app.switchLanguageSuccessfully'));
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },

    expandOrCollapseMenu() {
      this.isMenuCollapse = !this.isMenuCollapse;
    },
    logout() {
      sessionStorage.removeItem('user');
      this.socket.emit('userquit', this.sessionUserId);
      window.location.href = "login.html"
    },
    setMenuActive() {
      try {
        var routeName = window.location.href.split('/').at(-1)
        if (routeName) {
          this.activeIndex = '/' + routeName;
        }
      }
      catch (ex) { console.log(ex) }
    },
    refreshMessage() {
      if (this.sessionUser.id === undefined ||
        this.sessionUser.id === 'undefined' ||
        this.sessionUser.id === 0 ||
        this.sessionUser.id === null ||
        this.sessionUser.id === '') {
        return;
      }
      this.messageAllCount = 0;
      this.requestContactCount = 0;
      this.requestRoomCount = 0;
      this.chatContactCount = 0;
      this.chatRoomCount = 0;
      this.$get2(`/api/getMessageQueues?userId=${this.sessionUser.id}`, (data) => {
        for (let item of data) {
          //requestcontact联系人申请/requestroom群申请/chatcontact联系人聊天/chatroom群聊天
          if (item.type == 'requestcontact') {
            this.requestContactCount++;
          } else if (item.type == 'requestroom') {
            this.requestRoomCount++;
          } else if (item.type == 'chatroom') {
            this.chatRoomCount++;
          } else if (item.type == 'chatcontact') {
            this.chatContactCount++;
          }
          this.messageAllCount++;
        }
      })
    },

    openRequsetModal(type) {
      this.$getEx(`/api/getRequests?userId=${this.sessionUser.id}&type=${type}`, (data) => {
        this.requestTable.rows = data;
        this.requestModal.isVisible = true
      })
    },
    closeRequsetModal() {
      this.requestModal.isVisible = false
    },
    handleRequsetPass(index, row) {
      if (row.type === 'contact') {
        var inputDto = {
          requestId: row.id,
          myselfId: row.receiveUserId,
          friendId: row.sendUserId
        }
        this.$postEx(`/api/addContact`, inputDto, (data) => {
          row.progress = 'pass'
          this.$bus.emit('messageChange')
        })
      }
      else if (row.type === 'room') {
        var inputDto = {
          requestId: row.id,
          roomId: row.receiveRoomId,
          myselfId: row.receiveUserId,
          friendId: row.sendUserId
        }
        this.$postEx(`/api/addRoomUser`, inputDto, (data) => {
          row.progress = 'pass'
          this.$bus.emit('messageChange')
        })
      }
      else {
        this.$swalError('系统提示', row.type + '类型错误');
      }
    },
    handleRequsetRefuse(index, row) {
      this.$postEx(`/api/setRequestToRefuse`, { id: row.id, userId: row.receiveUserId, originUserId: row.sendUserId }, (data) => {
        row.progress = 'refuse'
        this.$bus.emit('messageChange')
      })
    },

    linkToChatContact() {
      this.router.push("/chatContact")
    },
    linkToChatRoom() {
      this.router.push("/room")
      //判断如果是当前路由就刷都当前表格
    },

    initSocket() {
      //服务器地址
      this.socket = io('http://192.168.1.234:5005/', {
        query: {
          userId: this.sessionUserId,
          userName: this.sessionUserName,
          roomId: null
        }
      });
      this.socket.on('connect', () => {
        console.log('Connected to server', this.socket.connected, this.socket.id);
      });
      // 接收消息
      this.socket.on('getuserlogin', (data) => {
        console.log('getuserlogin', data);
        this.$bus.emit('refreshOnlineUserIds', data)
      });
      this.socket.on('getuserquit', (data) => {
        console.log('getuserquit', data);
        this.$bus.emit('refreshOnlineUserIds', data)
      });
      this.socket.on('getdisconnect', (data) => {
        console.log('getdisconnect', data);
        this.$bus.emit('refreshOnlineUserIds', data)
      });
      this.socket.on('joinroom', (roomId) => {
        console.log('joinroom', roomId);
        this.$bus.emit('refreshOnlineRoomUserIds', roomId)
      });
      this.socket.on('quitroom', (roomId) => {
        console.log('quitroom', roomId);
        this.$bus.emit('refreshOnlineRoomUserIds', roomId)
      });
      this.socket.on('chat-ContactMessage', (data) => {
        console.log('chat-ContactMessage', data);
        if (data.receiveUserId == this.sessionUserId) {
          this.$bus.emit('messageChange')//接收到新的消息时，如果接收人就是自己就刷新右上角
        }
      });
      this.socket.on('message-RoomChat', (data) => {
        console.log('message-RoomChat', data);
        if (data.findIndex(f => f == this.sessionUserId) !== -1) {
          this.$bus.emit('messageChange')//接收到新的消息时，如果是群聊内的用户就刷新右上角
        }
      });
      this.socket.on('message-Refresh', (data) => {
        console.log('message-Refresh', data);
        if (data.findIndex(f => f == this.sessionUserId) !== -1) {
          this.$bus.emit('messageChange')//接收到新的消息时，就刷新右上角
        }
      });
      // 错误处理
      this.socket.on('connect_error', (err) => {
        console.error('connect_error:', err.message)
      })
      this.socket.on("disconnect", () => {
        console.log('disconnect', this.socket.id);
      });

      this.socket.emit('userlogin', this.sessionUserId);
    }
  },
  beforeCreate() {
    //console.log("App beforeCreate");
  },
  created() {
    console.log("App created");

    //校验有没有登录，没有就跳转登录页面
    var userJsonStr = sessionStorage.getItem('user')
    if (!userJsonStr) {
      window.location.href = "login.html"
      return;
    }

    this.isLogin = true;
    var userEntity = JSON.parse(userJsonStr);
    console.log(userEntity);
    this.sessionUser = userEntity;
    this.sessionUserId = userEntity.id;
    this.sessionUserName = userEntity.userName;
    this.isAdmin = userEntity.userType == "admin";
    this.onlineStatus = 'green';//在线状态

    //sessionStorage.removeItem('user');
    //sessionStorage.clear();
  },
  mounted() {
    console.log("App mounted");
    this.initSocket();
    this.refreshMessage();
    this.setMenuActive();

    this.$bus.on('messageChange', () => {
      console.log('messageChange')
      this.refreshMessage();
    })
    this.$bus.on('sendRefreshMessage', (data) => {
      console.log('sendRefreshMessage')
      this.socket.emit('send-RefreshMessage', data);//用户Id集合
    })
  },
  beforeUnmount() {
    console.log('App beforeUnmount');
    // 组件卸载前断开连接
    if (this.socket) {
      // 移除事件监听
      this.socket.off('getuserlogin')
      this.socket.off('getuserquit')
      this.socket.off('getdisconnect')
      this.socket.off('joinroom')
      this.socket.off('quitroom')
      this.socket.off('chat-ContactMessage')
      this.socket.off('message-RoomChat')
      this.socket.off('message-Refresh')
      this.socket.disconnect()
    }
    this.$bus.off('messageChange');
    this.$bus.off('sendRefreshMessage');
  },
  beforeDestroy() {
    console.log("App beforeDestroy");
    // 组件销毁前断开连接
    if (this.socket) {
      // 移除事件监听
      this.socket.off('getuserlogin')
      this.socket.off('getuserquit')
      this.socket.off('getdisconnect')
      this.socket.off('joinroom')
      this.socket.off('quitroom')
      this.socket.off('chat-ContactMessage')
      this.socket.off('message-RoomChat')
      this.socket.off('message-Refresh')
      this.socket.disconnect()
    }
    this.$bus.off('messageChange');
    this.$bus.off('sendRefreshMessage');
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
}

/* 让sweetalert2提示框显示的最上面，避免被模态框挡住 */
.swal2-container {
  z-index: 10000;
}
</style>

<style scoped>
.el-header {
  padding: 0 0;
}

.el-header .el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-aside {
  width: auto;
}
</style>
