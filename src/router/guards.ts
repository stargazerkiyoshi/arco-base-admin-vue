import { Message } from '@arco-design/web-vue';
import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

let lastWarnAt = 0;
const showNoPermMessage = (text: string) => {
  const now = Date.now();
  if (now - lastWarnAt < 1200) return;
  lastWarnAt = now;
  Message.warning(text);
};

export const setupGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    await authStore.handleGetMe();

    const requiresAuth = !to.meta?.public;
    if (requiresAuth && !authStore.isLoggedIn) {
      return next({ name: 'login' });
    }

    if (to.name === 'login' && authStore.isLoggedIn && authStore.menus.length > 0) {
      return next({ name: authStore.menus[0]?.name });
    }

    if (
      requiresAuth &&
      authStore.isLoggedIn &&
      authStore.permissions.length === 0 &&
      authStore.menus.length === 0
    ) {
      showNoPermMessage('当前账号暂无任何权限，请联系管理员');
      return next({ name: '403' });
    }

    const perm = to.meta?.permission as string | undefined;
    if (perm && !authStore.hasPerm(perm)) {
      showNoPermMessage('暂无权限访问该页面');
      return next({ name: '403' });
    }

    return next();
  });
};
