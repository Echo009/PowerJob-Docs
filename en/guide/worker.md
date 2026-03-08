# Worker

::: warning Documentation in Progress
This page is under construction. Please check back later.
:::

## Overview

The Worker is the component that actually executes tasks, typically integrated into business applications.

## Quick Configuration

### Maven Dependency

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>${powerjob.version}</version>
</dependency>
```

### application.yml Configuration

```yaml
powerjob:
  worker:
    enabled: true
    app-name: your-app-name
    server-address: 127.0.0.1:7700
```

## Next Steps

- [Processor Development](/en/guide/processor) - Learn how to develop processors
