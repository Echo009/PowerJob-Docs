# OpenAPI 文档

## 概述

PowerJob 提供了完整的 OpenAPI，允许开发者通过 HTTP 接口进行任务的创建、触发、停止等操作。OpenAPI 适用于以下场景：

- **跨系统集成**：在不接入 PowerJob Worker 的情况下，从其他系统触发 PowerJob 任务
- **自动化运维**：通过脚本或 CI/CD 流水线管理定时任务
- **第三方平台对接**：将 PowerJob 的调度能力集成到业务系统中

### 核心特性

- 基于 HTTP 的 RESTful 风格 API
- 支持 AppName + 密码的鉴权方式
- 提供完整的 Java SDK，开箱即用
- 支持任务和工作流的完整生命周期管理

## 接入说明

### 获取 AppId 和密码

1. 登录 PowerJob 控制台
2. 进入**应用管理**页面
3. 创建或选择已有应用
4. 记录应用的**应用名称**和**密码**

::: tip
OpenAPI 使用应用名称和密码进行鉴权，而非 AppId。AppId 会在鉴权成功后由服务器返回。
:::

### 鉴权机制

PowerJob OpenAPI 采用 Token 鉴权机制，流程如下：

1. **初始鉴权**：使用应用名称和加密后的密码调用鉴权接口
2. **获取 Token**：服务器返回 AppId 和 JWT Token
3. **后续请求**：在请求头中携带 Token 和 AppId

#### 鉴权流程图

```
┌─────────┐                ┌──────────────┐                ┌─────────────┐
│  Client │───────────────▶│  /openApi/   │───────────────▶│  PowerJob   │
│         │  authApp()    │   authApp    │                │   Server    │
└─────────┘                └──────────────┘                └─────────────┘
     │                              │                              │
     │◀─────────────────────────────│──────────────────────────────│
     │   AppAuthResult             │                              │
     │   (appId + token)           │                              │
     │                              │                              │
     │─────────────────────────────▶│─────────────────────────────▶│
     │   Header:                   │                              │
     │   X-POWERJOB-ACCESS-TOKEN   │                              │
     │   X-POWERJOB-APP-ID         │                              │
```

#### 请求头说明

| 请求头 | 说明 | 示例 |
|--------|------|------|
| X-POWERJOB-ACCESS-TOKEN | 鉴权 Token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| X-POWERJOB-APP-ID | 应用 ID | `1001` |

#### 密码加密

当前版本支持 MD5 加密方式，密码需要先进行 MD5 加密后再发送：

```java
String encryptedPassword = DigestUtils.md5(originalPassword);
```

::: warning
OpenAPI 鉴权功能默认关闭，需要在服务器配置中开启 `oms.auth.openapi.enable=true`。
:::

### 开启鉴权

在 `application.properties` 中配置：

```properties
# 开启 OpenAPI 鉴权（默认关闭）
oms.auth.openapi.enable=true
```

::: tip
为了兼容 4.x 及之前版本，OpenAPI 鉴权默认关闭。开启后，所有未携带 Token 的请求将被拒绝。
:::

## API 列表

### 基础接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /openApi/authApp | POST | 应用鉴权，获取 Token |
| /openApi/assert | POST | 验证应用名称和密码 |

### 任务管理接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /openApi/saveJob | POST | 创建或更新任务 |
| /openApi/copyJob | POST | 复制任务 |
| /openApi/exportJob | POST | 导出任务配置 |
| /openApi/fetchJob | POST | 获取任务详情 |
| /openApi/fetchAllJob | POST | 获取应用下所有任务 |
| /openApi/queryJob | POST | 查询任务列表 |
| /openApi/disableJob | POST | 禁用任务 |
| /openApi/enableJob | POST | 启用任务 |
| /openApi/deleteJob | POST | 删除任务 |
| /openApi/runJob | POST | 运行任务（简单参数） |
| /openApi/runJob2 | POST | 运行任务（完整参数） |

### 实例管理接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /openApi/stopInstance | POST | 停止任务实例 |
| /openApi/cancelInstance | POST | 取消任务实例 |
| /openApi/retryInstance | POST | 重试失败实例 |
| /openApi/fetchInstanceStatus | POST | 获取实例状态 |
| /openApi/fetchInstanceInfo | POST | 获取实例详情 |
| /openApi/queryInstance | POST | 分页查询实例 |

