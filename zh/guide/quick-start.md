# 5分钟上手

::: warning 文档编写中
此页面内容正在编写中，敬请期待。
:::

## 前置条件

- 已完成 [安装部署](/guide/installation)
- 有可运行的 Spring Boot 应用

## 第一步：添加依赖

在 `pom.xml` 中添加 PowerJob 依赖：

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>4.3.0</version>
</dependency>
```

## 第二步：配置应用

在 `application.yml` 中添加配置：

```yaml
powerjob:
  worker:
    enabled: true
    app-name: powerjob-demo
    server-address: 127.0.0.1:7700
```

## 第三步：编写处理器

```java
@Component
public class MyProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // 你的业务逻辑
        return new ProcessResult(true, "执行成功");
    }
}
```

## 第四步：创建任务

1. 登录 PowerJob 控制台
2. 创建应用
3. 创建任务，选择刚才编写的处理器
4. 运行任务

## 下一步

- [核心概念](/guide/architecture) - 了解 PowerJob 的架构设计
