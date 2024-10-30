// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About'
import Home from '../components/Home'
import Index from '../components/Index'
import Helper from '../components/Helper'
import CommandGroup from '../components/CommandGroup'
import TaskScheduler from '../components/TaskScheduler'

//创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/helloworld',
            component:HelloWorld
        },
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
        },
        {
            path:'/helper',
            name: 'helper',
            component:Helper
        },
        {
            path:'/commandGroup',
            name: 'commandGroup',
            component:CommandGroup
        },
        {
            path:'/taskScheduler',
            name: 'taskScheduler',
            component:TaskScheduler
        }
    ]
})