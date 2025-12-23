import type { MockMethod } from 'vite-plugin-mock';
import type { AuthUser, LoginRequest, LoginResponse } from '../src/types/auth';
import type { MeResponse } from '../src/types/auth';
import { ApiCode } from '../src/constants/api';

export default [
  {
    url: '/api/auth/me',
    method: 'get',
    response: () =>
      ({
        code: ApiCode.Success,
        data: {
          user: {
            id: 1,
            username: 'mock_admin',
            nickname: 'Mock Admin',
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            status: 1,
          },
          permissions: ['dashboard:home:view', 'workbench:view', 'settings:view'],
          menus: [
            {
              id: 1,
              name: '首页',
              type: 'MENU',
              routeName: 'dashboard',
              order: 1,
            },
            {
              id: 2,
              name: '工作台',
              type: 'MENU',
              routeName: 'workbench',
              order: 2,
            },
            {
              id: 3,
              name: '偏好设置',
              type: 'MENU',
              routeName: 'settings',
              order: 3,
            },
          ],
        } satisfies MeResponse,
        message: 'ok',
      }) satisfies { code: number; data: MeResponse; message: string },
  },
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: LoginRequest }) =>
      ({
        code: ApiCode.Success,
        data: {
          token: 'mock-token-123',
          user: {
            id: 1,
            username: body.username || 'Mock User',
            status: 1,
          } satisfies AuthUser,
        } satisfies LoginResponse,
        message: 'login success',
      }) satisfies { code: number; data: LoginResponse; message: string },
  },
] as MockMethod[];
