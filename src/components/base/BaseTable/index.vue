<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { TableColumnData } from '@arco-design/web-vue';
import { IconRefresh, IconLineHeight, IconSettings } from '@arco-design/web-vue/es/icon';

type TableSize = 'mini' | 'small' | 'medium' | 'large';
type RowKey = string | ((record: Record<string, unknown>) => string);

interface BaseTablePagination {
  current: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  showJumper?: boolean;
  showPageSize?: boolean;
}

interface BaseTableProps {
  columns: TableColumnData[];
  data: Record<string, unknown>[];
  rowKey?: RowKey;
  loading?: boolean;
  bordered?: boolean;
  stripe?: boolean;
  size?: TableSize;
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  pagination?: false | BaseTablePagination;
  defaultPagination?: {
    current?: number;
    pageSize?: number;
  };
  tableLayout?: 'auto' | 'fixed';
  emptyText?: string;
  showToolbar?: boolean;
  showRefresh?: boolean;
  showDensity?: boolean;
  showColumnSetting?: boolean;
  toolbarTitle?: string;
  stickyHeader?: boolean;
}

defineOptions({
  name: 'base-table',
});

const defaultPageSizeOptions = [10, 20, 50, 100];

const props = withDefaults(defineProps<BaseTableProps>(), {
  rowKey: 'id',
  bordered: true,
  stripe: false,
  size: 'medium',
  tableLayout: 'auto',
  emptyText: '暂无数据',
  showToolbar: true,
  showRefresh: true,
  showDensity: true,
  showColumnSetting: false,
  pagination: undefined,
  defaultPagination: () => ({
    current: 1,
    pageSize: 10,
  }),
});

const emit = defineEmits<{
  (
    e: 'change',
    payload: {
      pagination?: { current: number; pageSize: number };
      sorter?: () => unknown;
      filters?: () => unknown;
    },
  ): void;
  (e: 'pageChange', current: number): void;
  (e: 'pageSizeChange', pageSize: number): void;
  (e: 'refresh'): void;
  (e: 'update:pagination', pagination: BaseTablePagination | false): void;
}>();

const densityOptions: Array<{
  label: string;
  value: 'compact' | 'default' | 'loose';
  size: TableSize;
}> = [
  { label: '紧凑', value: 'compact', size: 'mini' },
  { label: '默认', value: 'default', size: 'medium' },
  { label: '宽松', value: 'loose', size: 'large' },
];

const getPaginationProp = () => (props.pagination === false ? undefined : props.pagination);

const tableSize = ref<TableSize>(props.size);
const internalCurrent = ref(getPaginationProp()?.current ?? props.defaultPagination?.current ?? 1);
const internalPageSize = ref(
  getPaginationProp()?.pageSize ?? props.defaultPagination?.pageSize ?? 10,
);

const syncPaginationFromProps = () => {
  const paginationProp = getPaginationProp();
  if (paginationProp) {
    if (typeof paginationProp.current === 'number') {
      internalCurrent.value = paginationProp.current;
    }
    if (typeof paginationProp.pageSize === 'number') {
      internalPageSize.value = paginationProp.pageSize;
    }
  }
};

watch(
  () => props.pagination,
  () => {
    syncPaginationFromProps();
  },
  { deep: true },
);

watch(
  () => props.size,
  (val) => {
    if (val) {
      tableSize.value = val;
    }
  },
);

const computedPagination = computed<BaseTablePagination | false>(() => {
  if (props.pagination === false) return false;
  const paginationProp = getPaginationProp();
  const current = paginationProp?.current ?? internalCurrent.value;
  const pageSize = paginationProp?.pageSize ?? internalPageSize.value;

  return {
    current,
    pageSize,
    total: paginationProp?.total ?? 0,
    showTotal: paginationProp?.showTotal ?? true,
    pageSizeOptions: paginationProp?.pageSizeOptions ?? defaultPageSizeOptions,
    showJumper: paginationProp?.showJumper ?? true,
    showPageSize: paginationProp?.showPageSize ?? true,
  };
});

