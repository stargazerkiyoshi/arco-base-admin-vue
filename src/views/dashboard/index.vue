<script setup lang="ts">
import {
  IconArrowRight,
  IconCalendarClock,
  IconEdit,
  IconFile,
  IconBarChart,
} from '@arco-design/web-vue/es/icon';

defineOptions({
  name: 'dashBoardPage',
});

const quickActions = [
  {
    title: '创建项目',
    desc: '从预设模板快速起盘你的业务',
    icon: IconFile,
  },
  {
    title: '发布版本',
    desc: '推送最新构建，支持灰度',
    icon: IconArrowRight,
  },
  {
    title: '数据看板',
    desc: '查看实时监控与告警',
    icon: IconBarChart,
  },
];
</script>

<template>
  <div class="space-y-6">
    <a-card
      :bordered="false"
      class="overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-white"
      :body-style="{ padding: '24px' }"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
            你好，欢迎回来
          </p>
          <h2 class="text-2xl font-semibold text-slate-900">控制台概览</h2>
          <p class="text-sm text-slate-600">
            在这里快速完成项目创建、查看监控与任务进度，页面骨架已准备就绪。
          </p>
          <div class="flex flex-wrap gap-2">
            <a-tag color="arcoblue" size="small" class="rounded-full">在线</a-tag>
            <a-tag color="green" size="small" class="rounded-full">稳定</a-tag>
            <a-tag color="orangered" size="small" class="rounded-full">Beta</a-tag>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a-button type="primary" size="large">快速开始</a-button>
          <a-button size="large" type="outline">查看文档</a-button>
        </div>
      </div>
    </a-card>

    <a-row :gutter="16">
      <a-col :xs="24" :md="8">
        <a-card :bordered="false">
          <a-statistic :value="1280" :precision="0" title="今日活跃用户" animation />
          <p class="mt-2 text-sm text-slate-500">较昨日提升 12%</p>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card :bordered="false">
          <a-statistic :value="92" :precision="1" title="服务可用性 (%)" animation />
          <a-progress :percent="92" status="success" size="large" class="mt-3" />
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card :bordered="false">
          <a-statistic :value="36" :precision="0" title="待办任务" animation />
          <div class="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span class="inline-flex items-center gap-1">
              <IconCalendarClock />
              本周
            </span>
            <a-button type="text" size="mini">查看全部</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :xs="24" :md="14">
        <a-card title="快速入口" :bordered="false" extra="快捷操作">
          <a-list :bordered="false">
            <a-list-item v-for="item in quickActions" :key="item.title">
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar shape="square" :size="32" class="bg-slate-100 text-slate-700">
                    <component :is="item.icon" />
                  </a-avatar>
                </template>
                <template #title>
                  <span class="font-medium text-slate-900">{{ item.title }}</span>
                </template>
                <template #description>
                  <span class="text-sm text-slate-500">{{ item.desc }}</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="text" size="mini">进入</a-button>
              </template>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="10">
        <a-card title="进度追踪" :bordered="false">
          <div class="space-y-4">
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <IconEdit class="text-blue-600" />
                  <div>
                    <p class="text-sm font-medium text-slate-900">Dashboard UI 骨架</p>
                    <p class="text-xs text-slate-500">布局、菜单、面包屑</p>
                  </div>
                </div>
                <a-tag size="small" color="green">完成</a-tag>
              </div>
              <a-progress :percent="100" size="large" class="mt-3" />
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <icon-bar-chart class="text-indigo-600" />
                  <div>
                    <p class="text-sm font-medium text-slate-900">数据卡片</p>
                    <p class="text-xs text-slate-500">待接入真实数据</p>
                  </div>
                </div>
                <a-tag size="small" color="arcoblue">进行中</a-tag>
              </div>
              <a-progress :percent="64" status="normal" size="large" class="mt-3" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
