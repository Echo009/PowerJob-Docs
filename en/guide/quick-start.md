# Quick Start

::: warning Documentation in Progress
This page is under construction. Please check back later.
:::

## Prerequisites

- Completed [Installation](/en/guide/installation)
- Have a running Spring Boot application

## Step 1: Add Dependency

Add PowerJob dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.powerjob</groupId>
    <artifactId>powerjob-worker-spring-boot-starter</artifactId>
    <version>4.3.0</version>
</dependency>
```

## Step 2: Configure Application

Add configuration to `application.yml`:

```yaml
powerjob:
  worker:
    enabled: true
    app-name: powerjob-demo
    server-address: 127.0.0.1:7700
```

## Step 3: Write Processor

```java
@Component
public class MyProcessor implements BasicProcessor {

    @Override
    public ProcessResult process(TaskContext context) throws Exception {
        // Your business logic here
        return new ProcessResult(true, "Success");
    }
}
```

## Step 4: Create Task

1. Login to PowerJob console
2. Create an application
3. Create a task and select your processor
4. Run the task

## Next Steps

- [Core Concepts](/en/guide/architecture) - Learn about PowerJob's architecture
