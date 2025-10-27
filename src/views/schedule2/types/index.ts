export interface Task {
  type: TaskType;
  id: string;
  title: string;
  themeColor: string;
  progress?: number; // 0 to 100, only for 'progress' type
  isCompleted: boolean;
  description?: string;
  repeatWeekdays?: number[]; // 按周几重复，0=周日, 1=周一, ..., 6=周六
  startDate?: string; // 任务开始日期
  endDate?: string; // 任务结束日期
  startTime?: string; // 任务开始时间
  endTime?: string; // 任务结束时间
  timeSlot?: string; // 时间段表示，如 "9:00-10:00"
}

export type TaskType = 'regular' | 'recurring' | 'progress';

export interface TimelineSettings {
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "22:00"
  timeInterval: number; // in minutes
}