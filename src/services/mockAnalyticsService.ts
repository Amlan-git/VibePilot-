import { 
  TimeRange, 
  DateRange, 
  AnalyticsDashboardData, 
  MetricType, 
  ContentType,
  MetricSummary,
  TimeSeriesMetric,
  PlatformSummary,
  ContentMetrics,
  AudienceDemographic,
  PostScheduleHeatmap,
  AIContentPerformance,
  DailyMetric,
  AnalyticsFilter
} from '../features/analytics/types';
import { PLATFORM_TYPES } from '../types/platforms';
import { addDays, subDays, format, eachDayOfInterval } from 'date-fns';

// Platform colors for consistent visualization
export const PLATFORM_COLORS: Record<string, string> = {
  [PLATFORM_TYPES.TWITTER]: '#1DA1F2',
  [PLATFORM_TYPES.FACEBOOK]: '#4267B2',
  [PLATFORM_TYPES.INSTAGRAM]: '#C13584',
  [PLATFORM_TYPES.LINKEDIN]: '#0077B5',
  [PLATFORM_TYPES.TIKTOK]: '#000000',
  [PLATFORM_TYPES.YOUTUBE]: '#FF0000',
};

// Helper function to generate random number between min and max
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to generate random percentage change (-20% to +30%)
const randomPercentageChange = (): number => {
  return Math.round((Math.random() * 50 - 20) * 10) / 10;
};

// Generate random time series data
const generateTimeSeriesData = (
  dateRange: DateRange,
  platforms: string[],
  metricType: MetricType,
  baseValue: number,
  variance: number
): TimeSeriesMetric => {
  const start = dateRange.startDate;
  const end = dateRange.endDate;
  
  const days = eachDayOfInterval({ start, end });
  
  const allData = platforms.flatMap(platform => {
    let currentValue = baseValue + randomNumber(-variance, variance);
    
    return days.map(day => {
      // Generate a value with some random variation but with an upward trend
      currentValue = Math.max(0, currentValue + randomNumber(-variance, variance * 1.2));
      
      return {
        date: format(day, 'yyyy-MM-dd'),
        value: currentValue,
        platform
      };
    });
  });
  
  return {
    metricType,
    data: allData
  };
};

