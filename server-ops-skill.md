# 云端服务器运维技能手册 (CentOS 7)

本手册总结了连接和配置云端服务器 122.51.6.210 的常用指令与环境配置流程。

## 1. 基础连接
使用指定的 PEM 密钥连接服务器：
```powershell
ssh -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210
```

### 常见连接问题修复
如果遇到 "REMOTE HOST IDENTIFICATION HAS CHANGED" 错误，运行：
```powershell
ssh-keygen -R 122.51.6.210
```

如果遇到密钥权限过大（Windows 报错），运行：
```powershell
icacls "C:\Users\DELL\Desktop\york_20260423.pem" /inheritance:r
icacls "C:\Users\DELL\Desktop\york_20260423.pem" /grant:r "$($env:USERNAME):R"
```

## 2. 环境配置指令 (CentOS 7)

### 2.1 基础工具安装
```bash
yum install -y epel-release git curl
```

### 2.2 Node.js 安装 (NodeSource)
注意：CentOS 7 建议安装 v16 或更低版本以保证兼容性。
```bash
curl -sL https://rpm.nodesource.com/setup_16.x | bash -
yum install -y nodejs
```

### 2.3 Nginx 安装与启动
```bash
yum install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 2.4 进程管理 (PM2)
```bash
npm install -g pm2
pm2 list
```

## 3. 常用运维操作
- **查看日志：** `pm2 logs`
- **重启服务：** `systemctl restart nginx`
- **防火墙检查：** `firewall-cmd --list-all`
- **查看端口占用：** `netstat -ntlp`

## 4. AI 热点追踪数据库运维 (MySQL Docker)
详见 [db-hotspot-workflow.md](./db-hotspot-workflow.md)

- **容器名:** `york-mysql`
- **库名:** `hotspot_db`
- **快速进入命令行:**
  ```powershell
  ssh -t -i "C:\Users\DELL\Desktop\york_20260423.pem" root@122.51.6.210 "docker exec -it york-mysql mysql -uroot -pyork_password_2026 -D hotspot_db"
  ```
- **重启服务:** `docker restart york-mysql`