### 工作流管理接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /openApi/saveWorkflow | POST | 创建或更新工作流 |
| /openApi/copyWorkflow | POST | 复制工作流 |
| /openApi/fetchWorkflow | POST | 获取工作流详情 |
| /openApi/disableWorkflow | POST | 禁用工作流 |
| /openApi/enableWorkflow | POST | 启用工作流 |
| /openApi/deleteWorkflow | POST | 删除工作流 |
| /openApi/runWorkflow | POST | 运行工作流 |
| /openApi/addWorkflowNode | POST | 添加工作流节点 |

### 工作流实例管理接口

| 接口 | 方法 | 描述 |
|------|------|------|
| /openApi/stopWfInstance | POST | 停止工作流实例 |
| /openApi/retryWfInstance | POST | 重试工作流实例 |
| /openApi/fetchWfInstanceInfo | POST | 获取工作流实例详情 |
| /openApi/markWorkflowNodeAsSuccess | POST | 标记节点为成功 |

## 详细接口文档

### 通用响应格式

所有接口返回统一的 JSON 格式：

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

部分接口返回 `PowerResultDTO`，包含错误码：

```json
{
  "success": true,
  "code": "",
  "data": {},
  "message": ""
}
```

### 基础接口

#### 1. 应用鉴权

**接口地址**：`POST /openApi/authApp`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appName | String | 是 | 应用名称 |
| encryptedPassword | String | 是 | MD5 加密后的密码 |
| encryptType | String | 是 | 加密类型，固定为 `MD5` |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/authApp" \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "powerjob-worker-samples",
    "encryptedPassword": "0192023a7bbd73250516f069df18b500",
    "encryptType": "MD5"
  }'
```

**响应示例**：

```json
{
  "success": true,
  "code": null,
  "data": {
    "appId": 1001,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "extra": null
  },
  "message": null
}
```

#### 2. 验证应用

**接口地址**：`POST /openApi/assert`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appName | String | 是 | 应用名称 |
| password | String | 否 | 应用密码 |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/assert?appName=powerjob-worker-samples&password=xxx"
```

### 任务管理接口

#### 1. 创建/更新任务

**接口地址**：`POST /openApi/saveJob`

**请求参数**：`SaveJobInfoRequest`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 否 | 任务 ID，存在则为更新，不存在则为创建 |
| jobName | String | 是 | 任务名称 |
| jobDescription | String | 否 | 任务描述 |
| jobParams | String | 否 | 任务参数（JSON 格式） |
| timeExpressionType | Enum | 是 | 时间表达式类型 |
| timeExpression | String | 是 | 时间表达式 |
| executeType | Enum | 是 | 执行类型 |
| processorType | Enum | 是 | 处理器类型 |
| processorInfo | String | 是 | 处理器信息 |
| maxInstanceNum | Integer | 否 | 最大同时运行实例数，0 表示无限制 |
| concurrency | Integer | 否 | 并发度，默认 5 |
| instanceTimeLimit | Long | 否 | 实例运行超时时间（毫秒），0 表示无限制 |
| instanceRetryNum | Integer | 否 | 实例重试次数，默认 0 |
| taskRetryNum | Integer | 否 | 任务重试次数，默认 0 |
| minCpuCores | Double | 否 | 最低 CPU 核心数要求 |
| minMemorySpace | Double | 否 | 最低内存要求（GB） |
| minDiskSpace | Double | 否 | 最低磁盘要求（GB） |
| enable | Boolean | 否 | 是否启用，默认 true |
| designatedWorkers | String | 否 | 指定运行的 Worker 节点 |
| maxWorkerCount | Integer | 否 | 最大 Worker 节点数 |
| notifyUserIds | List&lt;Long&gt; | 否 | 报警通知用户 ID 列表 |
| dispatchStrategy | Enum | 否 | 派发策略 |
| tag | String | 否 | 任务标签 |

**枚举类型说明**：

- **TimeExpressionType**：`API`(1), `CRON`(2), `FIXED_RATE`(3), `FIXED_DELAY`(4), `WORKFLOW`(5)
- **ExecuteType**：`STANDALONE`(1), `BROADCAST`(2), `MAP_REDUCE`(3), `MAP`(4)
- **ProcessorType**：`BUILT_IN`(1), `EXTERNAL`(4)

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/saveJob" \
  -H "Content-Type: application/json" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d '{
    "jobName": "测试任务",
    "jobDescription": "通过 OpenAPI 创建的任务",
    "jobParams": "{\"key\":\"value\"}",
    "timeExpressionType": 1,
    "timeExpression": "",
    "executeType": 1,
    "processorType": 1,
    "processorInfo": "tech.powerjob.samples.processors.StandaloneProcessorDemo",
    "maxInstanceNum": 1,
    "concurrency": 5
  }'
