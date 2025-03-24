import { PLATFORM_TYPES } from '../../types/platforms';

export enum TimeRange {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  CUSTOM = 'custom'
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  LINK = 'link',
  POLL = 'poll',
  STORY = 'story',
  REEL = 'reel'
}

export enum MetricType {
  LIKES = 'likes',
  COMMENTS = 'comments',
  SHARES = 'shares',
  SAVES = 'saves',
  CLICKS = 'clicks',
  IMPRESSIONS = 'impressions',
  REACH = 'reach',
  FOLLOWERS_GAINED = 'followers_gained',
  FOLLOWERS_LOST = 'followers_lost',
  ENGAGEMENT_RATE = 'engagement_rate',
  CLICK_THROUGH_RATE = 'click_through_rate',
  CONVERSION_RATE = 'conversion_rate',
  VIDEO_VIEWS = 'video_views',
  WATCH_TIME = 'watch_time'
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilter {
  timeRange: TimeRange;
  customDateRange?: DateRange;
  platforms: string[];
  contentTypes: ContentType[];
  compareWithPreviousPeriod: boolean;
  showAIOptimizedOnly: boolean;
}

export interface PlatformMetric {
  platformType: string;
  value: number;
  changePercentage: number;
}

export interface MetricSummary {
  metricType: MetricType;
  value: number;
  changePercentage: number;
  platforms: PlatformMetric[];
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  platform?: string;
}

export interface TimeSeriesMetric {
  metricType: MetricType;
  data: TimeSeriesDataPoint[];
}

export interface ContentMetrics {
  id: string;
  title: string;
  platformType: string;
  contentType: ContentType;
  publishedDate: string;
  isAIOptimized: boolean;
  metrics: {
    [key in MetricType]?: number;
  };
  engagementRate: number;
  changePercentage: number;
}

export interface PlatformSummary {
  platformType: string;
  followerCount: number;
  followerGrowth: number;
  engagementRate: number;
  impressions: number;
  reach: number;
  postCount: number;
  topPerformingContentType: ContentType;
}

export interface DailyMetric {
  date: string;
  metrics: {
    [key in MetricType]?: number;
  };
}

export interface AudienceDemographic {
  platformType: string;
  ageGroups: {
    label: string;
    percentage: number;
  }[];
  genderDistribution: {
    label: string;
    percentage: number;
  }[];
  topLocations: {
    location: string;
    percentage: number;
  }[];
  interests: {
    interest: string;
    percentage: number;
  }[];
}

export interface PostScheduleHeatmap {
  day: number; // 0-6 for Sunday-Saturday
  hour: number; // 0-23
  count: number;
  engagementRate: number;
}

export interface AIContentPerformance {
  contentId: string;
  title: string;
  platformType: string;
  publishedDate: string;
  aiOptimized: boolean;
  engagementImprovement: number; // percentage improvement compared to non-AI content
  metrics: {
    [key in MetricType]?: number;
  };
}

export interface AnalyticsDashboardData {
  timeRange: TimeRange;
  dateRange: DateRange;
  metricSummaries: MetricSummary[];
  timeSeriesMetrics: TimeSeriesMetric[];
  platformSummaries: PlatformSummary[];
  topPerformingContent: ContentMetrics[];
  underperformingContent: ContentMetrics[];
  audienceDemographics: AudienceDemographic[];
  postScheduleHeatmap: PostScheduleHeatmap[];
  aiContentPerformance: AIContentPerformance[];
  dailyMetrics: DailyMetric[];
}

export interface ChartConfig {
  title: string;
  height: number;
  axisTitle?: string;
  colors?: string[];
  showLegend: boolean;
  animated: boolean;
} 