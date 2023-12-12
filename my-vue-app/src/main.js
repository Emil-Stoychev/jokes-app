import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import VueWriter from 'vue-writer'
import Snackbar from './globalError/Snackbar.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueWriter)
app.component('Snackbar', Snackbar);

app.mount('#app')
