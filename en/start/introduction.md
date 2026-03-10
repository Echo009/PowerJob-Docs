# Introduction

## What is PowerJob?

PowerJob (formerly OhMyScheduler) is a next-generation distributed scheduling and computing framework that allows you to easily complete job scheduling and distributed computing for complex tasks.

## Key Features

### Easy to Use
Provides a web-based frontend interface that allows developers to visually manage scheduled tasks (CRUD), monitor task status, and view execution logs.

### Comprehensive Scheduling Strategies
Supports four scheduling strategies: CRON expressions, fixed rate, fixed delay, and API.

### Rich Execution Modes
Supports four execution modes: standalone, broadcast, Map, and MapReduce. The Map/MapReduce processors enable developers to harness distributed computing power with just a few lines of code.

### DAG Workflow Support
Supports online configuration of task dependencies, visual task orchestration, and data passing between upstream and downstream tasks.

### Extensive Processor Support
Supports Spring Bean, built-in/external Java classes, Shell, Python, and more processor types.

### High Availability & High Performance
The scheduling server is carefully designed with a lock-free scheduling approach, unlike other scheduling frameworks that rely on database locks. Deploying multiple scheduling servers enables both high availability and improved performance (supports unlimited horizontal scaling).

## Use Cases

- **Scheduled Tasks**: Such as full data synchronization every morning, generating business reports
- **Broadcast Tasks**: Such as using broadcast execution mode to clean up cluster logs
- **Distributed Computing**: Such as updating large amounts of data where single-machine execution takes too long
- **Delayed Execution**: Such as handling expired orders

## Comparison with Alternatives

| Feature | QuartZ | xxl-job | SchedulerX 2.0 | PowerJob |
|---------|--------|---------|----------------|----------|
| Scheduling Types | CRON | CRON | CRON, Fixed Rate, Fixed Delay, OpenAPI | **CRON, Fixed Rate, Fixed Delay, OpenAPI** |
| Task Types | Built-in Java | Built-in Java, GLUE Java, Shell, Python | Built-in Java, External Java, Shell, Python | **Built-in Java, External Java, Shell, Python** |
| Distributed Computing | None | Static Sharding | MapReduce Dynamic Sharding | **MapReduce Dynamic Sharding** |
| Online Task Management | No | Yes | Yes | **Yes** |
| Log Visualization | No | Yes | No | **Yes** |
| Scheduling Performance | Database Lock | Database Lock | Unknown | **Lock-free Design** |

## Next Steps

- [Installation](/en/guide/installation) - Learn how to deploy PowerJob
- [Quick Start](/en/guide/quick-start) - Experience PowerJob's core features in 5 minutes
