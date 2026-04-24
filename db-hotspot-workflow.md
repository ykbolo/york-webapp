# AI 热点追踪数据库连通与运维工作流 (Workflow)

本工作流详细说明了如何连接、管理和维护 AI 热点追踪板块的数据库环境。

## 1. 基础连接信息
- **服务器 IP**: `122.51.6.210` (CentOS 7)
- **连接方式**: SSH (使用 PEM 密钥)
- **密钥路径**: `C:\Users\DELL\Desktop\york_20260423.pem`
- **数据库容器**: `york-mysql` (MySQL 8.0)
- **数据库名**: `hotspot_db`
- **默认用户**: `root`
- **初始密码**: `york_password_2026`

---

## 2. 核心运维指令

### 2.1 检查数据库状态
确认 MySQL 容器是否正常运行：
```powershell
ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker ps | grep york-mysql"
```

### 2.2 进入数据库命令行
直接进入 MySQL 交互式终端：
```powershell
ssh -t -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker exec -it york-mysql mysql -uroot -pyork_password_2026 -D hotspot_db"
```

### 2.3 查看热点数据统计
快速查看当前入库量：
```powershell
ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker exec york-mysql mysql -uroot -pyork_password_2026 -D hotspot_db -e 'SELECT source, COUNT(*) FROM hotspots GROUP BY source;'"
```

---

## 3. 开发连通性设置

### 3.1 本地开发连接 (SSH 隧道)
如果你想在本地使用数据库客户端 (如 Navicat/DBeaver) 连接服务器数据库：
1.  **建立隧道**:
    ```powershell
    ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" -L 3307:localhost:3306 root@122.51.6.210
    ```
2.  **连接配置**:
    - 主机: `localhost`
    - 端口: `3307`
    - 用户: `root`
    - 密码: `york_password_2026`

### 3.2 后端代码连接配置
在 `backend/.env` 或 `backend/db.js` 中确保以下配置：
```javascript
{
  host: process.env.DB_HOST || 'localhost', // 本地运行则设为 localhost (需配合隧道) 或服务器 IP
  user: 'root',
  password: 'york_password_2026',
  database: 'hotspot_db'
}
```

---

## 4. 故障恢复

### 4.1 重启数据库服务
如果数据库连接超时，尝试重启容器：
```powershell
ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker restart york-mysql"
```

### 4.2 查看数据库日志
排查数据库内部错误：
```powershell
ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker logs york-mysql"
```

---

## 5. 爬虫入库流转
1. **Scraper** 抓取数据 -> 2. **Pipeline** 去重处理 -> 3. **MySQL** 写入 -> 4. **API** 分页读取 -> 5. **Frontend** 卡片展示
