# 5分钟上手 PowerJob

本文档将帮助你快速上手 PowerJob，通过一个简单的示例了解如何创建和执行你的第一个任务。

## 前置条件

在开始之前，请确保满足以下条件：

- **环境要求**：
  - JDK 8 或更高版本
  - 已安装 Maven 或 Gradle
  - Spring Boot 2.x/3.x 项目

- **PowerJob Server**：
  - 已完成 PowerJob Server 的部署（参考 [安装部署文档](/start/installation)）
  - 确认 Server 地址可访问（默认为 `127.0.0.1:7700`）

## 第一步：添加依赖

在您的 Spring Boot 项目中添加 PowerJob Worker 依赖。

### Maven

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>5.1.2</version>
</dependency>
```

### Gradle

```groovy
implementation 'tech.powerjob:powerjob-worker-spring-boot-starter:5.1.2'
```

::: tip 版本说明
- 最新版本请参考 [Maven Central](https://central.sonatype.com/artifact/tech.powerjob/powerjob-worker-spring-boot-starter)
- PowerJob 遵循语义化版本规范，推荐使用稳定版本
:::

## 第二步：配置应用

在 `application.yml` 或 `application.properties` 中添加 PowerJob Worker 配置。

### application.yml

```yaml
powerjob:
  worker:
    # 是否启用 PowerJob Worker，默认为 true
    enabled: true
    # 应用名称，用于在控制台注册应用
    app-name: powerjob-demo
    # PowerJob Server 地址，多个地址用逗号分隔
    server-address: 127.0.0.1:7700
    # Worker 通信端口，默认为 27777（可选）
    port: 27777
    # 通信协议：AKKA 或 HTTP，默认为 AKKA
    protocol: AKKA
    # 持久化策略：disk（磁盘）或 memory（内存），默认为 disk
    store-strategy: disk
    # 允许延迟连接 Server（开发环境可设为 true，避免 Server 未启动时报错）
    allow-lazy-connect-server: false
```

### application.properties

```properties
# 是否启用 PowerJob Worker
powerjob.worker.enabled=true
# 应用名称
powerjob.worker.app-name=powerjob-demo
# PowerJob Server 地址
powerjob.worker.server-address=127.0.0.1:7700
# Worker 通信端口
powerjob.worker.port=27777
# 通信协议
powerjob.worker.protocol=AKKA
# 持久化策略
powerjob.worker.store-strategy=disk
# 允许延迟连接 Server
powerjob.worker.allow-lazy-connect-server=false
```

::: tip 配置项说明
| 配置项 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `enabled` | 是否启用 Worker | `true` | 否 |
| `app-name` | 应用名称，必须与控制台注册的应用名称一致 | - | 是 |
| `server-address` | Server 地址，集群模式用逗号分隔 | - | 是 |
| `port` | Worker 通信端口 | `27777` | 否 |
| `protocol` | 通信协议（AKKA/HTTP） | `AKKA` | 否 |
| `store-strategy` | 持久化策略（disk/memory） | `disk` | 否 |
| `allow-lazy-connect-server` | 是否允许延迟连接 | `false` | 否 |
:::

## 第三步：编写处理器

创建一个实现 `BasicProcessor` 接口的类，并添加 `@Component` 注解使其被 Spring 托管。

```java
package com.example.powerjob;

import org.springframework.stereotype.Component;
import tech.powerjob.worker.core.processor.ProcessResult;
import tech.powerjob.worker.core.processor.TaskContext;
import tech.powerjob.worker.core.processor.sdk.BasicProcessor;
import tech.powerjob.worker.log.OmsLogger;

/**
 * 我的第一个 PowerJob 处理器
 */
@Component
public class MyFirstProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 获取在线日志记录器
        OmsLogger logger = context.getOmsLogger();

        // 记录日志，可在控制台实时查看
        logger.info("任务开始执行");

        // 获取任务参数
        String jobParams = context.getJobParams();
        logger.info("任务参数: {}", jobParams);

        // 编写你的业务逻辑
        try {
            // 示例：简单的数据处理
            logger.info("正在处理业务逻辑...");

            // 模拟业务处理
            Thread.sleep(1000);

            logger.info("任务执行成功");

            // 返回成功结果
            return new ProcessResult(true, "任务执行成功");

        } catch (Exception e) {
            logger.error("任务执行失败", e);
            // 返回失败结果
            return new ProcessResult(false, "任务执行失败: " + e.getMessage());
        }
    }
}
```

::: tip 处理器命名规则
- 处理器类名即为其在控制台的标识
- 可通过 `@Component("customName")` 自定义处理器名称
- 建议使用有意义的类名，便于在控制台识别
:::

::: tip ProcessResult 说明
`ProcessResult` 用于返回任务执行结果：
- `new ProcessResult(true)` - 返回成功，无额外信息
- `new ProcessResult(false)` - 返回失败，无额外信息
- `new ProcessResult(true, "成功消息")` - 返回成功并附带消息
- `new ProcessResult(false, "失败原因")` - 返回失败并附带原因
:::

## 第四步：创建应用

1. **启动 PowerJob Server**
   - 确保已启动 PowerJob Server
   - 默认访问地址：`http://127.0.0.1:7700`

2. **登录控制台**
   - 默认账号：`admin`
   - 默认密码：`admin`

3. **注册应用**
   - 点击左侧菜单「应用管理」
   - 点击「新建应用」按钮
   - 填写应用信息：
     - **应用名称**：`powerjob-demo`（必须与配置文件中的 `app-name` 一致）
     - **应用密码**：可选，用于 API 调用认证
     - **备注**：可选，填写应用说明
   - 点击「保存」完成注册

