# Spring Boot 集成

## 概述

通过 Spring Boot Starter 可以快速集成 PowerJob Worker，实现任务的自动注册和执行。

## 快速开始

### 1. 添加依赖

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```
### 2. 配置文件
```yaml
powerjob:
  worker:
    enabled: true
    app-name: my-application
    server-address: 127.0.0.1:7700
    port: 27777
    protocol: AKKA
```

### 3. 启动应用
```bash
mvn spring-boot:run
```
应用启动后，Worker 会自动连接到 Server 并注册。
## 完整配置项
| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `enabled` | Boolean | `true` | 是否启用 Worker |
| `app-name` | String | - | **应用名称（必填，最长 255 字符）** |
| `server-address` | String | - | **Server 地址（必填，支持集群）** |
| `port` | Integer | - | Worker 端口（为空时随机分配） |
| `akka-port` | Integer | `27777` | Akka 端口（已废弃，建议使用 port） |
| `protocol` | String | `AKKA` | 通信协议：AKKA、HTTP、MU |
| `store-strategy` | String | `DISK` | 本地存储策略：DISK、MEMORY |
| `max-result-length` | Integer | `8192` | 最大结果长度（超长截断） |
| `allow-lazy-connect-server` | Boolean | `false` | 是否允许延迟连接（测试模式） |
| `max-appended-wf-context-length` | Integer | `8192` | 工作流上下文最大长度 |
| `tag` | String | - | Worker 标签 |
| `max-lightweight-task-num` | Integer | `1024` | 轻量任务最大数量 |
| `max-heavyweight-task-num` | Integer | `64` | 重量任务最大数量 |
| `health-report-interval` | Integer | `10` | 健康报告间隔（秒） |
## 通信协议
| 协议 | 说明 | 特点 |
|-----|------|------|
| AKKA | 默认 | 高性能、适合生产环境 |
| HTTP | 通用 | 穿透性好、适合受限网络 |
| MU | 自研 | 连接复用、适合容器环境 |
### 协议选择建议
```yaml
# 生产环境（推荐）
protocol: AKKA

# 受限网络环境（如容器）
protocol: HTTP

# 内网环境
protocol: MU
```
## 处理器开发
### 方式一：类级别处理器
```java
@Component
public class MyProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        String jobParams = context.getJobParams();
        // 业务逻辑
        return new ProcessResult(true, "执行成功");
    }
}
```
**控制台配置处理器信息：**
```
com.example.MyProcessor
```
### 方式二: 方法级别处理器
```java
@Component
public class MethodProcessorDemo {

    @PowerJobHandler(name = "greetingHandler")
    public String greeting(TaskContext context) {
        return "Hello, " + context.getJobParams();
    }

    @PowerJobHandler(name = "calculateHandler")
    public Integer calculate(TaskContext context) {
        return 42;
    }
}
```
**控制台配置处理器信息:**
```
# 全限定类名#方法名
com.example.MethodProcessorDemo#greetingHandler

# SpringBean名称#方法名
methodProcessorDemo#calculateHandler
```
## TaskContext 使用
```java
@Component
public class TaskContextDemo implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取参数
        String jobParams = context.getJobParams();
        String instanceParams = context.getInstanceParams();

        // 获取任务信息
        Long jobId = context.getJobId();
        Long instanceId = context.getInstanceId();
        String taskId = context.getTaskId();

        // 获取重试信息
        int retryTimes = context.getCurrentRetryTimes();
        int maxRetry = context.getMaxRetryTimes();

        // 获取日志记录器
        OmsLogger logger = context.getOmsLogger();
        logger.info("任务开始执行");

        // 获取工作流上下文
        WorkflowContext wfContext = context.getWorkflowContext();
        if (wfContext != null) {
            Map<String, String> wfData = wfContext.fetchWorkflowContext();
            wfContext.appendData2WfContext("key", "value");
        }

        return new ProcessResult(true, "success");
    }
}
```
### TaskContext 属性
| 属性 | 类型 | 说明 |
|-----|------|------|
| jobId | Long | 任务 ID |
| instanceId | Long | 任务实例 ID |
| taskId | String | 任务 ID（字符串） |
| taskName | String | 任务名称 |
| jobParams | String | 控制台配置的静态参数 |
| instanceParams | String | 运行时参数（API 或工作流传入） |
| subTask | Object | 子任务对象（Map/MapReduce 模式） |
| maxRetryTimes | int | 最大重试次数 |
| currentRetryTimes | int | 当前重试次数 |
| omsLogger | OmsLogger | 在线日志记录器 |
| workflowContext | WorkflowContext | 工作流上下文 |
## 多环境配置
```yaml
# 开发环境
powerjob:
  worker:
    app-name: my-app-dev
    server-address: localhost:7700
    allow-lazy-connect-server: true
    tag: dev

# 测试环境
powerjob:
  worker:
    app-name: my-app-test
    server-address: test-server:7700
    tag: test
# 生产环境
powerjob:
  worker:
    app-name: my-app-prod
    server-address: prod-server1:7700,prod-server2:7700
    port: 27777
    protocol: AKKA
    store-strategy: DISK
    max-lightweight-task-num: 2048
    max-heavyweight-task-num: 128
    tag: prod
```
## 高级配置
### 集群配置
```yaml
powerjob:
  worker:
    server-address: 192.168.1.10:7700,192.168.1.11:7700,192.168.1.12:7700
```
### 性能调优
```yaml
powerjob:
  worker:
    max-lightweight-task-num: 2048  # 增加轻量任务并发
    max-heavyweight-task-num: 128   # 增加重型任务并发
    health-report-interval: 5      # 减少健康报告间隔
```
### 测试模式
```yaml
powerjob:
  worker:
    allow-lazy-connect-server: true  # 允许 Server 未启动时也能运行
```
## 最佳实践
### 1. 緻加健康检查
```java
@Component
public class HealthCheckProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 检查必要条件
        if (!checkPreconditions()) {
            return new ProcessResult(false, "前置条件不满足");
        }

        return new ProcessResult(true, "success");
    }
}
```
### 2. 合理使用日志
```java
@Override
public ProcessResult process(TaskContext context) throws Exception {
    OmsLogger logger = context.getOmsLogger();

    logger.info("任务开始");
    // ... 业务逻辑
    logger.info("关键步骤完成");
    // ... 更多业务逻辑
    logger.info("任务完成");

    return new ProcessResult(true, "success");
}
```
### 3. 异常处理
```java
@Override
public ProcessResult process(TaskContext context) throws Exception {
    try {
        doRiskyOperation();
        return new ProcessResult(true, "success");
    } catch (BusinessException e) {
        // 业务异常，返回失败
        return new ProcessResult(false, e.getMessage());
    } catch (Exception e) {
        // 系统异常，记录日志后返回失败
        context.getOmsLogger().error("系统异常", e);
        return new ProcessResult(false, "系统异常");
    }
}
```
## 下一步
- [处理器开发](/zh/core/processor) - 学习各种处理器接口
- [执行模式](/zh/core/execution-mode) - 了解不同的执行模式
