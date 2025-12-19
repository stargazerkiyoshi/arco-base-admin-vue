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

const baseURL = import.meta.env.VITE_API_BASE_URL || '/';

const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: false,
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
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

export const get = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => request<T>({ ...config, method: 'get', url });

export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => request<T>({ ...config, method: 'post', url, data });

export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => request<T>({ ...config, method: 'put', url, data });

export const del = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => request<T>({ ...config, method: 'delete', url });

export default httpClient;
