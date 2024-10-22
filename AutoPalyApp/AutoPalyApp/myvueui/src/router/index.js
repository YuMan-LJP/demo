// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import MyAbout from '../components/MyAbout'
import MyHome from '../components/MyHome'
import HelloWorld from '../components/HelloWorld.vue'

//创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/myabout',
            name: 'myabout',
            component:MyAbout
        },
        {
            path:'/myhome',
            name: 'myhome',
            component:MyHome
        },
        {
            path:'/helloworld',
            component:HelloWorld
        }
    ]
})