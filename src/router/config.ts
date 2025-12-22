import { type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      public: true,
    },
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('@/layout/index.vue'),
    redirect: '/app/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      // 首页 / 仪表盘
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'icon-dashboard',
        },
      },
      {
        path: 'workbench',
        name: 'workbench',
        meta: { title: '工作台' },
        component: () => import('@/views/workbench/index.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: { title: '偏好设置' },
        component: () => import('@/views/setting/index.vue'),
      },
    ],
  },
  // ========== 404 ==========
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      public: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];
