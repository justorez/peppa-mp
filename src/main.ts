import { createSSRApp } from 'vue'
import App from './App.vue'
import './assets/index.scss'

export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
