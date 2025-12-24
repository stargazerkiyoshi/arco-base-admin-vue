import type { Ref } from 'vue';

type Primitive = string | number | boolean | null;
export type JsonValue = Primitive | JsonValue[] | { [k: string]: JsonValue };
export type PlainQuery = Record<string, JsonValue>;

export type SortOrder = 'asc' | 'desc' | undefined;

export interface ListSorter {
  field?: string;
  order?: SortOrder;
}

export type ListFilters = Record<string, unknown>;

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export interface ListPaginationInput {
  current: number;
  pageSize: number;
}

export interface ListChangePayload {
  pagination?: ListPaginationInput;
  sorter?: ListSorter;
  filters?: ListFilters;
}

export interface RequestParams<TQuery> {
  current: number;
  pageSize: number;
  query: TQuery;
  sorter?: ListSorter;
  filters?: ListFilters;
}

export interface RequestResult<TItem> {
  list: TItem[];
  total: number;
  raw?: unknown;
}

export interface UseTableOptions<TItem, TQuery extends PlainQuery = PlainQuery> {
  request: (params: RequestParams<TQuery>) => Promise<RequestResult<TItem>>;
  defaultQuery?: TQuery;
  immediate?: boolean; // default true
  defaultPageSize?: number; // default 20
  defaultCurrent?: number; // default 1

  onSuccess?: (res: RequestResult<TItem>) => void;
  onError?: (err: unknown) => void;

  keepPreviousData?: boolean; // default true
}

export interface UseTableReturn<TItem, TQuery extends PlainQuery = PlainQuery> {
  list: Ref<TItem[]>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  pagination: Ref<PaginationState>;

  /** 只暴露行为，不暴露内部 query/sorter/filters 状态源 */
  load: (extra?: {
    current?: number;
    pageSize?: number;
    sorter?: ListSorter;
    filters?: ListFilters;
  }) => Promise<void>;

  reset: () => Promise<void>;

  setQuery: (
    patch: Partial<TQuery> | ((prev: TQuery) => TQuery),
    opts?: { reload?: boolean; resetPage?: boolean },
  ) => void;

  onTableChange: (payload: ListChangePayload) => void;

  setPage: (current: number, opts?: { reload?: boolean }) => void;
  setPageSize: (pageSize: number, opts?: { reload?: boolean; resetPage?: boolean }) => void;
}
