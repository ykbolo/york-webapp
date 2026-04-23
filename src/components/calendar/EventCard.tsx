'use client';

import React from 'react';
import moment from 'moment';
import { getEventColor } from './AppCalendar';
import './event-card.css';

interface EventItem {
  esid: string;
  event_name: string;
  classification: string;
  event_date_format: string;
  event_end_time_format?: string;
  detail?: string;
}

interface EventCardProps {
  item: EventItem;
  onClick?: () => void;
}

export default function EventCard({ item, onClick }: EventCardProps) {
  const diffBefore = moment(item.event_date_format).diff(moment().format('YYYY-MM-DD'), 'days');
  const colors = getEventColor(item.esid);
  
  const getTag = () => {
    if (diffBefore === 1) return 'https://vcdn.pharmcube.com/drawbed/1726025238459_1(1).png';
    if (diffBefore === 2) return 'https://vcdn.pharmcube.com/drawbed/1726025238468_2(1).png';
    if (diffBefore === 3) return 'https://vcdn.pharmcube.com/drawbed/1726025238460_3(1).png';
    return null;
  };

  const tagUrl = getTag();

  return (
    <div 
      className={`event-card-item`} 
      style={{
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
      }}
      onClick={onClick}
    >
      <div className="card-header">
        <h4 className="card-title" style={{ color: colors.text }}>{item.event_name}</h4>
        {tagUrl && <img src={tagUrl} alt="countdown tag" className="countdown-tag" />}
      </div>
      
      {item.detail && <p className="card-detail">{item.detail}</p>}
      
      <div className="card-footer">
        <span className="time-range">
          {item.event_end_time_format && item.event_end_time_format !== item.event_date_format
            ? `${item.event_date_format} ~ ${item.event_end_time_format}`
            : item.event_date_format}
        </span>
      </div>
    </div>
  );
}
