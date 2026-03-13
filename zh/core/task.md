# 任务

## 概述

任务是 PowerJob 中最基本的调度单位，包含任务配置、执行逻辑和调度策略。每个任务由以下核心部分组成：

- **任务配置**：定义任务的名称、描述、调度策略、执行方式等
- **处理器**：定义任务的执行逻辑，通过实现 Processor 接口完成
- **调度策略**：控制任务的触发时机，如 CRON 表达式、固定频率等
- **运行时配置**：控制任务的执行行为，如超时时间、重试次数、并发度等

## 任务属性

### 基础配置

| 属性 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `jobName` | 任务名称，建议使用有意义的命名 | 是 | - |
| `jobDescription` | 任务描述 | 否 | - |
| `appId` | 所属应用ID | 是 | - |
| `jobParams` | 任务静态参数，创建任务时指定的参数 | 否 | - |

**任务命名建议**：
- 使用业务模块+功能名称的组合，如 `order_sync_orderStatus`
- 避免使用中文和特殊字符
- 保持命名简洁且具有描述性

### 调度配置

#### 时间表达式类型 (timeExpressionType)

PowerJob 支持多种调度策略：

| 类型 | 值 | 说明 | 适用场景 |
|------|-----|------|----------|
| API | 1 | 通过 API 触发 | 需要手动触发的任务 |
| CRON | 2 | CRON 表达式 | 复杂定时规则 |
| FIXED_RATE | 3 | 固定频率 | 按固定间隔执行 |
| FIXED_DELAY | 4 | 固定延迟 | 上次执行完成后等待固定时间 |
| WORKFLOW | 5 | 工作流节点 | 工作流中的任务 |
| DAILY_TIME_INTERVAL | 11 | 每日时间间隔 | 每天特定时间段内执行 |

**CRON 表达式示例**：
```
0 0 2 * * ?     # 每天凌晨 2:00 执行
0 */5 * * * ?   # 每 5 分钟执行一次
0 0 12 * * MON-FRI  # 工作日中午 12:00 执行
```

**固定频率示例**：
- `1000`：每 1000 毫秒（1秒）执行一次
- `60000`：每 60000 毫秒（1分钟）执行一次

**固定延迟示例**：
- `5000`：上次任务执行完成后，等待 5 秒再执行下一次

### 执行配置

| 属性 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `executeType` | 执行类型 | 是 | - |
| `processorType` | 处理器类型 | 是 | BUILT_IN |
| `processorInfo` | 处理器名称（Spring Bean Name 或全类名） | 是 | - |

#### 执行类型 (executeType)

| 类型 | 值 | 说明 | 接口 |
|------|-----|------|------|
| 单机执行 (STANDALONE) | 1 | 任务只在一台机器上执行 | `BasicProcessor` |
| 广播执行 (BROADCAST) | 2 | 所有机器同时执行 | `BroadcastProcessor` |
| MapReduce 执行 (MAP_REDUCE) | 3 | 拆分任务并汇总结果 | `MapReduceProcessor` |
| Map 执行 (MAP) | 4 | 拆分任务并行执行 | `MapProcessor` |

#### 处理器类型 (processorType)

| 类型 | 值 | 说明 |
|------|-----|------|
| 内建处理器 (BUILT_IN) | 1 | 推荐，支持 Java 处理器和 Spring 方法处理器 |
| 外部处理器 (EXTERNAL) | 4 | 动态加载外部 Jar 包 |
| Shell 脚本 (SHELL) | 2 | 已废弃 |
| Python 脚本 (PYTHON) | 3 | 已废弃 |

### 运行时配置

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `maxInstanceNum` | 最大同时运行实例数，0 表示不限制 | 0 |
| `concurrency` | 单机并发度，同时执行的最大线程数 | 5 |
| `instanceTimeLimit` | 任务整体超时时间（毫秒），0 表示不限制 | 0 |
| `instanceRetryNum` | 实例级重试次数 | 0 |
| `taskRetryNum` | 任务级重试次数（仅 Map/MapReduce） | 0 |

### 资源配置

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `minCpuCores` | 最低 CPU 核心数，0 表示不限制 | 0 |
| `minMemorySpace` | 最低内存空间（GB），0 表示不限制 | 0 |
| `minDiskSpace` | 最低磁盘空间（GB），0 表示不限制 | 0 |

### 集群配置

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `designatedWorkers` | 指定运行的机器地址，逗号分隔 | 空（不限） |
| `maxWorkerCount` | 最大执行机器数量，0 表示不限制 | 0 |
| `dispatchStrategy` | 派发策略 | HEALTH_FIRST |

