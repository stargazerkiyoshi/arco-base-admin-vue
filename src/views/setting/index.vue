<script setup lang="ts">
defineOptions({
  name: 'settingPage',
});
</script>
<template>
  <a-card title="偏好设置" :bordered="false">
    <div class="space-y-4 text-sm text-slate-600">
      <p>这里预留给主题切换、通知偏好、快捷键等配置入口。</p>
      <p class="text-slate-500">后续可根据需求接入真实设置表单与保存逻辑。</p>
    </div>
  </a-card>
</template>
