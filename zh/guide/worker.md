# 执行器（Worker）

执行器（Worker）是 PowerJob 中实际执行任务的组件，通常集成在业务应用中，负责接收 Server 下发的任务并执行。

## 概述

Worker 是 PowerJob 的执行节点，主要职责包括：

- **任务接收**：接收来自 Server 的任务调度请求
- **任务执行**：执行处理器（Processor）编写的业务逻辑
- **状态上报**：定期向 Server 上报健康状态和任务执行状态
- **日志上报**：将任务执行日志上报到 Server，支持在线查看
- **容器管理**：支持动态加载和执行容器化的处理器

## 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                         Worker 节点                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ WorkerActor │  │TaskTracker  │  │Processor    │              │
│  │             │  │Actor        │  │TrackerActor │              │
│  │ 容器管理     │  │ 任务调度     │  │ 状态跟踪     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ProcessorLoader                       │    │
│  │  内置处理器 │ Spring Bean │ 容器处理器                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ExecutorManager                       │    │
│  │  核心线程池 │ 轻量级任务执行器 │ 状态检查执行器           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    存储层 (H2)                            │    │
│  │  任务持久化 │ 中间结果存储                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────────┐
│                    PowerJob Server                               │
│  任务调度 │ 服务发现 │ 状态管理 │ 日志聚合                      │
└─────────────────────────────────────────────────────────────────┘
```

## 快速开始

### Maven 依赖

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```

### Gradle 依赖

```groovy
implementation 'tech.powerjob:powerjob-worker-spring-boot-starter:${powerjob.version}'
```

### 基础配置

在 `application.yml` 中添加最小配置：

```yaml
powerjob:
  worker:
    # 应用名称，需要在控制台提前注册
    app-name: my-application
    # Server 地址，支持多个地址用逗号分隔
    server-address: 127.0.0.1:7700
```

### 完整配置示例

```yaml
powerjob:
  worker:
    # 是否启用 Worker，默认为 true
    enabled: true
    # 应用名称（必填）
    app-name: my-application
    # Server 地址，多个地址用逗号分隔（必填）
    server-address: 127.0.0.1:7700,127.0.0.1:7701
    # 通信端口，默认随机
    port: 27777
    # 通信协议，可选 AKKA、HTTP
    protocol: AKKA
    # 存储策略，可选 DISK、MEMORY
    store-strategy: DISK
    # 执行器标签，可用于指定执行器运行
    tag: production
    # 最大轻量级任务数
    max-lightweight-task-num: 1024
    # 最大重量级任务数
    max-heavyweight-task-num: 64
    # 健康上报间隔（秒）
    health-report-interval: 10
    # 允许延迟连接 Server（开发环境使用）
    allow-lazy-connect-server: false
```

## 配置项详解

### 核心配置

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `enabled` | Boolean | 否 | `true` | 是否启用 Worker |
| `app-name` | String | 是 | - | 应用名称，需在控制台注册，最大长度 255 字符 |
| `server-address` | String | 是 | - | Server 地址，支持多 IP 或域名，逗号分隔 |
| `port` | Integer | 否 | 随机端口 | Worker 通信端口，负数或 0 表示随机端口 |

### 通信配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `protocol` | Protocol | `AKKA` | 通信协议，可选 `AKKA`、`HTTP`、`MU` |
| `akka-port` | Integer | `27777` | **已废弃**，请使用 `port` |

### 存储配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `store-strategy` | StoreStrategy | `DISK` | 任务存储策略，`DISK`(磁盘) 或 `MEMORY`(内存) |
| `max-result-length` | Integer | `8192` | 任务返回结果最大长度 |

### 性能配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `max-lightweight-task-num` | Integer | `1024` | 最大轻量级任务并发数 |
| `max-heavyweight-task-num` | Integer | `64` | 最大重量级任务并发数 |

### 其他配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `tag` | String | - | 执行器标签，可用于指定特定 Worker 执行 |
| `health-report-interval` | Integer | `10` | 健康上报间隔（秒） |
| `allow-lazy-connect-server` | Boolean | `false` | 允许延迟连接 Server（仅开发环境） |
| `max-appended-wf-context-length` | Integer | `8192` | 工作流上下文追加内容最大长度 |

## Worker 运行机制

### 启动流程

```
1. 加载配置
   ↓
2. 服务发现 & 校验 appName
   ↓
3. 解析本地绑定 IP 和外部暴露 IP
   ↓
4. 初始化线程池（ExecutorManager）
   ↓
5. 初始化处理器加载器（ProcessorLoader）
   ↓
6. 初始化 Actor 系统
   ↓
7. 启动远程通信引擎
   ↓
8. 初始化日志处理器
   ↓
9. 初始化任务持久化服务
   ↓
10. 启动定时任务（健康上报、日志上报）
    ↓
11. 启动完成
```