#### 派发策略 (dispatchStrategy)

| 策略 | 值 | 说明 |
|------|-----|------|
| 健康度优先 (HEALTH_FIRST) | 1 | 优先选择健康的机器执行 |
| 随机 (RANDOM) | 2 | 随机选择机器执行 |
| 指定执行 (SPECIFY) | 11 | 仅在指定的机器上执行 |

### 高级配置

#### 任务生命周期 (lifecycle)

```json
{
  "start": 1234567890000,
  "end": 1234567899999
}
```

用于控制任务的有效期，仅在指定时间范围内才会被调度。

#### 告警配置 (alarmConfig)

```json
{
  "alertThreshold": 5,
  "statisticWindowLen": 60,
  "silenceWindowLen": 3600
}
```

- `alertThreshold`：触发告警的失败次数阈值
- `statisticWindowLen`：统计窗口长度（秒）
- `silenceWindowLen`：沉默窗口长度（秒）

#### 日志配置 (logConfig)

```json
{
  "type": 1,
  "level": 2,
  "loggerName": "com.example.JobLogger"
}
```

- `type`：日志类型（在线/本地/标准输出）
- `level`：日志级别（DEBUG/INFO/WARN/ERROR/OFF）
- `loggerName`：自定义 Logger 名称

#### 高级运行时配置 (advancedRuntimeConfig)

```json
{
  "taskTrackerBehavior": 1,
  "instanceLimitStrategy": 0
}
```

- `taskTrackerBehavior`：TaskTracker 行为（1=普通，11=划水）
- `instanceLimitStrategy`：实例超限策略（0=直接失败，1=排队等待）

## 执行类型详解

### 单机执行 (STANDALONE)

最基础的执行类型，任务只在一台机器上执行一次。

**适用场景**：
- 数据同步任务
- 定时报表生成
- 单机即可完成的业务逻辑

**示例代码**：

```java
@Component("singleJobProcessor")
public class SingleJobProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取任务参数
        String jobParams = context.getJobParams();
        String instanceParams = context.getInstanceParams();

        // 优先使用实例参数
        String params = StringUtils.isBlank(instanceParams) ? jobParams : instanceParams;

        // 使用在线日志记录
        OmsLogger logger = context.getOmsLogger();
        logger.info("开始执行单机任务，参数：{}", params);

        // 业务逻辑
        doBusiness();

        return new ProcessResult(true, "执行成功");
    }
}
```

### 广播执行 (BROADCAST)

任务会在所有在线的 Worker 机器上同时执行。

**适用场景**：
- 缓存清理
- 配置更新
- 需要在所有节点执行的操作

**生命周期方法**：
- `preProcess`：在所有节点执行前调用，只在一台机器执行一次
- `process`：在所有节点执行
- `postProcess`：在所有节点执行完成后调用，只在一台机器执行一次

**示例代码**：

```java
@Component("broadcastJobProcessor")
public class BroadcastJobProcessor implements BroadcastProcessor {

    @Override
    public ProcessResult preProcess(TaskContext context) throws Exception {
        context.getOmsLogger().info("广播任务前置处理");
        // 准备工作，如下载配置文件
        return new ProcessResult(true);
    }

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        String localIp = NetUtils.getLocalHost();
        context.getOmsLogger().info("在节点 {} 上执行广播任务", localIp);

        // 清理本地缓存
        clearLocalCache();

        return new ProcessResult(true);
    }

    @Override
    public ProcessResult postProcess(TaskContext context, List<TaskResult> taskResults) throws Exception {
        // 统计执行结果
        long success = taskResults.stream().filter(TaskResult::isSuccess).count();
        long failed = taskResults.size() - success;

        context.getOmsLogger().info("广播任务完成，成功：{}，失败：{}", success, failed);
        return new ProcessResult(true);
    }
}
```

### Map 执行 (MAP)

允许将大任务拆分为多个子任务并行执行，提高处理效率。

**适用场景**：
- 大批量数据处理
- 文件批量处理
- 可并行化的计算任务

**示例代码**：

