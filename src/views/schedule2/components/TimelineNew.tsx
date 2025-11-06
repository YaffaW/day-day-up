import React, { useState } from 'react';
import type { Task } from '../types';
import { getWeeklySchedule } from '../utils/scheduleUtils';
import './Timeline.css'; // Assuming you have some CSS for styling

interface TimelineProps {
  tasks: Task[];
  updateTaskStatus: (taskId: string, completed: boolean) => void;
  onTaskDrop: (taskOrId: Task | string, newStartTime: string, newEndTime: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, updateTaskStatus, onTaskDrop }) => {
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
    event.preventDefault();
    // 尝试获取从 TaskCard 拖拽的任务数据
    const taskData = event.dataTransfer.getData('task');
    if (taskData) {
      // 如果是新的拖拽数据格式（包含完整任务对象）
      const droppedTask = JSON.parse(taskData);
      // 为任务添加时间信息
      const [startTime, endTime] = timeSlot.split(' - ');
      const updatedTask = {
        ...droppedTask,
        startTime,
        endTime,
        type: 'recurring' as const // 将regular任务变为recurring类型以便显示在时间表中
      };
      onTaskDrop(updatedTask, startTime, endTime);
    } else {
      // 兼容原来的拖拽数据格式（仅ID）
      const taskId = event.dataTransfer.getData('text/plain');
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const [startTime, endTime] = timeSlot.split(' - ');
        onTaskDrop(taskId, startTime, endTime);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 使用工具函数获取周任务安排
  const weeklySchedule = getWeeklySchedule(tasks, dates[0]);

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
            const dayTasks = weeklySchedule.days[dayIdx].tasks; // 使用新的类型结构
            
            return (
              <tr key={dayIdx}>
                <td>
                  <div>星期{day}</div>
                  <div>{`${dates[dayIdx].getMonth() + 1}-${dates[dayIdx].getDate()}`}</div>
                </td>
                {timeSlots.map((slot, slotIdx) => {
                  // 找到在此时间段内的任务
                  const task = dayTasks.find(t => {
                    const taskStartHour = t.startTime ? parseInt(t.startTime.split(':')[0], 10) : -1;
                    const taskEndHour = t.endTime ? parseInt(t.endTime.split(':')[0], 10) : -1;
                    return taskStartHour <= 9 + slotIdx && taskEndHour > 9 + slotIdx;
                  });
                  
                  return (
                    <td
                      key={slotIdx}
                      onDrop={e => handleDrop(e, slot)}
                      onDragOver={handleDragOver}
                      className="timeline-cell"
                    >
                      {
                        task ? (
                          <div
                            className="task-card"
                            style={{ backgroundColor: task.themeColor }}
                            draggable
                            onDragStart={e => e.dataTransfer.setData('text/plain', task.taskId)}
                          >
                            {task.title}
                            <div 
                              className={`iconfont task-status ${task.isCompleted ? 'completed' : ''}`} 
                              onClick={() => updateTaskStatus(task.taskId, !task.isCompleted)}
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