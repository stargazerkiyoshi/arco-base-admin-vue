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

const findFirstMenuPath = (
  menus: { routeName?: string; children?: typeof menus }[],
  router: Router,
) => {
  const queue = [...menus];
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    if (item.routeName) {
      try {
        const path = router.resolve({ name: item.routeName as string }).path;
        if (path) return path;
      } catch {
        // ignore resolve errors
      }
    }
    if (item.children?.length) {
      queue.push(...item.children);
    }
  }
  return '';
};

export const setupGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    await authStore.handleGetMe();

    const firstMenuPath = authStore.menus.length ? findFirstMenuPath(authStore.menus, router) : '';

    const requiresAuth = !to.meta?.public;
    if (requiresAuth && !authStore.isLoggedIn) {
      return next({ name: 'login' });
    }

    if (to.name === 'login' && authStore.isLoggedIn && firstMenuPath) {
      return next(firstMenuPath);
    }

    if (
      requiresAuth &&
      authStore.isLoggedIn &&
      authStore.permissions.length === 0 &&
      authStore.menus.length === 0
    ) {
      showNoPermMessage('当前账号暂无任何权限，请联系管理员');
      return next({ path: '/403' });
    }

    if (requiresAuth && authStore.isLoggedIn && firstMenuPath && to.name === 'app') {
      return next(firstMenuPath);
    }

    const perm = to.meta?.permission as string | undefined;
    if (perm && !authStore.hasPerm(perm)) {
      showNoPermMessage('暂无权限访问该页面');
      if (firstMenuPath) {
        return next(firstMenuPath);
      }
      return next({ path: '/403' });
    }

    return next();
  });
};
