# 安装部署

本文档介绍 PowerJob 的多种部署方式，您可以根据实际需求选择合适的方案。

## 环境要求

### 硬件要求

| 组件 | 最低配置 | 推荐配置 | 说明 |
|------|---------|---------|------|
| CPU | 2 核 | 4 核+ | 并发任务较多时建议更高配置 |
| 内存 | 2 GB | 4 GB+ | Server 端建议至少 4GB |
| 磁盘 | 10 GB | 50 GB+ | 根据日志和数据量调整 |

### 软件要求

| 软件 | 版本要求 | 必需/可选 | 说明 |
|------|---------|----------|------|
| JDK | 8+ | 必需 | 推荐使用 JDK 11 或 JDK 17 |
| MySQL | 5.7+ / 8.0+ | 必需 | 推荐 MySQL 8.0+ |
| Maven | 3.6+ | 可选 | 仅源码编译时需要 |
| Docker | 19.03+ | 可选 | 仅 Docker 部署时需要 |
| Docker Compose | 1.25+ | 可选 | 仅 Docker Compose 部署时需要 |

### 网络端口

PowerJob Server 需要开放以下端口：

| 端口 | 协议 | 用途 | 必需/可选 |
|------|------|------|----------|
| 7700 | HTTP | Web 控制台 | 必需 |
| 10010 | HTTP | Worker 通信 | 必需 |
| 10086 | AKKA | Worker 通信（旧版） | 可选 |
| 10077 | MU | Worker 通信（实验性） | 可选 |

> **注意**：如果使用防火墙，请确保上述端口可访问。

## 快速开始

使用 Docker Compose 可以在 5 分钟内启动完整的 PowerJob 环境（包括 MySQL、Server 和示例 Worker）。

### 前置条件

确保已安装 Docker 和 Docker Compose：

```bash
docker --version
docker-compose --version
```

### 启动步骤

1. **下载项目**

```bash
git clone https://github.com/PowerJob/PowerJob.git
cd PowerJob
```

2. **启动服务**

```bash
docker-compose up -d
```

3. **等待服务就绪**

```bash
# 查看服务状态
docker-compose ps

# 查看服务日志（确认启动成功）
docker-compose logs -f powerjob-server
```

当看到类似 `Started PowerJobServerApplication in X seconds` 的日志时，表示启动成功。

4. **访问控制台**

打开浏览器访问：http://localhost:7703

默认账号密码：
- 用户名：`powerjob_admin`
- 密码：`powerjob_admin`

### 服务说明

启动的服务包括：

| 服务 | 容器名 | 端口映射 | 说明 |
|------|--------|----------|------|
| MySQL | powerjob-mysql | 3307:3306 | 数据库服务 |
| Server | powerjob-server | 7700:7700, 10010:10010 | 调度服务器 |
| Worker Samples | powerjob-worker-samples | 8081:8081, 27777:27777 | 示例执行器 |

### 停止服务

```bash
docker-compose down
```

如需同时删除数据卷：

```bash
docker-compose down -v
```

## Docker 部署

PowerJob 提供 Docker 镜像，支持灵活的部署方式。

### 单容器部署

适用于已有独立 MySQL 数据库的场景。

#### 前置准备

1. **创建数据库**

```sql
CREATE DATABASE IF NOT EXISTS powerjob_daily DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **初始化数据库表结构**

下载 SQL 脚本并执行：

```bash
# 下载对应版本的 SQL 脚本（以 5.1.2 为例）
wget https://github.com/PowerJob/PowerJob/releases/download/v5.1.2/powerjob_mysql_5.1.2.sql

# 导入数据库
mysql -h localhost -u root -p powerjob_daily < powerjob_mysql_5.1.2.sql
```

或使用 Docker 执行：

```bash
docker run --rm -v $(pwd):/data mysql:8.0 \
  mysql -h<your-mysql-host> -u<user> -p<password> powerjob_daily < /data/powerjob_mysql_5.1.2.sql
```

#### 启动 Server

```bash
docker run -d \
  --name powerjob-server \
  -p 7700:7700 \
  -p 10010:10010 \
  -e PARAMS="--spring.datasource.core.jdbc-url=jdbc:mysql://<host>:3306/powerjob_daily?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai --spring.datasource.core.username=<user> --spring.datasource.core.password=<password>" \
  powerjob/powerjob-server:latest
