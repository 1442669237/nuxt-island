# 多环境配置说明

本项目支持开发、测试、生产三个环境的配置，通过不同的启动命令和构建命令来使用不同环境的 API 接口。

## 环境配置

### 开发环境 (Development)
- **API 地址**: `https://api.test.mall.aitrip123.com`
- **配置文件**: `.env.development`
- **环境标识**: `development`
- **显示名称**: `开发环境`

### 测试环境 (Test)
- **API 地址**: `https://api.test.mall.aitrip123.com`
- **配置文件**: `.env.test`
- **环境标识**: `test`
- **显示名称**: `测试环境`

### 生产环境 (Production)
- **API 地址**: `https://api.mall.aitrip123.com`
- **配置文件**: `.env.production`
- **环境标识**: `production`
- **显示名称**: `生产环境`

## 启动命令

### 开发模式启动
```bash
# 开发环境
npm run dev:dev

# 测试环境
npm run dev:test

# 生产环境
npm run dev:prod
```

### 构建命令
```bash
# 开发环境构建
npm run build:dev

# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

### 静态生成命令
```bash
# 开发环境静态生成
npm run generate:dev

# 测试环境静态生成
npm run generate:test

# 生产环境静态生成
npm run generate:prod
```

### 预览命令
```bash
# 开发环境预览
npm run preview:dev

# 测试环境预览
npm run preview:test

# 生产环境预览
npm run preview:prod
```

## 环境变量说明

每个环境配置文件包含以下变量：

- `NODE_ENV`: Node.js 环境标识
- `NUXT_PUBLIC_API_BASE`: API 基础地址
- `NUXT_PUBLIC_API_TIMEOUT`: API 请求超时时间（毫秒）
- `NUXT_PUBLIC_API_RETRIES`: API 请求重试次数
- `NUXT_PUBLIC_ENV_NAME`: 环境名称标识
- `NUXT_PUBLIC_ENV_DISPLAY_NAME`: 环境显示名称

## 使用示例

1. **启动开发环境**:
   ```bash
   npm run dev:dev
   ```
   页面将显示"开发环境"标识，API 请求将发送到 `https://api.test.mall.aitrip123.com`

2. **构建生产环境**:
   ```bash
   npm run build:prod
   ```
   构建的应用将使用生产环境配置，API 请求将发送到 `https://api.mall.aitrip123.com`

## 注意事项

1. 环境配置文件 (`.env.*`) 已包含在项目中，包含了各环境的默认配置
2. 如需修改配置，请直接编辑对应的 `.env.*` 文件
3. Nuxt 会自动根据 `--dotenv` 参数加载对应的环境配置文件
4. 页面顶部会显示当前环境信息，方便确认当前使用的环境
5. 不同环境使用不同颜色的标识：
   - 开发环境：绿色
   - 测试环境：红色  
   - 生产环境：蓝色

## 环境切换验证

启动不同环境后，可以通过以下方式验证环境配置是否正确：

1. 查看页面顶部的环境标识和 API 地址
2. 打开浏览器开发者工具，查看网络请求的目标地址
3. 检查控制台输出的环境信息