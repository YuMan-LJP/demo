import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '../src/styles/custom.scss'//或者在vue.config.js里面引入
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueRouter from "vue-router";
import router from './router'//引入路由器

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// 将 axios 绑定到 Vue 原型上，方便全局使用
Vue.prototype.$axios = axios;
// 配置 axios 默认的根路径
axios.defaults.baseURL = 'http://localhost:5000';
// 可以在此处配置请求头、超时等
// axios.defaults.headers.common['Authorization'] = 'Bearer token';
// axios.defaults.timeout = 10000;

// 注册vue-router中的所有组件
Vue.use(VueRouter);

Vue.config.productionTip = false//关闭Vue的生产提示

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
