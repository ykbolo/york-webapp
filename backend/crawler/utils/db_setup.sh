#!/bin/bash

# 1. 检查并安装 Docker Compose (如果尚未安装)
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found, installing..."
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 2. 创建工作目录
mkdir -p /root/york-db
cd /root/york-db

# 3. 创建 docker-compose.yml
cat <<EOF > docker-compose.yml
version: '3.1'

services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: york_password_2026
      MYSQL_DATABASE: hotspot_db
    ports:
      - "3306:3306"
    volumes:
      - ./data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
EOF

# 4. 创建初始化脚本
cat <<EOF > init.sql
CREATE TABLE IF NOT EXISTS hotspots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    link VARCHAR(1024) UNIQUE NOT NULL,
    summary TEXT,
    source VARCHAR(64),
    hot_score INT DEFAULT 0,
    category VARCHAR(64),
    publish_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOF

# 5. 启动数据库
docker-compose up -d

echo "MySQL environment setup complete."
