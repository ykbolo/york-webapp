This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🚀 AI 热点追踪板块接口文档 (Hotspot Service)

该服务运行在独立端口 `3006`，负责 AI 热点资讯的聚合与分发。

### 1. 获取热点列表 (分页)
- **URL**: `/api/hotspots`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (Optional): 页码，默认 `1`
  - `pageSize` (Optional): 每页数量，默认 `10`
- **Response**:
  ```json
  {
    "code": 200,
    "data": {
      "list": [
        {
          "id": 1,
          "title": "AI 动态标题",
          "link": "https://...",
          "summary": "内容摘要",
          "source": "来源",
          "hot_score": 100,
          "category": "分类",
          "created_at": "2026-04-24T..."
        }
      ],
      "pagination": {
        "total": 50,
        "page": 1,
        "pageSize": 10
      }
    }
  }
  ```

### 2. 获取分类统计
- **URL**: `/api/hotspots/stats`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "code": 200,
    "data": [
      { "category": "大模型", "count": 15 },
      { "category": "开源", "count": 8 }
    ]
  }
  ```

### 3. 运维说明
- **服务启动**: `node backend/hotspot-service.js`
- **数据库依赖**: 需连接 `hotspot_db` 数据库。

