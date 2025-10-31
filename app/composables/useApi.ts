import { ref, readonly } from 'vue'
import type { ApiResponse, RequestOptions } from '../types/api'
import { 
  buildRequestConfig, 
  applyRequestInterceptor, 
  applyResponseInterceptor, 
  applyResponseErrorInterceptor,
  shouldRetry,
  delay
} from '../utils/request'

// 请求重试逻辑
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      
      // 如果是最后一次重试，直接抛出错误
      if (i === maxRetries) {
        throw error
      }
      
      // 检查是否应该重试
      if (!shouldRetry(error)) {
        throw error
      }
      
      // 等待后重试（指数退避）
      await delay(retryDelay * Math.pow(2, i))
    }
  }
  
  throw lastError
}

// 基础请求函数
async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retry = 0,
    retryDelay = 1000,
    ...restOptions
  } = options

  // 获取运行时配置
  const config = useRuntimeConfig()
  
  // 构建完整的 URL
  const fullUrl = url.startsWith('http') ? url : `${config.public.apiBase}${url}`
  
  // 构建请求配置
  let requestConfig = buildRequestConfig(restOptions)
  
  // 应用请求拦截器
  requestConfig = applyRequestInterceptor(requestConfig)

  // 定义请求函数
  const makeRequest = async () => {
    try {
      const response = await $fetch<ApiResponse<T>>(fullUrl, requestConfig)
      
      // 应用响应拦截器
      return applyResponseInterceptor(response)
    } catch (error) {
      // 应用响应错误拦截器
      return applyResponseErrorInterceptor(error)
    }
  }

  // 执行请求（带重试）
  if (retry > 0) {
    return await retryRequest(makeRequest, retry, retryDelay)
  } else {
    return await makeRequest()
  }
}

// 主要的 API 组合式函数
export function useApi() {
  // 响应式状态
  const loading = ref(false)
  const error = ref<any>(null)

  // GET 请求
  const get = async <T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await request<T>(url, { ...options, method: 'GET' })
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // POST 请求
  const post = async <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await request<T>(url, { ...options, method: 'POST', body: data })
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // PUT 请求
  const put = async <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await request<T>(url, { ...options, method: 'PUT', body: data })
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE 请求
  const del = async <T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await request<T>(url, { ...options, method: 'DELETE' })
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // PATCH 请求
  const patch = async <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await request<T>(url, { ...options, method: 'PATCH', body: data })
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    loading: readonly(loading),
    error: readonly(error),
    
    // 方法
    get,
    post,
    put,
    del,
    patch,
    clearError
  }
}

// 简化的 API 调用函数（不带状态管理）
export function useSimpleApi() {
  return {
    get: <T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(url, { ...options, method: 'GET' }),
      
    post: <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
      request<T>(url, { ...options, method: 'POST', body: data }),
      
    put: <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
      request<T>(url, { ...options, method: 'PUT', body: data }),
      
    del: <T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(url, { ...options, method: 'DELETE' }),
      
    patch: <T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
      request<T>(url, { ...options, method: 'PATCH', body: data })
  }
}

// 专门用于文件上传的组合式函数
export function useFileUpload() {
  const loading = ref(false)
  const progress = ref(0)
  const error = ref<any>(null)

  const upload = async (url: string, file: File, options: {
    fieldName?: string
    additionalData?: Record<string, any>
    onProgress?: (progress: number) => void
  } = {}) => {
    const { fieldName = 'file', additionalData = {}, onProgress } = options
    
    loading.value = true
    progress.value = 0
    error.value = null

    try {
      const formData = new FormData()
      formData.append(fieldName, file)
      
      // 添加额外数据
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })

      // 构建请求配置
      let requestConfig = buildRequestConfig({
        method: 'POST',
        body: formData,
        headers: {} // 让浏览器自动设置 Content-Type
      })
      
      // 移除 Content-Type，让浏览器自动设置
      delete requestConfig.headers['Content-Type']
      
      // 应用请求拦截器
      requestConfig = applyRequestInterceptor(requestConfig)

      const response = await $fetch(url, requestConfig)
      
      // 应用响应拦截器
      return applyResponseInterceptor(response)
    } catch (err) {
      error.value = err
      // 应用响应错误拦截器
      return applyResponseErrorInterceptor(err)
    } finally {
      loading.value = false
      progress.value = 0
    }
  }

  return {
    loading: readonly(loading),
    progress: readonly(progress),
    error: readonly(error),
    upload
  }
}