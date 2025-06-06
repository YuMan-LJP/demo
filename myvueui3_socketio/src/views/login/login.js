import { createApp } from 'vue'
import App from './Login.vue'
import ElementPlus from 'element-plus' //全局引入
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from '../../components/axios'
import router from '../../components/router'
import i18n from '../../components/i18n'
import sweetalert2 from '../../components/sweetalert2'
import common from '../../components/common'

const app = createApp(App)

//注意挂载东西必须在use或mount方法之前
//app.config.globalProperties.axios = XXXXX//挂载到全局变量上

app.use(ElementPlus)//引入ElementUI
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(axios)//引入axios
app.use(router)//引入vue-router
app.use(i18n)//引入国际化i18n
app.use(sweetalert2)//引入弹窗插件sweetalert2
app.use(common)//引入公共方法

app.mount('#app')