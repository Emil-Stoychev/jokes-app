import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import VueWriter from 'vue-writer'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(VueWriter)
app.use(pinia)
app.mount('#app')
