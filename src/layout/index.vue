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

type MenuItem = {
  key: string;
  label: string;
  icon: Component;
};

defineOptions({
  name: 'layoutPage',
});

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const searchValue = ref('');

const menuItems: MenuItem[] = [
  { key: '/app/dashboard', label: '总览', icon: IconDashboard },
  { key: '/app/workbench', label: '工作台', icon: IconApps },
  { key: '/app/settings', label: '偏好设置', icon: IconSettings },
];

const selectedKeys = computed(() => {
  const active = menuItems
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
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>
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
