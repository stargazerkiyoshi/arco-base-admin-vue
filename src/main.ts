import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './styles/main.css';
import App from './App.vue';
import router from './router';
import pinia from './stores';

const app = createApp(App);

app.use(ArcoVue);
app.use(pinia);
app.use(router);

app.mount('#app');
