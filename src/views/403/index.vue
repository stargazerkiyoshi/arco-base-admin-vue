<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({
  name: 'forbiddenPage',
});

const router = useRouter();
const goLogin = () => {
  router.push('/login');
};
const goHome = () => {
  router.push('/app/dashboard');
};
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <div class="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">403</div>
    <div class="text-2xl font-semibold text-slate-900">无权访问该页面</div>
    <p class="max-w-md text-sm text-slate-500">
      请确认账号是否具备当前功能权限，或联系管理员开通权限。您也可以返回工作台继续浏览。
    </p>
    <div class="flex items-center gap-2">
      <a-button type="primary" @click="goLogin">去登录</a-button>
      <a-button type="primary" @click="goHome">返回首页</a-button>
      <a-button @click="router.back()">返回上一页</a-button>
    </div>
  </div>
</template>
