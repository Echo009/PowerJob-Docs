# 任务高级配置

## 概述

任务高级配置是 PowerJob 提供的细粒度任务控制功能，允许用户对任务的生命周期、告警策略、日志行为、运行时特性等进行深度定制。通过合理使用高级配置，可以实现：

- **精准的生命周期管理**：控制任务的有效执行时间范围
- **智能告警机制**：根据失败频率自动触发告警并防止告警风暴
- **灵活的日志策略**：根据需求选择日志存储方式和级别
- **稳定的运行保障**：通过超限策略确保任务稳定运行
- **精确的资源调度**：指定执行机器和控制集群规模

## 任务生命周期配置

### 配置说明

生命周期配置（`LifeCycle`）用于控制任务的有效期，仅在指定时间范围内才会被调度执行。

### 配置结构

```json
{
  "start": 1234567890000,
  "end": 1234567899999
}
```

### 字段说明

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| `start` | Long | 任务生效起始时间（毫秒时间戳） | 否 |
| `end` | Long | 任务失效截止时间（毫秒时间戳） | 否 |

### 使用场景

- **促销活动任务**：活动期间生效，活动结束后自动停止
- **临时数据迁移**：指定时间窗口内执行迁移任务
- **测试任务**：仅在测试时间段内有效

### 配置示例

#### 控制台配置

在任务的"高级配置"区域，填写生命周期 JSON：

```json
{
  "start": 1704067200000,
  "end": 1704153600000
}
```

#### 代码配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 设置基础信息
request.setJobName("promo_task");
request.setProcessorInfo("promoProcessor");

// 配置生命周期
LifeCycle lifecycle = new LifeCycle();
lifecycle.setStart(1704067200000L);  // 2024-01-01 00:00:00
lifecycle.setEnd(1704153600000L);    // 2024-01-02 00:00:00
request.setLifeCycle(lifecycle);
```

### 注意事项

1. 时间戳使用毫秒级 Unix 时间戳
2. 只设置 `start` 时，任务从该时间点开始生效
3. 只设置 `end` 时，任务在该时间点后失效
4. 两个都不设置时，任务永久有效
5. 当前时间不在生命周期内时，任务不会被调度

## 告警配置

### 配置说明

告警配置（`AlarmConfig`）用于控制任务失败时的告警行为，支持基于统计窗口的智能告警，防止告警风暴。

### 配置结构

```json
{
  "alertThreshold": 5,
  "statisticWindowLen": 60,
  "silenceWindowLen": 3600
}
```

### 字段说明

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `alertThreshold` | Integer | 触发告警的失败次数阈值 | 5 |
| `statisticWindowLen` | Integer | 统计窗口长度（秒） | 60 |
| `silenceWindowLen` | Integer | 沉默窗口长度（秒），告警后不再重复告警的时间 | 3600 |

### 告警机制

```
统计窗口 (statisticWindowLen)
    │
    ├─ 失败次数 >= alertThreshold → 触发告警
    │
    └─ 沉默窗口 (silenceWindowLen) → 不再告警
```

### 使用场景

- **核心业务任务**：低阈值、短统计窗口，快速发现问题
- **批量处理任务**：高阈值、长统计窗口，减少误报
- **不稳定任务**：长沉默窗口，避免告警轰炸

### 配置示例

#### 核心任务配置（快速告警）

```json
{
  "alertThreshold": 1,
  "statisticWindowLen": 60,
  "silenceWindowLen": 1800
}
```

失败 1 次即告警，告警后 30 分钟内不再重复告警。

#### 批量任务配置（减少误报）

```json
{
  "alertThreshold": 10,
  "statisticWindowLen": 300,
  "silenceWindowLen": 7200
}
```

5 分钟内失败 10 次才告警，告警后 2 小时内不再重复告警。

#### 代码配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 配置告警
AlarmConfig alarmConfig = new AlarmConfig();
alarmConfig.setAlertThreshold(5);
alarmConfig.setStatisticWindowLen(60);
alarmConfig.setSilenceWindowLen(3600);
request.setAlarmConfig(alarmConfig);

// 配置通知用户
request.setNotifyUserIds(Arrays.asList(1L, 2L, 3L));
```

### 最佳实践

1. **根据任务重要性调整阈值**
   - 核心任务：1-3 次
   - 重要任务：3-5 次
   - 一般任务：5-10 次

2. **合理设置统计窗口**
   - 高频任务：60-300 秒
   - 低频任务：300-1800 秒

3. **设置足够的沉默窗口**
   - 避免告警轰炸
   - 建议至少 30 分钟

