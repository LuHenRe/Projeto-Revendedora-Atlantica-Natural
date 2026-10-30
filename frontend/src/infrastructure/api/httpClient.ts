import { env } from '../config/env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
    public readonly data?: unknown
  ) {
    super(`API Error ${status}: ${detail}`);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = env.apiUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, params, headers: customHeaders, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    } catch (error: unknown) {
      throw new ApiError(0, error instanceof Error ? error.message : 'Falha na conexão com o servidor');
    }

    // 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    let responseData: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => '');
    }

    if (!response.ok) {
      const detail =
        responseData && typeof responseData === 'object' && 'detail' in responseData
          ? typeof responseData.detail === 'string'
            ? responseData.detail
            : JSON.stringify(responseData.detail)
          : response.statusText || 'Erro inesperado na requisição';

      throw new ApiError(response.status, detail, responseData);
    }

    return responseData as T;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const isUrlEncoded = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: isFormData || isUrlEncoded ? (body as any) : JSON.stringify(body),
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