// Generate random content metrics
const generateContentMetrics = (
  count: number, 
  platforms: string[],
  dateRange: DateRange
): ContentMetrics[] => {
  const result: ContentMetrics[] = [];
  const contentTypes = Object.values(ContentType);
  
  for (let i = 0; i < count; i++) {
    const platformType = platforms[randomNumber(0, platforms.length - 1)];
    const contentType = contentTypes[randomNumber(0, contentTypes.length - 1)];
    const isAIOptimized = Math.random() > 0.5;
    const daysAgo = randomNumber(0, (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const metrics: Partial<Record<MetricType, number>> = {};
    metrics[MetricType.LIKES] = randomNumber(10, 5000);
    metrics[MetricType.COMMENTS] = randomNumber(0, 500);
    metrics[MetricType.SHARES] = randomNumber(0, 200);
    metrics[MetricType.IMPRESSIONS] = randomNumber(100, 50000);
    metrics[MetricType.REACH] = randomNumber(50, 20000);
    
    // AI optimized content generally performs better
    const engagementMultiplier = isAIOptimized ? 1.3 : 1;
    const engagementRate = Math.round((
      (metrics[MetricType.LIKES]! + metrics[MetricType.COMMENTS]! * 2 + metrics[MetricType.SHARES]! * 3) / 
      metrics[MetricType.IMPRESSIONS]! * 100
    ) * engagementMultiplier * 100) / 100;
    
    result.push({
      id: `content-${i}`,
      title: `${isAIOptimized ? '[AI] ' : ''}Sample ${contentType} post about ${i % 2 === 0 ? 'product features' : 'company news'}`,
      platformType,
      contentType,
      publishedDate: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
      isAIOptimized,
      metrics: metrics as Record<MetricType, number>,
      engagementRate,
      changePercentage: randomPercentageChange()
    });
  }
  
  // Sort by engagement rate descending
  return result.sort((a, b) => b.engagementRate - a.engagementRate);
};

// Generate platform summaries
const generatePlatformSummaries = (platforms: string[]): PlatformSummary[] => {
  return platforms.map(platformType => {
    const contentTypes = Object.values(ContentType);
    return {
      platformType,
      followerCount: randomNumber(1000, 100000),
      followerGrowth: randomNumber(-100, 5000),
      engagementRate: Math.random() * 5,
      impressions: randomNumber(10000, 1000000),
      reach: randomNumber(5000, 500000),
      postCount: randomNumber(10, 100),
      topPerformingContentType: contentTypes[randomNumber(0, contentTypes.length - 1)]
    };
  });
};

// Generate audience demographics
const generateAudienceDemographics = (platforms: string[]): AudienceDemographic[] => {
  const ageGroups = [
    { label: '13-17', percentage: 0 },
    { label: '18-24', percentage: 0 },
    { label: '25-34', percentage: 0 },
    { label: '35-44', percentage: 0 },
    { label: '45-54', percentage: 0 },
    { label: '55+', percentage: 0 }
  ];
  
  const genderDistribution = [
    { label: 'Male', percentage: 0 },
    { label: 'Female', percentage: 0 },
    { label: 'Other', percentage: 0 }
  ];
  
  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'India', 'Brazil', 'Japan', 'Mexico'
  ];
  
  const interests = [
    'Technology', 'Business', 'Entertainment', 'Sports', 
    'Food', 'Travel', 'Fashion', 'Health', 'Education', 'Lifestyle'
  ];
  
  return platforms.map(platformType => {
    // Random distribution for age groups that sums to 100%
    let remainingPercentage = 100;
    for (let i = 0; i < ageGroups.length - 1; i++) {
      const percentage = Math.min(remainingPercentage, randomNumber(5, 30));
      ageGroups[i].percentage = percentage;
      remainingPercentage -= percentage;
    }
    ageGroups[ageGroups.length - 1].percentage = remainingPercentage;
    
    // Random distribution for gender that sums to 100%
    remainingPercentage = 100;
    for (let i = 0; i < genderDistribution.length - 1; i++) {
      const percentage = Math.min(remainingPercentage, randomNumber(30, 50));
      genderDistribution[i].percentage = percentage;
      remainingPercentage -= percentage;
    }
    genderDistribution[genderDistribution.length - 1].percentage = remainingPercentage;
    
    // Random top locations
    const topLocations = locations
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((location, index) => ({
        location,
        percentage: index === 0 ? randomNumber(20, 40) : randomNumber(5, 15)
      }));
    
    // Random interests
    const randomInterests = interests
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map((interest, index) => ({
        interest,
        percentage: index === 0 ? randomNumber(15, 30) : randomNumber(5, 15)
      }));
    
    return {
      platformType,
      ageGroups: [...ageGroups],
      genderDistribution: [...genderDistribution],
      topLocations,
      interests: randomInterests
    };
  });
};

// Generate posting schedule heatmap
const generatePostScheduleHeatmap = (): PostScheduleHeatmap[] => {
  const heatmap: PostScheduleHeatmap[] = [];
  
  // Generate data for each day and hour
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Higher engagement during business hours and early evening
      const isBusinessHour = (hour >= 9 && hour <= 17);
      const isEveningHour = (hour >= 18 && hour <= 21);
      const isWeekend = (day === 0 || day === 6);
      
      // More posts during business hours on weekdays and evenings on weekends
      const countMultiplier = isWeekend
        ? (isEveningHour ? 1.5 : 0.8)
        : (isBusinessHour ? 1.3 : 0.7);
        
      // Higher engagement in evenings and weekends
      const engagementMultiplier = isWeekend
        ? (isEveningHour ? 1.4 : 1.2)
        : (isEveningHour ? 1.3 : (isBusinessHour ? 1 : 0.8));
      
      heatmap.push({
        day,
        hour,
        count: Math.floor(randomNumber(0, 10) * countMultiplier),
        engagementRate: Math.round(randomNumber(1, 5) * engagementMultiplier * 10) / 10
      });
    }
  }
  
  return heatmap;
};