```

请将 `<host>`、`<user>`、`<password>` 替换为实际值。

#### 查看日志

```bash
docker logs -f powerjob-server
```

#### 配置持久化

可选：挂载本地目录用于持久化数据：

```bash
docker run -d \
  --name powerjob-server \
  -p 7700:7700 \
  -p 10010:10010 \
  -v /path/to/powerjob-data:/root/powerjob/server \
  -e PARAMS="--spring.datasource.core.jdbc-url=..." \
  powerjob/powerjob-server:latest
```

### Docker Compose 部署

适用于从零开始搭建完整环境的场景。

#### 方式一：使用项目自带配置

```bash
# 1. 克隆项目
git clone https://github.com/PowerJob/PowerJob.git
cd PowerJob

# 2. 修改配置（可选）
# 编辑 docker-compose.yml，自定义数据库密码、端口等

# 3. 启动
docker-compose up -d
```

#### 方式二：自定义配置

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: powerjob-mysql
    environment:
      MYSQL_ROOT_PASSWORD: No1Bug2Please3!
      MYSQL_DATABASE: powerjob_daily
    ports:
      - "3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./powerjob_mysql_5.1.2.sql:/docker-entrypoint-initdb.d/init.sql
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  powerjob-server:
    image: powerjob/powerjob-server:latest
    container_name: powerjob-server
    depends_on:
      - mysql
    ports:
      - "7700:7700"
      - "10010:10010"
    environment:
      PARAMS: "--spring.datasource.core.jdbc-url=jdbc:mysql://mysql:3306/powerjob_daily?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai --spring.datasource.core.username=root --spring.datasource.core.password=No1Bug2Please3!"
      JVMOPTIONS: "-Xmx512m -Xms512m"
    volumes:
      - server-data:/root/powerjob/server
    restart: unless-stopped

volumes:
  mysql-data:
  server-data:
```

启动：

```bash
docker-compose up -d
```

### 常用运维命令

```bash
# 查看运行状态
docker ps | grep powerjob

# 查看日志
docker logs -f powerjob-server

# 进入容器
docker exec -it powerjob-server bash

# 停止服务
docker stop powerjob-server

# 删除容器
docker rm powerjob-server

# 重启服务
docker restart powerjob-server
```

## 源码编译部署

适用于需要自定义代码或参与开发的场景。

### 环境检查

```bash
# 检查 JDK 版本
java -version

# 检查 Maven 版本
mvn -version
```

### 编译打包

```bash
# 1. 克隆项目
git clone https://github.com/PowerJob/PowerJob.git
cd PowerJob

# 2. 编译打包（跳过测试以加快速度）
mvn clean install -DskipTests

# 3. 编译产物位置
# Server: powerjob-server/powerjob-server-starter/target/powerjob-server-starter-${version}.jar
# Worker: powerjob-worker/powerjob-worker-samples/target/powerjob-worker-samples-${version}.jar
```

### 启动 Server

```bash
# 1. 创建数据库并初始化（参考 Docker 部署章节）

# 2. 修改配置文件
cd powerjob-server/powerjob-server-starter/src/main/resources
# 编辑 application.properties 和 application-*.properties

# 3. 启动
cd ../../..
mvn spring-boot:run -pl powerjob-server/powerjob-server-starter

# 或直接运行 JAR
java -jar powerjob-server/powerjob-server-starter/target/powerjob-server-starter-${version}.jar
```

### 常见编译问题

**问题 1：依赖下载失败**

```bash
# 配置阿里云镜像（settings.xml）
<mirror>
  <id>aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>Aliyun Maven</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

**问题 2：编译内存不足**

```bash
# 增加 Maven 内存
export MAVEN_OPTS="-Xmx2048m -Xms512m"
```

## 配置说明

PowerJob Server 的配置文件位于 `powerjob-server-starter/src/main/resources/` 目录下。

### 核心配置

#### application.properties

```properties
# HTTP 服务端口
server.port=7700

# 环境配置：daily（开发）、pre（预发）、product（生产）
spring.profiles.active=daily

# 传输协议配置
oms.transporter.active.protocols=AKKA,HTTP,MU
oms.transporter.main.protocol=HTTP

# 端口配置
oms.akka.port=10086      # AKKA 协议端口（旧版兼容）
oms.http.port=10010      # HTTP 协议端口（推荐）
oms.mu.port=10077        # MU 协议端口（实验性）

