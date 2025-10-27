import React, { useState } from 'react';
import type { Task } from '../types';
import './Timeline.css'; // Assuming you have some CSS for styling

interface TimelineProps {
  tasks: Task[];
  updateTaskStatus: (taskId: string, completed: boolean) => void;
  onTaskDrop: (task: Task, timeSlot: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, updateTaskStatus, onTaskDrop }) => {
  const [week, setWeek] = useState<'lastWeek' | 'thisWeek' | 'nextWeek'>('thisWeek');

  const now = new Date();
  const day = now.getDay(); // 0 (Sun) to 6 (Sat)

  const datesTemp: Date[] = [];
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - (6 - day)); // Set to last Monday
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + i);
    datesTemp.push(currentDate);
  }

  const [dates, setDates] = useState<Date[]>(datesTemp);

  const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00 - ${10 + i}:00`); // 9:00 to 22:00

  const selectWeek = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'lastWeek' | 'thisWeek' | 'nextWeek';
    setWeek(value);
    const offset = value === 'lastWeek' ? -7 : value === 'nextWeek' ? 7 : 0;
    const newWeekStart = new Date(now);
    newWeekStart.setDate(newWeekStart.getDate() - (6 - day) + offset);
    const datesArr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(newWeekStart);
      currentDate.setDate(currentDate.getDate() + i);
      datesArr.push(currentDate);
    }
    setDates(datesArr);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskDrop(task, timeSlot);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

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
            const dayTasks = tasks.filter(t => {
              const date = dates[dayIdx];
              if (t.startDate) {
                const startDate = new Date(t.startDate);
                if (date < startDate) {
                  return false;
                }
              }
              if (t.endDate) {
                const endDate = new Date(t.endDate);
                if (date > endDate) {
                  return false;
                }
              }
              return t.repeatWeekdays?.includes(dayIdx + 1);
            });
            return (
              <tr key={dayIdx}>
                <td>
                  <div>星期{day}</div>
                  <div>{`${dates[dayIdx].getMonth() + 1}-${dates[dayIdx].getDate()}`}</div>
                </td>
                {timeSlots.map((slot, slotIdx) => {
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
                            onDragStart={e => e.dataTransfer.setData('text/plain', task.id)}
                          >
                            {task.title}
                            <div className={`iconfont task-status ${task.isCompleted ? 'completed' : ''}`} onClick={() => updateTaskStatus(task.id, !task.isCompleted)}>
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