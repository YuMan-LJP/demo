<template>
  <div>
    <el-config-provider :locale="locale" v-if="isLogin">
      <el-container style="height: 100vh">
        <el-header>
          <el-menu mode="horizontal" :ellipsis="false" background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="0" @click="expandOrCollapseMenu">{{ $t('app.title') }}</el-menu-item>
            <el-sub-menu index="3">
              <template #title>
                <el-badge :value="messageAllCount" class="item" :offset="[10, 15]" :hidden="messageAllCount == 0">
                  消息
                </el-badge>
              </template>
              <el-menu-item index="3-1" @click="openRequsetModal">
                <el-badge :value="requestContactCount" class="item" :offset="[20, 15]" :hidden="requestContactCount == 0">
                  联系人申请
                </el-badge>
              </el-menu-item>
              <el-menu-item index="3-2">
                <el-badge :value="requestRoomCount" class="item" :offset="[20, 15]" :hidden="requestRoomCount == 0">
                  群申请
                </el-badge>
              </el-menu-item>
              <el-menu-item index="3-3">
                <el-badge :value="chatContactCount" class="item" :offset="[20, 15]" :hidden="chatContactCount == 0">
                  联系人消息
                </el-badge>
              </el-menu-item>
              <el-menu-item index="3-4">
                <el-badge :value="chatRoomCount" class="item" :offset="[20, 15]" :hidden="chatRoomCount == 0">
                  群消息
                </el-badge>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2" @click="toggleLang">{{ $t("app.switchLanguage") }}</el-menu-item>
            <el-menu-item index="1" @click="logout">[<span v-html="sessionUserName"></span>]退出</el-menu-item>
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
                  <el-menu-item index="/room">群管理</el-menu-item>
                  <el-menu-item index="/chatRoom">群聊</el-menu-item>
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
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="3-3">选项3</el-menu-item>
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

    <el-dialog v-model="requestModal.isVisible" title="申请" width="800">
      <div>
        <el-table ref="requestTable" stripe row-key="id" :data="requestTable.rows" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column label="Operations">
            <template #default="scope">
              <el-button size="small" :disabled="scope.row.progress != 'waiting'" type="primary"
                @click="handleRequsetPass(scope.$index, scope.row)">
                同意
              </el-button>
              <el-button size="small" :disabled="scope.row.progress != 'waiting'" type="danger"
                @click="handleRequsetRefuse(scope.$index, scope.row)">
                拒绝
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Progress" prop="progress" />
          <el-table-column label="Nick Name" prop="nickName" />
          <el-table-column label="Email" prop="email" />
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
import { ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';

//菜单图标：https://element-plus.org/zh-CN/component/icon
export default {
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
      }
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
      window.location.href = "login.html"
    },
    setMenuActive() {
      // var routeName = window.location.href.split('/').at(-1)
      // if (routeName) {
      //   this.activeIndex = '/' + routeName;
      // }
    },
    refreshMessage() {
      this.$get(`/api/getMessageQueues?userId=${this.sessionUser.id}`).then((response) => {
        console.log(response.data.data);
        this.messageAllCount = 0;
        this.requestContactCount = 0;
        this.requestRoomCount = 0;
        this.chatContactCount = 0;
        this.chatRoomCount = 0;
        for (let item of response.data.data) {
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
      }).catch((err) => {
        this.$swalError('系统提示', err);
      })
    },

    openRequsetModal() {
      this.requestModal.isVisible = true

      let loadingInstance = ElLoading.service({ fullscreen: true });
      this.$get(`/api/getRequests?receiveUserId=${this.sessionUser.id}`).then((response) => {
        loadingInstance.close();
        console.log(response.data.data);
        this.requestTable.rows = response.data.data;
      }).catch((err) => {
        loadingInstance.close();
        this.$swalError('系统提示', err);
      })
    },
    closeRequsetModal() {
      this.requestModal.isVisible = false
    },
    handleRequsetPass(index, row) {
      var inputDto = {
        requestId: row.id,
        myselfId: row.receiveUserId,
        friendId: row.sendUserId
      }
      let loadingInstance = ElLoading.service({ fullscreen: true });
      this.$post(`/api/addContact`, inputDto).then((response) => {
        loadingInstance.close();
        if (response.data.isSuccess) {
          row.progress = 'pass'
          this.$bus.emit('messageChange')
        }
      }).catch((err) => {
        loadingInstance.close();
        this.$swalError('系统提示', err);
      })
    },
    handleRequsetRefuse(index, row) {
      let loadingInstance = ElLoading.service({ fullscreen: true });
      this.$post(`/api/setRequestToRefuse`, { id: row.id, userId: row.receiveUserId, originUserId: row.sendUserId }).then((response) => {
        loadingInstance.close();
        if (response.data.isSuccess) {
          row.progress = 'refuse'
          this.$bus.emit('messageChange')
        }
      }).catch((err) => {
        loadingInstance.close();
        this.$swalError('系统提示', err);
      })
    }
  },
  beforeCreate() {
    console.log("App beforeCreate");
  },
  created() {
    console.log("App created");

    //校验有没有登录，没有就跳转登录页面
    var userJsonStr = sessionStorage.getItem('user')
    if (!userJsonStr) {
      // var router = useRouter()
      // router.push({ path: "/login" })
      window.location.href = "login.html"
      return;
    }

    this.isLogin = true;
    var userEntity = JSON.parse(userJsonStr);
    console.log(userEntity);
    this.sessionUser = userEntity;
    this.sessionUserName = userEntity.userName;
    this.isAdmin = userEntity.userType == "admin";

    //sessionStorage.removeItem('user');
    //sessionStorage.clear();
  },
  mounted() {
    console.log("App mounted");
    this.refreshMessage();
    this.setMenuActive();

    this.$bus.on('messageChange', () => {
      console.log('messageChange')
      this.refreshMessage();
    })
  },
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