```java
@Component("mapJobProcessor")
public class MapJobProcessor implements MapProcessor {

    private static final int BATCH_SIZE = 100;

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        OmsLogger logger = context.getOmsLogger();

        if (isRootTask()) {
            // 根任务：拆分子任务
            logger.info("开始拆分子任务");

            // 模拟获取待处理数据
            List<DataItem> items = fetchData();

            // 分批派发
            List<List<DataItem>> batches = Lists.partition(items, BATCH_SIZE);
            for (int i = 0; i < batches.size(); i++) {
                SubTask subTask = new SubTask(i, batches.get(i));
                map(Lists.newArrayList(subTask), "PROCESS_BATCH");
            }

            return new ProcessResult(true, "MAP 成功，共拆分 " + batches.size() + " 个子任务");
        } else {
            // 子任务：处理数据
            SubTask subTask = (SubTask) context.getSubTask();
            logger.info("处理批次 {}，数据量：{}", subTask.getBatchId(), subTask.getItems().size());

            for (DataItem item : subTask.getItems()) {
                processItem(item);
            }

            return new ProcessResult(true, "批次 " + subTask.getBatchId() + " 处理完成");
        }
    }

    @Data
    public static class SubTask implements Serializable {
        private Integer batchId;
        private List<DataItem> items;
    }
}
```

### MapReduce 执行 (MAP_REDUCE)

在 Map 执行的基础上，增加了结果汇总（Reduce）的功能。

**适用场景**：
- 需要汇总结果的批量处理
- 分布式计算
- 数据聚合分析

**示例代码**：

```java
@Component("mapReduceJobProcessor")
public class MapReduceJobProcessor implements MapReduceProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        OmsLogger logger = context.getOmsLogger();

        if (isRootTask()) {
            // Map 阶段：拆分子任务
            List<Long> userIds = fetchUserIds();
            List<SubTask> subTasks = Lists.newArrayList();

            for (Long userId : userIds) {
                subTasks.add(new SubTask(userId));
            }

            map(subTasks, "CALCULATE_USER_SCORE");
            return new ProcessResult(true);
        } else {
            // 处理子任务
            SubTask subTask = (SubTask) context.getSubTask();
            double score = calculateUserScore(subTask.getUserId());
            return new ProcessResult(true, String.valueOf(score));
        }
    }

    @Override
    public ProcessResult reduce(TaskContext context, List<TaskResult> taskResults) {
        OmsLogger logger = context.getOmsLogger();

        // Reduce 阶段：汇总结果
        double totalScore = 0;
        int successCount = 0;

        for (TaskResult result : taskResults) {
            if (result.isSuccess()) {
                totalScore += Double.parseDouble(result.getResult());
                successCount++;
            }
        }

        double avgScore = totalScore / successCount;
        logger.info("计算完成，总分数：{}，平均分：{}", totalScore, avgScore);

        return new ProcessResult(true, "平均分：" + avgScore);
    }

    @Data
    @AllArgsConstructor
    public static class SubTask implements Serializable {
        private Long userId;
    }
}
```

## 任务生命周期

任务从创建到执行完成经历以下阶段：

```
创建 → 调度 → 派发 → 执行 → 完成
  ↓      ↓      ↓      ↓      ↓
配置  触发  分配  运行  结果
```

### 1. 创建阶段

在控制台或通过 API 创建任务配置，包括：
- 基础信息（名称、描述）
- 调度策略（时间表达式）
- 执行配置（处理器、执行类型）
- 运行时配置（超时、重试等）

### 2. 调度阶段

Server 根据时间表达式计算下次触发时间：
- CRON：解析表达式计算触发时间
- 固定频率：按固定间隔触发
- API：手动触发时立即调度

### 3. 派发阶段

Server 选择合适的 Worker 派发任务：
- 根据派发策略选择 Worker
- 检查资源配置（CPU、内存、磁盘）
- 检查最大实例数限制

### 4. 执行阶段

Worker 接收任务并执行：
- 加载对应的 Processor
- 创建 TaskContext
- 调用 process 方法
- 处理重试逻辑

### 5. 完成阶段

任务执行完成后：
- 上报执行结果
- 更新实例状态
- 触发告警（如配置）
- 计算下次触发时间

## 任务参数

### 参数类型

PowerJob 支持两种参数：

#### 1. 静态参数 (jobParams)

在创建任务时配置的固定参数，存储在任务配置中。

```java
String jobParams = context.getJobParams();
```

#### 2. 实例参数 (instanceParams)

运行任务实例时动态传入的参数：
- 通过控制台手动运行时输入
- 通过 OpenAPI 触发时传入
- 工作流节点从前置节点传递

```java
String instanceParams = context.getInstanceParams();
```

### 参数使用最佳实践

```java
@Override
public ProcessResult process(TaskContext context) throws Exception {
    // 优先使用实例参数，实现参数覆盖
    String finalParams = StringUtils.isBlank(context.getInstanceParams())
        ? context.getJobParams()
        : context.getInstanceParams();

    // 解析 JSON 参数
    JSONObject params = JSONObject.parseObject(finalParams);
    String param1 = params.getString("param1");
    Integer param2 = params.getIntValue("param2");

    // 使用参数执行业务逻辑
    // ...

    return new ProcessResult(true);
}
```

