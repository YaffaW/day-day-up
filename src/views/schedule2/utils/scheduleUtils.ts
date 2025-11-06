import type { Task, DailySchedule, ScheduledTask, WeeklySchedule } from '../types';

/**
 * 根据任务和日期创建每日任务安排
 * @param tasks - 任务列表
 * @param date - 要获取任务安排的日期
 * @returns 该日期的任务安排
 */
export const getDailySchedule = (tasks: Task[], date: Date): DailySchedule => {
  const dateStr = date.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
  const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  const scheduledTasks: ScheduledTask[] = tasks
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
      
      // 对于重复任务，检查是否在该日期重复
      if (task.repeatWeekdays && task.repeatWeekdays.length > 0) {
        // 注意：这里的 dayOfWeek 要与 repeatWeekdays 的格式对应
        // 根据之前的代码，repeatWeekdays 中 1=周一, 2=周二, ..., 7=周日
        const repeatDay = dayOfWeek === 0 ? 7 : dayOfWeek; // 周日为7，其他为对应数字
        return task.repeatWeekdays.includes(repeatDay);
      }
      
      // 如果任务没有指定重复日，但在该日期范围内有明确的时间安排
      if (task.startTime && task.endTime) {
        return true;
      }
      
      return false;
    })
    .map(task => ({
      taskId: task.id,
      title: task.title,
      themeColor: task.themeColor,
      startTime: task.startTime || '',
      endTime: task.endTime || '',
      isCompleted: task.isCompleted,
      description: task.description,
      taskType: task.type
    }));
  
  return {
    date,
    tasks: scheduledTasks
  };
};

/**
 * 根据任务列表和周数创建周任务安排
 * @param tasks - 任务列表
 * @param weekStart - 周开始日期（周一）
 * @returns 一周的任务安排
 */
export const getWeeklySchedule = (tasks: Task[], weekStart: Date): WeeklySchedule => {
  const days: DailySchedule[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    days.push(getDailySchedule(tasks, date));
  }
  
  return {
    week: weekStart,
    days
  };
};

/**
 * 获取任务在指定时间段内的所有安排
 * @param tasks - 任务列表
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 日期范围内的任务安排
 */
export const getScheduleInRange = (tasks: Task[], startDate: Date, endDate: Date): DailySchedule[] => {
  const schedules: DailySchedule[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    schedules.push(getDailySchedule(tasks, new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return schedules;
};