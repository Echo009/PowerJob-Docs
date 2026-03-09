# OpenAPI 使用

## 概述
PowerJob 提供完善的 OpenAPI，允许通过 HTTP 掏口远程管理任务、工作流和实例。

## 快速开始
### 1. 添加依赖
```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-client</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```
### 2. 初始化客户端
```java
// 方式一： 单地址
PowerJobClient client = new PowerJobClient("127.0.0.1:7700", "appName", "password");

// 方式二: 集群地址
PowerJobClient client = new PowerJobClient(
    Lists.newArrayList("192.168.1.1:7700", "192.168.1.2:7700"),
    "appName",
    "password"
);

// 方式三: 完整配置
ClientConfig config = new ClientConfig()
    .setAppName("appName")
    .setPassword("password")
    .setAddressList(Lists.newArrayList("192.168.1.1:7700"))
    .setProtocol(Protocol.HTTP)
    .setConnectionTimeout(5000)
    .setReadTimeout(10000);

PowerJobClient client = new PowerJobClient(config);
```
### 客户端配置项
| 配置项 | 类型 | 说明 |
|-------|------|------|
| appName | String | 应用名称（必填） |
| password | String | 应用密码（必填） |
| addressList | List\<String> | Server 地址列表（必填） |
| protocol | Protocol | 协议：HTTP / HTTPS |
| connectionTimeout | int | 连接超时（毫秒） |
| readTimeout | int | 读取超时（毫秒） |
| writeTimeout | int | 写入超时（毫秒） |
| defaultHeaders | Map | 默认请求头 |
## 任务管理 API
### 创建任务
```java
SaveJobInfoRequest request = new SaveJobInfoRequest();
request.setJobName("数据同步任务");
request.setJobDescription("每晚同步数据");
request.setTimeExpressionType(TimeExpressionType.CRON);
request.setTimeExpression("0 0 2 * * ?");
request.setExecuteType(ExecuteType.standalone);
request.setProcessorType(ProcessorType.BuiltIn);
request.setProcessorInfo("com.example.DataSyncProcessor");
request.setConcurrency(3);
request.setMaxInstanceNum(1);

ResultDTO<Long> result = client.saveJob(request);
if (result.isSuccess()) {
    Long jobId = result.getData();
    System.out.println("任务创建成功，ID: " + jobId);
}
```
### 查询任务
```java
// 根据ID查询
ResultDTO<JobInfoDTO> job = client.fetchJob(jobId);

// 查询所有任务
ResultDTO<List<JobInfoDTO>> jobs = client.fetchAllJob();

// 条件查询
JobInfoQuery query = new JobInfoQuery()
    .setJobNameLike("数据%")
    .setStatusIn(Lists.newArrayList(1, 2));

ResultDTO<List<JobInfoDTO>> jobs = client.queryJob(query);
```
### 运行任务
```java
// 基础运行
ResultDTO<Long> result = client.runJob(jobId, null, 0);

// 带参数运行
ResultDTO<Long> result = client.runJob(jobId, "{\"key\":\"value\"}", 0);

// 延迟运行（60秒后执行）
ResultDTO<Long> result = client.runJob(jobId, "params", 60000);
```
### 启用/禁用/删除任务
```java
// 启用任务
client.enableJob(jobId);

// 禁用任务
client.disableJob(jobId);

// 删除任务
client.deleteJob(jobId);
```
## 实例管理 API
### 查询实例
```java
// 查询实例状态
ResultDTO<Integer> status = client.fetchInstanceStatus(instanceId);

// 查询实例详情
ResultDTO<InstanceInfoDTO> info = client.fetchInstanceInfo(instanceId);

// 分页查询实例
InstancePageQuery query = new InstancePageQuery()
    .setJobIdEq(jobId)
    .setStatusIn(Lists.newArrayList(3, 4))
    .setSortBy("actualTriggerTime")
    .setAsc(false)
    .setPageSize(20);

ResultDTO<PageResult<InstanceInfoDTO>> result = client.queryInstanceInfo(query);
```
### 停止实例
```java
// 停止运行中的实例
client.stopInstance(instanceId);

// 取消尚未开始的实例
client.cancelInstance(instanceId);
```
### 重试实例
```java
// 重试失败的实例
client.retryInstance(instanceId);
```
## 工作流管理 API
### 创建工作流
```java
SaveWorkflowRequest request = new SaveWorkflowRequest();
request.setWfName("订单处理流程");
request.setTimeExpressionType(TimeExpressionType.API);
request.setMaxWfInstanceNum(1);

// 构建DAG
PEWorkflowDAG dag = new PEWorkflowDAG();
// ... 设置节点和边
request.setDag(dag);

ResultDTO<Long> result = client.saveWorkflow(request);
```
### 运行工作流
```java
// 基础运行
ResultDTO<Long> result = client.runWorkflow(workflowId, null, 0);

// 带初始参数运行
ResultDTO<Long> result = client.runWorkflow(workflowId, "{\"orderId\":\"123\"}", 0);

```
### 查询工作流
```java
// 查询工作流详情
ResultDTO<WorkflowInfoDTO> wf = client.fetchWorkflow(workflowId);
```
### 工作流实例管理
```java
// 停止工作流实例
client.stopWorkflowInstance(wfInstanceId);

// 重试工作流实例
client.retryWorkflowInstance(wfInstanceId);

// 标记节点成功
client.markWorkflowNodeAsSuccess(wfInstanceId, nodeId);

// 查询工作流实例详情
ResultDTO<WorkflowInstanceInfoDTO> info = client.fetchWorkflowInstanceInfo(wfInstanceId);
```
## 完整示例
### 定时数据同步任务
```java
public class PowerJobDemo {

    public static void main(String[] args) {
        // 初始化客户端
        PowerJobClient client = new PowerJobClient(
            "127.0.0.1:7700",
            "my-app",
            "my-password"
        );

        // 创建定时任务
        SaveJobInfoRequest jobRequest = new SaveJobInfoRequest();
        jobRequest.setJobName("数据同步");
        jobRequest.setJobDescription("每天凌晨2点同步数据");
        jobRequest.setTimeExpressionType(TimeExpressionType.cron);
        jobRequest.setTimeExpression("0 0 2 * * ?");
        jobRequest.setExecuteType(ExecuteType.standalone);
        jobRequest.setProcessorType(ProcessorType.builtIn);
        jobRequest.setProcessorInfo("com.example.DataSyncProcessor");
        jobRequest.setConcurrency(3);
        jobRequest.setMaxInstanceNum(1);

        ResultDTO<Long> result = client.saveJob(jobRequest);
        if (result.isSuccess()) {
            System.out.println("任务创建成功，ID: " + result.getData());
        }

        // 手动触发一次
        ResultDTO<Long> runResult = client.runJob(result.getData(), null, 0);
        System.out.println("任务触发成功，实例ID: " + runResult.getData());

        client.close();
    }
}
```
### 批量处理任务
```java
public class BatchProcessDemo {

    public static void main(String[] args) {
        PowerJobClient client = new PowerJobClient(
            "127.0.0.1:7700",
            "batch-app",
            "password"
        );

        // 创建MapReduce任务
        SaveJobInfoRequest jobRequest = new SaveJobInfoRequest();
        jobRequest.setJobName("批量数据处理");
        jobRequest.setExecuteType(ExecuteType.map_reduce);
        jobRequest.setProcessorType(ProcessorType.builtIn);
        jobRequest.setProcessorInfo("com.example.BatchProcessor");
        jobRequest.setConcurrency(10);

        ResultDTO<Long> jobResult = client.saveJob(jobRequest);
        if (!jobResult.isSuccess()) {
            return;
        }

        Long jobId = jobResult.getData();

        // 触发任务处理一批数据
        List<Long> userIds = Arrays.asList(1L, 2L, 3L, /* ... */ 1000L);
        String instanceParams = JSON.toJSONString(userIds);

        ResultDTO<Long> runResult = client.runJob(jobId, instanceParams, 0);
        System.out.println("任务触发成功，实例ID: " + runResult.getData());

        // 查询执行状态
        while (true) {
            ResultDTO<Integer> statusResult = client.fetchInstanceStatus(runResult.getData());
            if (statusResult.getData() != 3) { // 非运行中
                break;
            }
            Thread.sleep(1000);
        }

        // 获取结果
        ResultDTO<InstanceInfoDTO> infoResult = client.fetchInstanceInfo(runResult.getData());
        System.out.println("执行结果: " + infoResult.getData().getResult());

        client.close();
    }
}
```
## API 刱询表
| API | 说明 |
|-----|------|
| saveJob | 创建/更新任务 |
| fetchJob | 查询任务详情 |
| fetchAllJob | 查询所有任务 |
| queryJob | 条件查询任务 |
| runJob | 触发任务执行 |
| enableJob | 启用任务 |
| disableJob | 禁用任务 |
| deleteJob | 删除任务 |
| fetchInstanceStatus | 查询实例状态 |
| fetchInstanceInfo | 查询实例详情 |
| queryInstanceInfo | 分页查询实例 |
| stopInstance | 停止实例 |
| cancelInstance | 取消实例 |
| retryInstance | 重试实例 |
| saveWorkflow | 创建/更新工作流 |
| fetchWorkflow | 查询工作流详情 |
| runWorkflow | 触发工作流执行 |
| stopWorkflowInstance | 停止工作流实例 |
| retryWorkflowInstance | 重试工作流实例 |
| markWorkflowNodeAsSuccess | 标记节点成功 |
| fetchWorkflowInstanceInfo | 查询工作流实例详情 |
## 下一步
- [处理器开发](/zh/guide/processor) - 开发自定义处理器
- [Spring Boot 集成](/zh/guide/spring-boot) - Spring Boot 快速集成
