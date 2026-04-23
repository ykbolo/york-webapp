'use client';

import React, { useMemo, useState } from 'react';
import moment from 'moment';
import './app-calendar.css';

interface Event {
  esid: string;
  event_name: string;
  classification: string;
  event_date_format: string;
  event_end_time_format?: string;
  detail?: string;
}

interface AppCalendarProps {
  list: Event[];
  selectDate: string;
  scene: 'month' | 'day';
  onDateChange: (date: string, scene?: 'month' | 'day') => void;
  onEventClick: (event: Event, position: { x: number, y: number }) => void;
}

const MORANDI_COLORS = [
  { bg: '#e8ecef', border: '#b2bca3', text: '#5a6268' },
  { bg: '#f4e9e9', border: '#d4a5a5', text: '#6b4e4e' },
  { bg: '#eaf1f3', border: '#9bbec8', text: '#4a5d63' },
  { bg: '#f9f5ef', border: '#e3dac9', text: '#6d6559' },
  { bg: '#f0eff4', border: '#b8b5c3', text: '#55525d' },
  { bg: '#f2ece8', border: '#c0a692', text: '#645348' },
  { bg: '#f5f7f2', border: '#a3b18a', text: '#4e5645' },
  { bg: '#eceef0', border: '#90a4ae', text: '#37474f' },
];

export const getEventColor = (esid: string) => {
  let hash = 0;
  for (let i = 0; i < esid.length; i++) {
    hash = esid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MORANDI_COLORS[Math.abs(hash) % MORANDI_COLORS.length];
};

export default function AppCalendar({ list, selectDate, scene, onDateChange, onEventClick }: AppCalendarProps) {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const { calendarRows, dayNames } = useMemo(() => {
    const startOfMonth = moment(selectDate).startOf('month');
    const startDay = startOfMonth.clone().startOf('week'); 
    const endOfMonth = moment(selectDate).endOf('month');
    const endDay = endOfMonth.clone().endOf('week');

    const totalDays = endDay.diff(startDay, 'days') + 1;
    const allDays: any[] = [];
    
    let current = startDay.clone();
    for (let i = 0; i < totalDays; i++) {
      allDays.push({
        date: current.format('YYYY-MM-DD'),
        dayOfMonth: current.date(),
        isCurrentMonth: current.isSame(moment(selectDate), 'month'),
        isToday: current.isSame(moment(), 'day'),
        dayOfWeek: current.day(),
        slots: [] as (Event | null)[]
      });
      current.add(1, 'day');
    }

    const sortedAllEvents = [...list].sort((a, b) => {
      if (a.event_date_format !== b.event_date_format) {
        return a.event_date_format.localeCompare(b.event_date_format);
      }
      const aEnd = a.event_end_time_format || a.event_date_format;
      const bEnd = b.event_end_time_format || b.event_date_format;
      return bEnd.localeCompare(aEnd);
    });

    let maxSlotUsed = 0;

    sortedAllEvents.forEach(event => {
      const eventStart = event.event_date_format;
      const eventEnd = event.event_end_time_format || eventStart;
      
      let slotIndex = 0;
      while (true) {
        let isFree = true;
        for (let i = 0; i < allDays.length; i++) {
          const day = allDays[i];
          if (day.date >= eventStart && day.date <= eventEnd) {
            if (day.slots[slotIndex]) {
              isFree = false;
              break;
            }
          }
        }
        
        if (isFree) {
          for (let i = 0; i < allDays.length; i++) {
            const day = allDays[i];
            if (day.date >= eventStart && day.date <= eventEnd) {
              day.slots[slotIndex] = event;
            }
          }
          maxSlotUsed = Math.max(maxSlotUsed, slotIndex);
          break;
        }
        slotIndex++;
      }
    });

    allDays.forEach(day => {
      for (let s = 0; s <= maxSlotUsed; s++) {
        if (day.slots[s] === undefined) {
          day.slots[s] = null;
        }
      }
    });

    const rows = [];
    for (let i = 0; i < allDays.length; i += 7) {
      rows.push(allDays.slice(i, i + 7));
    }

    return { calendarRows: rows, dayNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] };
  }, [selectDate, list]);

  return (
    <div className="app-calendar">
      <table className="calendar-table">
        <thead>
          <tr>
            {dayNames.map(name => (
              <th key={name} className="weekday-label">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarRows.map((row: any[], rowIndex: number) => (
            <tr key={rowIndex} className="calendar-row">
              {row.map((day: any, dayIndex: number) => (
                <td 
                  key={day.date} 
                  className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''} ${scene === 'day' && selectDate === day.date ? 'selected' : ''}`}
                  onClick={() => onDateChange(day.date, 'day')}
                >
                  <div className="day-content">
                    <div className="day-header">
                      <span className="day-number">{day.isToday ? '今' : day.dayOfMonth}</span>
                    </div>
                    <div className="day-slots">
                      {day.slots.map((event: Event | null, slotIndex: number) => {
                        if (!event) return <div key={slotIndex} className="empty-slot"></div>;
                        
                        const isStart = event.event_date_format === day.date;
                        const isWeekStart = dayIndex === 0;
                        const showName = isStart || isWeekStart;
                        const colors = getEventColor(event.esid);

                        let spanInRow = 1;
                        if (showName) {
                          const eventEnd = event.event_end_time_format || event.event_date_format;
                          for (let k = dayIndex + 1; k < 7; k++) {
                            const nextDayDate = row[k].date;
                            if (nextDayDate <= eventEnd) {
                              spanInRow++;
                            } else {
                              break;
                            }
                          }
                        }

                        const isEnd = (event.event_end_time_format || event.event_date_format) === day.date;

                        return (
                          <div 
                            key={`${event.esid}-${slotIndex}`}
                            className={`calendar-event-bar 
                              ${isStart ? 'is-start' : 'is-sub'} 
                              ${isEnd ? 'is-end' : ''} 
                              ${hoveredEventId === event.esid ? 'behover' : ''}`}
                            style={{
                              backgroundColor: hoveredEventId === event.esid ? colors.border : colors.bg,
                              borderLeft: isStart ? `3px solid ${colors.border}` : 'none',
                              color: hoveredEventId === event.esid ? 'white' : colors.text,
                              transition: 'all 0.2s ease',
                              zIndex: showName ? 10 : 2
                            } as React.CSSProperties}
                            onMouseEnter={() => setHoveredEventId(event.esid)}
                            onMouseLeave={() => setHoveredEventId(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event, { x: e.clientX, y: e.clientY });
                            }}
                          >
                            {showName && (
                              <div 
                                className="event-text-container"
                                style={{ 
                                  left: isStart ? 0 : 18,
                                  width: isStart 
                                    ? `calc(${spanInRow * 100}% - 12px + ${(spanInRow - 1) * 2}px)`
                                    : `calc(${spanInRow * 100}% - 22px + ${(spanInRow - 1) * 2}px)`
                                }}
                              >
                                <span className="event-text" style={{ color: 'inherit' }}>{event.event_name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
