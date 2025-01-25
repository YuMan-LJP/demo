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
    },
    {
        path: '/tableSample2',
        name: 'tableSample2',
        component: () => import("../../components/TableSample2.vue")
    },
    {
        path: '/summary',
        name: 'summary',
        component: () => import("../../components/Summary.vue")
    },
    {
        path: '/automaticGroup',
        name: 'automaticGroup',
        component: () => import("../../components/layout/Automatic_Group.vue")
    },
    {
        path: '/automaticJob',
        name: 'automaticJob',
        component: () => import("../../components/layout/Automatic_Job.vue")
    },
    {
        path: '/automaticJobInfo',
        name: 'automaticJobInfo',
        component: () => import("../../components/layout/Automatic_JobInfo.vue")
    },
    {
        path: '/automaticScript',
        name: 'automaticScript',
        component: () => import("../../components/layout/Automatic_Script.vue")
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

export default router;