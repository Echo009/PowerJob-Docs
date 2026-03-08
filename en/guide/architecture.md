# Architecture

::: warning Documentation in Progress
This page is under construction. Please check back later.
:::

## Overall Architecture

PowerJob uses a Server-Worker architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    PowerJob Server                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Scheduler  │  │  Workflow   │  │   Console   │      │
│  │             │  │   Engine    │  │    (UI)     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                         │                                │
│                    ┌────┴────┐                          │
│                    │ Database│                          │
│                    └─────────┘                          │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Worker  │    │  Worker  │    │  Worker  │
    │   App A  │    │   App B  │    │   App C  │
    └──────────┘    └──────────┘    └──────────┘
```

## Core Components

### Server

- **Scheduler**: Responsible for timing and triggering tasks
- **Workflow Engine**: Handles DAG workflow orchestration and execution
- **Console**: Provides web-based management interface

### Worker

- **Task Execution**: Receives scheduling requests and executes tasks
- **Log Reporting**: Reports execution logs to the Server
- **Heartbeat**: Sends periodic heartbeats to the Server

## Next Steps

- [Task](/en/guide/task) - Learn about task concepts
- [Worker](/en/guide/worker) - Learn about worker configuration
