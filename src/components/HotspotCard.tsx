import React from 'react';
import styles from './HotspotCard.module.css';

export interface HotspotItem {
  id: number;
  title: string;
  link: string;
  summary: string;
  source: string;
  hot_score: number;
  category: string;
  publish_time: string;
  created_at: string;
}

const HotspotCard: React.FC<{ item: HotspotItem }> = ({ item }) => {
  return (
    <div className={styles.card}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.category}>{item.category || 'AI资讯'}</span>
          <span className={styles.source}>{item.source}</span>
        </div>
        <h3 className={styles.title}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        <p className={styles.summary}>{item.summary || '暂无摘要内容...'}</p>
        <div className={styles.footer}>
          <div className={styles.hotScore}>
            <span className={styles.fireIcon}>🔥</span>
            <span>{item.hot_score || 0}</span>
          </div>
          <span className={styles.time}>
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotspotCard;
