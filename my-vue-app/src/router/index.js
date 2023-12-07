import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import Create from '../components/create/Create.vue'
import Edit from '../components/edit/Edit.vue'
import Profile from '../components/profile/Profile.vue'
import About from '../components/about/About.vue'
import Login from '../components/login/Login.vue'
import Register from '../components/register/Register.vue'
import EditProfile from '../components/editProfile/EditProfile.vue'
import NotFound from '../components/core/NotFound.vue'
import routeGuard from '../routeGuard/routeGuard'

const routes = [
    { path: '/', component: Home },
    { path: '/create', component: Create, beforeEnter: routeGuard },
    { path: '/edit/:id', component: Edit, beforeEnter: routeGuard },
    { path: '/profile', component: Profile, beforeEnter: routeGuard },
    { path: '/profile/:id', component: Profile, beforeEnter: routeGuard },
    { path: '/editProfile/:id', component: EditProfile, beforeEnter: routeGuard },
    { path: '/about', component: About },
    { path: '/login', component: Login, beforeEnter: routeGuard },
    { path: '/register', component: Register, beforeEnter: routeGuard },
    { path: '/:pathMatch(.*)*', component: NotFound}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router