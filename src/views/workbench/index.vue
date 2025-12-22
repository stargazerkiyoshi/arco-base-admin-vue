<script lang="ts">
import { defineOptions } from 'vue';
defineOptions({
  name: 'workbenchPage',
});
</script>
<template>
  <a-card :bordered="false">
    <a-empty description="工作台内容待接入">
      <template #image>
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400"
        >
          🚧
        </div>
      </template>
      <template #footer>
        <a-button type="primary">创建任务</a-button>
      </template>
    </a-empty>
  </a-card>
</template>
