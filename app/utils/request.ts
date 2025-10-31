import type { ApiError, InterceptorConfig } from '../types/api'

// 全局拦截器配置
let globalInterceptors: InterceptorConfig = {}

// 设置全局拦截器
export function setInterceptors(interceptors: InterceptorConfig) {
  globalInterceptors = { ...globalInterceptors, ...interceptors }
}

// 获取当前拦截器配置
export function getInterceptors(): InterceptorConfig {
  return globalInterceptors
}

// 创建 API 错误
export function createApiError(message: string, code: number = 500, details?: any): ApiError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  }
}

// 延迟函数
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 判断是否应该重试
export function shouldRetry(error: any): boolean {
  // 只对特定错误进行重试（网络错误、超时等）
  if (error && typeof error === 'object' && 'status' in error) {
    const status = error.status
    // 不重试客户端错误（4xx）
    return !(status >= 400 && status < 500)
  }
  return true
}

// 构建请求配置
export function buildRequestConfig(options: any) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    timeout = 10000
  } = options

  const config: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    timeout
  }

  // 添加请求体
  if (body && method !== 'GET') {
    config.body = body
  }

  // 添加查询参数
  if (query) {
    config.query = query
  }

  return config
}

// 应用请求拦截器
export function applyRequestInterceptor(config: any) {
  if (globalInterceptors.request?.onFulfilled) {
    try {
      return globalInterceptors.request.onFulfilled(config)
    } catch (error) {
      if (globalInterceptors.request?.onRejected) {
        throw globalInterceptors.request.onRejected(error)
      }
      throw error
    }
  }
  return config
}

// 应用响应拦截器
export function applyResponseInterceptor(response: any) {
  if (globalInterceptors.response?.onFulfilled) {
    return globalInterceptors.response.onFulfilled(response)
  }
  return response
}

// 应用响应错误拦截器
export function applyResponseErrorInterceptor(error: any) {
  if (globalInterceptors.response?.onRejected) {
    return globalInterceptors.response.onRejected(error)
  }
  throw error
}