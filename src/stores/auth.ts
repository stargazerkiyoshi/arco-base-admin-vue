import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { login, me } from '@/api/auth';
import type { AuthUser, MenuNode, LoginRequest } from '@/types/auth';
import { storage } from '@/utils/storage';
import { Message } from '@arco-design/web-vue';
import { ApiCode } from '@/constants/api';
import { setTokenGetter, setHandleUnauthorized } from '@/api/request';

const APP_MENU_NAMES = new Set([
  'dashboard',
  'workbench',
  'settings',
  'componentDemo',
  'baseTableDemo',
]);

const sortMenus = (list: MenuNode[]): MenuNode[] =>
  list
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({
      ...item,
      children: item.children ? sortMenus(item.children) : undefined,
    }));

const buildMenusFromRoutes = (permissionSet?: Set<string>) => {
  const routes = router
    .getRoutes()
    .filter((route) => route.name && APP_MENU_NAMES.has(String(route.name)));

  const filteredRoutes = routes.filter((route) => {
    const perm = route.meta?.permission as string | undefined;
    return !(permissionSet && perm && !permissionSet.has(perm));
  });

  const nodeMap = new Map<string, MenuNode>();
  const routeMap = new Map<string, (typeof filteredRoutes)[number]>();

  filteredRoutes.forEach((route) => {
    const name = String(route.name);
    routeMap.set(name, route);
    nodeMap.set(name, {
      id: name,
      name: (route.meta?.title as string) || name,
      type: 'MENU',
      icon: route.meta?.icon as string | undefined,
      routeName: name,
    });
  });

  const roots: MenuNode[] = [];
  nodeMap.forEach((node, name) => {
    const route = routeMap.get(name);
    if (!route) return;
    const parent = filteredRoutes
      .filter((r) => r.path !== route.path && route.path.startsWith(`${r.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0];
    const parentName = parent?.name ? String(parent.name) : undefined;

    if (parentName && nodeMap.has(parentName)) {
      const parentNode = nodeMap.get(parentName)!;
      parentNode.children = parentNode.children || [];
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return sortMenus(roots);
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
      menus.value = buildMenusFromRoutes(permissionSet.value);
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
