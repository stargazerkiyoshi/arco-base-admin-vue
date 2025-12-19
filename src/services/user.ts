import type { LoginRequest, LoginResponse } from '@/types/api/auth';
import type { FetchUserInfoResponse } from '@/types/api/user';
import type { UserInfo } from '@/types/models/user';
import { get, post } from './http';

const baseUrl = '/user';

export const login = (data: LoginRequest) => post<LoginResponse>(`${baseUrl}/login`, data);

export const fetchUserInfo = (params: Partial<UserInfo>) =>
  get<FetchUserInfoResponse>(`${baseUrl}/info`, { params });
