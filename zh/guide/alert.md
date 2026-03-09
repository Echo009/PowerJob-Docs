# 报警通知

## 概述

PowerJob 提供完善的告警机制，支持多种通知渠道，确保任务异常时能及时通知相关人员。

## 告警类型

### 任务实例告警

| 触发场景 | 说明 |
|---------|------|
| 任务执行失败 | 任务运行过程中抛出异常或返回失败 |
| 任务重试 | 任务失败后触发重试 |
| 任务超时 | 任务执行时间超过设定的超时时间 |

### 工作流实例告警

| 触发场景 | 说明 |
|---------|------|
| 工作流执行失败 | 工作流中某节点失败导致整体失败 |
| 工作流超时 | 工作流执行时间超过设定值 |

## 告警渠道

### 渠道概览

| 渠道 | 配置方式 | 特点 |
|-----|---------|------|
| 邮件 | Server 配置 | 通用性强，支持附件 |
| 钉钉 | Server 配置 + 用户绑定 | 即时性强，支持 @ |
| WebHook | 用户级别配置 | 灵活自定义 |

### 邮件告警

#### Server 配置

```properties
# application.properties
spring.mail.host=smtp.example.com
spring.mail.port=465
spring.mail.username=your-email@example.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
```

#### 常用邮件服务器配置

| 邮箱 | SMTP 服务器 | 端口 |
|-----|------------|-----|
| QQ 邮箱 | smtp.qq.com | 465/587 |
| 163 邮箱 | smtp.163.com | 465/25 |
| 阿里邮箱 | smtp.aliyun.com | 465 |
| Gmail | smtp.gmail.com | 587 |

### 钉钉告警

#### 创建钉钉机器人

1. 打开钉钉群 → 群设置 → 智能群助手 → 添加机器人
2. 选择「自定义」机器人
3. 设置机器人名称和头像
4. 安全设置选择「自定义关键词」，添加「PowerJob」
5. 复制 Webhook 地址

#### Server 配置

```properties
# 钉钉企业内部应用配置（可选，用于 @ 指定用户）
oms.alarm.ding.app-key=ding-xxx
oms.alarm.ding.app-secret=xxx
oms.alarm.ding.agent-id=xxx
```

#### 用户绑定

在控制台用户设置中绑定钉钉手机号，即可接收钉钉告警。

### WebHook 告警

#### 配置方式

在控制台用户设置中配置 WebHook URL：

```
https://your-domain.com/webhook/powerjob
```

#### 请求格式

告警触发时，PowerJob 会向 WebHook 发送 POST 请求：

```json
{
    "title": "PowerJob 任务告警",
    "content": "appId: 123\njobId: 456\ninstanceId: 789\njobName: 数据同步任务\nstatus: FAILED\nresult: Connection timeout\nactualTriggerTime: 2024-01-01 10:30:00\nfinishedTime: 2024-01-01 10:30:05"
}
```

#### WebHook 服务示例

```java
@PostMapping("/webhook/powerjob")
public void handleAlarm(@RequestBody Map<String, String> payload) {
    String title = payload.get("title");
    String content = payload.get("content");

    // 自定义处理逻辑
    // 例如：转发到企业微信、Slack、短信平台等
    notificationService.send(title, content);
}
```

## 告警配置

### 任务级配置

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();

AlarmConfig alarmConfig = new AlarmConfig();
alarmConfig.setAlertThreshold(3);        // 连续失败 3 次触发告警
alarmConfig.setStatisticWindowLen(300);  // 统计窗口 5 分钟
alarmConfig.setSilenceWindowLen(3600);   // 沉默窗口 1 小时

request.setAlarmConfig(alarmConfig);
```

### 配置项说明

| 配置项 | 默认值 | 说明 |
|-------|-------|------|
| alertThreshold | 1 | 连续失败次数阈值 |
| statisticWindowLen | 300 | 统计窗口长度（秒） |
| silenceWindowLen | 600 | 沉默窗口长度（秒） |

### 告警抑制

沉默窗口机制避免告警风暴：

```mermaid
gantt
    title 告警抑制示例
    dateFormat mm:ss
    section 任务执行
    失败1 :crit, a1, 00:00, 1s
    失败2 :crit, a2, 00:30, 1s
    失败3 :crit, a3, 01:00, 1s
    section 告警
    发送告警 :milestone, alert1, 01:00, 0s
    沉默期 :silent, after alert1, 10m
    失败4 :crit, a4, 02:00, 1s
    失败5 :crit, a5, 03:00, 1s
    发送告警 :milestone, alert2, after silent, 0s
```

## 通知用户配置

### 控制台配置

1. 进入「应用管理」→「用户管理」
2. 编辑用户信息
3. 填写邮箱、手机号、WebHook
4. 在任务配置中选择通知用户

### 任务绑定通知用户

```java
SaveJobInfoRequest request = new SaveJobInfoRequest();
// ... 其他配置

// 设置通知用户（通过 OpenAPI）
// 在控制台中可直接选择
```

## 告警内容

### 任务告警内容示例

```
appId: 12345
jobId: 67890
instanceId: 111111
jobName: 数据同步任务
executeType: STANDALONE
processorType: BUILT_IN
timeExpressionType: CRON
status: FAILED
result: java.lang.RuntimeException: Connection timeout
expectedTriggerTime: 2024-01-01 10:30:00
actualTriggerTime: 2024-01-01 10:30:00
finishedTime: 2024-01-01 10:30:05
```

### 工作流告警内容示例

```
workflowId: 12345
wfInstanceId: 67890
workflowName: 订单处理流程
status: FAILED
peWorkflowDAG: {...}
actualTriggerTime: 2024-01-01 10:00:00
finishedTime: 2024-01-01 10:05:00
```

## 最佳实践

### 1. 合理设置告警阈值

```java
// 对于关键任务：立即告警
alarmConfig.setAlertThreshold(1);

// 对于非关键任务：容忍偶尔失败
alarmConfig.setAlertThreshold(3);
alarmConfig.setStatisticWindowLen(300);
```

### 2. 设置合理的沉默窗口

```java
// 对于频繁任务：避免告警风暴
alarmConfig.setSilenceWindowLen(3600);  // 1 小时

// 对于低频任务：缩短沉默时间
alarmConfig.setSilenceWindowLen(600);   // 10 分钟
```

### 3. 多渠道告警

- 关键任务：邮件 + 钉钉 + WebHook
- 普通任务：钉钉或邮件
- 可选告警：仅 WebHook

### 4. 告警分级处理

```java
// WebHook 中根据告警内容分级处理
if (content.contains("关键任务")) {
    // 发送短信或电话通知
    smsService.call(phone);
} else {
    // 发送普通通知
    notificationService.send(content);
}
```

## 故障排查

### 告警未发送

1. 检查 Server 邮件/钉钉配置是否正确
2. 检查用户邮箱/手机号是否已配置
3. 检查任务是否绑定了通知用户
4. 检查是否在沉默窗口期内

### 邮件发送失败

1. 检查 SMTP 服务器地址和端口
2. 检查用户名和密码（部分邮箱需使用授权码）
3. 检查 SSL/TLS 配置

### 钉钉发送失败

1. 检查机器人 Webhook 是否有效
2. 检查关键词是否匹配
3. 检查消息格式是否符合要求

## 下一步

- [任务运维](/zh/guide/operation) - 了解任务运维操作
- [OpenAPI 使用](/zh/guide/openapi) - 通过 API 配置告警
