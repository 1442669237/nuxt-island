import { setInterceptors, createApiError } from '~/utils/request'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // 设置默认的请求拦截器
  setInterceptors({
    request: {
      onFulfilled: (requestConfig) => {
        // 添加认证 token
        const token = useCookie('auth-token')
        if (token.value) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${token.value}`
          }
        }

        // 添加时间戳防止缓存
        if (requestConfig.method === 'GET') {
          requestConfig.query = {
            ...requestConfig.query,
            _t: Date.now()
          }
        }

        // 打印请求日志（开发环境）
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.log('🚀 API 请求:', {
            url: requestConfig.url || '未知',
            method: requestConfig.method,
            headers: requestConfig.headers,
            body: requestConfig.body,
            query: requestConfig.query
          })
        }

        return requestConfig
      },
      onRejected: (error) => {
        console.error('❌ 请求拦截器错误:', error)
        throw createApiError('请求配置错误', 400, error)
      }
    },
    response: {
      onFulfilled: (response) => {
        // 打印响应日志（开发环境）
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.log('✅ API 响应:', response)
        }

        // 检查业务状态码
        if (response && typeof response === 'object') {
          if ('code' in response && response.code !== 200 && response.code !== 0) {
            const error = createApiError(
              response.message || '请求失败',
              response.code,
              response
            )
            throw error
          }
        }

        return response
      },
      onRejected: (error) => {
        console.error('❌ API 响应错误:', error)

        // 处理不同类型的错误
        if (error?.status) {
          switch (error.status) {
            case 401:
              // 未授权，清除 token 并跳转登录
              const token = useCookie('auth-token')
              token.value = null
              
              // 如果不在登录页面，则跳转到登录页面
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                navigateTo('/login')
              }
              
              throw createApiError('登录已过期，请重新登录', 401, error)
              
            case 403:
              throw createApiError('没有权限访问该资源', 403, error)
              
            case 404:
              throw createApiError('请求的资源不存在', 404, error)
              
            case 422:
              throw createApiError('请求参数验证失败', 422, error)
              
            case 429:
              throw createApiError('请求过于频繁，请稍后再试', 429, error)
              
            case 500:
              throw createApiError('服务器内部错误', 500, error)
              
            case 502:
            case 503:
            case 504:
              throw createApiError('服务暂时不可用，请稍后再试', error.status, error)
              
            default:
              throw createApiError(
                error.message || `请求失败 (${error.status})`,
                error.status,
                error
              )
          }
        }

        // 网络错误
        if (error?.name === 'TypeError' || error?.message?.includes('fetch')) {
          throw createApiError('网络连接失败，请检查网络设置', 0, error)
        }

        // 超时错误
        if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
          throw createApiError('请求超时，请稍后再试', 0, error)
        }

        // 其他未知错误
        throw createApiError(
          error?.message || '未知错误',
          error?.code || error?.status || 500,
          error
        )
      }
    }
  })

  // 提供全局错误处理
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason === 'object' && 'code' in event.reason) {
        console.error('🚨 未处理的 API 错误:', event.reason)
        
        // 可以在这里添加全局错误提示
        // 例如：显示 toast 通知
      }
    })
  }
})