4. **配合通知用户使用**
   - 确保告警能被及时接收

## 日志配置

### 配置说明

日志配置（`LogConfig`）用于控制任务执行日志的记录方式和详细程度。

### 配置结构

```json
{
  "type": 1,
  "level": 2,
  "loggerName": "com.example.JobLogger"
}
```

### 字段说明

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `type` | Integer | 日志类型 | 1 (在线) |
| `level` | Integer | 日志级别 | 2 (INFO) |
| `loggerName` | String | 自定义 Logger 名称 | 空 |

### 日志类型 (LogType)

| 类型 | 值 | 说明 |
|------|-----|------|
| 在线日志 (ONLINE) | 1 | 日志上报到 Server，控制台可查看 |
| 本地日志 (LOCAL) | 2 | 日志记录到本地文件 |
| 标准输出 (STDOUT) | 3 | 日志输出到标准输出 |
| 在线+本地 (LOCAL_AND_ONLINE) | 4 | 同时记录在线和本地 |

### 日志级别 (LogLevel)

| 级别 | 值 | 说明 |
|------|-----|------|
| DEBUG | 1 | 调试信息 |
| INFO | 2 | 一般信息 |
| WARN | 3 | 警告信息 |
| ERROR | 4 | 错误信息 |
| OFF | 99 | 关闭日志 |

### 使用场景

- **在线日志**：需要实时查看日志、调试任务
- **本地日志**：日志量大、需要长期存储
- **标准输出**：容器化部署、日志采集场景

### 配置示例

#### 在线日志（默认配置）

```json
{
  "type": 1,
  "level": 2
}
```

#### 本地+在线日志（推荐生产环境）

```json
{
  "type": 4,
  "level": 2
}
```

#### 调试模式

```json
{
  "type": 1,
  "level": 1
}
```

#### 自定义 Logger

```json
{
  "type": 4,
  "level": 2,
  "loggerName": "com.mycompany.jobs.CriticalJobLogger"
}
```

#### 代码配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 配置日志
LogConfig logConfig = new LogConfig();
logConfig.setType(LogType.ONLINE.getV());
logConfig.setLevel(LogLevel.INFO.getV());
logConfig.setLoggerName("com.example.JobLogger");
request.setLogConfig(logConfig);
```

### 日志使用示例

```java
@Component
public class MyJobProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取 OmsLogger
        OmsLogger logger = context.getOmsLogger();

        // 不同级别的日志
        logger.debug("调试信息：当前处理 ID = {}", id);
        logger.info("任务开始执行");
        logger.warn("警告：处理时间过长");
        logger.error("发生错误", exception);

        return new ProcessResult(true);
    }
}
```

### 最佳实践

1. **开发环境**：使用在线日志 + DEBUG 级别
2. **测试环境**：使用在线日志 + INFO 级别
3. **生产环境**：使用本地+在线日志 + INFO 级别
4. **高频任务**：考虑使用本地日志减少网络传输

## 高级运行时配置

### 配置说明

高级运行时配置（`JobAdvancedRuntimeConfig`）用于控制任务的特殊运行行为，包括 MapReduce 任务的 TaskTracker 行为和实例超限策略。

### 配置结构

```json
{
  "taskTrackerBehavior": 1,
  "instanceLimitStrategy": 0
}
```

### 字段说明

#### TaskTracker 行为 (taskTrackerBehavior)

控制 Map/MapReduce 任务中 TaskTracker 的角色模式。

| 模式 | 值 | 说明 | 适用场景 |
|------|-----|------|----------|
| 普通 (NORMAL) | 1 | 参与集群计算，负载较高 | 节点数不多、任务不繁重 |
| 划水 (PADDLING) | 11 | 只管理不计算，稳定性最优 | 大规模计算场景 |

#### 实例超限策略 (instanceLimitStrategy)

控制当运行实例数超过 `maxInstanceNum` 时的处理策略。

| 策略 | 值 | 说明 | 适用场景 |
|------|-----|------|----------|
| 直接失败 (FAIL) | 0 | 立即返回失败（默认） | 需要严格控制并发的任务 |
| 排队等待 (WAIT) | 1 | 后台自动重试 | 允许延迟执行的任务 |

### 使用场景

#### TaskTracker 行为选择

**普通模式 (NORMAL)**
- 适用场景：中小规模集群（< 100 节点）
- 优点：充分利用计算资源
- 缺点：TaskTracker 负载较高

**划水模式 (PADDLING)**
- 适用场景：大规模集群（> 100 节点）或繁重任务
- 优点：稳定性最优，避免 TaskTracker 过载
- 缺点：少一个计算节点

#### 实例超限策略选择

**直接失败 (FAIL)**
- 适用场景：需要严格控制并发数的任务
- 示例：库存扣减、支付处理

**排队等待 (WAIT)**
- 适用场景：允许延迟执行的任务
- 示例：报表生成、数据同步

### 配置示例

#### 大规模计算任务配置

```json
{
  "taskTrackerBehavior": 11,
  "instanceLimitStrategy": 1
}
```

TaskTracker 使用划水模式保证稳定性，实例超限时排队等待。

#### 严格并发控制配置

```json
{
  "taskTrackerBehavior": 1,
  "instanceLimitStrategy": 0
}
```

使用普通模式充分利用资源，实例超限时直接失败。

#### 代码配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 配置高级运行时参数
JobAdvancedRuntimeConfig advancedConfig = new JobAdvancedRuntimeConfig();

// 设置 TaskTracker 行为
advancedConfig.setTaskTrackerBehavior(TaskTrackerBehavior.PADDLING.getV());

// 设置实例超限策略
advancedConfig.setInstanceLimitStrategy(InstanceLimitStrategy.WAIT.getV());

request.setAdvancedRuntimeConfig(advancedConfig);

// 配合最大实例数使用
request.setMaxInstanceNum(10);
```

