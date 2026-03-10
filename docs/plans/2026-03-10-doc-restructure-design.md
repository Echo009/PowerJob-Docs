# PowerJob 文档目录重组设计方案

## 概述

本方案旨在重新组织 PowerJob 中文文档的目录结构，使其更加清晰、易于导航，同时满足新用户入门和老用户查阅的需求。

## 设计原则

1. **全面兼顾**：同时满足新用户入门和老用户查阅的需求
2. **功能导向**：按内容类型分类（入门、核心、进阶、API、运维）
3. **中英文同步**：zh/ 和 en/ 采用完全相同的目录结构

## 目标目录结构

```
zh/
├── index.md                   # 首页（保持不变）
│
├── start/                     # 快速开始
│   ├── introduction.md        # 产品介绍：什么是 PowerJob、特性、适用场景
│   ├── installation.md        # 安装部署：环境要求、部署方式
│   └── quick-start.md         # 5分钟上手：快速体验完整流程
│
├── core/                      # 核心功能
│   ├── architecture.md        # 架构设计：核心概念、系统架构
│   ├── task.md                # 任务配置：创建任务、基本参数
│   ├── processor.md           # 处理器开发：BasicProcessor 等
│   ├── execution-mode.md      # 执行模式：单机、广播、Map、MapReduce
│   └── schedule-strategy.md   # 调度策略：CRON、固定频率、固定延迟、API
│
├── advanced/                  # 进阶功能
│   ├── workflow.md            # 工作流：合并 workflow.md + workflow-design.md
│   ├── advanced-task.md       # 高级任务：任务参数、生命周期、重试策略
│   └── worker.md              # Worker 高级配置
│
├── integration/               # 集成指南
│   └── spring-boot.md         # Spring Boot 集成
│
├── api/                       # API 参考
│   └── openapi.md             # OpenAPI 文档
│
└── ops/                       # 运维管理
    ├── alert.md               # 告警配置
    └── operation.md           # 运维操作：容器管理、日志等
```

## 变更清单

### 新建目录

| 目录 | 用途 |
|------|------|
| `start/` | 入门相关文档 |
| `core/` | 核心功能文档 |
| `advanced/` | 进阶功能文档 |
| `integration/` | 集成指南 |
| `ops/` | 运维管理文档 |

### 文件移动

| 原路径 | 新路径 | 说明 |
|--------|--------|------|
| `guide/introduction.md` | `start/introduction.md` | |
| `guide/installation.md` | `start/installation.md` | |
| `guide/quick-start.md` | `start/quick-start.md` | |
| `guide/architecture.md` | `core/architecture.md` | |
| `guide/task.md` | `core/task.md` | |
| `guide/processor.md` | `core/processor.md` | |
| `guide/execution-mode.md` | `core/execution-mode.md` | |
| `guide/schedule-strategy.md` | `core/schedule-strategy.md` | |
| `guide/workflow.md` | `advanced/workflow.md` | |
| `guide/workflow-design.md` | 合并到 `advanced/workflow.md` | |
| `guide/advanced-task.md` | `advanced/advanced-task.md` | |
| `guide/worker.md` | `advanced/worker.md` | |
| `guide/spring-boot.md` | `integration/spring-boot.md` | |
| `guide/alert.md` | `ops/alert.md` | |
| `guide/operation.md` | `ops/operation.md` | |

### 文件删除

| 文件 | 原因 |
|------|------|
| `guide/openapi.md` | 与 `api/openapi.md` 重复，保留后者 |
| `guide/` 目录 | 移动完成后删除空目录 |

## URL 映射

| 旧 URL | 新 URL |
|--------|--------|
| `/guide/introduction` | `/start/introduction` |
| `/guide/installation` | `/start/installation` |
| `/guide/quick-start` | `/start/quick-start` |
| `/guide/architecture` | `/core/architecture` |
| `/guide/task` | `/core/task` |
| `/guide/processor` | `/core/processor` |
| `/guide/execution-mode` | `/core/execution-mode` |
| `/guide/schedule-strategy` | `/core/schedule-strategy` |
| `/guide/workflow` | `/advanced/workflow` |
| `/guide/workflow-design` | `/advanced/workflow` (合并) |
| `/guide/advanced-task` | `/advanced/advanced-task` |
| `/guide/worker` | `/advanced/worker` |
| `/guide/spring-boot` | `/integration/spring-boot` |
| `/guide/alert` | `/ops/alert` |
| `/guide/operation` | `/ops/operation` |
| `/guide/openapi` | `/api/openapi` |

## 同步更新英文文档

英文文档 (en/) 需要执行相同的目录重组操作，保持与中文文档结构一致。

## 注意事项

1. **链接更新**：所有文档内部的交叉引用链接需要更新
2. **配置更新**：如有导航配置文件（如 `.vitepress/config.ts`），需要同步更新
3. **重定向**：考虑为旧 URL 设置重定向，避免外部链接失效

---

设计日期：2026-03-10
