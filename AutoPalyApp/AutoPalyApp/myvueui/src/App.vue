<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">{{ $t("app.title") }}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <!-- Vue中借助router-link标签实现路由的切换，这里使用了bootstrap自带路由功能 -->
            <!-- <b-nav-item :to="{ name: 'home', params: { username: '需要传递的值' } }" exact exact-active-class="active">{{ $t("app.home") }}</b-nav-item> -->
            <b-nav-item to="/home" exact exact-active-class="active">{{ $t("app.home") }}</b-nav-item>
            <b-nav-item to="/commandGroup" exact exact-active-class="active">{{ $t("commandGroup.title") }}</b-nav-item>
            <b-nav-item to="/about" exact exact-active-class="active">{{ $t("app.about") }}</b-nav-item>
            <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" :placeholder="$t('app.search')"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">{{ $t("app.search") }}</b-button>
            </b-nav-form>

            <b-nav-item-dropdown :text="$t('app.languages')" right>
              <b-dropdown-item href="#" v-for="curLang in languagelist"
                @click="selectlang(curLang.key)">{{ curLang.value }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <!-- 指定组件的呈现位置 -->
    <router-view></router-view>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      language: '',
      languagelist: [{ key: 'zh', value: '中文' }, { key: 'en', value: 'English' }],
    }
  },
  methods: {
    selectlang(lang) {
      // 根据监听改变获取到的值去数组里找到对应的值
      localStorage.setItem('lang', lang)
      this.$i18n.locale = lang//切换字典文件
    },
  },
  created() {
    // 获取缓存的语种，如若没有（新用户），保存当前默认语言
    if (localStorage.getItem('lang')) {
      console.log(localStorage.getItem('lang'))
      this.language = localStorage.getItem('lang')
    } else {
      localStorage.setItem('lang', this.language)
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
