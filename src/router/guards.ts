import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const setupGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isLoaded) {
      await authStore.initMe();
    }

    const requiresAuth = !to.meta?.public;
    if (requiresAuth && !authStore.isLoggedIn) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (to.path === '/login' && authStore.isLoggedIn) {
      return next('/app/dashboard');
    }

    const perm = to.meta?.permission as string | undefined;
    if (perm && !authStore.hasPerm(perm)) {
      return next('/403');
    }

    return next();
  });
};