// Generate AI content performance data
const generateAIContentPerformance = (
  platforms: string[],
  dateRange: DateRange
): AIContentPerformance[] => {
  const result: AIContentPerformance[] = [];
  
  for (let i = 0; i < 10; i++) {
    const platformType = platforms[randomNumber(0, platforms.length - 1)];
    const daysAgo = randomNumber(0, (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const metrics: Partial<Record<MetricType, number>> = {};
    metrics[MetricType.LIKES] = randomNumber(100, 10000);
    metrics[MetricType.COMMENTS] = randomNumber(10, 1000);
    metrics[MetricType.SHARES] = randomNumber(5, 500);
    metrics[MetricType.IMPRESSIONS] = randomNumber(1000, 100000);
    metrics[MetricType.ENGAGEMENT_RATE] = Math.random() * 8;
    
    result.push({
      contentId: `ai-content-${i}`,
      title: `AI Optimized Post #${i + 1}`,
      platformType,
      publishedDate: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
      aiOptimized: true,
      engagementImprovement: randomNumber(10, 50),
      metrics: metrics as Record<MetricType, number>
    });
  }
  
  return result;
};

// Generate daily metrics data
const generateDailyMetrics = (
  dateRange: DateRange
): DailyMetric[] => {
  const start = dateRange.startDate;
  const end = dateRange.endDate;
  
  const days = eachDayOfInterval({ start, end });
  
  return days.map(day => {
    const metrics: Partial<Record<MetricType, number>> = {};
    metrics[MetricType.LIKES] = randomNumber(500, 15000);
    metrics[MetricType.COMMENTS] = randomNumber(50, 2000);
    metrics[MetricType.SHARES] = randomNumber(20, 1000);
    metrics[MetricType.IMPRESSIONS] = randomNumber(5000, 200000);
    metrics[MetricType.REACH] = randomNumber(3000, 150000);
    metrics[MetricType.FOLLOWERS_GAINED] = randomNumber(10, 500);
    metrics[MetricType.FOLLOWERS_LOST] = randomNumber(5, 200);
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      metrics: metrics as Record<MetricType, number>
    };
  });
};

// Generate metric summaries
const generateMetricSummaries = (
  platforms: string[]
): MetricSummary[] => {
  const metricTypes = [
    MetricType.ENGAGEMENT_RATE,
    MetricType.IMPRESSIONS,
    MetricType.REACH,
    MetricType.FOLLOWERS_GAINED,
    MetricType.LIKES,
    MetricType.COMMENTS
  ];
  
  return metricTypes.map(metricType => {
    const overallValue = metricType === MetricType.ENGAGEMENT_RATE
      ? Math.random() * 5
      : randomNumber(1000, 1000000);
    
    const platformMetrics = platforms.map(platformType => ({
      platformType,
      value: metricType === MetricType.ENGAGEMENT_RATE
        ? Math.random() * 8
        : randomNumber(100, 500000),
      changePercentage: randomPercentageChange()
    }));
    
    return {
      metricType,
      value: overallValue,
      changePercentage: randomPercentageChange(),
      platforms: platformMetrics
    };
  });
};

// Get date range from time range
const getDateRangeFromTimeRange = (timeRange: TimeRange, customRange?: DateRange): DateRange => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  switch (timeRange) {
    case TimeRange.LAST_7_DAYS:
      return {
        startDate: subDays(today, 7),
        endDate: today
      };
    case TimeRange.LAST_30_DAYS:
      return {
        startDate: subDays(today, 30),
        endDate: today
      };
    case TimeRange.LAST_90_DAYS:
      return {
        startDate: subDays(today, 90),
        endDate: today
      };
    case TimeRange.CUSTOM:
      if (customRange) {
        return customRange;
      }
      // Default to last 30 days if no custom range provided
      return {
        startDate: subDays(today, 30),
        endDate: today
      };
  }
};

// Generate complete analytics dashboard data
export const generateAnalyticsDashboardData = (
  filter: AnalyticsFilter
): AnalyticsDashboardData => {
  const { timeRange, customDateRange, platforms } = filter;
  const dateRange = getDateRangeFromTimeRange(timeRange, customDateRange);
  
  // Generate all content metrics
  const allContentMetrics = generateContentMetrics(50, platforms, dateRange);
  
  // Top and bottom performing content
  const topPerformingContent = allContentMetrics.slice(0, 10);
  const underperformingContent = [...allContentMetrics]
    .sort((a, b) => a.engagementRate - b.engagementRate)
    .slice(0, 10);

  // Generate time series data for key metrics
  const engagementSeries = generateTimeSeriesData(
    dateRange, 
    platforms, 
    MetricType.ENGAGEMENT_RATE, 
    2.5, 
    0.5
  );
  
  const impressionsSeries = generateTimeSeriesData(
    dateRange, 
    platforms, 
    MetricType.IMPRESSIONS, 
    5000, 
    1000
  );
  
  const reachSeries = generateTimeSeriesData(
    dateRange, 
    platforms, 
    MetricType.REACH, 
    3000, 
    800
  );
  
  const followersSeries = generateTimeSeriesData(
    dateRange, 
    platforms, 
    MetricType.FOLLOWERS_GAINED, 
    50, 
    20
  );
  
  return {
    timeRange,
    dateRange,
    metricSummaries: generateMetricSummaries(platforms),
    timeSeriesMetrics: [
      engagementSeries,
      impressionsSeries,
      reachSeries,
      followersSeries
    ],
    platformSummaries: generatePlatformSummaries(platforms),
    topPerformingContent,
    underperformingContent,
    audienceDemographics: generateAudienceDemographics(platforms),
    postScheduleHeatmap: generatePostScheduleHeatmap(),
    aiContentPerformance: generateAIContentPerformance(platforms, dateRange),
    dailyMetrics: generateDailyMetrics(dateRange)
  };
};

// Mock analytics service
export const mockAnalyticsService = {
  getAnalyticsDashboardData: async (filter: AnalyticsFilter): Promise<AnalyticsDashboardData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return generateAnalyticsDashboardData(filter);
  }
}; 