import type { PermissionCode } from '../models/permission';
import type { UserInfo } from '../models/user';

// API response for fetching a single user info
export type FetchUserInfoResponse = UserInfo;

// API response for fetching permission codes of current user
export type FetchUserPermissionsResponse = PermissionCode[];
