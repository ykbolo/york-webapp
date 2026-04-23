import RelationGraph from '@/components/RelationGraph/RelationGraph';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import styles from './RelationPage.module.css';

export default function RelationPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.badge}>
            Advanced Analytics
          </div>
          <h1 className={styles.title}>
            运动员竞合 <span className={styles.gradientText}>拓扑图谱</span>
          </h1>
          <p className={styles.description}>
            基于多维度赛事数据构建的动态关联矩阵，深度解析职业球员间的技术对垒与职业纽带。
          </p>
        </header>
        
        <RelationGraph />
        
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Zap style={{ color: '#60a5fa' }} size={24} />
            </div>
            <h3 className={styles.featureTitle}>智能动力学布局</h3>
            <p className={styles.featureDescription}>
              采用高性能 D3 力导向仿真算法，实时计算节点间的引斥力平衡，即使在海量数据下也能保持连线的清晰与优雅。
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Activity style={{ color: '#a78bfa' }} size={24} />
            </div>
            <h3 className={styles.featureTitle}>实时交互反馈</h3>
            <p className={styles.featureDescription}>
              毫秒级响应的悬停过滤机制，自动高亮相关路径并压暗非相关信息，帮助分析师精准定位复杂的竞争网络。
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <ShieldCheck style={{ color: '#34d399' }} size={24} />
            </div>
            <h3 className={styles.featureTitle}>数据驱动决策</h3>
            <p className={styles.featureDescription}>
              所有连线与节点状态均与底层赛事数据库实时对齐，为技战术研究提供直观、可靠的视觉化证据支撑。
            </p>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>© 2026 YorkApp Visualizer</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>API Documentation</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
