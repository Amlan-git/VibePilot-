import React from 'react';
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
  
  // Prepare sparkline data if available
  const sparklineValues = sparklineData
    ? sparklineData.map(d => d.value)
    : [];
  
  // Determine color based on change percentage
  const changeColor = changePercentage >= 0 ? '#22C55E' : '#EF4444';
  const changeIcon = changePercentage >= 0 ? '↑' : '↓';
  
  return (
    <Card style={{ 
      height: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <CardBody style={{ padding: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: 'var(--text-secondary)',
            margin: 0 
          }}>
            {getMetricDisplayName(metricType)}
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              margin: '0 0 4px 0',
              color: 'var(--text-primary)'
            }}>
              {formatMetricValue(value, metricType)}
            </h2>
            
            {showComparison && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '13px',
                fontWeight: 500,
                color: changeColor
              }}>
                <span>{changeIcon}</span>
                <span style={{ marginLeft: '4px' }}>
                  {Math.abs(changePercentage).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          {sparklineValues.length > 0 && (
            <div style={{ width: '100px', height: '40px' }}>
              <Chart>
                <ChartSeries>
                  <ChartSeriesItem 
                    type="line" 
                    data={sparklineValues}
                    color={changePercentage >= 0 ? '#3B82F6' : '#EF4444'} 
                    style="smooth"
                  />
                </ChartSeries>
              </Chart>
            </div>
          )}
        </div>
        
        {showComparison && platforms.length > 0 && (
          <div style={{ 
            marginTop: '16px',
            display: 'flex',
            gap: '8px',
            overflow: 'hidden'
          }}>
            {platforms.map(platform => (
              <div 
                key={platform.platformType}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: `${PLATFORM_COLORS[platform.platformType]}10`,
                  borderRadius: '6px',
                  padding: '6px 10px',
                  minWidth: '60px',
                  flex: 1
                }}
              >
                <span style={{ 
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: PLATFORM_COLORS[platform.platformType],
                  marginBottom: '4px'
                }} />
                <span style={{ 
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}>
                  {platform.platformType.charAt(0).toUpperCase() + platform.platformType.slice(1)}
                </span>
                <span style={{ 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginTop: '2px'
                }}>
                  {formatMetricValue(platform.value, metricType)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ 
  metricSummaries, 
  timeSeriesData, 
  isLoading = false,
  showComparison
}) => {
  // Define tile layout structure
  const columns = window.innerWidth < 1200 ? 2 : 3;
  
  // Prepare items for TileLayout
  const items = metricSummaries.map((metricSummary, index) => {
    // Find corresponding time series data if available
    const timeSeriesForMetric = timeSeriesData.find(ts => ts.metric === metricSummary.metricType);
    
    // Create sparkline data for this metric
    const sparklineData = timeSeriesForMetric
      ? timeSeriesForMetric.data.filter(d => !d.platform) // Only use aggregated data points
      : undefined;
    
    return {
      header: getMetricDisplayName(metricSummary.metricType),
      body: (
        <MetricCard 
          metricSummary={metricSummary} 
          sparklineData={sparklineData}
          showComparison={showComparison}
        />
      ),
      col: index % columns,
      colSpan: 1,
      rowSpan: 1
    };
  });

  return (
    <Card style={{ 
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '24px'
    }}>
      <CardHeader style={{ 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 20px',
        background: 'var(--bg-secondary)'
      }}>
        <CardTitle style={{ fontSize: '18px', fontWeight: 600 }}>
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        {isLoading ? (
          <div>Loading metrics...</div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '16px'
          }}>
            {metricSummaries.map((metricSummary, index) => {
              // Find corresponding time series data if available
              const timeSeriesForMetric = timeSeriesData.find(ts => ts.metric === metricSummary.metricType);
              
              // Create sparkline data for this metric
              const sparklineData = timeSeriesForMetric
                ? timeSeriesForMetric.data.filter(d => !d.platform) // Only use aggregated data points
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
      </CardBody>
    </Card>
  );
};

export default PerformanceOverview; 