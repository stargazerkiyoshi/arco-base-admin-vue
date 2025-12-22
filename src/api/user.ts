import type { LoginRequest, LoginResponse } from '@/types/api/auth';
import type { FetchUserInfoResponse, FetchUserPermissionsResponse } from '@/types/api/user';
import type { UserInfo } from '@/types/models/user';
import { get, post } from './request';

const baseUrl = '/user';

export const login = (data: LoginRequest) => post<LoginResponse>(`${baseUrl}/login`, data);

export const fetchUserInfo = (params: Partial<UserInfo>) =>
  get<FetchUserInfoResponse>(`${baseUrl}/info`, { params });

export const fetchUserPermissions = (userId?: number) =>
  get<FetchUserPermissionsResponse>(`${baseUrl}/permissions`, {
    params: userId ? { userId } : undefined,
  });
