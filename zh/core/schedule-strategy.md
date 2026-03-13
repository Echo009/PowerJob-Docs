# 定时策略

## 概述

PowerJob 提供多种定时策略，支持从简单的固定频率到复杂的 CRON 表达式，满足各种调度需求。

## 策略类型

| 策略类型 | 枚举值 | 说明 |
|---------|-------|------|
| API | 1 | 手动/API 触发，无定时 |
| CRON | 2 | CRON 表达式，灵活定时 |
| FIXED_RATE | 3 | 固定频率执行 |
| FIXED_DELAY | 4 | 固定延迟执行 |
| WORKFLOW | 5 | 工作流触发 |
| DAILY_TIME_INTERVAL | 11 | 每日时间区间执行 |

## CRON 表达式

CRON 是最灵活的定时策略，支持标准 CRON 表达式语法。

### 表达式格式

```
秒 分 时 日 月 周 [年]
```

| 字段 | 允许值 | 特殊字符 |
|------|--------|---------|
| 秒 | 0-59 | , - * / |
| 分 | 0-59 | , - * / |
| 时 | 0-23 | , - * / |
| 日 | 1-31 | , - * ? / L W |
| 月 | 1-12 | , - * / |
| 周 | 1-7（1=周一，7=周日） | , - * ? / L # |
| 年 | 1970-2099 | , - * / |

### 特殊字符说明

| 字符 | 说明 | 示例 |
|-----|------|------|
| `*` | 所有值 | `* * * * * ?` 每秒执行 |
| `?` | 不指定（日/周互斥） | `0 0 0 ? * 2` 每周二执行 |
| `-` | 范围 | `0 0 9-17 * * ?` 9点到17点每小时执行 |
| `,` | 列举 | `0 0 9,12,15 * * ?` 9/12/15点执行 |
| `/` | 间隔 | `0 0/30 * * * ?` 每30分钟执行 |
| `L` | 最后 | `0 0 0 L * ?` 每月最后一天执行 |
| `W` | 工作日 | `0 0 0 15W * ?` 15号最近工作日执行 |
| `#` | 第几个 | `0 0 0 ? * 6#3` 每月第三个周五执行 |

### 常用示例

```bash
# 每分钟执行
0 * * * * ?

# 每小时整点执行
0 0 * * * ?

# 每天凌晨2点执行
0 0 2 * * ?

# 每周一早上7点执行
0 0 7 ? * 2

# 每月1号凌晨执行
0 0 0 1 * ?

# 工作日（周一到周五）每天9点执行
0 0 9 ? * 2-6

# 每隔5分钟执行
0 0/5 * * * ?

# 每月最后一个工作日执行
0 0 0 LW * ?
```

## 固定频率（FIXED_RATE）

按固定时间间隔执行，不考虑任务执行耗时。

### 配置方式

时间表达式填写毫秒数：

```bash
# 每10秒执行一次
10000

# 每5分钟执行一次
300000

# 每小时执行一次
3600000
```

### 特点

- 任务可能重叠执行
- 适合执行时间短且固定的任务
- 最大间隔限制：120000ms（2分钟，可通过系统属性 `powerjob.server.frequency-job.max-interval` 调整）

### 执行时序

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#e3f2fd', 'primaryTextColor':'#1565c0', 'primaryBorderColor':'#1976d2', 'lineColor':'#42a5f5', 'secondaryColor':'#f3e5f5', 'tertiaryColor':'#fff3e0', 'background':'#ffffff'}}}%%
gantt
    title FIXED_RATE 固定频率执行时序
    dateFormat ss
    axisFormat %M分%S秒

    section 调度时间线
    固定间隔(10秒) :milestone, interval, 00:00, 10s

    section 任务执行
    第1次执行 :task1, 00:00, 2s
    第2次执行 :task2, 00:10, 2s
    第3次执行(耗时较长) :task3, 00:20, 3s
    第4次执行 :task4, 00:30, 2s
