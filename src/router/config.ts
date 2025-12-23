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
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'icon-dashboard',
          // 页面访问权限编码映射：dashboard -> dashboard:home:view
          permission: 'dashboard:view',
        },
      },
      {
        path: 'workbench',
        name: 'workbench',
        meta: {
          title: '工作台',
          icon: 'icon-apps',
          // 页面访问权限编码映射：workbench -> workbench:view
          permission: 'workbench:view',
        },
        component: () => import('@/views/workbench/index.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          title: '偏好设置',
          icon: 'icon-settings',
          // 页面访问权限编码映射：settings -> settings:view
          permission: 'settings:view',
        },
        component: () => import('@/views/setting/index.vue'),
      },
      {
        path: 'demo',
        name: 'componentDemo',
        meta: {
          title: '组件示例',
          icon: 'icon-apps',
        },
        redirect: '/app/demo/base-table',
        component: () => import('@/views/demo/index.vue'),
        children: [
          {
            path: 'base-table',
            name: 'baseTableDemo',
            meta: {
              title: 'BaseTable 示例',
              icon: 'icon-apps',
            },
            component: () => import('@/views/demo/base-table/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/403/index.vue'),
    meta: {
      title: '403',
      public: true,
    },
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
