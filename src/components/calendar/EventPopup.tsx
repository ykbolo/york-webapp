'use client';

import React from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { getEventColor } from './AppCalendar';
import './event-popup.css';

interface EventPopupProps {
  item: any;
  onClose: () => void;
  position?: { x: number, y: number };
}

export default function EventPopup({ item, onClose, position }: EventPopupProps) {
  if (!item) return null;

  const colors = getEventColor(item.esid);

  const style: React.CSSProperties = position ? {
    position: 'fixed',
    left: position.x + 10,
    top: position.y + 10,
    zIndex: 1000,
  } : {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose} />
      <div className={`event-popup-card`} style={style}>
        <button className="close-btn" onClick={onClose}><X size={18} /></button>
        
        <div className="popup-header">
          <div className="type-badge" style={{ backgroundColor: colors.bg, color: colors.border }}>
            {item.classification}
          </div>
          <h3 className="popup-title">{item.event_name}</h3>
        </div>

        <div className="popup-body">
          <div className="info-row">
            <Calendar size={16} />
            <span>{item.event_date_format} {item.event_end_time_format ? `~ ${item.event_end_time_format}` : ''}</span>
          </div>
          
          <div className="info-row">
            <Tag size={16} />
            <span>{item.classification}</span>
          </div>

          <div className="divider" />
          
          <div className="popup-detail">
            <h4>赛事详情</h4>
            <p>{item.detail || '暂无详情介绍。'}</p>
          </div>
        </div>
        
        <div className="popup-footer">
          <button className="action-btn primary" style={{ backgroundColor: colors.border }}>查看详情</button>
          <button className="action-btn secondary" onClick={onClose}>关闭</button>
        </div>
      </div>
    </>
  );
}
