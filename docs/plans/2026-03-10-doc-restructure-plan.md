# PowerJob 文档目录重组实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 PowerJob 文档从扁平的 guide/ 结构重组为功能导向的三层目录结构

**Architecture:** 创建 start/、core/、advanced/、integration/、api/、ops/ 六个目录，将现有文档按功能分类移动，并更新 VitePress 配置文件

**Tech Stack:** VitePress, Markdown

---

## 前置说明

### 当前文件对照表

**中文文档 (zh/guide/)**：
| 文件 | 内容 |
|------|------|
| `introduction.md` | 产品介绍 |
| `installation.md` | 安装部署 |
| `quick-start.md` | 5分钟上手 |
| `architecture.md` | 架构设计 |
| `task.md` | 任务配置 |
| `processor.md` | 处理器开发 |
| `execution-mode.md` | 执行模式 |
| `schedule-strategy.md` | 调度策略 |
| `workflow.md` | 工作流基础 |
| `workflow-design.md` | 工作流设计（需合并） |
| `advanced-task.md` | 高级任务 |
| `worker.md` | Worker 配置 |
| `spring-boot.md` | Spring Boot 集成 |
| `openapi.md` | OpenAPI（重复，删除） |
| `alert.md` | 告警配置 |
| `operation.md` | 运维操作 |

**英文文档 (en/guide/)**：
| 文件 | 状态 |
|------|------|
| `introduction.md` | ✅ 存在 |
| `installation.md` | ✅ 存在 |
| `quick-start.md` | ✅ 存在 |
| `architecture.md` | ✅ 存在 |
| `task.md` | ✅ 存在 |
| `worker.md` | ✅ 存在 |
| 其他文件 | ❌ 缺失（后续补充） |

---

## Task 1: 创建中文文档新目录结构

**Files:**
- Create: `zh/start/`
- Create: `zh/core/`
- Create: `zh/advanced/`
- Create: `zh/integration/`
- Create: `zh/ops/`

**Step 1: 创建新目录**

Run:
```bash
mkdir -p zh/start zh/core zh/advanced zh/integration zh/ops
```

Expected: 创建 5 个新目录

**Step 2: 验证目录创建成功**

Run:
```bash
ls -la zh/
```

Expected:
```
api  core  advanced  integration  ops  guide  index.md  start
```

---

## Task 2: 移动中文文档 - 快速开始目录

**Files:**
- Move: `zh/guide/introduction.md` → `zh/start/introduction.md`
- Move: `zh/guide/installation.md` → `zh/start/installation.md`
- Move: `zh/guide/quick-start.md` → `zh/start/quick-start.md`

**Step 1: 移动 introduction.md**

Run:
```bash
mv zh/guide/introduction.md zh/start/introduction.md
```

Expected: 文件移动成功

**Step 2: 移动 installation.md**

Run:
```bash
mv zh/guide/installation.md zh/start/installation.md
```

Expected: 文件移动成功

**Step 3: 移动 quick-start.md**

Run:
```bash
mv zh/guide/quick-start.md zh/start/quick-start.md
```

Expected: 文件移动成功

**Step 4: 验证移动结果**

Run:
```bash
ls zh/start/
```

Expected:
```
installation.md  introduction.md  quick-start.md
```

---

## Task 3: 移动中文文档 - 核心功能目录

**Files:**
- Move: `zh/guide/architecture.md` → `zh/core/architecture.md`
- Move: `zh/guide/task.md` → `zh/core/task.md`
- Move: `zh/guide/processor.md` → `zh/core/processor.md`
- Move: `zh/guide/execution-mode.md` → `zh/core/execution-mode.md`
- Move: `zh/guide/schedule-strategy.md` → `zh/core/schedule-strategy.md`

**Step 1: 移动所有核心功能文档**

Run:
```bash
mv zh/guide/architecture.md zh/core/architecture.md && \
mv zh/guide/task.md zh/core/task.md && \
mv zh/guide/processor.md zh/core/processor.md && \
mv zh/guide/execution-mode.md zh/core/execution-mode.md && \
mv zh/guide/schedule-strategy.md zh/core/schedule-strategy.md
```

Expected: 5 个文件移动成功

**Step 2: 验证移动结果**

Run:
```bash
ls zh/core/
```

Expected:
```
architecture.md  execution-mode.md  processor.md  schedule-strategy.md  task.md
```

---

## Task 4: 移动中文文档 - 进阶功能目录

**Files:**
- Move: `zh/guide/workflow.md` → `zh/advanced/workflow.md`
- Move: `zh/guide/workflow-design.md` → 临时位置，稍后合并
- Move: `zh/guide/advanced-task.md` → `zh/advanced/advanced-task.md`
- Move: `zh/guide/worker.md` → `zh/advanced/worker.md`

**Step 1: 移动进阶功能文档**

