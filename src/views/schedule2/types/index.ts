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
  startTime?: string; // 任务默认开始时间
  endTime?: string; // 任务默认结束时间
  timeSlot?: string; // 时间段表示，如 "9:00-10:00"
}

export type TaskType = 'regular' | 'recurring' | 'progress';

export interface TimelineSettings {
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "22:00"
  timeInterval: number; // in minutes
}

export interface DailySchedule {
  date: Date; // 日期
  tasks: ScheduledTask[]; // 该天的任务安排
}

export interface ScheduledTask {
  taskId: string; // 关联的任务ID
  title: string; // 任务标题
  themeColor: string; // 任务主题色
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  isCompleted: boolean; // 是否已完成
  description?: string; // 任务描述
  taskType: TaskType; // 任务类型
}

export interface WeeklySchedule {
  week: Date; // 本周开始日期（周一）
  days: DailySchedule[]; // 一周七天的安排
}

// 调度记录类型 - 用于记录任务的具体时间安排而不改变原任务
export interface ScheduleRecord {
  id: string;           // 调度记录ID
  taskId: string;       // 原始任务ID
  date: string;         // 日期 (YYYY-MM-DD)
  startTime: string;    // 开始时间
  endTime: string;      // 结束时间
  isCompleted?: boolean; // 完成状态
}