```

**响应示例**：

```json
{
  "success": true,
  "data": 123456
}
```

#### 2. 运行任务

**接口地址**：`POST /openApi/runJob2`

**请求参数**：`RunJobRequest`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | Long | 是 | 任务 ID |
| instanceParams | String | 否 | 运行时参数 |
| delay | Long | 否 | 延迟执行时间（毫秒） |
| outerKey | String | 否 | 外部业务键，用于关联业务数据 |
| extendValue | String | 否 | 扩展参数 |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/runJob2" \
  -H "Content-Type: application/json" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d '{
    "jobId": 123456,
    "instanceParams": "{\"param\":\"value\"}",
    "delay": 0
  }'
```

**响应示例**：

```json
{
  "success": true,
  "code": null,
  "data": 789012,
  "message": null
}
```

#### 3. 获取任务详情

**接口地址**：`POST /openApi/fetchJob`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | Long | 是 | 任务 ID |
| appId | Long | 是 | 应用 ID |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/fetchJob" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d "jobId=123456&appId=1001"
```

#### 4. 查询任务列表

**接口地址**：`POST /openApi/queryJob`

**请求参数**：`JobInfoQuery`

| 参数 | 类型 | 说明 |
|------|------|------|
| idEq | Long | 精确匹配 ID |
| jobNameEq | String | 精确匹配任务名称 |
| jobNameLike | String | 模糊匹配任务名称 |
| statusIn | List&lt;Integer&gt; | 状态列表 |
| timeExpressionTypeIn | List&lt;Integer&gt; | 时间表达式类型列表 |
| executeTypeIn | List&lt;Integer&gt; | 执行类型列表 |
| processorTypeIn | List&lt;Integer&gt; | 处理器类型列表 |
| index | Integer | 页码（从 0 开始） |
| pageSize | Integer | 页大小 |
| sortBy | String | 排序字段 |
| asc | Boolean | 是否升序 |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/queryJob" \
  -H "Content-Type: application/json" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d '{
    "jobNameLike": "测试",
    "index": 0,
    "pageSize": 10
  }'
```

#### 5. 禁用/启用任务

**接口地址**：
- 禁用：`POST /openApi/disableJob`
- 启用：`POST /openApi/enableJob`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| jobId | Long | 是 | 任务 ID |
| appId | Long | 是 | 应用 ID |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/disableJob" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d "jobId=123456&appId=1001"
```

#### 6. 删除任务

**接口地址**：`POST /openApi/deleteJob`

**请求参数**：同禁用任务

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/deleteJob" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d "jobId=123456&appId=1001"
```

### 实例管理接口

#### 1. 获取实例状态

**接口地址**：`POST /openApi/fetchInstanceStatus`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| instanceId | Long | 是 | 实例 ID |

**响应示例**：

```json
{
  "success": true,
  "data": 5
}
```

**状态码说明**：

| 值 | 说明 |
|----|------|
| 1 | 等待派发 |
| 2 | 等待 Worker 接收 |
| 3 | 运行中 |
| 4 | 失败 |
| 5 | 成功 |
| 9 | 取消 |
| 10 | 手动停止 |

#### 2. 获取实例详情

**接口地址**：`POST /openApi/fetchInstanceInfo`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| instanceId | Long | 是 | 实例 ID |

**响应示例**：

```json
{
  "success": true,
  "data": {
    "instanceId": 789012,
    "jobId": 123456,
    "status": 5,
    "result": "执行成功",
    "gmtCreated": "2024-03-09T10:00:00",
    "gmtModified": "2024-03-09T10:01:00"
  }
}
```

#### 3. 停止实例

**接口地址**：`POST /openApi/stopInstance`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| instanceId | Long | 是 | 实例 ID |
| appId | Long | 是 | 应用 ID |

#### 4. 取消实例

**接口地址**：`POST /openApi/cancelInstance`

**请求参数**：同停止实例

::: warning
取消接口仅适用于尚未运行的实例，且建议在预计执行时间前调用，否则可靠性无法保证。
:::

