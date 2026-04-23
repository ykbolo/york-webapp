import RelationGraph from '@/components/RelationGraph/RelationGraph';
import styles from './RelationPage.module.css';

export default function RelationPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <RelationGraph />
      </div>
    </main>
  );
}
