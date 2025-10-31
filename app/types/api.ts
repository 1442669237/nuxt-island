// API 响应基础接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页响应接口
export interface PaginatedResponse<T = any> {
  code: number
  message: string
  success: boolean
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
}

// 请求配置接口
export interface RequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

// 拦截器配置接口
export interface InterceptorConfig {
  request?: {
    onFulfilled?: (config: any) => any
    onRejected?: (error: any) => any
  }
  response?: {
    onFulfilled?: (response: any) => any
    onRejected?: (error: any) => any
  }
}

// API 错误类型
export interface ApiError {
  code: number
  message: string
  details?: any
  timestamp?: string
}

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求选项接口
export interface RequestOptions {
  method?: HttpMethod
  body?: any
  query?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  retry?: number
  retryDelay?: number
}