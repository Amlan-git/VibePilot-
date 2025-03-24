import React, { useState, useEffect } from 'react';
import { 
  PanelBar,
  PanelBarItem
} from '@progress/kendo-react-layout';
import { Loader } from "@progress/kendo-react-indicators";
import { Button, Chip, FloatingActionButton } from '@progress/kendo-react-buttons';
import { generateAnalyticsDashboardData } from '../../services/mockAnalyticsService';
import { 
  AnalyticsDashboardData, 
  AnalyticsFilter, 
  ContentType, 
  TimeRange,
  MetricType
} from './types';
import TimeSelector from './components/TimeSelector';
import PlatformFilter from './components/PlatformFilter';
import PerformanceOverview from './components/PerformanceOverview';
import PlatformComparison from './components/PlatformComparison';
import ContentPerformance from './components/ContentPerformance';
import AudienceInsights from './components/AudienceInsights';
import PostTiming from './components/PostTiming';
import AIPerformanceInsights from './components/AIPerformanceInsights';
import { PLATFORM_TYPES } from '../../types/platforms';
import { PLATFORM_COLORS } from '../../services/mockAnalyticsService';
import 'hammerjs';

// Helper functions for formatting
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const AnalyticsDashboard: React.FC = () => {
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for analytics data
  const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);
  
  // State for filter
  const [filter, setFilter] = useState<AnalyticsFilter>({
    timeRange: TimeRange.LAST_30_DAYS,
    platforms: Object.values(PLATFORM_TYPES),
    contentTypes: Object.values(ContentType),
    compareWithPreviousPeriod: true,
    showAIOptimizedOnly: false
  });
  
  // Load analytics data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        const data = await generateAnalyticsDashboardData(filter);
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        // Delay setting isLoading to false for smoother transitions
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }
    };
    
    loadData();
  }, [filter]);
  
  // Summary metrics for header
  const getSummaryMetrics = () => {
    if (!analytics) return null;
    
    // Engagement summary
    const engagementMetric = analytics.metricSummaries.find(m => 
      m.metricType === MetricType.ENGAGEMENT_RATE
    );
    
    // Reach summary
    const reachMetric = analytics.metricSummaries.find(m => 
      m.metricType === MetricType.REACH
    );
    
    // Followers gained
    const followersMetric = analytics.metricSummaries.find(m => 
      m.metricType === MetricType.FOLLOWERS_GAINED
    );
    
    // Content count
    const contentCount = analytics.topPerformingContent.length + analytics.underperformingContent.length;
    
    return { engagementMetric, reachMetric, followersMetric, contentCount };
  };
  
  const summaryMetrics = getSummaryMetrics();
  
  return (
    <div className="analytics-dashboard" style={{ 
      padding: '16px 24px 32px', 
      maxWidth: '1800px', 
      margin: '0 auto',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          margin: 0,
          background: 'linear-gradient(90deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          Analytics Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            themeColor="info"
            icon="refresh"
            rounded="medium"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                const newFilter = { ...filter };
                setFilter(newFilter);
              }, 300);
            }}
          >
            Refresh
          </Button>
          <Button
            themeColor="primary"
            icon="file-excel"
            rounded="medium"
            onClick={() => alert('Export Report feature would be implemented here')}
          >
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Summary Stats */}
      {!isLoading && analytics && summaryMetrics && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-color)'
        }}>
          <StatCard 
            icon="user" 
            title="Total Reach" 
            value={summaryMetrics.reachMetric ? formatNumber(summaryMetrics.reachMetric.value) : '-'}
            changePercentage={summaryMetrics.reachMetric?.changePercentage || 0}
            color="#3880FF"
          />
          
          <StatCard 
            icon="heart" 
            title="Engagement Rate" 
            value={summaryMetrics.engagementMetric ? formatPercentage(summaryMetrics.engagementMetric.value) : '-'}
            changePercentage={summaryMetrics.engagementMetric?.changePercentage || 0}
            color="#8257E6"
          />
          
          <StatCard 
            icon="user-add" 
            title="New Followers" 
            value={summaryMetrics.followersMetric ? formatNumber(summaryMetrics.followersMetric.value) : '-'}
            changePercentage={summaryMetrics.followersMetric?.changePercentage || 0}
            color="#FF9F43"
          />
          
          <StatCard 
            icon="image" 
            title="Content Published" 
            value={formatNumber(summaryMetrics.contentCount)}
            changePercentage={0}
            color="#28C76F"
            showChange={false}
          />
        </div>
      )}
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Filters Section */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="k-icon k-i-filter" style={{ fontSize: '16px' }}></span>
              Analytics Filters
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Customize your dashboard view by adjusting the filters below
            </div>
          </div>
          
          <TimeSelector 
            filter={filter}
            onFilterChange={(newFilter) => setFilter({...filter, ...newFilter})}
          />
          
          <PlatformFilter
            filter={filter}
            onFilterChange={(newFilter) => setFilter({...filter, ...newFilter})}
          />
          
          {/* Active filters display */}
          {(filter.platforms.length > 0 || filter.contentTypes.length > 0) && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active filters:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {filter.platforms.map(platform => (
                  <Chip
                    key={platform}
                    text={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    style={{
                      backgroundColor: `${PLATFORM_COLORS[platform]}20`,
                      borderColor: PLATFORM_COLORS[platform],
                      color: PLATFORM_COLORS[platform]
                    }}
                  />
                ))}
                {filter.contentTypes.map(contentType => (
                  <Chip
                    key={contentType}
                    text={contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  />
                ))}
                {filter.showAIOptimizedOnly && (
                  <Chip
                    text="AI Optimized Only"
                    style={{
                      backgroundColor: 'rgba(75, 85, 232, 0.1)',
                      borderColor: '#4b55e8',
                      color: '#4b55e8'
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div style={{ padding: '40px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <LoadingCard height={300} />
            <LoadingCard height={300} />
            <LoadingCard height={400} />
          </div>
        ) : (
          analytics && (
            <>
              {/* Performance Overview Section */}
              <PerformanceOverview
                metricSummaries={analytics.metricSummaries}
                timeSeriesData={analytics.timeSeriesMetrics.map(ts => ({
                  metric: ts.metricType,
                  data: ts.data
                }))}
                showComparison={filter.compareWithPreviousPeriod}
              />
              
              {/* Platform Comparison Section */}
              <PlatformComparison
                timeSeriesData={analytics.timeSeriesMetrics.map(ts => ({
                  metric: ts.metricType,
                  data: ts.data
                }))}
                platformSummaries={analytics.platformSummaries}
              />
              
              {/* Content Performance Section */}
              <ContentPerformance
                topPerformingContent={analytics.topPerformingContent}
                underperformingContent={analytics.underperformingContent}
              />
              
              {/* Expanding Sections for Additional Insights */}
              <PanelBar expandMode="multiple">
                <PanelBarItem 
                  title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="k-icon k-i-group" style={{ fontSize: '18px' }}></span>
                      <span style={{ fontSize: '16px', fontWeight: 600 }}>Audience Demographics</span>
                    </div>
                  } 
                  expanded={true}
                >
                  <div style={{ padding: '16px 0' }}>
                    <AudienceInsights
                      audienceDemographics={analytics.audienceDemographics}
                    />
                  </div>
                </PanelBarItem>
                
                <PanelBarItem 
                  title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="k-icon k-i-calendar" style={{ fontSize: '18px' }}></span>
                      <span style={{ fontSize: '16px', fontWeight: 600 }}>Post Timing Analysis</span>
                    </div>
                  } 
                  expanded={true}
                >
                  <div style={{ padding: '16px 0' }}>
                    <PostTiming
                      postScheduleHeatmap={analytics.postScheduleHeatmap}
                    />
                  </div>
                </PanelBarItem>
                
                <PanelBarItem 
                  title={
                    <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="k-icon k-i-spark" style={{ fontSize: '18px' }}></span>
                      <span style={{ fontSize: '16px', fontWeight: 600 }}>AI Optimization Impact</span>
                    </div>
                  } 
                  expanded={true}
                >
                  <div style={{ padding: '16px 0' }}>
                    <AIPerformanceInsights
                      aiContentPerformance={analytics.aiContentPerformance}
                    />
                  </div>
                </PanelBarItem>
              </PanelBar>
              
              {/* Recommendations Section */}
              <div style={{
                marginTop: '24px',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--border-color)',
                background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-secondary) 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(to right, #3880FF, #4B55E8, #8257E6)',
                }}></div>
                
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  marginTop: '8px', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span className="k-icon k-i-lightbulb" style={{ color: '#FFB400', fontSize: '20px' }}></span>
                  AI-Powered Recommendations
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  <RecommendationCard
                    title="Optimize Posting Time"
                    description="Your engagement is 42% higher when posting on Thursdays. Consider shifting more content to this day."
                    icon="calendar"
                    color="#3880FF"
                  />
                  <RecommendationCard
                    title="Content Type Performance"
                    description="Video content is outperforming images by 3.2x. Consider creating more video content."
                    icon="video"
                    color="#8257E6"
                  />
                  <RecommendationCard
                    title="Platform Focus"
                    description="Instagram has your highest engagement rate (4.2%). Consider allocating more resources here."
                    icon="stats"
                    color="#4B55E8"
                  />
                </div>
              </div>
            </>
          )
        )}
      </div>
      
      {/* Fixed action button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100
      }}>
        <FloatingActionButton
          icon="question"
          themeColor="primary"
          size="large"
          style={{
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
          }}
          onClick={() => alert('AI assistant would provide analytics help here')}
        />
      </div>
    </div>
  );
};

// Helper component for stats cards
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  changePercentage: number;
  color: string;
  showChange?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  changePercentage, 
  color,
  showChange = true
}) => {
  return (
    <div className="summary-stat" style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: '16px',
      padding: '12px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}
    >
      <div style={{ 
        width: '48px', 
        height: '48px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <span className={`k-icon k-i-${icon}`} style={{ fontSize: '24px' }}></span>
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {value}
          {showChange && changePercentage !== 0 && (
            <span style={{ 
              fontSize: '14px',
              color: changePercentage > 0 ? '#28C76F' : '#EA5455',
              backgroundColor: changePercentage > 0 ? 'rgba(40, 199, 111, 0.1)' : 'rgba(234, 84, 85, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {changePercentage > 0 ? '↑' : '↓'} 
              {Math.abs(changePercentage).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for loading cards
const LoadingCard: React.FC<{ height: number }> = ({ height }) => {
  return (
    <div style={{ 
      height: `${height}px`, 
      borderRadius: '12px', 
      background: 'var(--bg-secondary)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(to right, transparent, var(--primary-color), transparent)',
        animation: 'loadingShimmer 2s infinite'
      }}></div>
      <Loader size="large" type="pulsing" />
      <style>{`
        @keyframes loadingShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// Helper component for recommendations
const RecommendationCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
}> = ({ title, description, icon, color }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'var(--bg-primary)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      cursor: 'pointer',
    }} 
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    }}
    >
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '20px'
      }}>
        <span className={`k-icon k-i-${icon}`}></span>
      </div>
      <div>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          margin: '0 0 8px 0',
          color: 'var(--text-primary)'
        }}>
          {title}
        </h3>
        <p style={{ 
          margin: 0,
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 