### 最佳实践

1. **根据集群规模选择 TaskTracker 行为**
   - 小集群（< 50）：使用 NORMAL
   - 中集群（50-100）：根据任务负载选择
   - 大集群（> 100）：推荐 PADDLING

2. **根据业务特性选择超限策略**
   - 实时性要求高：使用 FAIL
   - 允许延迟：使用 WAIT

3. **合理设置最大实例数**
   - 配合 WAIT 策略可以防止任务堆积
   - 配合 FAIL 策略需要做好监控

## 任务标签和分组

### 配置说明

任务标签（`tag`）用于对任务进行分类，方便管理和组织。

### 配置方式

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();
request.setTag("data-sync");
```

### 标签使用场景

- **按业务模块分类**：`order`、`payment`、`user`
- **按功能分类**：`sync`、`report`、`cleanup`
- **按优先级分类**：`critical`、`normal`、`low`

### 标签示例

```java
// 订单同步任务
request.setTag("order-sync");

// 日报生成任务
request.setTag("report-daily");

// 缓存清理任务
request.setTag("cache-cleanup");
```

### 分组调度建议

1. **统一命名规范**
   ```
   {业务模块}-{功能类型}-{优先级}

   示例：
   order-sync-critical    # 订单同步（高优先级）
   report-daily-normal     # 日报生成（普通优先级）
   cache-cleanup-low       # 缓存清理（低优先级）
   ```

2. **按环境分离**
   ```
   prod-payment-sync
   test-payment-sync
   dev-payment-sync
   ```

## 资源配置详解

### 配置说明

资源配置用于控制任务执行节点的资源要求，确保任务在合适的机器上执行。

### 配置字段

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `minCpuCores` | Double | 最低 CPU 核心数 | 0 |
| `minMemorySpace` | Double | 最低内存空间（GB） | 0 |
| `minDiskSpace` | Double | 最低磁盘空间（GB） | 0 |
| `designatedWorkers` | String | 指定运行的机器地址 | 空 |
| `maxWorkerCount` | Integer | 最大执行机器数量 | 0 |

### 使用场景

#### 资源要求配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 设置资源要求
request.setMinCpuCores(2.0);      // 至少 2 核 CPU
request.setMinMemorySpace(4.0);   // 至少 4GB 内存
request.setMinDiskSpace(10.0);    // 至少 10GB 磁盘
```

#### 指定机器执行

```java
// 只在指定机器上执行
request.setDesignatedWorkers("192.168.1.10:27777,192.168.1.11:27777");
```

#### 限制执行机器数量

```java
// 最多在 5 台机器上执行
request.setMaxWorkerCount(5);
```

### 最佳实践

1. **合理设置资源要求**
   - 避免设置过高导致无法派发
   - 避免设置过低导致执行失败

2. **指定机器的使用**
   - 用于特殊任务（如需要特定文件或权限）
   - 一般情况不推荐使用

3. **限制机器数量**
   - MapReduce 任务推荐设置
   - 避免过多机器导致协调开销过大

## 任务依赖和编排

### 工作流集成

高级配置的任务可以无缝集成到工作流中：

1. **任务配置保持独立**：每个任务有自己的高级配置
2. **参数传递**：通过工作流上下文传递数据
3. **依赖控制**：通过工作流 DAG 控制执行顺序

### 上下游数据传递

