import { ref, shallowRef } from 'vue';
import type {
  ListChangePayload,
  ListFilters,
  ListSorter,
  PaginationState,
  RequestParams,
  RequestResult,
  UseTableOptions,
  UseTableReturn,
  PlainQuery,
} from './useTable.types';

export function useTable<TItem = unknown, TQuery extends PlainQuery = PlainQuery>(
  options: UseTableOptions<TItem, TQuery>,
): UseTableReturn<TItem, TQuery> {
  const {
    request,
    defaultQuery,
    immediate = true,
    defaultPageSize = 20,
    defaultCurrent = 1,
    onSuccess,
    onError,
    keepPreviousData = true,
  } = options;

  function createInitialQuery<TQ extends PlainQuery>(dq?: TQ): TQ {
    return (dq ?? {}) as TQ;
  }

  // ✅ 内部私有状态（不暴露）
  const query = shallowRef<TQuery>(createInitialQuery(defaultQuery));
  const sorter = shallowRef<ListSorter>({ field: undefined, order: undefined });
  const filters = shallowRef<ListFilters>({});

  // ✅ list 用 shallowRef：避免 TItem 泛型被 UnwrapRefSimple 干扰
  const list = shallowRef<TItem[]>([]);
  const loading = ref(false);
  const error = ref<unknown>(null);

  const pagination = ref<PaginationState>({
    current: defaultCurrent,
    pageSize: defaultPageSize,
    total: 0,
  });

  let requestId = 0;

  const load: UseTableReturn<TItem, TQuery>['load'] = async (extra) => {
    const id = ++requestId;
    loading.value = true;
    error.value = null;

    if (!keepPreviousData) list.value = [];

    const nextCurrent =
      typeof extra?.current === 'number' ? extra.current : pagination.value.current;
    const nextPageSize =
      typeof extra?.pageSize === 'number' ? extra.pageSize : pagination.value.pageSize;

    pagination.value = { ...pagination.value, current: nextCurrent, pageSize: nextPageSize };

    if (typeof extra?.sorter !== 'undefined') sorter.value = extra.sorter;
    if (typeof extra?.filters !== 'undefined') filters.value = extra.filters;

    const params: RequestParams<TQuery> = {
      current: nextCurrent,
      pageSize: nextPageSize,
      query: query.value,
      sorter: sorter.value,
      filters: filters.value,
    };

    try {
      const res = (await request(params)) as RequestResult<TItem>;
      if (id !== requestId) return;

      list.value = Array.isArray(res.list) ? res.list : [];
      pagination.value.total = typeof res.total === 'number' ? res.total : 0;
      onSuccess?.(res);
    } catch (e) {
      if (id !== requestId) return;
      error.value = e;
      onError?.(e);
    } finally {
      if (id === requestId) loading.value = false;
    }
  };

  const reset: UseTableReturn<TItem, TQuery>['reset'] = async () => {
    pagination.value.current = 1;
    sorter.value = { field: undefined, order: undefined };
    filters.value = {};
    query.value = defaultQuery;
    await load({ current: 1 });
  };

  const setQuery: UseTableReturn<TItem, TQuery>['setQuery'] = (patch, opts) => {
    const next =
      typeof patch === 'function' ? patch(query.value) : ({ ...query.value, ...patch } as TQuery);

    query.value = next;

    const resetPage = opts?.resetPage ?? true;
    if (resetPage) pagination.value.current = 1;

    if (opts?.reload ?? false) {
      load({ current: resetPage ? 1 : pagination.value.current });
    }
  };

  const setPage: UseTableReturn<TItem, TQuery>['setPage'] = (current, opts) => {
    pagination.value.current = current;
    if (opts?.reload ?? true) load({ current });
  };

  const setPageSize: UseTableReturn<TItem, TQuery>['setPageSize'] = (pageSize, opts) => {
    pagination.value.pageSize = pageSize;

    const resetPage = opts?.resetPage ?? true;
    if (resetPage) pagination.value.current = 1;

    if (opts?.reload ?? true) load({ current: pagination.value.current, pageSize });
  };

  const onTableChange: UseTableReturn<TItem, TQuery>['onTableChange'] = (
    payload: ListChangePayload,
  ) => {
    const nextCurrent = payload.pagination?.current ?? pagination.value.current;
    const nextPageSize = payload.pagination?.pageSize ?? pagination.value.pageSize;

    const sorterChanged = typeof payload.sorter !== 'undefined';
    const filtersChanged = typeof payload.filters !== 'undefined';

    const nextSorter = sorterChanged ? (payload.sorter as ListSorter) : sorter.value;
    const nextFilters = filtersChanged ? (payload.filters as ListFilters) : filters.value;

    sorter.value = nextSorter;
    filters.value = nextFilters;

    const shouldReset = sorterChanged || filtersChanged;
    const current = shouldReset ? 1 : nextCurrent;
    if (shouldReset) pagination.value.current = 1;

    load({
      current,
      pageSize: nextPageSize,
      sorter: nextSorter,
      filters: nextFilters,
    });
  };

  if (immediate) load();

  return {
    list,
    loading,
    error,
    pagination,
    load,
    reset,
    setQuery,
    onTableChange,
    setPage,
    setPageSize,
  };
}
