import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle,
  CardActions
} from '@progress/kendo-react-layout';
import { 
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartTooltip,
  ChartValueAxis,
  ChartValueAxisItem
} from '@progress/kendo-react-charts';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { PlatformMetric, MetricType, TimeSeriesDataPoint, PlatformSummary } from '../types';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';
import 'hammerjs';

interface PlatformComparisonProps {
  timeSeriesData: {
    metric: MetricType;
    data: TimeSeriesDataPoint[];
  }[];
  platformSummaries: PlatformSummary[];
  isLoading?: boolean;
}

// Chart types
const CHART_TYPES = [
  { text: 'Line', value: 'line' },
  { text: 'Column', value: 'column' },
  { text: 'Area', value: 'area' }
];

// Get metric options for dropdown
const METRIC_OPTIONS = Object.values(MetricType).map(metric => ({
  text: getMetricDisplayName(metric),
  value: metric
}));

// Helper function to get metric display name
function getMetricDisplayName(metricType: MetricType): string {
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
}

// Helper function to format metric values
function formatMetricValue(value: number, metricType: MetricType): string {
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
}

const PlatformComparison: React.FC<PlatformComparisonProps> = ({ 
  timeSeriesData, 
  platformSummaries, 
  isLoading = false 
}) => {
  // State for selected metric and chart type
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(MetricType.ENGAGEMENT_RATE);
  const [chartType, setChartType] = useState<string>('line');
  
  // Find time series data for the selected metric
  const metricData = timeSeriesData.find(series => series.metric === selectedMetric);
  
  // Organize data by platform
  const platformData = metricData ? Object.entries(
    metricData.data.reduce((acc, dataPoint) => {
      if (dataPoint.platform) {
        if (!acc[dataPoint.platform]) {
          acc[dataPoint.platform] = [];
        }
        acc[dataPoint.platform].push(dataPoint);
      }
      return acc;
    }, {} as Record<string, TimeSeriesDataPoint[]>)
  ).map(([platform, data]) => ({
    platform,
    data: data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })) : [];
  
  // Extract unique dates for category axis
  const categories = metricData
    ? [...new Set(metricData.data.map(d => d.date))].sort((a, b) => 
        new Date(a).getTime() - new Date(b).getTime()
      )
    : [];
  
  // Format dates for display
  const formattedCategories = categories.map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
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
        background: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <CardTitle style={{ fontSize: '18px', fontWeight: 600 }}>
          Platform Comparison
        </CardTitle>
        <CardActions>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <DropDownList
              data={METRIC_OPTIONS}
              textField="text"
              dataItemKey="value"
              value={METRIC_OPTIONS.find(m => m.value === selectedMetric)}
              onChange={(e) => setSelectedMetric(e.value.value)}
              style={{ width: '180px' }}
            />
            <ButtonGroup>
              {CHART_TYPES.map(type => (
                <Button
                  key={type.value}
                  togglable={true}
                  selected={chartType === type.value}
                  onClick={() => setChartType(type.value)}
                >
                  {type.text}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </CardActions>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        {isLoading ? (
          <div>Loading comparison data...</div>
        ) : (
          <div style={{ height: '400px' }}>
            <Chart style={{ height: '100%' }}>
              <ChartLegend position="bottom" />
              <ChartTooltip />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem 
                  categories={formattedCategories}
                  labels={{
                    rotation: 0,
                    padding: { top: 10 }
                  }}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem 
                  labels={{
                    format: selectedMetric === MetricType.ENGAGEMENT_RATE ? '{0}%' : '{0}'
                  }}
                />
              </ChartValueAxis>
              <ChartSeries>
                {platformData.map(({ platform, data }) => (
                  <ChartSeriesItem
                    key={platform}
                    type={chartType as any}
                    data={data.map(d => d.value)}
                    name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    color={PLATFORM_COLORS[platform]}
                    markers={{ visible: chartType === 'line' }}
                    style={chartType === 'area' ? 'smooth' : undefined}
                  />
                ))}
              </ChartSeries>
            </Chart>
          </div>
        )}
        
        {!isLoading && platformSummaries.length > 0 && (
          <div style={{ 
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {platformSummaries.map(summary => {
              let metricValue = 0;
              let metricChange = 0;
              
              // Use the appropriate metric from the platform summary based on selected metric
              switch (selectedMetric) {
                case MetricType.ENGAGEMENT_RATE:
                  metricValue = summary.engagementRate;
                  break;
                case MetricType.IMPRESSIONS:
                  metricValue = summary.impressions;
                  break;
                case MetricType.REACH:
                  metricValue = summary.reach;
                  break;
                case MetricType.FOLLOWERS_GAINED:
                  metricValue = summary.followerGrowth;
                  break;
                default:
                  metricValue = 0;
              }
              
              // For simplicity, use follower growth percentage for the change indicator
              metricChange = summary.followerGrowth;
              
              return (
                <Card key={summary.platformType} style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: `1px solid ${PLATFORM_COLORS[summary.platformType]}30`
                }}>
                  <CardBody style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{ 
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: PLATFORM_COLORS[summary.platformType],
                        marginRight: '8px'
                      }} />
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: 600
                      }}>
                        {summary.platformType.charAt(0).toUpperCase() + summary.platformType.slice(1)}
                      </span>
                    </div>
                    
                    {metricValue > 0 ? (
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                          {formatMetricValue(metricValue, selectedMetric)}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          fontSize: '13px',
                          fontWeight: 500,
                          color: metricChange >= 0 ? '#22C55E' : '#EF4444'
                        }}>
                          <span>{metricChange >= 0 ? '↑' : '↓'}</span>
                          <span style={{ marginLeft: '4px' }}>
                            {Math.abs(metricChange).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        No data available
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PlatformComparison; 