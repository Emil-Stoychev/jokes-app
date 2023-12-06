import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import Create from '../components/create/Create.vue'
import Edit from '../components/edit/Edit.vue'
import Profile from '../components/profile/Profile.vue'
import About from '../components/about/About.vue'
import Login from '../components/login/Login.vue'
import Register from '../components/register/Register.vue'
import EditProfile from '../components/editProfile/EditProfile.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/edit/:id', component: Edit },
    { path: '/profile', component: Profile },
    { path: '/profile/:id', component: Profile },
    { path: '/editProfile/:id', component: EditProfile },
    { path: '/about', component: About },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router