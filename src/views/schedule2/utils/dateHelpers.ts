import { format, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

export const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

export const getCurrentWeek = (): { start: Date; end: Date } => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { start, end };
};

export const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
};