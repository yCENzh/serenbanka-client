import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';  // 导入路由配置
import dayjs from 'dayjs';
import axios from 'axios';
const app = createApp(App);
const pinia =createPinia();
app.use(router);  // 使用路由
app.use(pinia);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$formatDate = (timestamp, format = 'YYYY年MM月DD日 HH:mm') => {
    return dayjs(timestamp).format(format);
  };
app.mount('#app');