const emitPaginationUpdate = (next?: Partial<BaseTablePagination>) => {
  if (props.pagination === false) return;
  const merged = {
    ...computedPagination.value,
    ...next,
  } as BaseTablePagination;
  emit('update:pagination', merged);
};

const onTableChange = (_pag: unknown, sorter: () => unknown, filters: () => unknown) => {
  emit('change', {
    pagination:
      computedPagination.value === false
        ? undefined
        : {
            current: computedPagination.value.current,
            pageSize: computedPagination.value.pageSize,
          },
    sorter,
    filters,
  });
};

const onPageChange = (page: number) => {
  internalCurrent.value = page;
  const currentPageSize =
    computedPagination.value === false ? internalPageSize.value : computedPagination.value.pageSize;
  emit('pageChange', page);
  emit('change', { pagination: { current: page, pageSize: currentPageSize } });
  emitPaginationUpdate({ current: page, pageSize: currentPageSize });
};

const onPageSizeChange = (pageSize: number) => {
  internalPageSize.value = pageSize;
  internalCurrent.value = 1;
  emit('pageSizeChange', pageSize);
  emit('change', { pagination: { current: 1, pageSize } });
  emitPaginationUpdate({ current: 1, pageSize });
};

const onRefresh = () => {
  emit('refresh');
};

const onDensityChange = (value: 'compact' | 'default' | 'loose') => {
  const target = densityOptions.find((item) => item.value === value);
  if (target) {
    tableSize.value = target.size;
    emit('change', {
      pagination:
        computedPagination.value === false
          ? undefined
          : {
              current: computedPagination.value.current,
              pageSize: computedPagination.value.pageSize,
            },
    });
  }
};
</script>

<template>
  <div class="base-table">
    <div v-if="showToolbar" class="base-table__toolbar">
      <div class="base-table__toolbar-left">
        <slot name="toolbar-left">
          <span v-if="toolbarTitle" class="base-table__title">{{ toolbarTitle }}</span>
        </slot>
      </div>
      <div class="base-table__toolbar-right">
        <slot name="toolbar-right">
          <div class="base-table__actions">
            <a-button v-if="showRefresh" type="outline" size="small" @click="onRefresh">
              <template #icon>
                <IconRefresh />
              </template>
            </a-button>
            <a-dropdown v-if="showDensity" trigger="click" @select="onDensityChange">
              <a-button type="outline" size="small">
                <template #icon>
                  <IconLineHeight />
                </template>
              </a-button>
              <template #content>
                <a-doption v-for="item in densityOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-doption>
              </template>
            </a-dropdown>
            <a-button v-if="showColumnSetting" type="outline" size="small">
              <template #icon>
                <IconSettings />
              </template>
              <!-- TODO: 列设置面板预留 -->
            </a-button>
          </div>
        </slot>
      </div>
    </div>

    <a-table
      :bordered="bordered"
      :stripe="stripe"
      :loading="loading"
      :columns="columns"
      :data="data"
      :size="tableSize"
      :scroll="scroll"
      :pagination="false"
      :table-layout="tableLayout"
      :row-key="rowKey"
      :sticky-header="stickyHeader"
      @change="onTableChange"
    >
      <template #empty>
        <slot name="empty">
          <a-empty :description="emptyText" />
        </slot>
      </template>
      <template #cell="slotProps">
        <slot name="cell" v-bind="slotProps" />
      </template>
    </a-table>

    <div v-if="computedPagination !== false" class="base-table__pagination">
      <a-pagination
        :current="computedPagination.current"
        :page-size="computedPagination.pageSize"
        :total="computedPagination.total"
        :show-total="computedPagination.showTotal"
        :show-jumper="computedPagination.showJumper"
        :show-page-size="computedPagination.showPageSize"
        :page-size-options="computedPagination.pageSizeOptions ?? defaultPageSizeOptions"
        size="medium"
        @change="onPageChange"
        @page-size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.base-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.base-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.base-table__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.base-table__toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-table__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-table__pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
