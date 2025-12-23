import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { login, me } from '@/api/auth';
import type { AuthUser, MenuNode, LoginRequest } from '@/types/auth';
import { storage } from '@/utils/storage';
import { Message } from '@arco-design/web-vue';
import { ApiCode } from '@/constants/api';
import { setTokenGetter, setHandleUnauthorized } from '@/api/request';

const APP_MENU_NAMES = new Set(['dashboard', 'workbench', 'settings']);

const sortMenus = (list: MenuNode[]) =>
  list.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const buildMenusFromRoutes = (permissionSet?: Set<string>) => {
  const routes = router
    .getRoutes()
    .filter((route) => route.name && APP_MENU_NAMES.has(String(route.name)));

  return sortMenus(
    routes
      .map((route) => {
        const perm = route.meta?.permission as string | undefined;
        if (permissionSet && perm && !permissionSet.has(perm)) return null;
        return {
          id: String(route.name),
          name: (route.meta?.title as string) || String(route.name),
          type: 'MENU',
          icon: route.meta?.icon as string | undefined,
          routeName: String(route.name),
        } satisfies MenuNode;
      })
      .filter(Boolean) as MenuNode[],
  );
};

const buildMenusFromBackend = (menus: MenuNode[], permissionSet?: Set<string>) => {
  const routeMap = new Map<string, ReturnType<typeof router.getRoutes>[number]>();
  router.getRoutes().forEach((route) => {
    if (route.name) routeMap.set(String(route.name), route);
  });

  const filterMenus = (nodes: MenuNode[]): MenuNode[] => {
    const filtered: MenuNode[] = [];
    nodes.forEach((node) => {
      if (node.hidden) return;
      const copy: MenuNode = { ...node };
      const currentRoute = copy.routeName ? routeMap.get(String(copy.routeName)) : undefined;
      if (copy.type === 'MENU') {
        if (!copy.routeName || !currentRoute) return;
        const perm = copy.perm || (currentRoute.meta?.permission as string | undefined);
        if (permissionSet && perm && !permissionSet.has(perm)) return;
      }
      if (copy.children?.length) {
        copy.children = filterMenus(copy.children);
      }
      if (copy.type === 'CATALOG') {
        if (copy.children && copy.children.length > 0) {
          filtered.push({ ...copy, children: sortMenus(copy.children) });
        }
        return;
      }
      filtered.push(copy);
    });
    return sortMenus(filtered);
  };

  return filterMenus(menus);
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const permissions = ref<string[]>([]);
  const menus = ref<MenuNode[]>([]);
  const token = ref<string | null>(storage.get<string>('token'));
  const isGettedAuth = ref<boolean>(false);

  const permissionSet = computed(() => new Set(permissions.value));
  const isLoggedIn = computed(() => Boolean(token.value || storage.get<string>('token')));

  const hasPerm = (code?: string) => {
    if (!code) return true;
    return permissionSet.value.has(code);
  };

  // const lastExpiredAt = 0;
  const resetState = () => {
    user.value = null;
    permissions.value = [];
    menus.value = [];
    token.value = null;
    storage.remove('token');
  };

  const handleLogout = async () => {
    resetState();
    try {
      await router.replace({ path: '/login' });
    } catch {
      // ignore
    }
  };

  const handleUnauthorized = () => {
    // const now = Date.now();
    // if (now - lastExpiredAt > 1200) {
    //   Message.warning('登录已失效，请重新登录');
    //   lastExpiredAt = now;
    // }
    Message.warning('登录已失效，请重新登录');
    handleLogout();
  };

  /**
   * 获取当前登录用户信息和权限
   * @returns
   */
  const handleGetMe = async () => {
    const latestToken = storage.get<string>('token');
    token.value = token.value || latestToken;

    if (isGettedAuth.value || !token.value) {
      return;
    }

    try {
      const res = await me();
      const payload = res.data;
      if (payload?.user) {
        user.value = payload.user;
      } else {
        user.value = null;
      }
      permissions.value = payload?.permissions ?? [];

      if (payload?.menus && payload.menus.length > 0) {
        menus.value = buildMenusFromBackend(payload.menus, permissionSet.value);
      } else {
        menus.value = buildMenusFromRoutes(permissionSet.value);
      }
      isGettedAuth.value = true;
    } catch {
      user.value = null;
      permissions.value = [];
      menus.value = [];
      isGettedAuth.value = false;
    }
  };

  /**
   * 处理登录逻辑
   * @param params
   */
  const handlelogin = async (params: LoginRequest) => {
    const { username, password } = params;
    try {
      const res = await login({
        username,
        password,
      });

      if (res.code === ApiCode.Success && res.data?.token) {
        storage.set('token', res.data.token);
        token.value = res.data.token;
        Message.success('登录成功');
        const redirect = '/app/dashboard';
        router.push(redirect);
      } else {
        const message =
          res.code === ApiCode.LoginFailed ? '用户名或密码错误' : res.message || '登录失败';
        Message.error(message);
      }
    } catch (error) {
      console.error(error);
      Message.error('登录失败，请稍后重试');
    }
  };

  setTokenGetter(() => token.value);
  setHandleUnauthorized(handleUnauthorized);
  return {
    user,
    permissions,
    menus,
    token,
    isLoggedIn,
    hasPerm,
    handleLogout,
    handleGetMe,
    handlelogin,
    handleUnauthorized,
  };
});