#### 5. 重试实例

**接口地址**：`POST /openApi/retryInstance`

**请求参数**：同停止实例

::: warning
仅支持已完成状态（成功、失败、手动停止、取消）的实例重试。暂不支持工作流内任务实例的重试。
:::

#### 6. 分页查询实例

**接口地址**：`POST /openApi/queryInstance`

**请求参数**：`InstancePageQuery`

| 参数 | 类型 | 说明 |
|------|------|------|
| instanceIdEq | Long | 精确匹配实例 ID |
| outerKeyEq | String | 根据业务外键查询 |
| jobIdEq | Long | 任务 ID |
| statusIn | List&lt;Integer&gt; | 状态列表 |
| index | Integer | 页码 |
| pageSize | Integer | 页大小 |
| sortBy | String | 排序字段 |

### 工作流管理接口

#### 1. 创建/更新工作流

**接口地址**：`POST /openApi/saveWorkflow`

**请求参数**：`SaveWorkflowRequest`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 否 | 工作 ID，存在则为更新 |
| wfName | String | 是 | 工作流名称 |
| wfDescription | String | 否 | 工作流描述 |
| timeExpressionType | Enum | 是 | 时间表达式类型（仅支持 CRON 和 API） |
| timeExpression | String | 是 | 时间表达式 |
| maxWfInstanceNum | Integer | 否 | 最大同时运行实例数，默认 1 |
| enable | Boolean | 否 | 是否启用，默认 true |
| notifyUserIds | List&lt;Long&gt; | 否 | 报警通知用户 ID 列表 |
| dag | PEWorkflowDAG | 是 | 工作流 DAG 结构 |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/saveWorkflow" \
  -H "Content-Type: application/json" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d '{
    "wfName": "测试工作流",
    "wfDescription": "通过 OpenAPI 创建的工作流",
    "timeExpressionType": 1,
    "timeExpression": "",
    "enable": true
  }'
