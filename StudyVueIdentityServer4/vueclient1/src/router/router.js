import { createRouter, createWebHashHistory } from 'vue-router'
import CallBack from '@/components/CallBack'
import MyHome from '@/components/MyHome'

const routes = [
    {
        path: '/CallBack',
        name: 'CallBack',
        component: CallBack
    },
    {
        path: '/MyHome',
        name: 'MyHome',
        component: MyHome
    }
]

const router = createRouter({
    history:createWebHashHistory(),//createWebHistory
    routes,
})

export default router;