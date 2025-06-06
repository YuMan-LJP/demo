import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        component: () => import("../views/login/Login.vue")
    },
    {
        path: '/',
        component: () => import("../views/index/Home.vue")
    },
    {
        path: '/about',
        name: 'about',
        component: () => import("../views/index/commons/About.vue")
    },
    {
        path: '/help',
        name: 'help',
        component: () => import("../views/index/commons/Help.vue")
    },
    {
        path: '/helloWorld',
        name: 'helloWorld',
        component: () => import("../views/index/commons/HelloWorld.vue")
    },
    {
        path: '/tableSample',
        name: 'tableSample',
        component: () => import("../views/index/commons/TableSample.vue")
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import("../views/index/users/UserInfo.vue")
    },
    {
        path: '/chatContact',
        name: 'chatContact',
        component: () => import("../views/index/chats/ChatContact.vue")
    },
    {
        path: '/chatRoom',
        name: 'chatRoom',
        component: () => import("../views/index/chats/ChatRoom.vue")
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import("../views/index/chats/Contact.vue")
    },
    {
        path: '/room',
        name: 'room',
        component: () => import("../views/index/chats/Room.vue")
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;