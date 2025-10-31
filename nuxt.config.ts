// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  
  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false
  },
  
  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    apiSecret: '',
    
    // 公共环境变量（客户端可访问）
    public: {
      // API 配置 - 可通过环境变量覆盖
      // Nuxt 会自动从 NUXT_PUBLIC_* 环境变量中读取值
      apiBase: 'https://api.test.mall.aitrip123.com',
      apiTimeout: 10000,
      apiRetries: 3,
      
      // 环境信息
      envName: 'development',
      envDisplayName: '开发环境'
    }
  },
  
  // CSS 配置
  css: [],
  
  // 自动导入配置
  imports: {
    dirs: [
      'composables/**',
      'utils/**'
    ]
  }
})