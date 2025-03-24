import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle,
  TileLayout,
  TileLayoutItem 
} from '@progress/kendo-react-layout';
import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';
import { MetricSummary, MetricType, TimeSeriesDataPoint } from '../types';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';
import 'hammerjs';

interface PerformanceOverviewProps {
  metricSummaries: MetricSummary[];
  timeSeriesData: {
    metric: MetricType;
    data: TimeSeriesDataPoint[];
  }[];
  isLoading?: boolean;
  showComparison: boolean;
}

// Helper function to format metric values
const formatMetricValue = (value: number, metricType: MetricType): string => {
  switch (metricType) {
    case MetricType.ENGAGEMENT_RATE:
      return `${value.toFixed(2)}%`;
    case MetricType.IMPRESSIONS:
    case MetricType.REACH:
      return value >= 1000000
        ? `${(value / 1000000).toFixed(1)}M`
        : value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : value.toString();
    case MetricType.FOLLOWERS_GAINED:
    case MetricType.FOLLOWERS_LOST:
    case MetricType.LIKES:
    case MetricType.COMMENTS:
    case MetricType.SHARES:
    case MetricType.SAVES:
    case MetricType.CLICKS:
      return value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : value.toString();
    default:
      return value.toString();
  }
};

// Helper function to get metric display name
const getMetricDisplayName = (metricType: MetricType): string => {
  switch (metricType) {
    case MetricType.ENGAGEMENT_RATE:
      return 'Engagement Rate';
    case MetricType.IMPRESSIONS:
      return 'Impressions';
    case MetricType.REACH:
      return 'Reach';
    case MetricType.FOLLOWERS_GAINED:
      return 'New Followers';
    case MetricType.LIKES:
      return 'Likes';
    case MetricType.COMMENTS:
      return 'Comments';
    case MetricType.SHARES:
      return 'Shares';
    case MetricType.SAVES:
      return 'Saves';
    case MetricType.CLICKS:
      return 'Clicks';
    default:
      return metricType.replace(/_/g, ' ');
  }
};

// Metric card component
const MetricCard: React.FC<{
  metricSummary: MetricSummary;
  sparklineData?: TimeSeriesDataPoint[];
  showComparison: boolean;
}> = ({ metricSummary, sparklineData, showComparison }) => {
  const { metricType, value, changePercentage, platforms } = metricSummary;
  const [isHovered, setIsHovered] = useState(false);
  
  // Prepare sparkline data if available
  const sparklineValues = sparklineData
    ? sparklineData.map(d => d.value)
    : [];
  
  // Determine color based on change percentage
  const changeColor = changePercentage >= 0 ? '#22C55E' : '#EF4444';
  const changeIcon = changePercentage >= 0 ? '↑' : '↓';
  
  return (
    <div 
      style={{ 
        height: '100%',
        borderRadius: '12px',
        background: 'white',
        boxShadow: isHovered 
          ? '0 12px 24px rgba(0, 0, 0, 0.08)'
          : '0 4px 12px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-secondary)',
            margin: 0,
            letterSpacing: '-0.3px'
          }}>
            {getMetricDisplayName(metricType)}
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              margin: '0 0 4px 0',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px'
            }}>
              {formatMetricValue(value, metricType)}
            </h2>
            
            {showComparison && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '14px',
                fontWeight: 500,
                color: changeColor,
                gap: '4px'
              }}>
                <span>{changeIcon}</span>
                <span>{Math.abs(changePercentage).toFixed(1)}%</span>
                <span style={{ 
                  marginLeft: '4px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  opacity: 0.8
                }}>
                  vs previous
                </span>
              </div>
            )}
          </div>
          
          {sparklineValues.length > 0 && (
            <div style={{ width: '120px', height: '40px' }}>
              <Chart style={{ height: '100%' }}>
                <ChartSeries>
                  <ChartSeriesItem 
                    type="line" 
                    data={sparklineValues}
                    color={changePercentage >= 0 ? '#3B82F6' : '#EF4444'} 
                    style="smooth"
                    markers={{ visible: false }}
                    line={{ width: 2 }}
                  />
                </ChartSeries>
              </Chart>
            </div>
          )}
        </div>
        
        {showComparison && platforms.length > 0 && (
          <div style={{ 
            marginTop: '20px',
            display: 'flex',
            gap: '12px',
            overflow: 'hidden'
          }}>
            {platforms.map(platform => {
              const [isPlatformHovered, setIsPlatformHovered] = useState(false);
              return (
                <div 
                  key={platform.platformType}
                  style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: isPlatformHovered 
                      ? `${PLATFORM_COLORS[platform.platformType]}15`
                      : `${PLATFORM_COLORS[platform.platformType]}10`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    minWidth: '70px',
                    flex: 1,
                    transition: 'all 0.2s ease',
                    border: `1px solid ${PLATFORM_COLORS[platform.platformType]}20`,
                    transform: isPlatformHovered ? 'translateY(-1px)' : 'none'
                  }}
                  onMouseEnter={() => setIsPlatformHovered(true)}
                  onMouseLeave={() => setIsPlatformHovered(false)}
                >
                  <span style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: PLATFORM_COLORS[platform.platformType],
                    marginBottom: '6px'
                  }} />
                  <span style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    fontWeight: 500
                  }}>
                    {platform.platformType.charAt(0).toUpperCase() + platform.platformType.slice(1)}
                  </span>
                  <span style={{ 
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginTop: '4px'
                  }}>
                    {formatMetricValue(platform.value, metricType)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: `repeat(${window.innerWidth < 1200 ? 2 : 3}, 1fr)`,
    gap: '16px'
  }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={{ 
        height: '140px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        <div style={{ 
          width: '40%', 
          height: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
          marginBottom: '12px'
        }}></div>
        <div style={{ 
          width: '60%', 
          height: '32px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
          marginBottom: '16px'
        }}></div>
        <div style={{ 
          width: '100%', 
          height: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px'
        }}></div>
      </div>
    ))}
  </div>
);

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ 
  metricSummaries, 
  timeSeriesData, 
  isLoading = false,
  showComparison
}) => {
  const columns = window.innerWidth < 1200 ? 2 : 3;

  return (
    <div style={{ 
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 255, 255, 0.8) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ 
        borderBottom: '1px solid var(--border-color)',
        padding: '20px 24px',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600,
          margin: 0,
          letterSpacing: '-0.3px'
        }}>
          Performance Overview
        </h2>
      </div>
      <div style={{ padding: '24px' }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '24px'
          }}>
            {metricSummaries.map((metricSummary, index) => {
              const timeSeriesForMetric = timeSeriesData.find(ts => ts.metric === metricSummary.metricType);
              const sparklineData = timeSeriesForMetric
                ? timeSeriesForMetric.data.filter(d => !d.platform)
                : undefined;
              
              return (
                <div key={metricSummary.metricType}>
                  <MetricCard 
                    metricSummary={metricSummary} 
                    sparklineData={sparklineData}
                    showComparison={showComparison}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverview; 