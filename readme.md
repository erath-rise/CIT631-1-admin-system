# 员工管理系统 (Admin System) — 前端应用

本仓库为员工管理系统的前端项目，基于 Next.js + TypeScript + Tailwind CSS 构建，提供登录/注册、员工信息管理增删改查功能与交互。

后端代码：
https://github.com/erath-rise/CIT631-1-admin-system-backend

## 项目概述

本前端项目通过 REST API 与后端交互，默认连接本地后端 `http://localhost:4000/api`，你也可以按需修改 API 地址。

### 核心功能
- **用户认证**：登录、注册，基于 JWT 的会话维持
- **员工管理**：员工列表、查询、创建、编辑、删除
- **现代化 UI**：Tailwind CSS + Radix UI，无障碍且响应式

## 技术栈
- **Next.js 15** — React 应用框架（App Router）
- **TypeScript** — 类型安全
- **Tailwind CSS 4** — 实用优先样式
- **Radix UI** — 无障碍基础组件
- **Axios** — HTTP 客户端
- **Lucide React** — 图标库

## 目录结构

```
frontend/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── login/        # 登录页
│   │   ├── register/     # 注册页
│   │   ├── dashboard/    # 仪表盘
│   │   └── employees/    # 员工管理
│   ├── components/       # 复用组件（表单、UI）
│   └── lib/              # 工具（API 封装等）
├── public/               # 静态资源
├── package.json
└── readme.md
```

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm 或 yarn

### 安装与启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发环境
npm run dev
```

启动后访问：`http://localhost:3000`

> 注意：前端默认请求后端 `http://localhost:4000/api`。请先启动或配置后端服务（见上方链接）。

### 配置 API 地址

当前 API 基址在 `src/lib/api.ts` 中定义：

```ts
// src/lib/api.ts
const API_URL = "http://localhost:4000/api";
```

## 构建与部署

```bash
# 生产构建
npm run build

# 启动生产服务
npm run start
```

## 后端服务

后端源码与部署说明请见：
https://github.com/erath-rise/CIT631-1-admin-system-backend

默认本地开发后端地址：`http://localhost:4000/api`
