<script setup lang="ts">
import { ref } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue';
import BaseTable from '@/components/base/BaseTable/index.vue';

defineOptions({
  name: 'BaseTableDemoPage',
});

type UserItem = {
  id: number;
  name: string;
  role: string;
  status: string;
  createdAt: string;
};

const columns: TableColumnData[] = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '角色', dataIndex: 'role', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
];

const makeData = (count: number) =>
  Array.from({ length: count }).map(
    (_, idx) =>
      ({
        id: idx + 1,
        name: `用户-${idx + 1}`,
        role: ['管理员', '运营', '访客'][idx % 3] as string,
        status: ['启用', '禁用'][idx % 2] as string,
        createdAt: `2024-05-${(idx % 28) + 1} 12:00`,
      }) satisfies UserItem,
  );

const tableData = ref<UserItem[]>(makeData(18));

const controlledPagination = ref({
  current: 1,
  pageSize: 5,
  total: 18,
  showTotal: true,
});

const halfControlledPagination = ref({
  current: 1,
  pageSize: 4,
  total: 18,
  showTotal: true,
});

const loading = ref(false);

const handleChange = (payload: { pagination?: { current: number; pageSize: number } }) => {
  if (payload.pagination) {
    controlledPagination.value = {
      ...controlledPagination.value,
      ...payload.pagination,
    };
  }
};

const handleHalfControlledChange = (pagination?: { current: number; pageSize: number }) => {
  if (pagination) {
    halfControlledPagination.value = {
      ...halfControlledPagination.value,
      ...pagination,
    };
  }
};

const handleRefresh = () => {
  loading.value = true;
  window.setTimeout(() => {
    tableData.value = makeData(18).sort(() => Math.random() - 0.5);
    loading.value = false;
  }, 600);
};
</script>

<template>
  <div class="space-y-6">
    <a-card title="受控模式" :bordered="false">
      <BaseTable
        :columns="columns"
        :data="
          tableData.slice(
            (controlledPagination.current - 1) * controlledPagination.pageSize,
            controlledPagination.current * controlledPagination.pageSize,
          )
        "
        :pagination="controlledPagination"
        :loading="loading"
        toolbar-title="受控分页 + 工具栏"
        @change="handleChange"
        @refresh="handleRefresh"
      >
        <template #toolbar-left>
          <div class="font-semibold text-[14px]">受控模式</div>
        </template>
      </BaseTable>
    </a-card>

    <a-card title="半受控模式" :bordered="false">
      <BaseTable
        :columns="columns"
        :data="tableData"
        :pagination="halfControlledPagination"
        :default-pagination="{ current: 1, pageSize: 4 }"
        toolbar-title="半受控分页"
        @change="({ pagination }) => handleHalfControlledChange(pagination)"
      />
    </a-card>

    <a-card title="无分页 / 自定义空态" :bordered="false">
      <BaseTable
        :columns="columns"
        :data="[]"
        :pagination="false"
        toolbar-title="空态示例"
        empty-text="暂无记录，点击右上角刷新试试"
        @refresh="handleRefresh"
      >
        <template #empty>
          <a-empty description="这里什么也没有" />
        </template>
      </BaseTable>
    </a-card>
  </div>
</template>
