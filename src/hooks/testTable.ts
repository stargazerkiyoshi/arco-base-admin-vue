import { useTable } from './useTable';

type User = { a: ''; b: '' };
const fetchUsers = () => {
  return Promise.resolve({ a: '', b: '' });
};
const table = useTable<User, { keyword: string; status?: number }>({
  defaultQuery: { keyword: '', status: undefined },
  request: fetchUsers,
});

// 输入变化：只改条件，不请求
table.setQuery({ keyword: 'abc' });

// 点搜索：请求
table.setQuery({ keyword: 'abc' }, { reload: true });

// 表格 change 事件：排序/筛选/分页
table.onTableChange(payload);