## 第五步：创建任务

1. **启动你的应用**
   - 运行 Spring Boot 应用
   - 观察日志，确认 Worker 成功连接到 Server
   - 在控制台「应用管理」页面，应该能看到在线机器

2. **创建任务**
   - 点击左侧菜单「任务管理」
   - 点击「新建任务」按钮
   - 填写任务信息：
     - **任务名称**：`我的第一个任务`
     - **处理器类型**：内建处理器（Built-in）
     - **处理器信息**：`myFirstProcessor`（处理器类名的首字母小写）
     - **任务参数**：可选，例如 `{"key":"value"}`
     - **执行配置**：
       - 执行类型：单机执行
       - 定时表达式：`0 */1 * * * ?`（每分钟执行一次）或选择空表示手动触发
     - **运行配置**：
       - 单机执行：超时时间 60000ms
   - 点击「保存」完成创建

3. **执行任务**
   - 在任务列表中找到刚创建的任务
   - 点击「运行」按钮
   - 在弹出的对话框中确认执行参数
   - 点击「确定」立即触发任务

## 第六步：查看执行结果

1. **查看任务状态**
   - 在「任务管理」页面，点击任务的「实例」按钮
   - 可以看到任务的执行历史记录
   - 状态包括：等待运行、运行中、成功、失败等

2. **查看在线日志**
   - 点击实例记录的「日志」按钮
   - 可以看到通过 `OmsLogger` 记录的所有日志
   - 日志实时上报，可在控制台即时查看

3. **查看执行结果**
   - 在实例详情中可以看到 `ProcessResult` 返回的消息
   - 可以查看执行时长、重试次数等信息

## 高级示例：使用参数处理

```java
@Component
public class ParamProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        OmsLogger logger = context.getOmsLogger();

        // 获取控制台配置的任务参数（静态参数）
        String jobParams = context.getJobParams();

        // 获取任务实例运行时参数（动态参数，通过 OpenAPI 触发时传入）
        String instanceParams = context.getInstanceParams();

        // 优先使用动态参数，没有则使用静态参数
        String actualParams = StringUtils.isNotBlank(instanceParams)
            ? instanceParams
            : jobParams;

        logger.info("静态参数(jobParams): {}", jobParams);
        logger.info("动态参数(instanceParams): {}", instanceParams);
        logger.info("实际使用参数: {}", actualParams);

        // 解析 JSON 参数
        if (StringUtils.isNotBlank(actualParams)) {
            JSONObject params = JSON.parseObject(actualParams);
            String username = params.getString("username");
            Integer count = params.getInteger("count");

            logger.info("用户名: {}, 计数: {}", username, count);

            // 业务处理逻辑...
        }

        return new ProcessResult(true, "参数处理完成");
    }
}
```

## 常见问题排查

### 1. Worker 连接失败

**现象**：应用启动日志提示连接 Server 失败

**排查步骤**：
- 检查 `server-address` 配置是否正确
- 确认 PowerJob Server 是否已启动
- 检查防火墙是否开放对应端口
- 确认网络是否可达（尝试 ping 或 telnet）

**解决方案**：
```yaml
# 开发环境可设置延迟连接，避免 Server 未启动导致应用启动失败
powerjob:
  worker:
    allow-lazy-connect-server: true
```

### 2. 找不到处理器

**现象**：控制台提示找不到指定的处理器

**排查步骤**：
- 确认处理器类已添加 `@Component` 注解
- 检查处理器信息是否正确（默认为类名首字母小写）
- 确认应用是否已启动并成功连接 Server

**解决方案**：
```java
// 指定处理器名称
@Component("myProcessor")
public class MyProcessor implements BasicProcessor {
    // ...
}
```

### 3. 任务不执行

**现象**：任务创建后不会自动执行

**排查步骤**：
- 检查执行类型配置
- 单机执行需要配置定时表达式或手动触发
- 确认应用是否有在线机器

**解决方案**：
- 设置定时表达式（如 `0 */1 * * * ?` 每分钟执行）
- 或使用「运行」按钮手动触发

### 4. 日志查看问题

**现象**：控制台看不到在线日志

**排查步骤**：
- 确认使用了 `context.getOmsLogger()` 记录日志
- 检查日志级别是否正确
- 确认任务实例状态是否为运行中或已完成

**最佳实践**：
```java
OmsLogger logger = context.getOmsLogger();
logger.info("关键业务日志");
logger.error("错误信息", exception);
```

## 下一步学习

恭喜你完成了第一个 PowerJob 任务！接下来可以学习：

- **[核心概念](/core/architecture)** - 了解 PowerJob 的架构设计和核心概念
- **[任务详解](/core/task)** - 深入学习各种任务类型的配置和使用
- **[处理器开发](/core/processor)** - 掌握单机、广播、MapReduce 等处理器的开发
- **[工作流](/advanced/workflow)** - 学习如何使用工作流编排复杂任务
- **[OpenAPI](/api/openapi)** - 了解如何通过 API 调用 PowerJob

## 完整示例代码

完整的示例代码可以在 PowerJob 仓库中找到：

- **GitHub**: [https://github.com/PowerJob/PowerJob/tree/main/powerjob-worker-samples](https://github.com/PowerJob/PowerJob/tree/main/powerjob-worker-samples)

示例包含：
- 单机处理器示例
- 广播处理器示例
- MapReduce 处理器示例
- 工作流示例
- 更多高级用法示例
