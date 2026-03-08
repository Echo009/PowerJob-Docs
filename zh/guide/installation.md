# 安装部署

::: warning 文档编写中
此页面内容正在编写中，敬请期待。
:::

## 环境要求

- JDK 8+
- MySQL 5.7+
- Maven 3.6+

## 快速部署

### Docker 部署（推荐）

```bash
docker run -d \
  --name powerjob-server \
  -p 7700:7700 \
  -e PARAMS="--spring.profiles.active=product --spring.datasource.core.jdbc-url=jdbc:mysql://localhost:3306/powerjob-daily?useUnicode=true&characterEncoding=UTF-8 --spring.datasource.core.username=root --spring.datasource.core.password=YourPassword" \
  powerjob/powerjob-server:latest
```

### 源码编译部署

```bash
git clone https://github.com/PowerJob/PowerJob.git
cd PowerJob
mvn clean install -DskipTests
```

## 下一步

- [5分钟上手](/guide/quick-start) - 快速体验 PowerJob
