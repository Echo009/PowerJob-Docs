# OpenAPI 文档

::: warning 文档编写中
此页面内容正在编写中，敬请期待。
:::

## 概述

PowerJob 提供了完整的 OpenAPI，允许开发者通过 HTTP 接口进行任务的创建、触发、停止等操作。

## 接入说明

### 获取 AppId 和 AppSecret

1. 登录 PowerJob 控制台
2. 进入应用管理页面
3. 复制 AppId 和 AppSecret

### 请求签名

所有 OpenAPI 请求需要进行签名验证...

## API 列表

| 接口 | 方法 | 描述 |
|------|------|------|
| /api/createJob | POST | 创建任务 |
| /api/runJob | POST | 触发任务 |
| /api/stopJob | POST | 停止任务 |
| /api/fetchJobLog | GET | 获取日志 |
