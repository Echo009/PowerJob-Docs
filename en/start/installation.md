# Installation

::: warning Documentation in Progress
This page is under construction. Please check back later.
:::

## Requirements

- JDK 8+
- MySQL 5.7+
- Maven 3.6+

## Quick Deployment

### Docker (Recommended)

```bash
docker run -d \
  --name powerjob-server \
  -p 7700:7700 \
  -e PARAMS="--spring.profiles.active=product --spring.datasource.core.jdbc-url=jdbc:mysql://localhost:3306/powerjob-daily?useUnicode=true&characterEncoding=UTF-8 --spring.datasource.core.username=root --spring.datasource.core.password=YourPassword" \
  powerjob/powerjob-server:latest
```

### Build from Source

```bash
git clone https://github.com/PowerJob/PowerJob.git
cd PowerJob
mvn clean install -DskipTests
```

## Next Steps

- [Quick Start](/en/guide/quick-start) - Experience PowerJob in 5 minutes
