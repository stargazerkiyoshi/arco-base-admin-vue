import type { MeResponse } from '@/types/auth';
import { request } from './request';

export const me = () => request<MeResponse>({ url: '/api/auth/me', method: 'get' });
