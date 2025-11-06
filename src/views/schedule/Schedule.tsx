import "./Schedule.css";
import { useReducer, useState, useEffect } from "react";
import { taskApi, scheduleRecordApi } from "../../api";

interface Task {
  id: string;
  type: string; // 'progress', 'regular', 'recurring'
  theme_color?: string;
  title: string;
  progress?: number;
  description?: string;
  is_completed: boolean;
  start_date?: string;
  end_date?: string;
  repeat_weekdays?: string; // comma separated string
  start_time?: string; // HH:MM
  end_time?: string; // HH:MM
  owner_id: number;
  created_at?: string;
  updated_at?: string;
}

interface ScheduleRecord {
  id: string;
  task_id?: string;
  date: string; // YYYY-MM-DD
  content?: string;
  is_completed: boolean;
  owner_id: number;
  created_at?: string;
  updated_at?: string;
}

function schedulesReducer(list: Task[], action: any) {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...list, action.payload];
    case 'TOGGLE_DONE':
      return list.map((task, index) =>
        index === action.index ? { ...task, is_completed: !task.is_completed } : task
      );
    case 'CHANGE_PROGRESS':
      return list.map((task, index) =>
        index === action.index ? { ...task, progress: action.progress } : task
      );
    case 'UPDATE_TASK':
      return list.map((task) =>
        task.id === action.id ? { ...action.payload } : task
      );
    default:
      return list;
  }
}

function Schedule() {
  const [showModel, setShowModel] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(0);
  const [list, dispatch] = useReducer(schedulesReducer, []);
  const [loading, setLoading] = useState(true);

  // 从 API 获取任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasks = await taskApi.getAll();
        dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (error) {
        console.error('获取任务失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDone = async (index: number) => {
    const task = list[index];
    
    // 如果是进度型任务且未完成，显示进度输入框
    if (task.type === 'progress' && !task.is_completed) {
      setCurrentSchedule(index);
      setShowModel(true);
      return;
    }

    try {
      // 切换完成状态
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await taskApi.update(task.id, updatedTask);
      
      // 更新本地状态
      dispatch({ type: 'UPDATE_TASK', id: task.id, payload: updatedTask });
    } catch (error) {
      console.error('更新任务状态失败:', error);
    }
  };

  const handleProgress = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value) || 0;
    
    if (newProgress >= 0 && newProgress <= 100) {
      try {
        const task = list[currentSchedule];
        const updatedTask = { ...task, progress: newProgress };
        await taskApi.update(task.id, updatedTask);
        
        // 更新本地状态
        dispatch({ type: "CHANGE_PROGRESS", index: currentSchedule, progress: newProgress });
      } catch (error) {
        console.error('更新进度失败:', error);
      }
    }
  };

  const handleProgressDone = async () => {
    try {
      const task = list[currentSchedule];
      const updatedTask = { ...task, is_completed: true };
      await taskApi.update(task.id, updatedTask);
      
      // 更新本地状态
      dispatch({ type: 'UPDATE_TASK', id: task.id, payload: updatedTask });
      setShowModel(false);
    } catch (error) {
      console.error('更新任务状态失败:', error);
    }
  };

  if (loading) {
    return <div className="schedule">加载中...</div>;
  }

  return (
    <div className="schedule">
      {
        list.map((task, index) => {
          return (
            <div key={task.id} className="schedule-item">
              <div className="schedule-title">
                <div className="schedule-name" style={task.theme_color ? { color: task.theme_color } : {}}>
                  {task.title}
                </div>
                <div className="schedule-done" onClick={() => handleDone(index)}>
                  <span 
                    className="iconfont" 
                    style={{ color: task.is_completed ? '#FFC107' : '#FFFFFF80' }}
                  >
                    &#xe7a7;
                  </span>
                </div>
              </div>
              {
                (task.type === 'progress' || task.progress !== undefined) && (
                  <div>
                    <span>进度: {task.progress}%</span>
                    <progress value={task.progress} max={100}></progress>
                  </div>
                )
              }
              <div className="schedule-period">
                {
                  task.start_time && task.end_time && (
                    <span className="time">
                      {task.start_time} - {task.end_time}
                    </span>
                  )
                }
                {
                  task.description && (
                    <div className="schedule-description">{task.description}</div>
                  )
                }
              </div>
            </div>
          )
        })
      }
      {
        showModel &&
        <div className="mask">
          <div className="wrapper schedule-change">
            <div className="button-close" onClick={handleProgressDone}>
              <span className="iconfont">&#xe614;</span>
            </div>
            <div className="title"><span>填写当前完成进度</span></div>
            <input 
              type="number" 
              min="0" 
              max="100"
              defaultValue={list[currentSchedule]?.progress || 0} 
              onBlur={handleProgress} 
              placeholder="输入进度百分比"
            />
          </div>
        </div>
      }
    </div>
  );
}

export default Schedule;