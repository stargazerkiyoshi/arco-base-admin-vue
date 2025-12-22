<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IconUndo, IconHome } from '@arco-design/web-vue/es/icon';

defineOptions({
  name: 'notFoundPage',
});

const router = useRouter();

const goHome = () => router.push('/app/dashboard');
const goBack = () => router.back();
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4">
    <div class="w-full max-w-3xl">
      <a-card :bordered="false" class="overflow-hidden shadow-sm">
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-white p-8 lg:p-10"
        >
          <div
            class="pointer-events-none absolute -left-16 top-6 h-40 w-40 rounded-full bg-indigo-100 blur-3xl"
          />
          <div
            class="pointer-events-none absolute -right-12 -bottom-10 h-40 w-40 rounded-full bg-blue-50 blur-3xl"
          />

          <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div class="space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">
                404 Not Found
              </p>
              <h1 class="text-3xl font-bold text-slate-900">这里好像什么都没有</h1>
              <p class="text-sm leading-6 text-slate-600">
                您访问的页面可能已经被移动或不存在。请返回上一页，或回到首页继续浏览。
              </p>

              <div class="flex flex-wrap gap-3">
                <a-button type="primary" size="large" @click="goHome">
                  <template #icon>
                    <IconHome />
                  </template>
                  回到首页
                </a-button>
                <a-button type="outline" size="large" @click="goBack">
                  <template #icon>
                    <IconUndo />
                  </template>
                  返回上一页
                </a-button>
              </div>
            </div>

            <div class="flex flex-1 justify-center">
              <div class="relative h-40 w-40 sm:h-52 sm:w-52">
                <div class="absolute inset-0 rounded-full border border-dashed border-slate-200" />
                <div class="absolute inset-4 rounded-2xl bg-white shadow-lg" />
                <div
                  class="absolute inset-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-4xl font-black text-white"
                >
                  404
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>
