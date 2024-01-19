import { createRouter, createWebHashHistory } from 'vue-router'
import CallBack from '@/components/CallBack'
import MyHome from '@/components/MyHome'
import Login from '@/components/loginView'
import _404View from '@/components/_404View'
import Logout from '@/components/logoutView'

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
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/404',
        name: '404',
        component: _404View
    },
    {
        path: '/Logout',
        name: 'Logout',
        component: Logout
    }
]

const router = createRouter({
    history:createWebHashHistory(),//createWebHistory
    routes,
})

export default router;