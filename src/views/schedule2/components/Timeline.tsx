import React, { useState, useMemo } from 'react';
import type { Task, ScheduleRecord } from '../types';
import { getWeeklySchedule } from '../utils/scheduleUtils';
import './Timeline.css'; // Assuming you have some CSS for styling

interface TimelineProps {
  tasks: Task[];
  scheduleRecords: ScheduleRecord[];
  updateTaskStatus: (taskId: string, completed: boolean) => void;
  onTaskDrop: (taskOrId: Task | string, newStartTime: string, newEndTime: string, date: string) => void;
  deleteScheduleRecord: (recordId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, scheduleRecords, updateTaskStatus, onTaskDrop, deleteScheduleRecord }) => {
  const [week, setWeek] = useState<'lastWeek' | 'thisWeek' | 'nextWeek'>('thisWeek');

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

  // 根据调度记录生成当周的任务安排
  // 根据调度记录生成当周的任务安排
  const weeklySchedule = useMemo(() => {
    const days: { date: Date; tasks: any[] }[] = [];
    
    // 定义时间表时间段
    const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00 - ${10 + i}:00`); // 9:00 to 22:00
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(dates[i]);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // 获取该日期的调度记录
      const dayScheduleRecords = scheduleRecords.filter(record => record.date === dateStr);
      
      // 将调度记录转换为任务显示格式
      const dayTasksFromRecords = dayScheduleRecords.map(record => {
        const task = tasks.find(t => t.id === record.taskId);
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
        }
        return null;
      }).filter(Boolean);
      
      // 处理有重复设置且有默认时间段的任务（按需生成）
      const dayTasksFromRecurringWithTime = tasks
        .filter(task => 
          task.repeatWeekdays && 
          task.repeatWeekdays.length > 0 && 
          task.startTime && 
          task.endTime
        )
        .filter(task => {
          // 检查任务是否适用于该日期
          if (task.startDate) {
            const startDate = new Date(task.startDate);
            if (date < startDate) {
              return false;
            }
          }
          
          if (task.endDate) {
            const endDate = new Date(task.endDate);
            if (date > endDate) {
              return false;
            }
          }
          
          // 检查是否在重复日中
          const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
          // 根据之前的代码约定，repeatWeekdays 中 1=周一, 2=周二, ..., 7=周日
          const repeatDay = dayOfWeek === 0 ? 7 : dayOfWeek;
          return task.repeatWeekdays?.includes(repeatDay) || false;
        })
        .map(task => ({
          taskId: task.id,
          recordId: `auto-${task.id}-${dateStr}`, // 为自动生成的记录创建唯一ID
          title: task.title,
          themeColor: task.themeColor,
          startTime: task.startTime || '',
          endTime: task.endTime || '',
          isCompleted: task.isCompleted,
          description: task.description,
          taskType: task.type
        }));
      
      // 收集没有默认时间段但有重复设置的任务
      const recurringTaskWithoutTime = tasks
        .filter(task =>
          task.repeatWeekdays && 
          task.repeatWeekdays.length > 0 && 
          (!task.startTime || !task.endTime)
        )
        .filter(task => {
          const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
          const repeatDay = dayOfWeek === 0 ? 7 : dayOfWeek;
          return task.repeatWeekdays?.includes(repeatDay) || false;
        });
      
      // 合并来自调度记录和有默认时间的重复设置的任务
      let allDayTasks = [...dayTasksFromRecords, ...dayTasksFromRecurringWithTime].filter(Boolean);
      
      // 为没有默认时间段的重复任务安排空闲时间段
      if (recurringTaskWithoutTime.length > 0) {
        // 检查当前日期的已占用时间段
        const occupiedTimeSlots = allDayTasks.map(task => {
          const startHour = parseInt(task.startTime.split(':')[0]);
          const endHour = parseInt(task.endTime.split(':')[0]);
          const slots = [];
          for (let h = startHour; h < endHour; h++) {
            slots.push(`${h}:00 - ${h + 1}:00`);
          }
          return slots;
        }).flat();
        
        // 尝试将没有默认时间段的任务安排到空闲时间段中
        recurringTaskWithoutTime.forEach(task => {
          // 找到第一个空闲时间段
          for (let slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
            const timeSlot = timeSlots[slotIdx];
            if (!occupiedTimeSlots.includes(timeSlot)) {
              // 找到空闲时间段，分配任务
              allDayTasks.push({
                taskId: task.id,
                recordId: `auto-${task.id}-${dateStr}-${slotIdx}`,
                title: task.title,
                themeColor: task.themeColor,
                startTime: timeSlot.split(' - ')[0],
                endTime: timeSlot.split(' - ')[1],
                isCompleted: task.isCompleted,
                description: task.description,
                taskType: task.type
              });
              occupiedTimeSlots.push(timeSlot); // 标记为已占用
              break; // 分配一个时间段后跳出
            }
          }
        });
      }
      
      days.push({
        date,
        tasks: allDayTasks as any[]
      });
    }
    
    return {
      week: dates[0],
      days
    };
  }, [tasks, scheduleRecords, dates]);

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
          {['一', '二', '三', '四', '五', '六', '日'].map((day, dayIdx) => {
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
                    const taskStartHour = t.startTime ? parseInt(t.startTime.split(':')[0], 10) : -1;
                    const taskEndHour = t.endTime ? parseInt(t.endTime.split(':')[0], 10) : -1;
                    return taskStartHour <= 9 + slotIdx && taskEndHour > 9 + slotIdx;
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