# 数据库表前缀（可选）
oms.table-prefix=

# 认证配置
oms.auth.initiliaze.admin.password=powerjob_admin  # 管理员初始密码
oms.auth.openapi.enable=false                      # 是否开启 OpenAPI
```

#### 数据库配置

```properties
# 数据库驱动
spring.datasource.core.driver-class-name=com.mysql.cj.jdbc.Driver

# 数据库连接 URL
spring.datasource.core.jdbc-url=jdbc:mysql://localhost:3306/powerjob-daily?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai

# 数据库用户名
spring.datasource.core.username=root

# 数据库密码
spring.datasource.core.password=No1Bug2Please3!

# 连接池配置
spring.datasource.core.maximum-pool-size=20    # 最大连接数
spring.datasource.core.minimum-idle=5           # 最小空闲连接数
```

### 可选配置

#### 存储配置

```properties
# MongoDB 存储（用于存储大文件，可选）
# oms.storage.dfs.mongodb.uri=mongodb://localhost:27017/powerjob-daily
```

#### 邮件告警配置

```properties
spring.mail.host=smtp.qq.com
spring.mail.username=your-email@qq.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

#### 钉钉告警配置

```properties
oms.alarm.ding.app-key=your-app-key
oms.alarm.ding.app-secret=your-app-secret
oms.alarm.ding.agent-id=your-agent-id
```

#### 资源清理配置

```properties
# 实例信息保留天数（超过此天数的实例信息将被清理）
oms.instanceinfo.retention=7

# 容器保留天数
oms.container.retention.local=7    # 本地容器
oms.container.retention.remote=-1  # 远程容器（-1 表示不清理）
```

#### 缓存配置

```properties
# 实例元数据缓存大小
oms.instance.metadata.cache.size=2048
```

#### 精确获取服务器阈值

```properties
# 0~100，100 表示完全检测。值越高，脑裂风险越低，但性能开销越大
oms.accurate.select.server.percentage=50
```

### 环境配置文件

| 文件 | 环境 | 说明 |
|------|------|------|
| application-daily.properties | 开发环境 | 用于日常开发测试 |
| application-pre.properties | 预发环境 | 用于上线前验证 |
| application-product.properties | 生产环境 | 用于正式生产环境 |

### JVM 参数配置

通过环境变量 `JVMOPTIONS` 设置 JVM 参数：

```bash
# Docker 部署
docker run -e JVMOPTIONS="-Xmx1g -Xms1g -XX:+UseG1GC" ...

# 源码启动
export JVMOPTIONS="-Xmx1g -Xms1g"
java $JVMOPTIONS -jar powerjob-server-starter.jar
```

推荐配置：

| 场景 | JVM 参数 |
|------|---------|
| 开发环境 | `-Xmx512m -Xms512m` |
| 生产环境（小规模） | `-Xmx1g -Xms1g -XX:+UseG1GC` |
| 生产环境（大规模） | `-Xmx2g -Xms2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200` |

## 验证与排查

### 安装验证

#### 1. 端口检查

```bash
# 检查端口是否监听
netstat -tlnp | grep -E "7700|10010"

# 或使用 ss 命令
ss -tlnp | grep -E "7700|10010"
```

#### 2. 服务健康检查

```bash
# 访问健康检查接口
curl http://localhost:7703/health

# 预期返回
{"status":"UP"}
```

#### 3. 数据库连接检查

```bash
# 检查数据库表是否创建成功
mysql -h localhost -u root -p -e "USE powerjob_daily; SHOW TABLES;"

# 应该看到类似以下表
# app_info, container_info, instance_info, job_info, ...
```

#### 4. Web 控制台访问

打开浏览器访问：http://localhost:7703

使用默认账号登录：
- 用户名：`powerjob_admin`
- 密码：`powerjob_admin`

登录成功后，应该能看到控制台主界面。

### 日志查看

#### Docker 部署

```bash
# 查看实时日志
docker logs -f powerjob-server

# 查看最近 100 行日志
docker logs --tail 100 powerjob-server

# 查看特定时间范围的日志
docker logs --since 2024-03-01T00:00:00 powerjob-server
```

#### 源码部署

```bash
# 日志文件位置
tail -f logs/powerjob-server.log

# 或查看控制台输出
```