Run:
```bash
mv zh/guide/workflow.md zh/advanced/workflow.md && \
mv zh/guide/workflow-design.md zh/advanced/workflow-design.md && \
mv zh/guide/advanced-task.md zh/advanced/advanced-task.md && \
mv zh/guide/worker.md zh/advanced/worker.md
```

Expected: 4 个文件移动成功

**Step 2: 验证移动结果**

Run:
```bash
ls zh/advanced/
```

Expected:
```
advanced-task.md  workflow-design.md  workflow.md  worker.md
```

---

## Task 5: 移动中文文档 - 集成指南目录

**Files:**
- Move: `zh/guide/spring-boot.md` → `zh/integration/spring-boot.md`

**Step 1: 移动集成文档**

Run:
```bash
mv zh/guide/spring-boot.md zh/integration/spring-boot.md
```

Expected: 文件移动成功

**Step 2: 验证移动结果**

Run:
```bash
ls zh/integration/
```

Expected:
```
spring-boot.md
```

---

## Task 6: 移动中文文档 - 运维管理目录

**Files:**
- Move: `zh/guide/alert.md` → `zh/ops/alert.md`
- Move: `zh/guide/operation.md` → `zh/ops/operation.md`

**Step 1: 移动运维文档**

Run:
```bash
mv zh/guide/alert.md zh/ops/alert.md && \
mv zh/guide/operation.md zh/ops/operation.md
```

Expected: 2 个文件移动成功

**Step 2: 验证移动结果**

Run:
```bash
ls zh/ops/
```

Expected:
```
alert.md  operation.md
```

---

## Task 7: 清理中文文档旧文件

**Files:**
- Delete: `zh/guide/openapi.md` (重复文件)
- Delete: `zh/guide/` 目录

**Step 1: 删除重复的 openapi.md**

Run:
```bash
rm zh/guide/openapi.md
```

Expected: 文件删除成功

**Step 2: 删除空的 guide 目录**

Run:
```bash
rmdir zh/guide/
```

Expected: 目录删除成功

**Step 3: 验证最终目录结构**

Run:
```bash
ls -la zh/
```

Expected:
```
api  core  advanced  integration  ops  index.md  start
```

---

## Task 8: 更新中文文档内部链接

**Files:**
- Modify: `zh/start/quick-start.md` - 更新交叉引用链接
- Modify: `zh/start/introduction.md` - 更新交叉引用链接
- Modify: `zh/core/*.md` - 更新交叉引用链接
- Modify: `zh/advanced/*.md` - 更新交叉引用链接

**Step 1: 更新 quick-start.md 中的链接**

在 `zh/start/quick-start.md` 中，将：
- `[安装部署文档](/guide/installation)` → `[安装部署文档](/start/installation)`

**Step 2: 更新 introduction.md 中的链接**

在 `zh/start/introduction.md` 中，将：
- `[安装部署](/guide/installation)` → `[安装部署](/start/installation)`
- `[5分钟上手](/guide/quick-start)` → `[5分钟上手](/start/quick-start)`

**Step 3: 更新其他文档中的链接**

批量替换所有文档中的旧链接：
- `/guide/introduction` → `/start/introduction`
- `/guide/installation` → `/start/installation`
- `/guide/quick-start` → `/start/quick-start`
- `/guide/architecture` → `/core/architecture`
- `/guide/task` → `/core/task`
- `/guide/processor` → `/core/processor`
- `/guide/execution-mode` → `/core/execution-mode`
- `/guide/schedule-strategy` → `/core/schedule-strategy`
- `/guide/workflow` → `/advanced/workflow`
- `/guide/workflow-design` → `/advanced/workflow`
- `/guide/advanced-task` → `/advanced/advanced-task`
- `/guide/worker` → `/advanced/worker`
- `/guide/spring-boot` → `/integration/spring-boot`
- `/guide/alert` → `/ops/alert`
- `/guide/operation` → `/ops/operation`
- `/guide/openapi` → `/api/openapi`

---

## Task 9: 更新 VitePress 配置文件

**Files:**
- Modify: `.vitepress/config.ts`

**Step 1: 更新中文导航配置**

将：
```typescript
{ text: '文档', link: '/zh/guide/introduction' },
```
改为：
```typescript
{ text: '文档', link: '/zh/start/introduction' },
```

**Step 2: 更新中文侧边栏配置**

将完整的 sidebar 配置从 `/zh/guide/` 路径更新为新路径：