### 心跳保活机制

Worker 通过定时心跳向 Server 报告自身状态，默认每 10 秒上报一次。心跳信息包含：

- **系统指标**：CPU、内存、磁盘使用率
- **任务统计**：当前运行的轻量级和重量级任务数量
- **容器信息**：已加载的容器列表
- **过载状态**：是否超过最大任务数限制

```java
// 心跳上报核心逻辑（简化）
WorkerHeartbeat heartbeat = new WorkerHeartbeat();
heartbeat.setSystemMetrics(systemMetricsCollector.collect());
heartbeat.setWorkerAddress(workerAddress);
heartbeat.setAppName(appName);
heartbeat.setLightTaskTrackerNum(lightTaskTrackerNum);
heartbeat.setHeavyTaskTrackerNum(heavyTaskTrackerNum);
heartbeat.setOverload(isOverload());

TransportUtils.reportWorkerHeartbeat(heartbeat, serverAddress, transporter);
```

### 服务发现

Worker 通过服务发现机制与 Server 保持连接，支持以下特性：

1. **多 Server 支持**：配置多个 Server 地址，自动选择可用 Server
2. **故障转移**：当前 Server 不可用时自动切换到其他 Server
3. **定期检查**：每 10 秒检查一次 Server 可用性

```java
// 服务发现核心逻辑
private String discovery() {
    // 优先请求当前 Server
    String result = acquire(currentServerAddress);

    // 当前 Server 不可用时，尝试其他 Server
    if (StringUtils.isEmpty(result)) {
        for (String serverAddress : serverAddresses) {
            result = acquire(serverAddress);
            if (StringUtils.isNotEmpty(result)) {
                break;
            }
        }
    }

    return result;
}
```

### 任务接收和执行

Worker 通过 Actor 模型接收和处理任务：

```
Server 请求 → WorkerActor → TaskTrackerActor
                              ↓
                    轻量级任务 → LightTaskTracker
                    重量级任务 → HeavyTaskTracker
                              ↓
                          Processor
                              ↓
                          执行结果上报
```

### 日志上报

Worker 支持在线日志功能，执行日志会实时上报到 Server：

```java
// 在 Processor 中使用 OmsLogger
public class MyProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取 OmsLogger
        OmsLogger log = context.getOmsLogger();

        // 记录日志，会实时上报到 Server
        log.info("任务开始执行，参数：{}", context.getJobParams());
        log.debug("调试信息：{}", someDebugInfo);
        log.warn("警告信息：{}", someWarning);
        log.error("错误信息：{}", someError);

        return new ProcessResult(true, "执行成功");
    }
}
```

日志上报采用异步批量机制：

- **批量上报**：每 20 条日志批量上报一次
- **定时上报**：最多延迟 5 秒上报
- **队列缓冲**：本地队列最大缓存 10240 条日志

## 高可用配置

### 多 Server 配置

配置多个 Server 地址实现高可用：

```yaml
powerjob:
  worker:
    server-address: 192.168.1.10:7700,192.168.1.11:7700,192.168.1.12:7700
```

**工作机制**：
- Worker 启动时随机打乱 Server 地址顺序
- 优先使用当前连接的 Server
- Server 不可用时自动切换到其他 Server
- 每 10 秒检查一次 Server 可用性

### 故障转移

当 Worker 与 Server 失去连接时：

1. **短期故障**（< 30 秒）：继续尝试重连
2. **长期故障**（> 30 秒）：终止本地频繁执行的任务，避免重复执行

```java
// 连续失败超过 3 次，终止频繁任务
if (FAILED_COUNT++ > MAX_FAILED_COUNT) {
    List<Long> frequentInstanceIds = HeavyTaskTrackerManager.getAllFrequentTaskTrackerKeys();
    frequentInstanceIds.forEach(instanceId -> {
        HeavyTaskTracker taskTracker = HeavyTaskTrackerManager.removeTaskTracker(instanceId);
        taskTracker.destroy();
    });
}
```

### 水平扩展

增加 Worker 节点实现水平扩展：

1. **部署多个 Worker**：使用相同的 `app-name`
2. **配置不同端口**：避免端口冲突
3. **Server 自动调度**：Server 会将任务分配给可用 Worker

```yaml
# Worker 节点 1
powerjob:
  worker:
    app-name: my-application
    port: 27777
    server-address: server1:7700,server2:7700

# Worker 节点 2
powerjob:
  worker:
    app-name: my-application
    port: 27778
    server-address: server1:7700,server2:7700
```

## Worker Agent

PowerJob 提供了独立部署的 Worker Agent，适用于以下场景：

- 容器化部署
- 独立执行环境
- 资源隔离

### 启动方式

```bash
java -jar powerjob-worker-agent.jar \
  -a my-application \
  -s 127.0.0.1:7700 \
  -p 27777 \
  -o AKKA \
  -e DISK \
  -t production
```

