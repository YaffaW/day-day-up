import React, { useState } from 'react';
import type { Task } from '../types';

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    type: 'regular',
    title: '',
    themeColor: '#3498db',
    isCompleted: false,
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    repeatWeekdays: [],
    progress: 0,
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`, // 生成唯一ID
    };

    if (newTask.type !== 'progress') {
      delete task.progress; // 非进度任务不需要progress字段
    }

    onAddTask(task);
    // 重置表单
    setNewTask({
      type: 'regular',
      title: '',
      themeColor: '#3498db',
      isCompleted: false,
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      repeatWeekdays: [],
      progress: 0,
    });
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setNewTask(prev => ({
      ...prev,
      themeColor: color
    }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(prev => ({
      ...prev,
      progress: parseInt(e.target.value)
    }));
  };

  const handleRepeatDayChange = (dayIndex: number) => {
    setNewTask(prev => {
      const newRepeatWeekdays = prev.repeatWeekdays ? [...prev.repeatWeekdays] : [];
      const index = newRepeatWeekdays.indexOf(dayIndex);
      if (index > -1) {
        newRepeatWeekdays.splice(index, 1);
      } else {
        newRepeatWeekdays.push(dayIndex);
      }
      return {
        ...prev,
        repeatWeekdays: newRepeatWeekdays
      };
    });
  };

  return (
    <div>
      <button 
        onClick={() => setShowModal(true)}
        style={{ 
          width: '60px',
          height: '60px', 
          border: '2px dashed #ccc', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '5px', 
          fontSize: '24px', 
          color: '#888',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '5px'
        }}
      >
        +
      </button>

      {/* 弹窗表单 */}
      {showModal && (
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
          <h3 style={{ margin: '0 0 15px 0', color: newTask.themeColor }}>Create New Task</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 3 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={newTask.title}
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
                        border: newTask.themeColor === color ? '2px solid #333' : '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {newTask.themeColor === color && (
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
                placeholder="Task description"
                value={newTask.description || ''}
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
                  value={newTask.startDate || ''}
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
                  value={newTask.endDate || ''}
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
                  value={newTask.startTime || ''}
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
                  value={newTask.endTime || ''}
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
            
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type:</label>
              <select
                name="type"
                value={newTask.type}
                onChange={handleInputChange}
                style={{ 
                  padding: '5px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                <option value="regular">Regular Task</option>
                <option value="recurring">Recurring Task</option>
                <option value="progress">Progress Task</option>
              </select>
            </div>
            
            {newTask.type === 'progress' && (
              <div style={{ marginTop: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Progress: {newTask.progress}%
                </label>
                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={newTask.progress}
                  onChange={handleProgressChange}
                  style={{ width: '100%' }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '5px' }}>
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
                    backgroundColor: newTask.repeatWeekdays?.includes(index) ? newTask.themeColor : 'white',
                    color: newTask.repeatWeekdays?.includes(index) ? 'white' : 'inherit'
                  }}>
                    <input
                      type="checkbox"
                      checked={newTask.repeatWeekdays?.includes(index) || false}
                      onChange={() => handleRepeatDayChange(index)}
                      style={{ marginRight: '4px' }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={() => setShowModal(false)} 
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
              onClick={handleAddTask}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: newTask.themeColor, 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Create Task
            </button>
          </div>
        </div>
      )}
      
      {/* 弹窗遮罩 */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AddTaskForm;