import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/user/info',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        id: 1,
        name: 'Mock User',
        role: 'admin',
      },
      message: 'ok',
    }),
  },
] as MockMethod[];
