import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '../src/styles/custom.scss'//或者在vue.config.js里面引入
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from "vue-router";
import router from './router'//引入路由器
import VueToastr from 'vue-toastr';
import BlockUI from 'vue-blockui'
import common from './utils/common'
//import alert from './components/Common/alert'
import i18n from './components/Common/i18n'
import axios from './components/Common/axios'
import message from './components/Common/message'
import loading from './components/Common/loading'


// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// 注册vue-router中的所有组件
Vue.use(VueRouter);


//http://s4l1h.github.io/vue-toastr/
Vue.use(VueToastr, {
  defaultTimeout: 3000,
  //defaultProgressBar: false,
  //defaultProgressBarValue: 0,
  //defaultType: "error",
  defaultPosition: "toast-bottom-right",//'toast-top-right', 'toast-bottom-right', 'toast-bottom-left', 'toast-top-left', 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-center', 'toast-bottom-center'
  //defaultCloseOnHover: false,
  //defaultStyle: { "background-color": "red" },
  //defaultClassNames: ["animated", "zoomInUp"]
});


Vue.use(BlockUI)

// 将 axios 绑定到 Vue 原型上，方便全局使用
Vue.prototype.$axios = axios;
//Vue.use(alert);//改用vue-swal
Vue.use(message);
Vue.use(loading);
Vue.prototype.$common = common;//挂一个全局公共方法

Vue.config.productionTip = false//关闭Vue的生产提示

new Vue({
  render: h => h(App),
  router: router,
  i18n: i18n,
}).$mount('#app')
