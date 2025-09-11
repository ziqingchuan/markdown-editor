import { createApp } from 'vue'
import { createPinia } from 'pinia'  // 导入 createPinia
import './style.css'
import App from './App.vue'

// 创建 Pinia 实例
const pinia = createPinia()

// 创建应用并使用 Pinia
const app = createApp(App)
app.use(pinia)  // 先使用 Pinia

// 挂载应用
app.mount('#app')

