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
  ChartValueAxis,
  ChartValueAxisItem
} from '@progress/kendo-react-charts';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { AIContentPerformance, MetricType } from '../types';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';
import 'hammerjs';

interface AIPerformanceInsightsProps {
  aiContentPerformance: AIContentPerformance[];
  isLoading?: boolean;
}

// Helper to format metric value
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

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const AIPerformanceInsights: React.FC<AIPerformanceInsightsProps> = ({
  aiContentPerformance,
  isLoading = false
}) => {
  // State for selected metric to analyze
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(MetricType.ENGAGEMENT_RATE);
  
  // If no data, show placeholder
  if (aiContentPerformance.length === 0) {
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
            AI Optimization Impact
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div>No AI optimization data available</div>
        </CardBody>
      </Card>
    );
  }
  
  // Count AI optimized vs non-AI content
  const aiOptimizedCount = aiContentPerformance.filter(c => c.aiOptimized).length;
  const nonAiCount = aiContentPerformance.length - aiOptimizedCount;
  
  // Calculate average improvement percentage
  const avgImprovement = aiContentPerformance.reduce((sum, content) => 
    sum + (content.aiOptimized ? content.engagementImprovement : 0), 0) / (aiOptimizedCount || 1);
  
  // Group content by platform
  const platformData = aiContentPerformance.reduce((acc, content) => {
    const platform = content.platformType;
    if (!acc[platform]) {
      acc[platform] = {
        aiOptimized: [],
        nonAiOptimized: []
      };
    }
    
    if (content.aiOptimized) {
      acc[platform].aiOptimized.push(content);
    } else {
      acc[platform].nonAiOptimized.push(content);
    }
    
    return acc;
  }, {} as Record<string, { aiOptimized: AIContentPerformance[], nonAiOptimized: AIContentPerformance[] }>);
  
  // Calculate average engagement by platform
  const platformPerformance = Object.entries(platformData).map(([platform, data]) => {
    const aiMetricSum = data.aiOptimized.reduce((sum, content) => 
      sum + (content.metrics[selectedMetric] || 0), 0);
    const nonAiMetricSum = data.nonAiOptimized.reduce((sum, content) => 
      sum + (content.metrics[selectedMetric] || 0), 0);
    
    const aiAvg = data.aiOptimized.length > 0 
      ? aiMetricSum / data.aiOptimized.length 
      : 0;
    const nonAiAvg = data.nonAiOptimized.length > 0 
      ? nonAiMetricSum / data.nonAiOptimized.length 
      : 0;
    
    return {
      platform,
      aiAvg,
      nonAiAvg,
      improvement: nonAiAvg > 0 ? ((aiAvg - nonAiAvg) / nonAiAvg) * 100 : 0
    };
  });
  
  // Top performing AI content
  const topAiContent = [...aiContentPerformance]
    .filter(content => content.aiOptimized)
    .sort((a, b) => b.engagementImprovement - a.engagementImprovement)
    .slice(0, 5);
  
  // Metric options for dropdown
  const metricOptions = [
    { text: 'Engagement Rate', value: MetricType.ENGAGEMENT_RATE },
    { text: 'Likes', value: MetricType.LIKES },
    { text: 'Comments', value: MetricType.COMMENTS },
    { text: 'Shares', value: MetricType.SHARES },
    { text: 'Impressions', value: MetricType.IMPRESSIONS },
    { text: 'Reach', value: MetricType.REACH }
  ];
  
  // Cell template for platform column
  const PlatformCell = (props: any) => {
    const { dataItem } = props;
    const platform = dataItem.platformType;
    
    return (
      <td>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%',
            backgroundColor: PLATFORM_COLORS[platform]
          }} />
          <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
        </div>
      </td>
    );
  };
  
  // Cell template for title column
  const TitleCell = (props: any) => {
    const { dataItem } = props;
    
    return (
      <td>
        <div style={{ maxWidth: '250px' }}>
          <div style={{ 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 500
          }}>
            {dataItem.title}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)',
            marginTop: '4px'
          }}>
            {formatDate(dataItem.publishedDate)}
          </div>
        </div>
      </td>
    );
  };
  
  // Cell template for improvement column
  const ImprovementCell = (props: any) => {
    const { dataItem } = props;
    
    return (
      <td>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 600,
          color: '#22C55E'
        }}>
          <span>↑</span>
          <span style={{ marginLeft: '4px' }}>
            {dataItem.engagementImprovement.toFixed(1)}%
          </span>
        </div>
      </td>
    );
  };
  
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
          AI Optimization Impact
        </CardTitle>
        <CardActions>
          <DropDownList
            data={metricOptions}
            textField="text"
            dataItemKey="value"
            value={metricOptions.find(o => o.value === selectedMetric)}
            onChange={(e) => setSelectedMetric(e.value.value)}
            style={{ width: '150px' }}
          />
        </CardActions>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        {isLoading ? (
          <div>Loading AI performance data...</div>
        ) : (
          <>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* AI Content Stats */}
              <Card style={{ 
                padding: '20px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    AI Optimized Posts
                  </div>
                  <div style={{ 
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#3B82F6'
                  }}>
                    {aiOptimizedCount}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginTop: '8px'
                  }}>
                    {Math.round((aiOptimizedCount / (aiContentPerformance.length || 1)) * 100)}% of total content
                  </div>
                </div>
              </Card>
              
              {/* Regular Content Stats */}
              <Card style={{ 
                padding: '20px',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    Regular Posts
                  </div>
                  <div style={{ 
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#64748B'
                  }}>
                    {nonAiCount}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginTop: '8px'
                  }}>
                    {Math.round((nonAiCount / (aiContentPerformance.length || 1)) * 100)}% of total content
                  </div>
                </div>
              </Card>
              
              {/* Average Improvement */}
              <Card style={{ 
                padding: '20px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    Average Improvement
                  </div>
                  <div style={{ 
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span>↑</span>
                    <span style={{ marginLeft: '4px' }}>
                      {avgImprovement.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginTop: '8px'
                  }}>
                    in {getMetricName(selectedMetric)}
                  </div>
                </div>
              </Card>
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
              marginBottom: '24px'
            }}>
              {/* Performance by Platform */}
              <Card style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '20px' }}>
                  Performance by Platform
                </h3>
                <div style={{ height: '300px' }}>
                  <Chart style={{ height: '100%' }}>
                    <ChartLegend position="bottom" />
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem 
                        categories={platformPerformance.map(p => 
                          p.platform.charAt(0).toUpperCase() + p.platform.slice(1)
                        )}
                      />
                    </ChartCategoryAxis>
                    <ChartValueAxis>
                      <ChartValueAxisItem 
                        min={0}
                        title={{ text: getMetricName(selectedMetric) }}
                      />
                    </ChartValueAxis>
                    <ChartSeries>
                      <ChartSeriesItem
                        name="AI Optimized"
                        data={platformPerformance.map(p => p.aiAvg)}
                        type="column"
                        color="#3B82F6"
                      />
                      <ChartSeriesItem
                        name="Regular Posts"
                        data={platformPerformance.map(p => p.nonAiAvg)}
                        type="column"
                        color="#94A3B8"
                      />
                    </ChartSeries>
                  </Chart>
                </div>
              </Card>
              
              {/* Improvement by Platform */}
              <Card style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '20px' }}>
                  Improvement by Platform
                </h3>
                <div style={{ height: '300px' }}>
                  <Chart style={{ height: '100%' }}>
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem 
                        categories={platformPerformance.map(p => 
                          p.platform.charAt(0).toUpperCase() + p.platform.slice(1)
                        )}
                      />
                    </ChartCategoryAxis>
                    <ChartValueAxis>
                      <ChartValueAxisItem 
                        min={0}
                        title={{ text: "Improvement %" }}
                        labels={{
                          format: '{0}%'
                        }}
                      />
                    </ChartValueAxis>
                    <ChartSeries>
                      <ChartSeriesItem
                        data={platformPerformance.map(p => p.improvement)}
                        type="column"
                        color="#22C55E"
                      />
                    </ChartSeries>
                  </Chart>
                </div>
              </Card>
            </div>
            
            {/* Top Performing AI Content */}
            <Card style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '20px' }}>
                Top Performing AI-Optimized Content
              </h3>
              <Grid
                data={topAiContent}
                style={{ border: 'none' }}
              >
                <GridColumn 
                  field="platformType" 
                  title="Platform" 
                  width="120px"
                  cell={PlatformCell}
                />
                <GridColumn 
                  field="title" 
                  title="Content" 
                  width="300px"
                  cell={TitleCell}
                />
                <GridColumn 
                  field="engagementImprovement" 
                  title="Improvement" 
                  width="130px"
                  cell={ImprovementCell}
                />
                {[MetricType.LIKES, MetricType.COMMENTS, MetricType.SHARES].map(metric => (
                  <GridColumn 
                    key={metric}
                    field={`metrics.${metric}`}
                    title={getMetricName(metric)}
                    width="100px"
                    cell={(props) => (
                      <td style={{ fontWeight: 500 }}>
                        {formatMetricValue(props.dataItem.metrics[metric] || 0, metric)}
                      </td>
                    )}
                  />
                ))}
              </Grid>
            </Card>
          </>
        )}
      </CardBody>
    </Card>
  );
};

// Helper to get metric display name
function getMetricName(metricType: MetricType): string {
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
      return metricType.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
}

export default AIPerformanceInsights; 