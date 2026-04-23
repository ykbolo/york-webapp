'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import AppCalendar from '@/components/calendar/AppCalendar';
import EventCard from '@/components/calendar/EventCard';
import EventPopup from '@/components/calendar/EventPopup';
import Link from 'next/link';
import './calendar.css';

moment.locale('zh-cn');

export default function CalendarPage() {
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [scene, setScene] = useState<'month' | 'day'>('month');
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [classificationActiveList, setClassificationActiveList] = useState(['国内赛事', '海外赛事']);
  const [activePanel, setActivePanel] = useState<string[]>(['进行中', '未开始', '已结束']);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | undefined>(undefined);
  
  const rightContainerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async (date: string) => {
    setLoading(true);
    try {
      const begin = moment(date).startOf('month').format('YYYY-MM-DD');
      const end = moment(date).endOf('month').format('YYYY-MM-DD');
      const response = await fetch(`http://localhost:3005/api/calendar/events?begin=${begin}&end=${end}`);
      const data = await response.json();
      if (data.code === 0) {
        setList(data.obj.eventList || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectDate);
  }, [selectDate]);

  const listFiltered = useMemo(() => {
    return list.filter(item => classificationActiveList.includes(item.classification));
  }, [list, classificationActiveList]);

  const listGroupMap = useMemo(() => {
    const groups: Record<string, any[]> = {
      '进行中': [],
      '未开始': [],
      '已结束': []
    };

    const today = moment().format('YYYY-MM-DD');
    
    let filteredForScene = listFiltered;
    if (scene === 'day') {
      filteredForScene = listFiltered.filter(item => {
        const start = item.event_date_format;
        const end = item.event_end_time_format || start;
        return moment(selectDate).isBetween(start, end, 'day', '[]');
      });
    }

    filteredForScene.forEach(item => {
      const start = item.event_date_format;
      const end = item.event_end_time_format || start;

      if (moment(end).isBefore(today)) {
        groups['已结束'].push(item);
      } else if (moment(start).isAfter(today)) {
        groups['未开始'].push(item);
      } else {
        groups['进行中'].push(item);
      }
    });

    return groups;
  }, [listFiltered, scene, selectDate]);

  const handleClassificationClick = (type: string) => {
    setClassificationActiveList(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleDateChange = (date: string, newScene?: 'month' | 'day') => {
    setSelectDate(date);
    if (newScene) setScene(newScene);
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-bg-overlay"></div>
      
      <div className="calendar-content-wrapper">
        <div className="breadcrumb">
          <Link href="/">York 首页</Link>
          <span className="separator">&gt;</span>
          <span>乒乓球赛事日历</span>
        </div>

        <div className="page-header">
          <h1 className="page-title">乒乓球赛事日历</h1>
          <p className="page-subtitle">
            一站式获取全球最新、最全的乒乓球赛事资讯。从 WTT 大满贯赛到国内乒超联赛，实时追踪您的最爱选手的赛程安排。
          </p>
        </div>

        <div className="calendar-card">
          <div className="calendar-toolbar">
            <div className="date-selector">
              <div className="current-month">
                {moment(selectDate).format('YYYY年MM月')}
              </div>
              <div className="month-nav">
                <button onClick={() => handleDateChange(moment(selectDate).subtract(1, 'month').format('YYYY-MM-DD'), 'month')} className="nav-btn"><ChevronLeft size={18} /></button>
                <button onClick={() => handleDateChange(moment(selectDate).add(1, 'month').format('YYYY-MM-DD'), 'month')} className="nav-btn"><ChevronRight size={18} /></button>
              </div>
              <button onClick={() => handleDateChange(moment().format('YYYY-MM-DD'), 'day')} className="today-btn">今天</button>
            </div>

            <div className="filter-group">
              {[
                { label: '国内赛事', value: '国内赛事' },
                { label: '国际赛事', value: '海外赛事' }
              ].map(type => (
                <div 
                  key={type.value}
                  className={`filter-item ${classificationActiveList.includes(type.value) ? 'active' : ''} ${type.value}`}
                  onClick={() => handleClassificationClick(type.value)}
                >
                  <div className="checkbox">
                    {classificationActiveList.includes(type.value) && <div className="inner"></div>}
                  </div>
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="calendar-main-layout">
            <div className="calendar-grid-wrapper">
              {loading ? (
                <div className="calendar-loading">
                  <Loader2 className="animate-spin" size={40} />
                </div>
              ) : (
                <AppCalendar 
                  list={listFiltered}
                  selectDate={selectDate}
                  scene={scene}
                  onDateChange={handleDateChange}
                  onEventClick={(event, pos) => {
                    setSelectedEvent(event);
                    setPopupPosition(pos);
                  }}
                />
              )}
            </div>

            <div className="event-sidebar" ref={rightContainerRef}>
              <div className="sidebar-header">
                <h3>{scene === 'month' ? '本月赛程' : `${moment(selectDate).format('MM月DD日')}赛事`}</h3>
                {scene === 'day' && (
                  <span className="view-all" onClick={() => setScene('month')}>查看本月</span>
                )}
              </div>

              <div className="event-groups">
                {Object.entries(listGroupMap).map(([groupName, events]) => (
                  events.length > 0 && (
                    <div key={groupName} className="event-group">
                      <div 
                        className={`group-header ${groupName}`}
                        onClick={() => setActivePanel(prev => 
                          prev.includes(groupName) ? prev.filter(n => n !== groupName) : [...prev, groupName]
                        )}
                      >
                        <div className="status-dot"></div>
                        <span>{groupName}</span>
                        <ChevronRight 
                          size={16} 
                          className={`arrow ${activePanel.includes(groupName) ? 'open' : ''}`} 
                        />
                      </div>
                      {activePanel.includes(groupName) && (
                        <div className="group-content">
                          {events.map(event => (
                            <EventCard key={event.esid} item={event} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
                
                {listFiltered.length === 0 && !loading && (
                  <div className="empty-state">
                    <Info size={40} />
                    <p>暂无相关赛事</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <EventPopup 
          item={selectedEvent} 
          position={popupPosition} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
