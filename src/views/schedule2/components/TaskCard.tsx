import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onRemove: () => void;
  onToggleComplete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onRemove, onToggleComplete }) => {
  const {
    title,
    themeColor,
    isCompleted,
    progress,
    startDate,
    endDate,
    startTime,
    endTime,
    type
  } = task;
  return (
    <div style={{ border: `2px solid ${themeColor}`, padding: '10px', borderRadius: '5px' }}>
      <div style={{ color: themeColor, fontWeight: 'bold' }}>{title}</div>
      {/* <p>Status: {isCompleted ? 'Completed' : 'In Progress'}</p> */}
      {
        type === 'progress' && <div><progress value={progress} max={100}></progress></div>
      }
      {
        type !== 'regular' && <div>{`${startDate} ${startTime} - ${endDate} ${endTime}`}</div>
      }
      <button style={{ marginRight: '10px' }} onClick={onRemove}>remove</button>
      <button onClick={onToggleComplete}>{isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
    </div>
  );
};

export default TaskCard;