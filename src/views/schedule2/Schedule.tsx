import { useState } from 'react';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';
import type { Task } from './types';

const Schedule = () => {
  const [tasks, setTasks] = useState<Task[]>([
    // Example initial tasks
    {
      type: 'progress',
      id: '1',
      themeColor: '#ffcc00',
      title: 'Learning English',
      progress: 10,
      description: '《The You You Are》：跟读练习、总结出自己的思考并发布',
      isCompleted: false,
      startTime: '09:00',
      endTime: '10:00',
      startDate: '2025-08-24',
      endDate: '',
      repeatWeekdays: [1, 2, 3, 4, 5, 6, 7], // 每天重复
    },
    {
      type: 'regular',
      id: '2',
      themeColor: '#00ccff',
      title: '源码学习',
      description: '阅读 React、Vue 等前端框架源码',
      isCompleted: false,
      startTime: '',
      endTime: '',
      startDate: '2025-08-24',
      endDate: '',
      repeatWeekdays: [6, 7], // 每周六、日重复
    },
    {
      type: 'recurring',
      id: '2',
      themeColor: '#51ff00ff',
      title: '学习webgl',
      description: '为了找工作，快速入门webgl',
      isCompleted: false,
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-08-24',
      endDate: '',
      repeatWeekdays: [1, 2, 3, 4, 5, 6, 7],
    }
  ]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    ));
  };
  const onTaskDrop = (taskId: string, newStartTime: string, newEndTime: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, startTime: newStartTime, endTime: newEndTime } : task
    ));
  }
  return (
    <div style={{ height: '100vh', padding: 10, overflow: 'hidden' }}>
      {/* <h1>Schedule</h1> */}
      <TaskList tasks={tasks} removeTask={removeTask} />
      <Timeline tasks={tasks} updateTaskStatus={updateTaskStatus} onTaskDrop={onTaskDrop} />
    </div>
  );
};

export default Schedule;