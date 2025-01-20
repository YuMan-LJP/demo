import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../../components/Home.vue'
import About from '../../components/About.vue'
import Help from '../../components/Help.vue'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: About
    },
    {
        path: '/help',
        name: 'help',
        component: Help
    },
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;