```java
// 上游任务
@Component("upstreamTask")
public class UpstreamTask implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 处理结果
        Map<String, Object> result = new HashMap<>();
        result.put("processedCount", 1000);
        result.put("timestamp", System.currentTimeMillis());

        // 返回 JSON 格式结果给下游
        return new ProcessResult(true, JSON.toJSONString(result));
    }
}

// 下游任务
@Component("downstreamTask")
public class DownstreamTask implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取上游任务的结果
        String upstreamResult = context.getInstanceParams();

        // 解析并使用
        JSONObject result = JSON.parseObject(upstreamResult);
        Integer count = result.getInteger("processedCount");

        // 使用上游结果继续处理
        // ...

        return new ProcessResult(true);
    }
}
```

### 配置建议

1. **数据传递格式**：使用 JSON 格式便于解析
2. **数据大小控制**：避免传递大量数据
3. **错误处理**：下游任务需要处理上游可能失败的情况

## 完整配置示例

### 示例 1：核心数据同步任务

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 基础配置
request.setJobName("order_data_sync");
request.setJobDescription("订单数据核心同步任务");
request.setExecuteType(ExecuteType.STANDALONE);
request.setProcessorType(ProcessorType.BUILT_IN);
request.setProcessorInfo("orderSyncProcessor");

// 调度配置：每 5 分钟执行一次
request.setTimeExpressionType(TimeExpressionType.FIXED_RATE);
request.setTimeExpression("300000");

// 运行时配置
request.setMaxInstanceNum(1);          // 同时只运行一个实例
request.setConcurrency(1);              // 单线程执行
request.setInstanceTimeLimit(300000L);  // 5 分钟超时
request.setInstanceRetryNum(3);         // 失败重试 3 次

// 资源配置
request.setMinCpuCores(1.0);
request.setMinMemorySpace(2.0);

// 告警配置：快速告警
AlarmConfig alarmConfig = new AlarmConfig();
alarmConfig.setAlertThreshold(1);
alarmConfig.setStatisticWindowLen(60);
alarmConfig.setSilenceWindowLen(1800);
request.setAlarmConfig(alarmConfig);
request.setNotifyUserIds(Arrays.asList(1L, 2L));

// 日志配置：在线+本地
LogConfig logConfig = new LogConfig();
logConfig.setType(LogType.LOCAL_AND_ONLINE.getV());
logConfig.setLevel(LogLevel.INFO.getV());
request.setLogConfig(logConfig);

// 标签
request.setTag("order-sync-critical");

// 高级运行时配置
JobAdvancedRuntimeConfig advancedConfig = new JobAdvancedRuntimeConfig();
advancedConfig.setInstanceLimitStrategy(InstanceLimitStrategy.FAIL.getV());
request.setAdvancedRuntimeConfig(advancedConfig);
```

### 示例 2：大规模 MapReduce 任务

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 基础配置
request.setJobName("data_analysis_mr");
request.setJobDescription("大数据分析 MapReduce 任务");
request.setExecuteType(ExecuteType.MAP_REDUCE);
request.setProcessorType(ProcessorType.BUILT_IN);
request.setProcessorInfo("dataAnalysisProcessor");

// 调度配置：每天凌晨 2 点执行
request.setTimeExpressionType(TimeExpressionType.CRON);
request.setTimeExpression("0 0 2 * * ?");

// 运行时配置
request.setMaxInstanceNum(1);
request.setConcurrency(10);             // 单机并发度 10
request.setInstanceTimeLimit(3600000L); // 1 小时超时
request.setTaskRetryNum(2);             // 子任务重试 2 次

// 资源配置
request.setMinCpuCores(2.0);
request.setMinMemorySpace(4.0);
request.setMaxWorkerCount(20);          // 最多 20 台机器执行

// 告警配置
AlarmConfig alarmConfig = new AlarmConfig();
alarmConfig.setAlertThreshold(5);
alarmConfig.setStatisticWindowLen(300);
alarmConfig.setSilenceWindowLen(7200);
request.setAlarmConfig(alarmConfig);

// 日志配置：本地日志（大量日志）
LogConfig logConfig = new LogConfig();
logConfig.setType(LogType.LOCAL.getV());
logConfig.setLevel(LogLevel.INFO.getV());
request.setLogConfig(logConfig);

// 高级运行时配置：使用划水模式
JobAdvancedRuntimeConfig advancedConfig = new JobAdvancedRuntimeConfig();
advancedConfig.setTaskTrackerBehavior(TaskTrackerBehavior.PADDLING.getV());
advancedConfig.setInstanceLimitStrategy(InstanceLimitStrategy.WAIT.getV());
request.setAdvancedRuntimeConfig(advancedConfig);
```

