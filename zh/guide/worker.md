# 执行器

::: warning 文档编写中
此页面内容正在编写中，敬请期待。
:::

## 概述

执行器（Worker）是实际执行任务的组件，通常集成在业务应用中。

## 快速配置

### Maven 依赖

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```

### application.yml 配置

```yaml
powerjob:
  worker:
    enabled: true
    app-name: your-app-name
    server-address: 127.0.0.1:7700
```

## 下一步

- [处理器开发](/guide/processor) - 学习如何开发处理器
