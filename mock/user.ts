import type { MockMethod } from 'vite-plugin-mock';
import type { LoginRequest, LoginResponse } from '../src/types/api/auth';
import type { FetchUserInfoResponse } from '../src/types/api/user';
import type { UserInfo } from '../src/types/models/user';
import { ApiCode } from '../src/constants/api';

export default [
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
