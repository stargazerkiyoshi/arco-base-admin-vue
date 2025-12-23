export interface AuthUser {
  id: string | number;
  username: string;
  nickname?: string;
  avatar?: string;
  status: 0 | 1;
}

export type MenuType = 'CATALOG' | 'MENU';

export interface MenuNode {
  id: string | number;
  name: string;
  type: MenuType;
  icon?: string;
  order?: number;
  hidden?: boolean;
  routeName?: string;
  perm?: string;
  children?: MenuNode[];
}

export interface MeResponse {
  user: AuthUser;
  permissions?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: AuthUser;
}
