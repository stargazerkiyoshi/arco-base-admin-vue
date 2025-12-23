<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IconApps,
  IconEmail,
  IconDashboard,
  IconMenuFold,
  IconMenuUnfold,
  IconSettings,
  IconSearch,
  IconUser,
  IconHome,
} from '@arco-design/web-vue/es/icon';
import { useAuthStore } from '@/stores/auth';

type MenuItem = {
  key: string;
  label: string;
  icon?: Component;
  children?: MenuItem[];
};

defineOptions({
  name: 'layoutPage',
});

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const searchValue = ref('');
const authStore = useAuthStore();

const iconMap: Record<string, Component> = {
  'icon-dashboard': IconDashboard,
  'icon-apps': IconApps,
  'icon-settings': IconSettings,
};

const resolvePath = (name?: string) => {
  if (!name) return '';
  try {
    return router.resolve({ name }).path;
  } catch {
    return '';
  }
};

const menuItems = computed<MenuItem[]>(() => {
  const build = (items: typeof authStore.menus): MenuItem[] =>
    items.map((item) => {
      const icon = item.icon ? (iconMap[item.icon] ?? IconApps) : undefined;
      const children = item.children?.length ? build(item.children) : undefined;
      return {
        key: resolvePath(item.routeName) || String(item.id),
        label: item.name,
        icon,
        children,
      };
    });
  return build(authStore.menus);
});

const selectedKeys = computed(() => {
  const flatItems: MenuItem[] = [];
  const flatten = (items: MenuItem[]) => {
    items.forEach((item) => {
      flatItems.push(item);
      if (item.children) flatten(item.children);
    });
  };
  flatten(menuItems.value);

  const active = flatItems
    .slice()
    .sort((a, b) => b.key.length - a.key.length)
    .find((item) => route.path === item.key || route.path.startsWith(`${item.key}/`))?.key;
  return active ? [active] : [];
});

const breadcrumbs = computed(() =>
  route.matched
    .filter((record) => record.meta?.title)
    .map((record) => ({
      title: record.meta.title as string,
      path: record.name ? router.resolve({ name: record.name as string }).path : record.path,
    })),
);

const currentTitle = computed(() => (route.meta.title as string) || 'Base Admin');

const handleMenuClick = (key: string | number) => {
  router.push(String(key));
};

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};
</script>

<template>
  <a-layout class="min-h-screen">
    <a-layout-sider
      :width="240"
      :collapsed="collapsed"
      breakpoint="xl"
      collapsible
      hide-trigger
      class="shadow-sm"
    >
      <div class="flex h-16 px-2 items-center justify-between border-b border-slate-100">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600"
          >
            BA
          </div>
          <div class="text-base font-semibold text-slate-900" :class="{ hidden: collapsed }">
            Base Admin
          </div>
        </div>
      </div>
      <a-menu
        :selected-keys="selectedKeys"
        :collapsed="collapsed"
        :style="{ borderInlineEnd: 'none' }"
        @menu-item-click="handleMenuClick"
      >
        <template v-for="item in menuItems" :key="item.key">
          <a-sub-menu v-if="item.children?.length" :key="item.key">
            <template #icon>
              <component v-if="item.icon" :is="item.icon" />
            </template>
            <template #title>{{ item.label }}</template>
            <a-menu-item v-for="child in item.children" :key="child.key">
              <template #icon>
                <component v-if="child.icon" :is="child.icon" />
              </template>
              {{ child.label }}
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else>
            <template #icon>
              <component v-if="item.icon" :is="item.icon" />
            </template>
            {{ item.label }}
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="border-b border-slate-100 bg-white px-6">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-3">
            <a-button type="text" shape="circle" @click="toggleCollapsed">
              <icon-menu-unfold v-if="collapsed" />
              <icon-menu-fold v-else />
            </a-button>
            <div>
              <p class="text-xs uppercase tracking-[0.08em] text-slate-500">Base Admin</p>
              <p class="text-lg font-semibold text-slate-900">
                {{ currentTitle }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a-input
              v-model="searchValue"
              allow-clear
              placeholder="搜索功能、页面或成员"
              class="w-60"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input>
            <a-button type="text" shape="circle">
              <icon-email />
            </a-button>
            <a-avatar :size="32" class="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <icon-user />
            </a-avatar>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="bg-slate-50 px-6 py-3">
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1 text-slate-600">
            <div class="flex items-center gap-2">
              <div class="flex h-7 w-7 items-center justify-center rounded-md bg-white/80">
                <icon-home class="text-slate-500" />
              </div>
              <a-breadcrumb>
                <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                  <router-link :to="item.path">{{ item.title }}</router-link>
                </a-breadcrumb-item>
              </a-breadcrumb>
            </div>
            <a-tag size="small" color="arcoblue" class="rounded-full"> 实时 </a-tag>
          </div>
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
