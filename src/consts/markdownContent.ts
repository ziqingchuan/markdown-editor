export const initialMarkdownContent = `
# 欢迎来到素笔 Mark !
这是一个基于Vue3的简易Markdown编辑器，提供如下功能：
> - 实时预览
> - 明暗模式切换
> - 全屏模式切换
> - 编辑模式/预览模式切换
> - 同步跟随滚动
> - 导出md/pdf文件
> - 图片本地上传
> - 文件内容解析读取
> - 代码高亮
> - 快捷检索emoji
> - 快捷工具栏
> - html代码渲染模式
> - json结构可视化定义
> - 数学公式可视化编辑
> - 后续持续更新...

[欢迎来我的博客看看：try-catch.life](https://try-catch.life/)

主要记录前端面试知识点，以及一些自己做的小demo
`;

export const restfulAPIContent = `
# RESTful API 接口文档模板

## 1. 文档概述

### 1.1 文档目的
本文档旨在描述[项目/系统名称]提供的RESTful API接口规范，为开发人员提供清晰的接口使用指南。

### 1.2 文档范围
本文档包含所有公开的API接口定义，包括请求方法、URL、参数、响应格式及示例。

### 1.3 术语定义
- RESTful: 一种基于HTTP协议的API设计风格
- Resource: 资源，API操作的对象
- Endpoint: API访问地址
- Payload: 请求/响应体数据

## 2. 基础信息

### 2.1 请求基础URL
\`\`\`
https://api.example.com/v1
\`\`\`

### 2.2 认证方式
- OAuth2.0 Bearer Token
- API Key (X-API-Key头)

### 2.3 公共请求头
| 头部字段 | 描述 | 示例 |
|---------|------|------|
| Authorization | Bearer token | \`Bearer abc123...\` |
| X-API-Key | API密钥 | \`key-abc123...\` |
| Accept | 接受的内容类型 | \`application/json\` |
| Content-Type | 请求体内容类型 | \`application/json\` |

### 2.4 公共响应头
| 头部字段 | 描述 |
|---------|------|
| X-RateLimit-Limit | 请求限制总数 |
| X-RateLimit-Remaining | 剩余请求次数 |
| X-RateLimit-Reset | 限制重置时间 |

### 2.5 公共参数
| 参数名 | 位置 | 类型 | 必填 | 描述 |
|-------|------|------|------|------|
| page | query | integer | 否 | 分页页码 |
| per_page | query | integer | 否 | 每页数量(默认10，最大100) |
| sort | query | string | 否 | 排序字段(如: \`-created_at\`表示倒序) |

### 2.6 响应状态码
| 状态码 | 描述 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 204 | 无内容(删除成功) |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 422 | 业务验证错误 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 2.7 日期时间格式
所有日期时间字段使用ISO 8601格式:
\`\`\`
YYYY-MM-DDTHH:MM:SSZ
示例: 2023-05-15T08:30:00Z
\`\`\`

## 3. 接口定义

### 3.1 用户管理

#### 3.1.1 获取用户列表
\`\`\`
GET /users
\`\`\`

**描述**: 获取用户列表(分页)

**请求参数**:
| 参数名 | 位置 | 类型 | 必填 | 描述 |
|-------|------|------|------|------|
| status | query | string | 否 | 用户状态(active/inactive) |
| role | query | string | 否 | 用户角色(admin/user) |

**请求示例**:
\`\`\`bash
curl -X GET "https://api.example.com/v1/users?page=1&per_page=20" \\
  -H "Authorization: Bearer abc123..."
\`\`\`

**成功响应**:
\`\`\`json
{
  "data": [
    {
      "id": "usr_abc123",
      "name": "张三",
      "email": "zhangsan@example.com",
      "role": "user",
      "created_at": "2023-01-15T08:30:00Z",
      "updated_at": "2023-01-15T08:30:00Z"
    },
    {
      "id": "usr_def456",
      "name": "李四",
      "email": "lisi@example.com",
      "role": "admin",
      "created_at": "2023-01-10T10:15:00Z",
      "updated_at": "2023-01-12T14:20:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "per_page": 20
  }
}
\`\`\`

#### 3.1.2 创建用户
\`\`\`
POST /users
\`\`\`

**描述**: 创建新用户

**请求体参数**:
| 参数名 | 类型 | 必填 | 描述 | 验证规则 |
|-------|------|------|------|----------|
| name | string | 是 | 用户名 | 长度2-50字符 |
| email | string | 是 | 邮箱 | 有效邮箱格式 |
| password | string | 是 | 密码 | 最小8字符，包含字母和数字 |
| role | string | 否 | 角色 | 默认"user" |

**请求示例**:
\`\`\`bash
curl -X POST "https://api.example.com/v1/users" \\
  -H "Authorization: Bearer abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "王五",
    "email": "wangwu@example.com",
    "password": "password123",
    "role": "user"
  }'
\`\`\`

**成功响应(201)**:
\`\`\`json
{
  "data": {
    "id": "usr_ghi789",
    "name": "王五",
    "email": "wangwu@example.com",
    "role": "user",
    "created_at": "2023-05-15T09:45:00Z",
    "updated_at": "2023-05-15T09:45:00Z"
  }
}
\`\`\`

**错误响应(422)**:
\`\`\`json
{
  "error": {
    "code": "validation_error",
    "message": "输入验证失败",
    "details": {
      "email": ["邮箱已被使用"],
      "password": ["密码必须包含至少一个字母和一个数字"]
    }
  }
}
\`\`\`

#### 3.1.3 获取单个用户
\`\`\`
GET /users/{user_id}
\`\`\`

**描述**: 获取指定ID的用户信息

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求示例**:
\`\`\`bash
curl -X GET "https://api.example.com/v1/users/usr_abc123" \\
  -H "Authorization: Bearer abc123..."
\`\`\`

**成功响应**:
\`\`\`json
{
  "data": {
    "id": "usr_abc123",
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user",
    "created_at": "2023-01-15T08:30:00Z",
    "updated_at": "2023-01-15T08:30:00Z"
  }
}
\`\`\`

#### 3.1.4 更新用户
\`\`\`
PATCH /users/{user_id}
\`\`\`

**描述**: 更新用户信息(部分更新)

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求体参数**:
| 参数名 | 类型 | 必填 | 描述 | 验证规则 |
|-------|------|------|------|----------|
| name | string | 否 | 用户名 | 长度2-50字符 |
| email | string | 否 | 邮箱 | 有效邮箱格式 |
| role | string | 否 | 角色 | admin/user |

**请求示例**:
\`\`\`bash
curl -X PATCH "https://api.example.com/v1/users/usr_abc123" \\
  -H "Authorization: Bearer abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "张三丰",
    "role": "admin"
  }'
\`\`\`

**成功响应**:
\`\`\`json
{
  "data": {
    "id": "usr_abc123",
    "name": "张三丰",
    "email": "zhangsan@example.com",
    "role": "admin",
    "created_at": "2023-01-15T08:30:00Z",
    "updated_at": "2023-05-15T10:00:00Z"
  }
}
\`\`\`

#### 3.1.5 删除用户
\`\`\`
DELETE /users/{user_id}
\`\`\`

**描述**: 删除指定用户

**路径参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| user_id | string | 是 | 用户ID |

**请求示例**:
\`\`\`bash
curl -X DELETE "https://api.example.com/v1/users/usr_def456" \\
  -H "Authorization: Bearer abc123..."
\`\`\`

**成功响应(204)**: 无内容

### 3.2 产品管理

#### 3.2.1 获取产品列表
\`\`\`
GET /products
\`\`\`

**描述**: 获取产品列表(分页)

**请求参数**:
| 参数名 | 位置 | 类型 | 必填 | 描述 |
|-------|------|------|------|------|
| category | query | string | 否 | 产品分类 |
| min_price | query | number | 否 | 最低价格 |
| max_price | query | number | 否 | 最高价格 |
| in_stock | query | boolean | 否 | 是否有库存 |

**响应示例**:
\`\`\`json
{
  "data": [
    {
      "id": "prod_123",
      "name": "智能手机",
      "description": "最新款智能手机",
      "price": 2999.00,
      "stock": 100,
      "category": "electronics",
      "created_at": "2023-03-10T08:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
\`\`\`

## 4. 错误处理

### 4.1 错误响应格式
所有错误响应都遵循以下格式:
\`\`\`json
{
  "error": {
    "code": "错误代码",
    "message": "人类可读的错误信息",
    "details": {
      // 可选，具体错误详情
    }
  }
}
\`\`\`

### 4.2 常见错误代码
| 错误代码 | 描述 |
|---------|------|
| invalid_request | 请求参数无效 |
| unauthorized | 未授权访问 |
| forbidden | 禁止访问 |
| not_found | 资源不存在 |
| rate_limit_exceeded | 请求过于频繁 |
| internal_error | 服务器内部错误 |
| validation_error | 数据验证失败 |

## 5. 版本控制

API使用URL路径进行版本控制，当前版本为v1:
\`\`\`
https://api.example.com/v1
\`\`\`

## 6. 附录

### 6.1 枚举值说明

**用户角色**:
- admin: 管理员
- user: 普通用户

**产品状态**:
- active: 活跃
- inactive: 未激活
- archived: 已归档

### 6.2 速率限制
- 普通用户: 100次/分钟
- 高级用户: 500次/分钟
- 管理员: 1000次/分钟

### 6.3 变更日志
| 日期 | 版本 | 变更描述 |
|------|------|----------|
| 2023-05-01 | v1.0 | 初始版本发布 |
| 2023-05-15 | v1.1 | 新增用户搜索功能 |

`