### 参数说明

| 参数 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `-a, --app` | 应用名称 | 是 | - |
| `-s, --server` | Server 地址 | 是 | `localhost:7700` |
| `-p, --port` | 通信端口 | 否 | `27777` |
| `-o, --protocol` | 通信协议 (AKKA/HTTP) | 否 | `AKKA` |
| `-e, --persistence` | 存储策略 (DISK/MEMORY) | 否 | `DISK` |
| `-l, --length` | 返回结果最大长度 | 否 | `1024` |
| `-t, --tag` | 执行器标签 | 否 | - |

### 嵌入式 Worker vs Worker Agent

| 特性 | 嵌入式 Worker | Worker Agent |
|------|--------------|--------------|
| 部署方式 | 集成在业务应用中 | 独立进程 |
| 资源占用 | 共享业务资源 | 独立资源 |
| 隔离性 | 与业务同进程 | 完全隔离 |
| 适用场景 | 大多数场景 | 容器化、独立环境 |
| Spring 集成 | 原生支持 | 需容器模式 |

## 最佳实践

### 命名规范

- **应用名称**：建议使用项目名称或服务名称，如 `order-service`、`data-sync`
- **标签**：使用环境或机房标识，如 `production`、`center`、`edge`

```yaml
powerjob:
  worker:
    app-name: order-service
    tag: production
```

### 资源配置

根据任务类型合理配置：

```yaml
powerjob:
  worker:
    # 轻量级任务（API 调用、简单计算）
    max-lightweight-task-num: 1024

    # 重量级任务（数据处理、MapReduce）
    max-heavyweight-task-num: 64

    # 存储策略
    store-strategy: DISK  # 大量子任务使用 DISK
```

### 监控告警

建议监控以下指标：

- **健康状态**：Worker 是否正常上报心跳
- **任务执行**：成功率和执行耗时
- **资源使用**：CPU、内存、磁盘使用率
- **队列积压**：待处理任务数量

### 开发环境配置

开发环境可使用延迟连接：

```yaml
powerjob:
  worker:
    allow-lazy-connect-server: true
```

**注意**：生产环境严禁使用此配置，会导致任务丢失。

### 生产环境配置

生产环境推荐配置：

```yaml
powerjob:
  worker:
    # 多 Server 部署
    server-address: server1:7700,server2:7700,server3:7700

    # 固定端口便于监控
    port: 27777

    # 使用 HTTP 协议（更稳定）
    protocol: HTTP

    # 磁盘存储防止内存溢出
    store-strategy: DISK

    # 根据实际负载调整
    max-lightweight-task-num: 2048
    max-heavyweight-task-num: 128
```

## 常见问题

### Q: Worker 无法连接到 Server？

**可能原因**：
1. Server 地址配置错误
2. 网络不通或防火墙阻止
3. appName 未在控制台注册

**解决方法**：
1. 检查 `server-address` 配置是否正确
2. 测试网络连通性：`telnet server-ip 7700`
3. 在控制台注册应用

### Q: 任务执行日志看不到？

**可能原因**：
1. 未使用 `OmsLogger`
2. 日志上报失败
3. 日志量过大被丢弃

**解决方法**：
```java
// 使用 OmsLogger 而不是 Slf4j Logger
OmsLogger log = context.getOmsLogger();
log.info("这条日志会上报到 Server");
```

### Q: Worker 负载不均衡？

**解决方法**：
1. 确保所有 Worker 使用相同的 `app-name`
2. 检查 Server 调度策略配置
3. 考虑使用标签进行分组调度

### Q: 轻量级任务和重量级任务如何选择？

**任务类型判断**：
- **轻量级任务**：单机执行、非固定频率/固定延迟
- **重量级任务**：广播、MapReduce、固定频率、固定延迟

自动选择逻辑在 `TaskTrackerActor.isLightweightTask()` 中实现。

### Q: 如何实现 Worker 灰度发布？

使用标签机制：

```yaml
# 新版本 Worker
powerjob:
  worker:
    app-name: my-app
    tag: v2

# 旧版本 Worker
powerjob:
  worker:
    app-name: my-app
    tag: v1
```

在控制台指定标签调度任务。

### Q: store-strategy 如何选择？

- **MEMORY**：适合单机任务、少量子任务，性能更好
- **DISK**：适合 MapReduce 任务、大量子任务，防止内存溢出

```yaml
# 推荐：大多数场景使用 DISK
powerjob:
  worker:
    store-strategy: DISK
```

## 下一步

- [处理器开发](/zh/guide/processor) - 学习如何开发处理器
- [任务高级配置](/zh/guide/advanced-task) - 了解任务的高级特性
- [工作流](/zh/guide/workflow) - 使用工作流编排复杂任务
