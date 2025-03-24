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

// Loading skeleton component
const LoadingSkeleton = () => (
  <div style={{ padding: '24px' }}>
    <div style={{ 
      width: '200px', 
      height: '32px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '6px',
      marginBottom: '24px'
    }}></div>
    
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ 
          height: '120px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          <div style={{ 
            width: '60%', 
            height: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
            marginBottom: '12px'
          }}></div>
          <div style={{ 
            width: '40%', 
            height: '32px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
        </div>
      ))}
    </div>
    
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      marginBottom: '24px'
    }}>
      <div style={{ 
        width: '150px', 
        height: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
        marginBottom: '16px'
      }}></div>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ 
            height: '200px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px'
          }}></div>
        ))}
      </div>
    </div>
  </div>
);

// Add styles for the pulse animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;
document.head.appendChild(styleSheet);

const FilterCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        background: 'var(--bg-primary)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0, 0, 0, 0.08)' 
          : '0 4px 16px rgba(0, 0, 0, 0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

const CustomFloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Button
      themeColor="primary"
      rounded="full"
      style={{
        width: '56px',
        height: '56px',
        fontSize: '20px',
        fontWeight: 'bold',
        boxShadow: isHovered 
          ? '0 12px 32px rgba(0, 0, 0, 0.2)'
          : '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      ?
    </Button>
  );
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
      padding: '24px 32px 40px',
      maxWidth: '1800px', 
      margin: '0 auto',
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh'
    }}>
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: 700, 
          margin: 0,
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(0,0,0,0.05)',
          letterSpacing: '-0.5px'
        }}>
          Analytics Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button
            themeColor="info"
            rounded="large"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
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
            rounded="large"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(8px)',
          background: 'linear-gradient(to bottom right, var(--bg-secondary), rgba(255, 255, 255, 0.5))'
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
        gap: '32px'
      }}>
        {/* Filters Section */}
        <div style={{ 
          padding: '32px',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 255, 255, 0.8) 100%)',
          borderRadius: '20px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(to right, #3880FF, #4B55E8, #8257E6)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px'
          }}></div>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: 600, 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.3px'
            }}>
              Analytics Filters
            </h2>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              marginTop: '8px',
              opacity: 0.8
            }}>
              Customize your dashboard view by adjusting the filters below
            </div>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            <FilterCard>
              <TimeSelector 
                filter={filter}
                onFilterChange={setFilter}
              />
            </FilterCard>
            
            <FilterCard>
              <PlatformFilter
                filter={filter}
                onFilterChange={setFilter}
              />
            </FilterCard>
          </div>
          
          {/* Active filters display - hidden to remove X marks */}
          {false && (filter.platforms.length > 0 || filter.contentTypes.length > 0) && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '20px',
              alignItems: 'flex-start',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--bg-primary)',
              border: '1px dashed var(--border-color)'
            }}>
              <span style={{ 
                fontSize: '13px', 
                color: 'var(--text-secondary)',
                fontWeight: 500,
                background: 'var(--bg-secondary)',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                Active filters:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: '1' }}>
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
                    style={{
                      backgroundColor: 'rgba(65, 145, 255, 0.1)',
                      borderColor: 'rgba(65, 145, 255, 0.3)',
                      color: '#3880FF',
                    }}
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
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <Button
              themeColor="primary"
              rounded="large"
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const newFilter = { ...filter };
                  setFilter(newFilter);
                }, 300);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSkeleton />
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
              
              {/* Custom Expanding Sections - replaces PanelBar */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px', 
                marginTop: '32px'
              }}>
                <div style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <div style={{ 
                    padding: '16px 20px', 
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Audience Demographics</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <AudienceInsights
                      audienceDemographics={analytics.audienceDemographics}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <div style={{ 
                    padding: '16px 20px', 
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Post Timing Analysis</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <PostTiming
                      postScheduleHeatmap={analytics.postScheduleHeatmap}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <div style={{ 
                    padding: '16px 20px', 
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>AI Optimization Impact</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <AIPerformanceInsights
                      aiContentPerformance={analytics.aiContentPerformance}
                    />
                  </div>
                </div>
              </div>
              
              {/* Recommendations Section */}
              <div style={{
                marginTop: '32px',
                padding: '32px',
                borderRadius: '20px',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.08)',
                border: '1px solid var(--border-color)',
                background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 255, 255, 0.8) 100%)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(12px)'
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
        bottom: '32px',
        right: '32px',
        zIndex: 100
      }}>
        <CustomFloatingButton 
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
  const isPositive = changePercentage >= 0;
  const changeColor = isPositive ? '#22C55E' : '#EF4444';
  
  return (
    <div style={{ 
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '5px',
        height: '100%',
        backgroundColor: color,
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px'
      }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)', 
          margin: 0,
          fontWeight: 500
        }}>
          {title}
        </h3>
        
        <div style={{ 
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}15`,
          color: color,
          fontSize: '18px',
          border: `2px solid ${color}`
        }}>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: color, 
            borderRadius: '4px' 
          }}></div>
        </div>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          margin: 0, 
          marginBottom: '4px',
          color: 'var(--text-primary)'
        }}>
          {value}
        </h2>
        
        {showChange && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '14px', 
            color: changeColor,
            fontWeight: 500
          }}>
            <span>{Math.abs(changePercentage).toFixed(1)}%</span>
            <span style={{ marginLeft: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              vs previous period
            </span>
          </div>
        )}
      </div>
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
        fontSize: '20px',
        border: `2px solid ${color}`
      }}>
        <div style={{ 
          width: '16px', 
          height: '16px', 
          backgroundColor: color, 
          borderRadius: '4px' 
        }}></div>
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