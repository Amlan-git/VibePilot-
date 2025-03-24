import { Platform, Post, PostStatus } from './posts';

export type ScheduleView = 'day' | 'week' | 'month' | 'list';

export interface CalendarEvent {
  id: string;
  postId: string;
  title: string;
  start: Date;
  end: Date;
  platforms: Platform[];
  status: PostStatus;
  isAllDay?: boolean;
  description?: string;
  color?: string;
  post: Post;
}

export interface CalendarFilter {
  platforms?: Platform[];
  status?: PostStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  tags?: string[];
}

export interface BestTimeRecommendation {
  platform: Platform;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  timeOfDay: string; // HH:MM format
  engagementScore: number; // 0-100
  confidence: 'high' | 'medium' | 'low';
}

export interface TimeSlot {
  id: string;
  platform: Platform;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface CalendarDensity {
  date: string; // YYYY-MM-DD
  count: number;
  hasConflicts: boolean;
}

export interface CalendarSettings {
  defaultView: ScheduleView;
  workWeekStart: number; // 0-6 (Sunday to Saturday)
  workWeekEnd: number; // 0-6 (Sunday to Saturday)
  workDayStart: string; // HH:MM format
  workDayEnd: string; // HH:MM format
  timezone: string;
  showWeekends: boolean;
  firstDayOfWeek: number; // 0-6 (Sunday to Saturday)
} 