import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import store from './store';
import IconPark from '@/utils/icons'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/style/index.css';
import 'ant-design-vue/dist/reset.css';
const app = createApp(App);

app.use(router);
app.use(store);
app.use(IconPark);
app.mount('#app');
