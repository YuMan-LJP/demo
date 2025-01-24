import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import("../../components/Home.vue")
    },
    {
        path: '/about',
        name: 'about',
        component: () => import("../../components/About.vue")
    },
    {
        path: '/help',
        name: 'help',
        component: () => import("../../components/Help.vue")
    },
    {
        path: '/tableSample',
        name: 'tableSample',
        component: () => import("../../components/TableSample.vue")
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;