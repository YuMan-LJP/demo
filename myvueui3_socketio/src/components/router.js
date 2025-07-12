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
    },
    {
        path: '/ddz',
        name: 'ddz',
        component: () => import("../views/index/others/ddz.vue")
    },
    {
        path: '/snake',
        name: 'snake',
        component: () => import("../views/index/others/snake.vue")
    },
    {
        path: '/snakeOnline',
        name: 'snakeOnline',
        component: () => import("../views/index/others/snakeOnline.vue")
    },
    {
        path: '/snakeOnline2',
        name: 'snakeOnline2',
        component: () => import("../views/index/others/snakeOnline2.vue")
    },
    {
        path: '/snakeOnline2HighFPS',
        name: 'snakeOnline2HighFPS',
        component: () => import("../views/index/others/snakeOnline2HighFPS.vue")
    },
    {
        path: '/template',
        name: 'template',
        component: () => import("../views/index/others/_template.vue")
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;