```typescript
sidebar: {
  '/zh/start/': [
    {
      text: '快速开始',
      items: [
        { text: '介绍', link: '/zh/start/introduction' },
        { text: '安装部署', link: '/zh/start/installation' },
        { text: '5分钟上手', link: '/zh/start/quick-start' }
      ]
    }
  ],
  '/zh/core/': [
    {
      text: '核心功能',
      items: [
        { text: '架构设计', link: '/zh/core/architecture' },
        { text: '任务配置', link: '/zh/core/task' },
        { text: '处理器开发', link: '/zh/core/processor' },
        { text: '执行模式', link: '/zh/core/execution-mode' },
        { text: '调度策略', link: '/zh/core/schedule-strategy' }
      ]
    }
  ],
  '/zh/advanced/': [
    {
      text: '进阶功能',
      items: [
        { text: '工作流', link: '/zh/advanced/workflow' },
        { text: '工作流编排', link: '/zh/advanced/workflow-design' },
        { text: '高级任务', link: '/zh/advanced/advanced-task' },
        { text: 'Worker 配置', link: '/zh/advanced/worker' }
      ]
    }
  ],
  '/zh/integration/': [
    {
      text: '集成指南',
      items: [
        { text: 'Spring Boot 集成', link: '/zh/integration/spring-boot' }
      ]
    }
  ],
  '/zh/ops/': [
    {
      text: '运维管理',
      items: [
        { text: '告警配置', link: '/zh/ops/alert' },
        { text: '运维操作', link: '/zh/ops/operation' }
      ]
    }
  ],
  '/zh/api/': [
    {
      text: 'API 参考',
      items: [
        { text: 'OpenAPI 文档', link: '/zh/api/openapi' }
      ]
    }
  ]
}
```

**Step 3: 更新英文导航配置**

将：
```typescript
{ text: 'Guide', link: '/en/guide/introduction' },
```
改为：
```typescript
{ text: 'Guide', link: '/en/start/introduction' },
```

**Step 4: 更新英文侧边栏配置**

将路径从 `/en/guide/` 更新为 `/en/start/` 等。

---

## Task 10: 创建英文文档新目录结构

**Files:**
- Create: `en/start/`
- Create: `en/core/`
- Create: `en/advanced/`
- Create: `en/integration/`
- Create: `en/ops/`

**Step 1: 创建新目录**

Run:
```bash
mkdir -p en/start en/core en/advanced en/integration en/ops
```

Expected: 创建 5 个新目录

---

## Task 11: 移动英文文档

**Files:**
- Move: `en/guide/introduction.md` → `en/start/introduction.md`
- Move: `en/guide/installation.md` → `en/start/installation.md`
- Move: `en/guide/quick-start.md` → `en/start/quick-start.md`
- Move: `en/guide/architecture.md` → `en/core/architecture.md`
- Move: `en/guide/task.md` → `en/core/task.md`
- Move: `en/guide/worker.md` → `en/advanced/worker.md`

**Step 1: 移动所有英文文档**

Run:
```bash
mv en/guide/introduction.md en/start/introduction.md && \
mv en/guide/installation.md en/start/installation.md && \
mv en/guide/quick-start.md en/start/quick-start.md && \
mv en/guide/architecture.md en/core/architecture.md && \
mv en/guide/task.md en/core/task.md && \
mv en/guide/worker.md en/advanced/worker.md
```

Expected: 6 个文件移动成功

**Step 2: 删除空的 guide 目录**

Run:
```bash
rmdir en/guide/
```

Expected: 目录删除成功

---

## Task 12: 验证构建

**Step 1: 运行开发服务器验证**

Run:
```bash
npm run docs:dev
```

Expected: 服务启动成功，无 404 错误

**Step 2: 运行构建验证**

Run:
```bash
npm run docs:build
```

Expected: 构建成功，无死链接错误

---

## Task 13: 提交更改

**Step 1: 查看更改**

Run:
```bash
git status
```

**Step 2: 暂存所有更改**

Run:
```bash
git add -A
```

**Step 3: 提交更改**

Run:
```bash
git commit -m "$(cat <<'EOF'
refactor: 重组文档目录结构

- 将扁平的 guide/ 目录重组为功能导向的三层结构
- 新增 start/、core/、advanced/、integration/、ops/ 目录
- 更新 VitePress 配置中的导航和侧边栏
- 中英文文档保持一致的目录结构

目录结构:
- start/: 快速开始（介绍、安装、上手）
- core/: 核心功能（架构、任务、处理器、执行模式、调度策略）
- advanced/: 进阶功能（工作流、高级任务、Worker）
- integration/: 集成指南（Spring Boot）
- api/: API 参考（OpenAPI）
- ops/: 运维管理（告警、运维操作）
EOF
)"
```

---

## 后续任务（可选）

### Task 14: 合并 workflow 文档

将 `zh/advanced/workflow-design.md` 的内容合并到 `zh/advanced/workflow.md` 中，然后删除 `workflow-design.md`。

### Task 15: 补充英文文档

为英文文档补充缺失的文件：
- `en/core/processor.md`
- `en/core/execution-mode.md`
- `en/core/schedule-strategy.md`
- `en/advanced/workflow.md`
- `en/advanced/advanced-task.md`
- `en/integration/spring-boot.md`
- `en/ops/alert.md`
- `en/ops/operation.md`
