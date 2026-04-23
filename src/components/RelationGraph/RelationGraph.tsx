'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, Download, Info } from 'lucide-react';
import { renderRelChart, killChart, destroyAllPop, saveChartAsImage } from './d3Renderer';
import { tableTennisData, GraphData } from './mockData';
import styles from './RelationGraph.module.css';

interface RelationGraphProps {
  data?: GraphData;
  title?: string;
}

const RelationGraph: React.FC<RelationGraphProps> = ({ 
  data = tableTennisData, 
  title = "乒乓球运动员赛事关联图谱" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initChart = () => {
    if (!containerRef.current) return;
    
    const mainId = 'malong'; 
    const processedNodes = data.nodes.map(node => ({
      ...node,
      isCenter: node.id === mainId,
      isNeighbor: data.edges.some(e => 
        (e.source === mainId && e.target === node.id) || 
        (e.target === mainId && e.source === node.id)
      ),
    }));

    renderRelChart({
      data: { ...data, nodes: processedNodes },
      lang: 'cn',
      options: {
        distance: 120,
        chargeStrength: -300,
        centerStrength: 0.1,
        onNodeClick: (node: any) => {
          console.log('Node clicked:', node);
        }
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      initChart();
      setLoading(false);
    }, 500);

    const handleResize = () => {
      initChart();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      killChart();
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [data]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error enabling full-screen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    
    setTimeout(initChart, 300);
  };

  const handleReset = () => {
    destroyAllPop();
    initChart();
  };

  const handleDownload = async () => {
    destroyAllPop();
    try {
      await saveChartAsImage('cn');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleIndicator}></div>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.badge}>Live Analysis</span>
        </div>
        
        <div className={styles.toolbar}>
          <button onClick={handleReset} className={styles.toolButton} title="重置布局">
            <RotateCcw size={18} />
          </button>
          <button onClick={handleDownload} className={styles.toolButton} title="导出 PNG">
            <Download size={18} />
          </button>
          <button onClick={toggleFullscreen} className={`${styles.toolButton} ${isFullscreen ? styles.toolButtonActive : ''}`} title={isFullscreen ? "退出全屏" : "开启全屏"}>
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} /> }
          </button>
        </div>
      </div>

      <div 
        id="chart-container" 
        ref={containerRef}
        className={`${styles.chartWrapper} ${isFullscreen ? styles.chartWrapperFullscreen : ''}`}
        style={{ cursor: 'grab' }}
      >
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Initializing Neural Graph</p>
          </div>
        )}
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotCore}`}></div>
            <span className={styles.legendText}>核心球员 (Core)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotDirect}`}></div>
            <span className={styles.legendText}>直接对手 (Direct)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotSecondary}`}></div>
            <span className={styles.legendText}>二级关联 (Secondary)</span>
          </div>
        </div>

        <div className={styles.footerInfo}>
          <Info size={12} style={{ color: 'var(--primary)' }} />
          <span>YorkApp Visualizer · Engine v1.0</span>
        </div>
      </div>
      
      <div className={styles.tipArea}>
        <p className={styles.tipText}>
          <strong className={styles.tipHighlight}>交互指南:</strong> 自由拖拽节点以调整拓扑布局，滚动缩放视野。点击球员节点可调阅实时战绩档案。
        </p>
      </div>
    </div>
  );
};

export default RelationGraph;
