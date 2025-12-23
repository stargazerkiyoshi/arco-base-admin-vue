import type { MeResponse, LoginRequest, LoginResponse } from '@/types/auth';
import { request } from './request';

const baseUrl = '/auth';
export const login = (data: LoginRequest) =>
  request<LoginResponse>({
    url: `${baseUrl}/login`,
    method: 'post',
    data,
  });
export const me = () =>
  request<MeResponse>({
    url: `${baseUrl}/me`,
    method: 'get',
  });
