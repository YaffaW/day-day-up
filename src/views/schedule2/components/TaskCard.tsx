import React, { useState } from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onRemove: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask?: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onRemove, onToggleComplete, onUpdateTask }) => {
  const {
    id,
    title,
    themeColor,
    isCompleted,
    progress,
    startDate,
    endDate,
    startTime,
    endTime,
    type,
    description
  } = task;

  const [showSettings, setShowSettings] = useState(false);
  const [tempTask, setTempTask] = useState<Task>({...task});

  const handleSaveSettings = () => {
    if (onUpdateTask) {
      onUpdateTask(tempTask);
    }
    setShowSettings(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setTempTask(prev => ({
      ...prev,
      themeColor: color
    }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTask(prev => ({
      ...prev,
      progress: parseInt(e.target.value)
    }));
  };

  return (
    <div 
        draggable="true"
        onDragStart={(e) => {
          e.dataTransfer.setData('task', JSON.stringify({...task}));
        }}
        style={{ 
          border: `2px solid ${themeColor}`, 
          padding: '10px', 
          borderRadius: '5px',
          position: 'relative',
          width: '300px',
          margin: '5px',
          cursor: 'move'
        }}
      >
        {/* 详情图标 */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '5px', 
            right: '5px', 
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'auto' // 确保设置图标仍可点击
          }} 
          onClick={(e) => {
            e.stopPropagation(); // 防止拖拽事件触发
            setShowSettings(true);
          }}
        >
          ⚙️
        </div>
      
      <div style={{ color: themeColor, fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>
      
      {description && (
        <div style={{ fontSize: '14px', marginBottom: '5px' }}>{description}</div>
      )}
      
      {
        type === 'progress' && progress !== undefined && (
          <div style={{ marginBottom: '5px' }}>
            <progress value={progress} max={100} style={{ width: '100%' }}></progress>
            <div style={{ textAlign: 'right', fontSize: '12px' }}>{progress}%</div>
          </div>
        )
      }
      
      {
        (startDate || startTime) && (endDate || endTime) && (
          <div style={{ fontSize: '12px', marginBottom: '5px' }}>
            {`${startDate || ''} ${startTime || ''} - ${endDate || ''} ${endTime || ''}`}
          </div>
        )
      }
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          style={{ 
            marginRight: '5px', 
            padding: '4px 8px',
            fontSize: '12px'
          }} 
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
        <div>
          <button 
            style={{ 
              padding: '4px 8px',
              fontSize: '12px',
              marginRight: '5px'
            }}
            onClick={() => onToggleComplete(id)}
          >
            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          minWidth: '400px',
          maxWidth: '600px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: themeColor }}>Task Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 3 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={tempTask.title}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Theme Color:</label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'].map(color => (
                    <div
                      key={color}
                      onClick={() => handleColorChange(color)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: color,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: tempTask.themeColor === color ? '2px solid #333' : '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {tempTask.themeColor === color && (
                        <span style={{ fontSize: '8px', color: 'white' }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                name="description"
                value={tempTask.description || ''}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '40px',
                  maxHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={tempTask.startDate || ''}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '5px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={tempTask.endDate || ''}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '5px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={tempTask.startTime || ''}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '5px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={tempTask.endTime || ''}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '5px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
            
            {type === 'progress' && tempTask.progress !== undefined && (
              <div style={{ marginTop: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Progress: {tempTask.progress}%
                </label>
                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={tempTask.progress}
                  onChange={handleProgressChange}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Repeat Days:</label>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <label key={index} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: tempTask.repeatWeekdays?.includes(index) ? themeColor : 'white',
                  color: tempTask.repeatWeekdays?.includes(index) ? 'white' : 'inherit'
                }}>
                  <input
                    type="checkbox"
                    checked={tempTask.repeatWeekdays?.includes(index) || false}
                    onChange={(e) => {
                      const newRepeatWeekdays = tempTask.repeatWeekdays ? [...tempTask.repeatWeekdays] : [];
                      if (e.target.checked) {
                        if (!newRepeatWeekdays.includes(index)) {
                          newRepeatWeekdays.push(index);
                        }
                      } else {
                        const idx = newRepeatWeekdays.indexOf(index);
                        if (idx > -1) newRepeatWeekdays.splice(idx, 1);
                      }
                      setTempTask(prev => ({
                        ...prev,
                        repeatWeekdays: newRepeatWeekdays
                      }));
                    }}
                    style={{ marginRight: '4px' }}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => setShowSettings(false)} 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#ccc', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveSettings}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: themeColor, 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      
      {/* 弹窗遮罩 */}
      {showSettings && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;