### 常见问题

#### 问题 1：数据库连接失败

**现象**：日志中出现 `Could not open connection to database`

**排查步骤**：

1. 检查数据库是否启动
```bash
mysql -h localhost -u root -p -e "SELECT 1"
```

2. 检查数据库地址、端口、用户名、密码配置是否正确

3. 检查数据库防火墙设置
```bash
# 开放 MySQL 端口
sudo ufw allow 3306
```

4. 检查数据库是否创建了对应的数据库和表结构
```bash
mysql -h localhost -u root -p -e "USE powerjob_daily; SHOW TABLES;"
```

**解决方案**：确保数据库配置正确，并执行了初始化 SQL 脚本。

#### 问题 2：端口冲突

**现象**：日志中出现 `Address already in use` 或 `port 7700 is already in use`

**排查步骤**：

```bash
# 查找占用端口的进程
lsof -i :7700
netstat -tlnp | grep 7700
```

**解决方案**：

方案一：停止占用端口的进程
```bash
kill -9 <PID>
```

方案二：修改 PowerJob 端口
```properties
# application.properties
server.port=7701
oms.http.port=10011
```

#### 问题 3：内存不足

**现象**：日志中出现 `OutOfMemoryError` 或服务频繁重启

**排查步骤**：

```bash
# 查看 Docker 容器内存使用
docker stats powerjob-server

# 查看 JVM 内存使用
jps -l | grep powerjob
jmap -heap <PID>
```

**解决方案**：

```bash
# 增加 JVM 内存
docker run -e JVMOPTIONS="-Xmx1g -Xms1g" ...

# 或修改 docker-compose.yml
environment:
  JVMOPTIONS: "-Xmx1g -Xms1g"
```

#### 问题 4：Worker 无法连接 Server

**现象**：Worker 启动后无法注册到 Server，控制台看不到 Worker

**排查步骤**：

1. 检查 Server 端口是否开放
```bash
curl http://<server-ip>:7703/health
```

2. 检查 Worker 配置的 Server 地址是否正确
```properties
powerjob.worker.server-address=<server-ip>:7700
```

3. 检查防火墙设置
```bash
# 开放所需端口
sudo ufw allow 7700
sudo ufw allow 10010
```

4. 查看日志确认连接失败原因

**解决方案**：确保网络连通性，Worker 配置的 Server 地址正确。

#### 问题 5：启动缓慢

**现象**：Server 启动时间过长（超过 2 分钟）

**可能原因**：

1. 数据库连接慢
2. 磁盘 I/O 慢
3. 内存不足导致频繁 GC

**排查步骤**：

```bash
# 查看启动日志
docker logs powerjob-server | grep -i "started\|error"

# 检查数据库连接
mysql -h localhost -u root -p -e "SELECT NOW();"
```

**解决方案**：

1. 优化数据库连接配置
2. 使用 SSD 存储
3. 增加内存配置
4. 检查网络延迟

### 健康检查脚本

创建 `health_check.sh`：

```bash
#!/bin/bash

echo "PowerJob 健康检查"

# 检查端口
echo -n "检查端口 7700... "
if nc -z localhost 7700; then
    echo "✓ 正常"
else
    echo "✗ 异常"
    exit 1
fi

# 检查 HTTP 接口
echo -n "检查健康接口... "
if curl -s http://localhost:7703/health | grep -q "UP"; then
    echo "✓ 正常"
else
    echo "✗ 异常"
    exit 1
fi

# 检查数据库
echo -n "检查数据库连接... "
if mysql -h localhost -u root -p${MYSQL_PASSWORD} -e "USE powerjob_daily; SELECT COUNT(*) FROM app_info;" > /dev/null 2>&1; then
    echo "✓ 正常"
else
    echo "✗ 异常"
    exit 1
fi

echo "所有检查通过！"
```

## 下一步

恭喜！PowerJob Server 已经成功部署。

- 📚 [快速上手](/start/quick-start) - 了解如何创建第一个任务
- 🏗️ [Worker 接入](/advanced/worker) - 让应用接入 PowerJob
- 📖 [用户指南](/guide/) - 查看完整功能文档

如遇问题，请访问：
- 🐛 [GitHub Issues](https://github.com/PowerJob/PowerJob/issues)
- 💬 [官方文档](https://www.yuque.com/powerjob/guidence/intro)
