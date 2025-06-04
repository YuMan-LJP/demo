import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import("../pages/Home.vue")
    },
    {
        path: '/about',
        name: 'about',
        component: () => import("../pages/commons/About.vue")
    },
    {
        path: '/help',
        name: 'help',
        component: () => import("../pages/commons/Help.vue")
    },
    {
        path: '/helloWorld',
        name: 'helloWorld',
        component: () => import("../pages/commons/HelloWorld.vue")
    },
    {
        path: '/tableSample',
        name: 'tableSample',
        component: () => import("../pages/commons/TableSample.vue")
    },
    {
        path: '/chatRoom',
        name: 'chatRoom',
        component: () => import("../pages/chats/ChatRoom.vue")
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import("../pages/users/UserInfo.vue")
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;