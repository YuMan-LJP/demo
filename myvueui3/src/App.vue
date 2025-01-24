<template>
  <div>
    <el-config-provider :locale="locale">
      <el-container style="height: 100vh">
        <el-header>
          <el-menu mode="horizontal" :ellipsis="false" background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="0" @click="expandOrCollapseMenu">{{ $t('app.title') }}</el-menu-item>
            <el-sub-menu index="2">
              <template #title>Workspace</template>
              <el-menu-item index="2-1">item one</el-menu-item>
              <el-menu-item index="2-2">item two</el-menu-item>
              <el-menu-item index="2-3">item three</el-menu-item>
              <el-sub-menu index="2-4">
                <template #title>item four</template>
                <el-menu-item index="2-4-1">item one</el-menu-item>
                <el-menu-item index="2-4-2">item two</el-menu-item>
                <el-menu-item index="2-4-3">item three</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="1" @click="toggleLang">{{ $t("app.switchLanguage") }}</el-menu-item>
          </el-menu>
        </el-header>
        <el-container>
          <el-aside style="background-color:darkgray">
            <el-menu :router="true" :unique-opened="true" :default-active="activeIndex" @select="handleSelect" :collapse="isMenuCollapse">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>导航一</span>
                </template>
                <el-menu-item-group title="分组1">
                  <el-menu-item index="/">Home</el-menu-item>
                  <el-menu-item index="/about">About</el-menu-item>
                  <el-menu-item index="/help">Help</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="/tableSample">表格样例</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                  <template #title>选项4</template>
                  <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>导航二</span>
                </template>
                <el-menu-item-group title="分组1">
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="2-4">
                  <template #title>选项4</template>
                  <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                </el-sub-menu>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>导航三</span>
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
  </div>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

//菜单图标：https://element-plus.org/zh-CN/component/icon
export default {
  name: 'App',
  components: {
    ElConfigProvider
  },
  data() {
    return {
      locale: zhCn,
      activeIndex: '/',//页面加载时默认激活菜单的 index
      isMenuCollapse: false,
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

    expandOrCollapseMenu(){
      this.isMenuCollapse = !this.isMenuCollapse;
    },
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
