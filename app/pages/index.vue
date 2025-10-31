<template>
  <div class="container">
    <div class="header">
      <h1>🏝️ Nuxt Island API 演示</h1>
      <p>演示使用封装的 API 拦截器发送请求</p>
      
      <!-- 环境信息显示 -->
      <div class="env-info">
        <span class="env-badge" :class="envClass">
          {{ config.public.envDisplayName }}
        </span>
        <span class="api-url">{{ config.public.apiBase }}</span>
      </div>
    </div>

    <div class="api-section">
      <div class="api-info">
        <h2>📡 API 接口信息</h2>
        <div class="info-card">
          <p><strong>请求地址：</strong> /buyer/goods/grouptour/search/v1/list</p>
          <p><strong>请求方法：</strong> POST</p>
          <p><strong>请求参数：</strong> { pageSize: 10 }</p>
        </div>
      </div>

      <div class="controls">
        <button 
          @click="fetchData" 
          :disabled="loading"
          class="fetch-btn"
        >
          {{ loading ? '请求中...' : '发送请求' }}
        </button>
        
        <button 
          @click="clearData" 
          :disabled="loading"
          class="clear-btn"
        >
          清空数据
        </button>
      </div>

      <div class="status-section">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在发送请求...</p>
        </div>

        <div v-if="error" class="error">
          <h3>❌ 请求失败</h3>
          <pre>{{ error }}</pre>
        </div>

        <div v-if="data && !loading" class="success">
          <h3>✅ 请求成功</h3>
          <div class="response-data">
            <h4>响应数据：</h4>
            <pre>{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 使用我们封装的 API 组合式函数
const { loading, error, post, clearError } = useApi()

// 获取运行时配置
const config = useRuntimeConfig()

// 响应式数据状态
const data = ref(null)

// 环境样式类
const envClass = computed(() => {
  const envName = config.public.envName
  return {
    'env-development': envName === 'development',
    'env-test': envName === 'test',
    'env-production': envName === 'production'
  }
})

// 发送请求的方法
const fetchData = async () => {
  try {
    const response = await post('/buyer/goods/grouptour/search/v1/list', {
      pageSize: 10
    })
    data.value = response
    console.log('请求成功:', response)
  } catch (err) {
    console.error('请求失败:', err)
  }
}

// 清空数据
const clearData = () => {
  data.value = null
  clearError()
}

// 页面标题
useHead({
  title: 'Nuxt Island - API 演示',
  meta: [
    { name: 'description', content: '演示 Nuxt 项目中的 API 请求拦截器功能' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  font-size: 1.1rem;
  color: #718096;
}

/* 环境信息样式 */
.env-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.env-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.env-badge.env-development {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.env-badge.env-test {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #fc8181;
}

.env-badge.env-production {
  background: #bee3f8;
  color: #2a4365;
  border: 1px solid #63b3ed;
}

.api-url {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: #4a5568;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
}

.api-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.api-info h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.info-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-card p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.info-card strong {
  color: #2d3748;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fetch-btn, .clear-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.fetch-btn {
  background: #4299e1;
  color: white;
}

.fetch-btn:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-1px);
}

.fetch-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.clear-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.clear-btn:hover:not(:disabled) {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.status-section {
  min-height: 200px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #4299e1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 1.5rem;
  color: #c53030;
}

.error h3 {
  margin: 0 0 1rem 0;
}

.error pre {
  background: #fff5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  white-space: pre-wrap;
}

.success {
  background: #c6f6d5;
  border: 1px solid #68d391;
  border-radius: 8px;
  padding: 1.5rem;
  color: #22543d;
}

.success h3 {
  margin: 0 0 1rem 0;
}

.response-data h4 {
  margin: 1rem 0 0.5rem 0;
  color: #2d3748;
}

.response-data pre {
  background: #f0fff4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .api-section {
    padding: 1.5rem;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .fetch-btn, .clear-btn {
    width: 100%;
  }
}
</style>