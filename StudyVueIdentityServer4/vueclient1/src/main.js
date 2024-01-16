import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'

const app = createApp(App)

axios.defaults.baseURL = "https://localhost:5001/"
//axios.defaults.withCredentials = true;
app.config.globalProperties.$http = axios; // 挂载全局自定义方法

app.use(router).mount('#app')
