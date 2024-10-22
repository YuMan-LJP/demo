import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../src/styles/custom.scss'
import axios from 'axios'

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

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
