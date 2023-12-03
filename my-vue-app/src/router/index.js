import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import Create from '../components/create/Create.vue'
import Profile from '../components/profile/Profile.vue'
import About from '../components/about/About.vue'
import Login from '../components/login/Login.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/profile', component: Profile },
    { path: '/about', component: About },
    { path: '/login', component: Login },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router