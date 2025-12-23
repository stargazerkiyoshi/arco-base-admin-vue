import { createApp, type Directive } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './styles/main.css';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import { useAuthStore } from './stores/auth';
import { setupGuards } from './router/guards';

const app = createApp(App);

app.use(ArcoVue);
app.use(pinia);

const permDirective: Directive = {
  mounted(el, binding) {
    const code = binding.value as string;
    if (!code) return;
    const authStore = useAuthStore();
    if (!authStore.hasPerm(code)) {
      el.remove();
    }
  },
  updated(el, binding) {
    const code = binding.value as string;
    if (!code) return;
    const authStore = useAuthStore();
    if (!authStore.hasPerm(code)) {
      el.remove();
    }
  },
};

setupGuards(router);

app.directive('perm', permDirective);
app.use(router);

app.mount('#app');
