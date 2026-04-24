'use client';

import React, { useEffect, useState } from 'react';
import HotspotCard, { HotspotItem } from '@/components/HotspotCard';
import styles from './page.module.css';

export default function AIHotspotsPage() {
  const [items, setItems] = useState<HotspotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHotspots = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3006/api/hotspots?page=${p}&pageSize=9`);
      const json = await res.json();
      if (json.code === 200) {
        setItems(json.data.list);
        setTotal(json.data.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch hotspots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots(page);
  }, [page]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI 热点追踪</h1>
        <p className={styles.subtitle}>实时聚合全球 AI 领域的最新动态与热点资讯</p>
      </header>

      {loading ? (
        <div className={styles.loader}>正在加载最新热点...</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <HotspotCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <footer className={styles.pagination}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={styles.pageBtn}
        >
          上一页
        </button>
        <span className={styles.pageInfo}>第 {page} 页 / 共 {Math.ceil(total / 9)} 页</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page * 9 >= total}
          className={styles.pageBtn}
        >
          下一页
        </button>
      </footer>
    </div>
  );
}
