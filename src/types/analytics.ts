// Platform types
export enum PlatformType {
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube'
}

// Content types for posts
export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  TEXT = 'text',
  LINK = 'link',
  STORY = 'story',
  REEL = 'reel',
  LIVE = 'live'
}

// Basic metrics types
export enum MetricType {
  LIKES = 'likes',
  COMMENTS = 'comments',
  SHARES = 'shares',
  SAVES = 'saves',
  CLICKS = 'clicks',
  IMPRESSIONS = 'impressions',
  REACH = 'reach',
  ENGAGEMENT_RATE = 'engagement_rate',
  FOLLOWERS_GAINED = 'followers_gained',
  FOLLOWERS_LOST = 'followers_lost',
  PROFILE_VISITS = 'profile_visits',
  LINK_CLICKS = 'link_clicks',
  VIDEO_VIEWS = 'video_views',
  VIDEO_COMPLETION_RATE = 'video_completion_rate',
  AVERAGE_WATCH_TIME = 'average_watch_time'
}

// Time period options
export enum TimeRange {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  CUSTOM = 'custom'
}

// Date range for custom period
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Analytics filter options
export interface AnalyticsFilter {
  timeRange: TimeRange;
  platforms: PlatformType[];
  contentTypes: ContentType[];
  customDateRange?: DateRange;
  compareWithPreviousPeriod: boolean;
  showAIOptimizedOnly: boolean;
}

// Post metrics structure
export interface PostMetrics {
  [MetricType.LIKES]?: number;
  [MetricType.COMMENTS]?: number;
  [MetricType.SHARES]?: number;
  [MetricType.SAVES]?: number;
  [MetricType.IMPRESSIONS]?: number;
  [MetricType.REACH]?: number;
  [MetricType.ENGAGEMENT_RATE]?: number;
  [MetricType.LINK_CLICKS]?: number;
  [MetricType.VIDEO_VIEWS]?: number;
  [MetricType.VIDEO_COMPLETION_RATE]?: number;
  [MetricType.AVERAGE_WATCH_TIME]?: number;
}

// Post data structure
export interface Post {
  id: string;
  title: string;
  content: string;
  platformType: PlatformType;
  contentType: ContentType;
  publishedDate: string; // ISO format date string
  url: string;
  isAIOptimized: boolean;
  metrics: PostMetrics;
  engagementRate: number;
  changePercentage: number; // Compared to previous period
}

// Platform summary
export interface PlatformSummary {
  platformType: PlatformType;
  followerCount: number;
  followerGrowth: number;
  engagementRate: number;
  impressions: number;
  reach: number;
  postCount: number;
  topPerformingContentType: ContentType;
}

// Time series data point
export interface TimeSeriesDataPoint {
  date: string; // ISO format date string
  value: number;
  platform: PlatformType;
}

// Time series metric
export interface TimeSeriesMetric {
  metricType: MetricType;
  data: TimeSeriesDataPoint[];
}

// Platform metric summary
export interface PlatformMetric {
  platformType: PlatformType;
  value: number;
  changePercentage: number;
}

// Metric summary
export interface MetricSummary {
  metricType: MetricType;
  value: number;
  changePercentage: number;
  platforms: PlatformMetric[];
}

// Audience demographic age group
export interface AgeGroup {
  label: string; // e.g., "18-24", "25-34"
  percentage: number;
}

// Audience demographic gender distribution
export interface GenderDistribution {
  label: string; // e.g., "Male", "Female", "Other"
  percentage: number;
}

// Audience demographic location
export interface LocationDistribution {
  location: string;
  percentage: number;
}

// Audience interest
export interface InterestDistribution {
  interest: string;
  percentage: number;
}

// Audience demographics
export interface AudienceDemographic {
  platformType: PlatformType;
  ageGroups: AgeGroup[];
  genderDistribution: GenderDistribution[];
  topLocations: LocationDistribution[];
  interests: InterestDistribution[];
}

// Post schedule heatmap item
export interface PostScheduleHeatmap {
  day: number; // 0-6, where 0 is Sunday
  hour: number; // 0-23
  count: number;
  engagementRate: number;
}

// AI content performance
export interface AIContentPerformance {
  contentId: string;
  title: string;
  platformType: PlatformType;
  publishedDate: string;
  aiOptimized: boolean;
  engagementImprovement: number; // percentage improvement compared to non-AI content
  metrics: PostMetrics;
}

// Daily metric
export interface DailyMetric {
  date: string;
  metrics: PostMetrics;
}

// Complete analytics dashboard data
export interface AnalyticsDashboardData {
  timeRange: TimeRange;
  dateRange: DateRange;
  metricSummaries: MetricSummary[];
  timeSeriesMetrics: TimeSeriesMetric[];
  platformSummaries: PlatformSummary[];
  topPerformingContent: Post[];
  underperformingContent: Post[];
  audienceDemographics: AudienceDemographic[];
  postScheduleHeatmap: PostScheduleHeatmap[];
  aiContentPerformance: AIContentPerformance[];
  dailyMetrics: DailyMetric[];
} 