```

#### 2. 运行工作流

**接口地址**：`POST /openApi/runWorkflow`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| workflowId | Long | 是 | 工作流 ID |
| appId | Long | 是 | 应用 ID |
| initParams | String | 否 | 工作流初始化参数 |
| delay | Long | 否 | 延迟执行时间（毫秒） |

**请求示例**：

```bash
curl -X POST "http://localhost:7700/openApi/runWorkflow" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-POWERJOB-ACCESS-TOKEN: your-token" \
  -H "X-POWERJOB-APP-ID: 1001" \
  -d "workflowId=123&appId=1001&initParams={\"key\":\"value\"}&delay=0"
```

#### 3. 添加工作流节点

**接口地址**：`POST /openApi/addWorkflowNode`

**请求参数**：`List<SaveWorkflowNodeRequest>`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Long | 否 | 节点 ID |
| type | Integer | 是 | 节点类型 |
| jobId | Long | 条件必填 | 任务 ID（任务节点必填） |
| nodeName | String | 否 | 节点别名 |
| nodeParams | String | 否 | 节点参数 |
| enable | Boolean | 否 | 是否启用，默认 true |
| skipWhenFailed | Boolean | 否 | 失败是否跳过，默认 false |

### 工作流实例管理接口

#### 1. 停止工作流实例

**接口地址**：`POST /openApi/stopWfInstance`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| wfInstanceId | Long | 是 | 工作流实例 ID |
| appId | Long | 是 | 应用 ID |

#### 2. 重试工作流实例

**接口地址**：`POST /openApi/retryWfInstance`

**请求参数**：同停止工作流实例

#### 3. 标记节点为成功

**接口地址**：`POST /openApi/markWorkflowNodeAsSuccess`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| wfInstanceId | Long | 是 | 工作流实例 ID |
| nodeId | Long | 是 | 节点 ID |
| appId | Long | 是 | 应用 ID |

#### 4. 获取工作流实例详情

**接口地址**：`POST /openApi/fetchWfInstanceInfo`

**请求参数**：同停止工作流实例

## SDK 使用

PowerJob 提供了官方 Java SDK，简化 OpenAPI 的调用。

### Maven 依赖

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-client</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```

### 初始化客户端

```java
import tech.powerjob.client.ClientConfig;
import tech.powerjob.client.PowerJobClient;
import java.util.List;

// 方式一：使用 ClientConfig（推荐）
ClientConfig config = new ClientConfig();
config.setAppName("powerjob-worker-samples");
config.setPassword("powerjob123");
config.setAddressList(Lists.newArrayList("127.0.0.1:7700", "127.0.0.1:7701"));

PowerJobClient client = new PowerJobClient(config);

// 方式二：直接构造
PowerJobClient client = new PowerJobClient(
    Lists.newArrayList("127.0.0.1:7700"),
    "powerjob-worker-samples",
    "powerjob123"
);
```

### 创建任务

```java
import tech.powerjob.common.enums.ExecuteType;
import tech.powerjob.common.enums.ProcessorType;
import tech.powerjob.common.enums.TimeExpressionType;
import tech.powerjob.common.request.http.SaveJobInfoRequest;
import tech.powerjob.common.response.ResultDTO;

SaveJobInfoRequest request = new SaveJobInfoRequest();
request.setJobName("测试任务");
request.setJobDescription("通过 SDK 创建的任务");
request.setTimeExpressionType(TimeExpressionType.API);
request.setExecuteType(ExecuteType.STANDALONE);
request.setProcessorType(ProcessorType.BUILT_IN);
request.setProcessorInfo("tech.powerjob.samples.processors.StandaloneProcessorDemo");
request.setMaxInstanceNum(1);
request.setConcurrency(5);

ResultDTO<Long> result = client.saveJob(request);
if (result.isSuccess()) {
    Long jobId = result.getData();
    System.out.println("任务创建成功，ID: " + jobId);
}
```

### 运行任务

```java
import tech.powerjob.common.request.http.RunJobRequest;
import tech.powerjob.common.response.PowerResultDTO;

// 简单运行
ResultDTO<Long> result = client.runJob(jobId, null, 0);

// 完整参数运行
RunJobRequest request = new RunJobRequest();
request.setJobId(jobId);
request.setInstanceParams("{\"key\":\"value\"}");
request.setDelay(0L);
request.setOuterKey("business-key-123");

PowerResultDTO<Long> result = client.runJob(request);
```

### 查询任务

```java
// 获取单个任务
ResultDTO<JobInfoDTO> result = client.fetchJob(jobId);

// 获取所有任务
ResultDTO<List<JobInfoDTO>> result = client.fetchAllJob();

// 条件查询
JobInfoQuery query = new JobInfoQuery();
query.setJobNameLike("测试");
query.setIndex(0);
query.setPageSize(10);
ResultDTO<List<JobInfoDTO>> result = client.queryJob(query);
```

### 管理实例

```java
// 获取实例状态
ResultDTO<Integer> statusResult = client.fetchInstanceStatus(instanceId);

// 获取实例详情
ResultDTO<InstanceInfoDTO> infoResult = client.fetchInstanceInfo(instanceId);

// 停止实例
client.stopInstance(instanceId);

// 重试实例
client.retryInstance(instanceId);

// 分页查询实例
InstancePageQuery query = new InstancePageQuery();
query.setJobIdEq(jobId);
query.setStatusIn(Lists.newArrayList(4, 5, 9, 10));
query.setIndex(0);
query.setPageSize(20);
ResultDTO<PageResult<InstanceInfoDTO>> result = client.queryInstanceInfo(query);
```

### 工作流操作

```java
import tech.powerjob.common.request.http.SaveWorkflowRequest;

// 创建工作流
SaveWorkflowRequest request = new SaveWorkflowRequest();
request.setWfName("测试工作流");
request.setWfDescription("通过 SDK 创建的工作流");
request.setTimeExpressionType(TimeExpressionType.API);
ResultDTO<Long> result = client.saveWorkflow(request);

// 运行工作流
ResultDTO<Long> wfResult = client.runWorkflow(workflowId, null, 0);

// 停止工作流实例
client.stopWorkflowInstance(wfInstanceId);
```

### 完整示例

```java
import com.google.common.collect.Lists;
import tech.powerjob.client.ClientConfig;
import tech.powerjob.client.PowerJobClient;
import tech.powerjob.common.enums.ExecuteType;
import tech.powerjob.common.enums.InstanceStatus;
import tech.powerjob.common.enums.ProcessorType;
import tech.powerjob.common.enums.TimeExpressionType;
import tech.powerjob.common.request.http.SaveJobInfoRequest;
import tech.powerjob.common.response.InstanceInfoDTO;
import tech.powerjob.common.response.JobInfoDTO;
import tech.powerjob.common.response.ResultDTO;

public class OpenApiExample {
    public static void main(String[] args) {
        // 1. 初始化客户端
        ClientConfig config = new ClientConfig();
        config.setAppName("powerjob-worker-samples");
        config.setPassword("powerjob123");
        config.setAddressList(Lists.newArrayList("127.0.0.1:7700"));

        try (PowerJobClient client = new PowerJobClient(config)) {
            // 2. 创建任务
            SaveJobInfoRequest jobRequest = new SaveJobInfoRequest();
            jobRequest.setJobName("定时数据同步");
            jobRequest.setJobDescription("每小时同步一次数据");
            jobRequest.setTimeExpressionType(TimeExpressionType.CRON);
            jobRequest.setTimeExpression("0 0 * * * ?");
            jobRequest.setExecuteType(ExecuteType.STANDALONE);
            jobRequest.setProcessorType(ProcessorType.BUILT_IN);
            jobRequest.setProcessorInfo("com.example.DataSyncProcessor");

            ResultDTO<Long> createResult = client.saveJob(jobRequest);
            if (!createResult.isSuccess()) {
                System.err.println("创建任务失败: " + createResult.getMessage());
                return;
            }
            Long jobId = createResult.getData();

            // 3. 立即运行一次
            ResultDTO<Long> runResult = client.runJob(jobId, null, 0);
            Long instanceId = runResult.getData();

            // 4. 等待执行完成
            Thread.sleep(5000);

            // 5. 检查执行状态
            ResultDTO<Integer> statusResult = client.fetchInstanceStatus(instanceId);
            Integer status = statusResult.getData();

            if (status == InstanceStatus.SUCCEED.getV()) {
                System.out.println("任务执行成功");
                ResultDTO<InstanceInfoDTO> infoResult = client.fetchInstanceInfo(instanceId);
                System.out.println("执行结果: " + infoResult.getData().getResult());
            } else {
                System.err.println("任务执行失败，状态: " + status);
                // 重试
                client.retryInstance(instanceId);
            }

            // 6. 清理测试任务
            client.deleteJob(jobId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 错误码说明

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| -100 | 用户未登录 | 检查 Token 是否正确 |
| -101 | 用户不存在 | 检查应用是否存在 |
| -102 | 用户认证失败 | 检查应用名称和密码 |
| -103 | 用户被停用 | 联系管理员启用应用 |
| -200 | 无权限 | 检查应用权限配置 |
| -300 | 无效请求 | 检查请求参数 |
| -400 | 密码错误 | 检查应用密码 |
| -401 | 非法令牌 | 重新获取 Token |
| -402 | 无效应用 | 检查应用是否存在 |
| -403 | 令牌过期 | 重新获取 Token |
| -500 | 系统内部异常 | 联系技术支持 |
| -501 | 非法参数 | 检查请求参数格式 |
| -502 | 不允许操作 | 检查操作权限 |
| -1002 | OpenAPI 鉴权失败 | 检查鉴权配置 |
| -2001 | 客户端 HTTP 请求失败 | 检查网络连接 |

## 最佳实践

### 1. 客户端复用

```java
// 推荐：使用单例或连接池管理客户端
public class PowerJobClientHolder {
    private static final PowerJobClient CLIENT;

    static {
        ClientConfig config = new ClientConfig();
        config.setAppName("your-app");
        config.setPassword("your-password");
        config.setAddressList(loadServerAddresses());
        CLIENT = new PowerJobClient(config);
    }

    public static PowerJobClient getClient() {
        return CLIENT;
    }
}
```

### 2. 错误处理

```java
ResultDTO<Long> result = client.runJob(jobId, null, 0);
if (result.isSuccess()) {
    Long instanceId = result.getData();
    // 处理成功逻辑
} else {
    String message = result.getMessage();
    // 根据错误码进行不同处理
    if (message.contains("token")) {
        // Token 失效，重新初始化客户端
    } else if (message.contains("not found")) {
        // 任务不存在
    }
    // 记录日志
    logger.error("运行任务失败: {}", message);
}
```

### 3. 重试策略

```java
public Long runJobWithRetry(PowerJobClient client, Long jobId, String params, int maxRetries) {
    for (int i = 0; i < maxRetries; i++) {
        try {
            ResultDTO<Long> result = client.runJob(jobId, params, 0);
            if (result.isSuccess()) {
                return result.getData();
            }
            // 非网络错误，直接抛出
            throw new RuntimeException(result.getMessage());
        } catch (Exception e) {
            if (i == maxRetries - 1) {
                throw new RuntimeException("重试失败", e);
            }
            // 指数退避
            Thread.sleep(1000 * (1 << i));
        }
    }
    throw new RuntimeException("运行任务失败");
}
```

### 4. 使用 outerKey 关联业务

```java
RunJobRequest request = new RunJobRequest();
request.setJobId(jobId);
request.setOuterKey("ORDER-" + orderId); // 关联订单 ID
request.setInstanceParams(JSON.toJSONString(orderData));

ResultDTO<Long> result = client.runJob(request);

// 后续可以通过 outerKey 查询实例
InstancePageQuery query = new InstancePageQuery();
query.setOuterKeyEq("ORDER-" + orderId);
ResultDTO<PageResult<InstanceInfoDTO>> queryResult = client.queryInstanceInfo(query);
```

### 5. 监控任务执行状态

```java
public void waitForCompletion(PowerJobClient client, Long instanceId, long timeoutMs) {
    long start = System.currentTimeMillis();
    while (System.currentTimeMillis() - start < timeoutMs) {
        ResultDTO<Integer> result = client.fetchInstanceStatus(instanceId);
        Integer status = result.getData();

        if (InstanceStatus.FINISHED_STATUS.contains(status)) {
            ResultDTO<InstanceInfoDTO> infoResult = client.fetchInstanceInfo(instanceId);
            InstanceInfoDTO info = infoResult.getData();
            if (status == InstanceStatus.SUCCEED.getV()) {
                logger.info("任务执行成功: {}", info.getResult());
            } else {
                logger.error("任务执行失败: {}", info.getResult());
            }
            return;
        }

        Thread.sleep(1000);
    }
    throw new RuntimeException("任务执行超时");
}
```

### 6. 安全配置

```properties
# 生产环境务必开启 OpenAPI 鉴权
oms.auth.openapi.enable=true

# 使用 HTTPS
oms.protocol.https.enabled=true

# 限制访问 IP（通过 nginx 或防火墙）
```

### 7. 日志记录

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OpenApiService {
    private static final Logger logger = LoggerFactory.getLogger(OpenApiService.class);

    public Long createAndRunJob(SaveJobInfoRequest request) {
        logger.info("开始创建任务: {}", request.getJobName());

        ResultDTO<Long> createResult = client.saveJob(request);
        if (!createResult.isSuccess()) {
            logger.error("创建任务失败: {} - {}", request.getJobName(), createResult.getMessage());
            throw new RuntimeException("创建任务失败");
        }

        Long jobId = createResult.getData();
        logger.info("任务创建成功, ID: {}", jobId);

        ResultDTO<Long> runResult = client.runJob(jobId, null, 0);
        if (runResult.isSuccess()) {
            logger.info("任务运行成功, instanceId: {}", runResult.getData());
            return runResult.getData();
        }

        logger.error("运行任务失败: {}", runResult.getMessage());
        throw new RuntimeException("运行任务失败");
    }
}
```

## 常见问题

### Q1: 如何处理 Token 过期？

Token 有效期由服务器端控制，过期后需要重新调用 `/openApi/authApp` 获取新 Token。

### Q2: 批量创建任务如何优化？

使用 `saveWorkflow` 创建工作流，或将多个任务在一个请求中处理。对于大量任务，考虑分批处理并控制并发数。

### Q3: 如何查询指定时间范围内的实例？

使用 `InstancePageQuery` 的时间参数：

```java
InstancePageQuery query = new InstancePageQuery();
query.setGmtCreateGt(startDate);
query.setGmtCreateLt(endDate);
```

### Q4: OpenAPI 调用有限流吗？

建议在客户端实现限流，避免对服务器造成压力。服务器端可能有默认限流配置。

### Q5: 如何验证 OpenAPI 连通性？

```java
// 调用 assert 接口验证
boolean connected = false;
try {
    PowerJobClient client = new PowerJobClient(config);
    connected = true;
} catch (Exception e) {
    // 连接失败
}
```

## 参考资源

- [GitHub 仓库](https://github.com/PowerJob/PowerJob)
- [快速开始](/start/quick-start)
- [任务管理](/core/task)
- [工作流文档](/advanced/workflow)
