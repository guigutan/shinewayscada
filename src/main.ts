import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia()); // 注册
app.use(router)
app.mount('#app')

