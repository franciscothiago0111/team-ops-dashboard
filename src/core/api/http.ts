import { env } from "../config/env";
import { applyAuthInterceptor } from "./interceptors/auth.interceptor";
import { applyErrorInterceptor } from "./interceptors/error.interceptor";

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class Http {
  constructor(private baseURL: string) {}

  private headers(): HeadersInit {
    return applyAuthInterceptor();
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (!params) return url;

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async request<T>(url: string, options: RequestConfig = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const finalUrl = this.buildUrl(url, params);

    const finalOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.headers(),
        ...fetchOptions.headers,
      },
    };

    const response = await fetch(this.baseURL + finalUrl, finalOptions);
    const result = await applyErrorInterceptor<T>(response);

    // Return the payload directly, which is the data the services expect
    return result.payload as T;
  }

  get<T>(url: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  post<T>(url: string, body: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(url: string, body: unknown, options?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const api = new Http(env.apiUrl);
