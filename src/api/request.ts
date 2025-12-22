import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

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

let tokenGetter: (() => string | null) | null = null;

export const setAuthTokenGetter = (getter: () => string | null) => {
  tokenGetter = getter;
};

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenGetter?.() ?? localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error) => Promise.reject(error),
);

export const request = async <T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const res = await httpClient.request<ApiResponse<T>>(config);
  return res.data;
};

export default httpClient;