```

## 固定延迟（FIXED_DELAY）

任务执行完成后等待固定时间再执行下一次。

### 配置方式

时间表达式填写毫秒数：

```bash
# 任务完成后等待1秒再执行
1000

# 任务完成后等待30秒再执行
30000
```

### 特点

- 任务不会重叠执行
- 适合需要保证执行间隔的任务
- 最大间隔限制：120000ms（2分钟，可通过系统属性 `powerjob.server.frequency-job.max-interval` 调整）

### 执行时序

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#e8f5e9', 'primaryTextColor':'#2e7d32', 'primaryBorderColor':'#66bb6a', 'lineColor':'#66bb6a', 'secondaryColor':'#fff3e0', 'tertiaryColor':'#e3f2fd', 'background':'#ffffff'}}}%%
gantt
    title FIXED_DELAY 固定延迟执行时序
    dateFormat ss
    axisFormat %M分%S秒

    section 执行流程
    第1次执行 :task1, 00:00, 5s
    延迟等待(2秒) :delay1, after task1, 2s
    第2次执行 :task2, after delay1, 3s
    延迟等待(2秒) :delay2, after task2, 2s
    第3次执行 :task3, after delay2, 4s
```

## 每日时间区间（DAILY_TIME_INTERVAL）

在指定的时间范围内按固定间隔执行。

### 配置方式

时间表达式填写 JSON 格式：

```json
{
    "interval": 300,
    "startTimeOfDay": "09:00:00",
    "endTimeOfDay": "18:00:00",
    "intervalUnit": "SECONDS",
    "daysOfWeek": [1, 2, 3, 4, 5]
}
```

### 配置项说明

| 配置项 | 类型 | 说明 |
|-------|------|------|
| interval | Integer | 时间间隔数值 |
| startTimeOfDay | String | 每日开始时间 |
| endTimeOfDay | String | 每日结束时间 |
| intervalUnit | String | 时间单位：SECONDS、MINUTES、HOURS |
| daysOfWeek | Integer[] | 每周哪几天执行（1=周一，7=周日） |

### 常用示例

```json
// 工作日 9点到18点，每5分钟执行
{
    "interval": 5,
    "startTimeOfDay": "09:00:00",
    "endTimeOfDay": "18:00:00",
    "intervalUnit": "MINUTES",
    "daysOfWeek": [1, 2, 3, 4, 5]
}

// 每天早上8点到晚上10点，每10分钟执行
{
    "interval": 600,
    "startTimeOfDay": "08:00:00",
    "endTimeOfDay": "22:00:00"
}
```

## API 触发

不配置定时策略，通过 OpenAPI 手动触发。

### 特点

- 无需配置时间表达式
- 适合临时任务或外部系统触发的场景

### 使用方式

```java
// 通过 OpenAPI 触发
client.runJob(jobId, "instanceParams", 0);

// 延迟60秒执行
client.runJob(jobId, "instanceParams", 60000);
```

## 工作流触发

由工作流节点触发执行，任务本身不需要配置定时策略。

### 特点

- 作为工作流的节点被触发
- 适合编排在工作流中的任务

## 策略选择建议

| 场景 | 推荐策略 |
|------|---------|
| 复杂定时规则 | CRON |
| 精确时间间隔 | FIXED_RATE |
| 任务完成后等待 | FIXED_DELAY |
| 工作时间执行 | DAILY_TIME_INTERVAL |
| 手动/外部触发 | API |
| 流程编排 | WORKFLOW |

## 生命周期配置

所有定时策略都可配置生命周期：

| 配置项 | 说明 |
|-------|------|
| 开始时间 | 任务生效时间 |
| 结束时间 | 任务失效时间 |

```java
// 通过 OpenAPI 配置生命周期
SaveJobInfoRequest request = new SaveJobInfoRequest();
request.setLifeCycle(new LifeCycle(startTime, endTime));
```

## 下一步

- [执行模式](/zh/core/execution-mode) - 了解任务的执行方式
- [OpenAPI 使用](/zh/api/openapi) - 通过 API 管理任务
