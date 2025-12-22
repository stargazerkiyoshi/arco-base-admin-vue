import type { MockMethod } from 'vite-plugin-mock';
import type { LoginRequest, LoginResponse } from '../src/types/api/auth';
import type { FetchUserInfoResponse } from '../src/types/api/user';
import type { UserInfo } from '../src/types/models/user';
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
    url: '/api/user/info',
    method: 'get',
    response: () =>
      ({
        code: ApiCode.Success,
        data: {
          id: 1,
          name: 'Mock User',
          role: 'admin',
        } satisfies FetchUserInfoResponse,
        message: 'ok',
      }) satisfies { code: number; data: FetchUserInfoResponse; message: string },
  },
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }: { body: LoginRequest }) =>
      ({
        code: ApiCode.Success,
        data: {
          token: 'mock-token-123',
          user: {
            id: 1,
            name: body.username || 'Mock User',
            role: 'admin',
          } satisfies UserInfo,
        } satisfies LoginResponse,
        message: 'login success',
      }) satisfies { code: number; data: LoginResponse; message: string },
  },
] as MockMethod[];