### 参数示例

控制台配置 jobParams：
```json
{
  "batchSize": 100,
  "timeout": 60000,
  "retryTimes": 3
}
```

运行时传入 instanceParams：
```json
{
  "batchSize": 200,
  "date": "2024-01-01"
}
```

实际生效时，instanceParams 中的 batchSize 会覆盖 jobParams 中的值。

## 任务状态

任务实例有以下状态：

| 状态 | 说明 |
|------|------|
| WAITING_DISPATCH (1) | 等待派发 |
| WAITING_WORKER_RECEIVE (2) | 等待 Worker 接收 |
| RUNNING (3) | 运行中 |
| FAILED (4) | 失败 |
| SUCCEED (5) | 成功 |
| CANCELED (9) | 已取消 |
| STOPPED (10) | 手动停止 |

## 最佳实践

### 1. 任务命名规范

```
{业务模块}_{功能名称}_{操作类型}

示例：
order_sync_orderStatus    # 订单同步订单状态
report_generate_daily      # 报表生成日报
cache_clear_all           # 缓存清理
```

### 2. 参数设计建议

- 使用 JSON 格式传递参数，便于扩展
- 区分静态参数和实例参数
- 实例参数用于动态覆盖静态参数
- 提供合理的默认值

### 3. 错误处理

```java
@Override
public ProcessResult process(TaskContext context) throws Exception {
    try {
        // 业务逻辑
        doBusiness();
        return new ProcessResult(true, "执行成功");
    } catch (BusinessException e) {
        // 业务异常，记录日志但标记失败
        context.getOmsLogger().error("业务处理失败", e);
        return new ProcessResult(false, "业务失败：" + e.getMessage());
    } catch (Exception e) {
        // 系统异常，标记失败以触发重试
        context.getOmsLogger().error("系统异常", e);
        throw e; // 抛出异常触发重试
    }
}
```

### 4. 日志记录

```java
@Override
public ProcessResult process(TaskContext context) throws Exception {
    OmsLogger logger = context.getOmsLogger();

    logger.info("任务开始执行");
    logger.debug("调试信息：{}", context.getJobParams());
    logger.warn("警告信息：处理耗时较长");
    logger.error("错误信息", exception);

    return new ProcessResult(true);
}
```

### 5. 超时配置

- 短任务：不设置超时或设置较大值
- 长任务：根据实际执行时间设置合理超时
- 注意超时会中断任务执行

### 6. 重试策略

- 实例级重试：整个任务失败时重试
- 任务级重试：Map/MapReduce 子任务失败时重试
- 建议根据业务特性设置合理的重试次数

### 7. 并发控制

- 单机并发度：控制单个 Worker 的并发线程数
- 最大实例数：控制同时运行的任务实例总数
- 根据服务器资源合理配置

## 常见问题

### Q1: 任务执行失败如何排查？

1. 查看任务实例详情，获取失败信息
2. 查看在线日志，获取详细错误堆栈
3. 检查 Worker 日志，确认是否 Worker 端问题
4. 验证处理器类是否正确加载

### Q2: Map 任务子任务全部失败？

检查以下几点：
- 子任务对象是否有无参构造方法
- 子任务对象是否实现 Serializable
- 子任务名称是否使用了保留名称（ROOT_TASK、LAST_TASK）
- 网络连接是否正常

### Q3: CRON 表达式不生效？

1. 确认 CRON 表达式格式正确
2. 检查任务是否启用
3. 查看下次触发时间是否计算正确
4. 确认服务器时区设置

### Q4: 如何停止正在运行的任务？

通过控制台或 API 停止任务实例：
- 控制台：任务管理 → 任务实例 → 停止
- API：调用停止实例接口

### Q5: 广播任务在部分节点失败怎么办？

- 检查失败节点的日志
- 确认节点资源配置是否满足要求
- 检查节点网络连接
- 在 postProcess 中处理部分失败的情况

### Q6: 实例参数和任务参数的区别？

- 任务参数（jobParams）：创建任务时配置，所有实例共享
- 实例参数（instanceParams）：运行时传入，每个实例独立
- 实例参数会覆盖任务参数

### Q7: 如何实现任务间依赖？

使用工作流功能：
1. 创建多个任务
2. 创建工作流，将任务按依赖关系连接
3. 通过工作流实例触发执行

## 下一步

- [执行器](/advanced/worker) - 了解执行器的配置和使用
- [处理器开发](/core/processor) - 学习如何开发自定义处理器
- [工作流](/advanced/workflow) - 了解工作流的使用
