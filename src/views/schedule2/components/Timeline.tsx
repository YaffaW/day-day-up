import React, { useState, useEffect, useMemo } from 'react';
import type { Task, ScheduleRecord } from '../types';
import { getWeeklySchedule } from '../utils/scheduleUtils';
import { scheduleApi } from '../../../api';
import './Timeline.css'; // Assuming you have some CSS for styling

interface TimelineProps {
  tasks: Task[];
  updateTaskStatus: (taskId: string, completed: boolean) => void;
  onTaskDrop: (taskOrId: Task | string, newStartTime: string, newEndTime: string, date: string) => void;
  deleteScheduleRecord: (recordId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, scheduleRecords, updateTaskStatus, onTaskDrop, deleteScheduleRecord }) => {
  const [week, setWeek] = useState<'lastWeek' | 'thisWeek' | 'nextWeek'>('thisWeek');
  const [backendScheduleRecords, setBackendScheduleRecords] = useState<any[]>([]); // 从后端获取的日程安排
  const [loading, setLoading] = useState(false);
  

  const now = new Date();
  const day = now.getDay(); // 0 (Sun) to 6 (Sat)

  // 计算周开始日期（周一）
  const weekStart = new Date(now);
  // 设置为当周的周一
  const daysFromMonday = day === 0 ? -6 : 1 - day; // 如果是周日则需要减6天到周一，否则计算到周一的天数差
  weekStart.setDate(weekStart.getDate() + daysFromMonday);

  // 根据当前选择的周计算日期
  const calculateWeekDates = (weekType: 'lastWeek' | 'thisWeek' | 'nextWeek') => {
    const offset = weekType === 'lastWeek' ? -7 : weekType === 'nextWeek' ? 7 : 0;
    const baseDate = new Date(now);
    baseDate.setDate(baseDate.getDate() + daysFromMonday + offset);
    
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const [dates, setDates] = useState<Date[]>(calculateWeekDates('thisWeek'));

  const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00 - ${10 + i}:00`); // 9:00 to 22:00

  const selectWeek = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'lastWeek' | 'thisWeek' | 'nextWeek';
    setWeek(value);
    setDates(calculateWeekDates(value));
  };

  // 获取日期字符串的辅助函数
  const formatDateStr = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, timeSlot: string, dayIndex: number) => {
    event.preventDefault();
    // 尝试获取从 TaskCard 拖拽的任务数据
    const taskData = event.dataTransfer.getData('task');
    const dropDate = formatDateStr(dates[dayIndex]);
    
    if (taskData) {
      // 如果是新的拖拽数据格式（包含完整任务对象）
      const droppedTask = JSON.parse(taskData);
      // 为任务添加时间信息，保持原有类型
      const [startTime, endTime] = timeSlot.split(' - ');
      onTaskDrop(droppedTask, startTime, endTime, dropDate);
    } else {
      // 兼容原来的拖拽数据格式（仅ID）
      const taskId = event.dataTransfer.getData('text/plain');
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const [startTime, endTime] = timeSlot.split(' - ');
        onTaskDrop(taskId, startTime, endTime, dropDate);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 从后端获取当前周的日程安排
  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      try {
        const startDate = formatDateStr(dates[0]);
        const endDate = formatDateStr(dates[6]);
        
        const response = await scheduleApi.getScheduleData({
          startDate,
          endDate
        });
        
        setBackendScheduleRecords(response);
      } catch (error) {
        console.error('Failed to fetch schedule data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheduleData();
  }, [dates]);

  // 根据后端获取的调度记录生成当周的任务安排
  const weeklySchedule = useMemo(() => {
    const days: { date: Date; tasks: any[] }[] = [];
    
    // 定义时间表时间段
    const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00 - ${10 + i}:00`); // 9:00 to 22:00
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(dates[i]);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // 获取该日期的后端调度记录
      const dayScheduleRecords = backendScheduleRecords.filter((record: any) => record.date === dateStr);
      
      // 将调度记录转换为任务显示格式
      const dayTasksFromRecords = dayScheduleRecords.map((record: any) => {
        // 如果调度记录有关联任务ID，查询对应任务信息
        const task = tasks.find((t: Task) => t.id === record.taskId);
        if (task) {
          return {
            taskId: task.id,
            recordId: record.id, // 添加记录ID用于删除
            title: task.title,
            themeColor: task.themeColor,
            startTime: record.startTime,
            endTime: record.endTime,
            isCompleted: record.isCompleted ?? task.isCompleted,
            description: task.description,
            taskType: task.type
          };
        } else {
          // 如果没有对应任务（如临时任务），使用调度记录中的信息
          return {
            taskId: record.taskId,
            recordId: record.id,
            title: record.title,
            themeColor: record.themeColor,
            startTime: record.startTime,
            endTime: record.endTime,
            isCompleted: record.isCompleted,
            description: record.description,
            taskType: 'regular' // 临时任务默认为regular类型
          };
        }
      });
      
      days.push({
        date,
        tasks: dayTasksFromRecords
      });
    }
    
    return {
      week: dates[0],
      days
    };
  }, [tasks, backendScheduleRecords, dates]);

  return (
    <div className="timeline-table-container">
      <table className="timeline-table">
        <thead>
          <tr>
            <th>
              <select name="" id="" value={week} onChange={selectWeek}>
                <option value="lastWeek">上周</option>
                <option value="thisWeek">本周</option>
                <option value="nextWeek">下周</option>
              </select>
            </th>
            {timeSlots.map((slot, idx) => (
              <th key={idx}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={timeSlots.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                Loading schedule...
              </td>
            </tr>
          ) : ['一', '二', '三', '四', '五', '六', '日'].map((day, dayIdx) => {
            const dayTasks = weeklySchedule.days[dayIdx].tasks;
            
            return (
              <tr key={dayIdx}>
                <td>
                  <div>星期{day}</div>
                  <div>{`${dates[dayIdx].getMonth() + 1}-${dates[dayIdx].getDate()}`}</div>
                </td>
                {timeSlots.map((slot, slotIdx) => {
                  // 找到在此时间段内的调度任务
                  const task = dayTasks.find(t => {
                    let startHour = 0;
                    let endHour = 0;
                    
                    if (typeof t.startTime === 'string') {
                      startHour = parseInt(t.startTime.split(':')[0], 10);
                    } else if (t.startTime && typeof t.startTime === 'object') {
                      // 如果是时间对象，需要转换为小时
                      startHour = t.startTime.hour || t.startTime.hours || 0;
                    }
                    
                    if (typeof t.endTime === 'string') {
                      endHour = parseInt(t.endTime.split(':')[0], 10);
                    } else if (t.endTime && typeof t.endTime === 'object') {
                      // 如果是时间对象，需要转换为小时
                      endHour = t.endTime.hour || t.endTime.hours || 0;
                    }
                    
                    return startHour <= 9 + slotIdx && endHour > 9 + slotIdx;
                  });
                  
                  return (
                    <td
                      key={slotIdx}
                      onDrop={e => handleDrop(e, slot, dayIdx)}
                      onDragOver={handleDragOver}
                      className="timeline-cell"
                    >
                      {
                        task ? (
                          <div
                            className="task-card"
                            style={{ backgroundColor: task.themeColor }}
                            draggable
                            onDragStart={e => {
                              e.dataTransfer.setData('text/plain', task.taskId);
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{task.title}</span>
                              <button
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  fontSize: '16px', 
                                  cursor: 'pointer',
                                  color: 'rgba(0,0,0,0.5)',
                                  marginLeft: '5px'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation(); // 防止事件冒泡触发其他操作
                                  if (task.recordId) {
                                    // 删除任何调度记录，无论是手动创建的还是自动生成的
                                    deleteScheduleRecord(task.recordId);
                                  }
                                }}
                              >
                                ×
                              </button>
                            </div>
                            <div 
                              className={`iconfont task-status ${task.isCompleted ? 'completed' : ''}`} 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.taskId, !task.isCompleted);
                              }}
                            >
                              &#xe7a7;
                            </div>
                          </div>
                        ) : null
                      }
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Timeline;