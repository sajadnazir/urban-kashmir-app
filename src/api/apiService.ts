import { AxiosRequestConfig } from 'axios';
import apiClient from './client';

// ─── Generic response wrapper ─────────────────────────────────────────────────

/**
 * Standard shape every API endpoint should return.
 * Adjust fields to match your actual backend response envelope.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMeta;
}

// ─── Request option types ──────────────────────────────────────────────────────

/** Extra per-request options layered on top of AxiosRequestConfig. */
export type RequestOptions = Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;

// ─── Generic API Service ──────────────────────────────────────────────────────

/**
 * `apiService` is a thin, generic wrapper around axios that:
 *
 *  • Is fully typed — every method is generic over the response payload.
 *  • Automatically receives the `Authorization: Bearer <token>` header via
 *    the axios interceptor in `client.ts` — callers never touch tokens.
 *  • Normalises the response so every method only ever returns the inner
 *    `data` field; no more `response.data.data` chains.
 *  • Forwards optional per-request axios config (custom headers, signal for
 *    cancellation, etc.) through `options`.
 *
 * Usage example
 * ─────────────
 * ```ts
 * // GET — automatically attaches auth header when logged in
 * const products = await apiService.get<Product[]>('/products');
 *
 * // POST with typed body
 * const order = await apiService.post<Order, CreateOrderDto>('/orders', dto);
 *
 * // Request cancellation
 * const controller = new AbortController();
 * const items = await apiService.get<Item[]>('/items', {}, { signal: controller.signal });
 * ```
 */
export const apiService = {
  /**
   * HTTP GET
   *
   * @template TResponse  Expected shape of `response.data.data`
   * @param url           Endpoint path relative to the base URL
   * @param params        URL query parameters
   * @param options       Optional axios config overrides (headers, signal, …)
   */
  get: async <TResponse>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.get<ApiResponse<TResponse>>(url, {
      params,
      ...options,
    });
    return response.data.data;
  },

  /**
   * HTTP GET (Paginated)
   * Returns both the data array and the pagination metadata.
   */
  getPaginated: async <TResponse>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<TResponse>> => {
    const response = await apiClient.get<ApiResponse<TResponse>>(url, {
      params,
      ...options,
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination!,
    };
  },

  /**
   * HTTP POST
   *
   * @template TResponse  Expected shape of the response payload
   * @template TBody      Shape of the request body
   */
  post: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.post<ApiResponse<TResponse>>(url, body, options);
    return response.data.data;
  },

  /**
   * HTTP PUT — full resource replacement
   *
   * @template TResponse  Expected shape of the response payload
   * @template TBody      Shape of the request body
   */
  put: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.put<ApiResponse<TResponse>>(url, body, options);
    return response.data.data;
  },

  /**
   * HTTP PATCH — partial resource update
   *
   * @template TResponse  Expected shape of the response payload
   * @template TBody      Shape of the request body
   */
  patch: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.patch<ApiResponse<TResponse>>(url, body, options);
    return response.data.data;
  },

  /**
   * HTTP DELETE
   *
   * @template TResponse  Expected shape of the response payload (often void)
   */
  delete: async <TResponse = void>(
    url: string,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.delete<ApiResponse<TResponse>>(url, options);
    return response.data.data;
  },

  /**
   * HTTP POST with multipart/form-data — for file uploads
   *
   * @template TResponse  Expected shape of the response payload
   */
  upload: async <TResponse>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressPercent: number) => void,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const response = await apiClient.post<ApiResponse<TResponse>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const total = progressEvent.total ?? 1;
            const percent = Math.round((progressEvent.loaded * 100) / total);
            onUploadProgress(percent);
          }
        : undefined,
      ...options,
    });
    return response.data.data;
  },
};
