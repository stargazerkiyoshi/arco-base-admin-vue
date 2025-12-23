import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ApiCode } from '@/constants/api';

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  data: T;
  [key: string]: unknown;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
});

let tokenGetter: (() => unknown) | null = null;
export const setTokenGetter = (fn: () => unknown) => {
  tokenGetter = fn;
};
let handleUnauthorized: (() => unknown) | null = null;
export const setHandleUnauthorized = (fn: (() => unknown) | null) => {
  handleUnauthorized = fn;
};

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenGetter?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    if (response.data?.code === ApiCode.Unauthorized) {
      handleUnauthorized?.();
      return Promise.reject(new Error(response.data.message || 'Unauthorized'));
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      handleUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export const request = async <T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const res = await httpClient.request<ApiResponse<T>>(config);
  return res.data;
};

export default httpClient;
