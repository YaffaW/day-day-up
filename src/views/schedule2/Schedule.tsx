import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';
import type { Task, ScheduleRecord } from './types';
import { taskApi, scheduleRecordApi, initDataApi } from '../../api';

const Schedule = () => {
  // 任务定义，不含时间信息
  const [tasks, setTasks] = useState<Task[]>([]);

  // 调度记录，记录任务的时间安排
  const [scheduleRecords, setScheduleRecords] = useState<ScheduleRecord[]>([]);

  // 从API获取初始化数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching initial data from API...');
        const data = await initDataApi.get();
        setTasks(data.tasks || []);
        setScheduleRecords(data.scheduleRecords || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        // 如果API请求失败，使用默认数据
        setTasks([]);
        setScheduleRecords([]);
      }
    };

    fetchData();
  }, []);
  // 自动填充将根据Timeline视图按需处理

  const addTask = async (task: Task) => {
    try {
      const result = await taskApi.create(task);
      setTasks([...tasks, result.task]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      // 后端会自动删除相关的调度记录，这里也同步更新本地状态
      setScheduleRecords(scheduleRecords.filter(record => record.taskId !== taskId));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      // 首先获取当前任务
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) return;

      const updatedTask = { ...currentTask, isCompleted: !currentTask.isCompleted };

      await taskApi.update(taskId, updatedTask);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));

      // 同时更新调度记录中的完成状态
      setScheduleRecords(scheduleRecords.map(record =>
        record.taskId === taskId ? { ...record, isCompleted: !record.isCompleted } : record
      ));
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await taskApi.update(updatedTask.id, updatedTask);
      setTasks(tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // 初始化本周的重复任务到调度记录
  useEffect(() => {
    // 这里可以实现初始化逻辑，将重复任务转换为独立的调度记录
    // 但为避免重复初始化，实际应用中这应该在用户首次查看时间表时执行
  }, []);

  const onTaskDrop = async (taskOrId: Task | string, newStartTime: string, newEndTime: string, date: string) => {
    let taskId: string;
    let task: Task | undefined;

    if (typeof taskOrId === 'object') {
      // 如果是拖拽一个新的任务，添加到任务列表（如果不存在）
      task = taskOrId;
      taskId = task.id;

      // 检查任务是否已存在，不存在则添加
      if (!tasks.some(t => t.id === task.id)) {
        try {
          const result = await taskApi.create({ ...task, startTime: undefined, endTime: undefined });
          setTasks(prev => [...prev, result.task]);
        } catch (error) {
          console.error('Error adding task:', error);
        }
      }
    } else {
      taskId = taskOrId;
      task = tasks.find(t => t.id === taskId);
    }

    if (task) {
      try {
        // 检查此时间段是否已有任务，如果有则删除（实现覆盖功能）
        const existingRecord = scheduleRecords.find(record =>
          record.date === date &&
          record.startTime === newStartTime &&
          record.endTime === newEndTime
        );

        if (existingRecord) {
          // 删除现有的记录
          await scheduleRecordApi.delete(existingRecord.id);
        }

        // 创建新的调度记录
        const newRecord: Omit<ScheduleRecord, 'id'> = {
          taskId: taskId,
          date: date,
          startTime: newStartTime,
          endTime: newEndTime,
          isCompleted: task.isCompleted
        };

        // 通过API添加新的调度记录
        const result = await scheduleRecordApi.create(newRecord);

        // 更新本地状态
        const filteredRecords = scheduleRecords.filter(record =>
          !(record.date === date &&
            record.startTime === newStartTime &&
            record.endTime === newEndTime)
        );
        setScheduleRecords([...filteredRecords, result.record]);
      } catch (error) {
        console.error('Error handling task drop:', error);
      }
    }
  }

  const deleteScheduleRecord = async (recordId: string) => {
    try {
      await scheduleRecordApi.delete(recordId);
      setScheduleRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    } catch (error) {
      console.error('Error deleting schedule record:', error);
    }
  }
  return (
    <div style={{ height: '100vh', padding: 10, overflow: 'hidden' }}>
      {/* <h1>Schedule</h1> */}
      <TaskList
        tasks={tasks}
        removeTask={removeTask}
        toggleTaskCompletion={toggleTaskCompletion}
        updateTask={updateTask}
        onAddTask={addTask}
      />
      <Timeline tasks={tasks} scheduleRecords={scheduleRecords} updateTaskStatus={toggleTaskCompletion} onTaskDrop={onTaskDrop} deleteScheduleRecord={deleteScheduleRecord} />
    </div>
  );
};

export default Schedule;