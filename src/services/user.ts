import { get } from './http';

export interface UserInfo {
  id: number;
  name: string;
  role: string;
}

export const fetchUserInfo = (params: UserInfo) => get<UserInfo>('/api/user/info', { params });