### 示例 3：限时促销任务

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

// 基础配置
request.setJobName("promo_calculation");
request.setJobDescription("促销活动计算任务");
request.setExecuteType(ExecuteType.STANDALONE);
request.setProcessorType(ProcessorType.BUILT_IN);
request.setProcessorInfo("promoCalcProcessor");

// 生命周期：活动期间有效
LifeCycle lifecycle = new LifeCycle();
lifecycle.setStart(1704067200000L);  // 活动开始时间
lifecycle.setEnd(1704153600000L);    // 活动结束时间
request.setLifeCycle(lifecycle);

// 调度配置：活动期间每小时执行
request.setTimeExpressionType(TimeExpressionType.FIXED_RATE);
request.setTimeExpression("3600000");

// 运行时配置
request.setMaxInstanceNum(0);         // 不限制实例数
request.setConcurrency(5);
request.setInstanceTimeLimit(600000L); // 10 分钟超时

// 指定在专门的计算节点执行
request.setDesignatedWorkers("192.168.1.20:27777,192.168.1.21:27777");

// 告警配置
AlarmConfig alarmConfig = new AlarmConfig();
alarmConfig.setAlertThreshold(3);
alarmConfig.setStatisticWindowLen(60);
alarmConfig.setSilenceWindowLen(3600);
request.setAlarmConfig(alarmConfig);

// 日志配置
LogConfig logConfig = new LogConfig();
logConfig.setType(LogType.LOCAL_AND_ONLINE.getV());
logConfig.setLevel(LogLevel.INFO.getV());
request.setLogConfig(logConfig);

// 标签
request.setTag("promo-calculation");
```

## 最佳实践总结

### 1. 配置分级策略

根据任务重要性采用不同的配置策略：

| 级别 | 告警阈值 | 统计窗口 | 重试次数 | 日志级别 |
|------|---------|---------|---------|---------|
| 核心任务 | 1-3 | 60s | 3-5 | INFO |
| 重要任务 | 3-5 | 60-300s | 2-3 | INFO |
| 一般任务 | 5-10 | 300-1800s | 1-2 | WARN |

### 2. 资源配置建议

- **计算密集型**：高 CPU 要求（4核+）
- **内存密集型**：高内存要求（8GB+）
- **IO 密集型**：高磁盘要求（50GB+）
- **普通任务**：默认配置即可

### 3. 告警配置建议

- **避免告警疲劳**：设置合理的沉默窗口
- **多级告警**：配置多个通知用户
- **告警收敛**：使用统计窗口机制

### 4. 日志配置建议

- **开发阶段**：在线日志 + DEBUG 级别
- **测试阶段**：在线日志 + INFO 级别
- **生产阶段**：本地+在线 + INFO/WARN 级别

### 5. 运行时配置建议

- **小规模集群**：使用 NORMAL 模式
- **大规模集群**：使用 PADDLING 模式
- **严格控制**：使用 FAIL 策略
- **允许延迟**：使用 WAIT 策略

## 常见问题

### Q1: 生命周期配置后任务为什么不执行？

检查以下几点：
1. 当前时间是否在生命周期范围内
2. 时间戳是否使用毫秒级格式
3. 任务是否处于启用状态
4. 时间戳是否正确转换

### Q2: 告警配置不生效？

1. 确认配置了 `notifyUserIds`
2. 检查用户邮箱配置是否正确
3. 验证统计窗口内是否达到阈值
4. 确认是否在沉默窗口内

### Q3: 日志配置后看不到日志？

1. 在线日志：检查控制台日志查看功能
2. 本地日志：检查 Worker 服务器日志文件
3. 确认日志级别设置是否正确
4. 检查是否使用了自定义 Logger

### Q4: 实例超限策略 WAIT 模式任务一直等待？

1. 检查是否有长时间运行的任务占用实例
2. 考虑增加 `maxInstanceNum`
3. 手动停止长时间运行的任务
4. 检查任务超时配置是否合理

### Q5: PADDLING 模式如何选择 TaskTracker？

PADDLING 模式下，第一个接收任务的 TaskTracker 自动成为管理节点，不参与计算。无需手动指定。

### Q6: 资源配置过高导致任务无法派发？

1. 降低资源要求到合理水平
2. 增加服务器资源
3. 移除资源配置使用默认值
4. 指定满足资源要求的机器

## 下一步

- [任务](/guide/task) - 了解基础任务配置
- [工作流](/guide/workflow) - 学习工作流编排
- [告警机制](/guide/alert) - 了解告警详细配置
