// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About'
import Home from '../components/Home'
import Index from '../components/Index'

//创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/helloworld',
            component:HelloWorld
        }
        ,
        {
            path:'/about',
            name: 'about',
            component:About
        },
        {
            path:'/home',
            name: 'home',
            component:Home
        },
        {
            path:'/',
            name: 'index',
            component:Index
        }
    ]
})