import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { me } from '@/api/auth';
import { setAuthTokenGetter } from '@/api/request';
import type { AuthUser, MenuNode } from '@/types/auth';
import { storage } from '@/utils/storage';

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
  const isLoaded = ref(false);
  const token = ref<string | null>(storage.get<string>('token'));

  const permissionSet = computed(() => new Set(permissions.value));
  const isLoggedIn = computed(() =>
    Boolean(token.value || storage.get<string>('token') || user.value),
  );

  const hasPerm = (code?: string) => {
    if (!code) return true;
    return permissionSet.value.has(code);
  };

  setAuthTokenGetter(() => token.value || storage.get<string>('token'));

  const initMe = async () => {
    if (isLoaded.value) return;

    token.value = token.value || storage.get<string>('token');
    if (!token.value) {
      isLoaded.value = true;
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
    } catch {
      user.value = null;
      permissions.value = [];
      menus.value = [];
    } finally {
      isLoaded.value = true;
    }
  };

  return {
    user,
    permissions,
    menus,
    token,
    isLoaded,
    isLoggedIn,
    hasPerm,
    initMe,
  };
});
