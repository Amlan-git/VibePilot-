import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle,
  CardActions
} from '@progress/kendo-react-layout';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { SplitButton, SplitButtonItem } from '@progress/kendo-react-buttons';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { ContentMetrics, ContentType, MetricType } from '../types';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';

interface ContentPerformanceProps {
  topPerformingContent: ContentMetrics[];
  underperformingContent: ContentMetrics[];
  isLoading?: boolean;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

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

// Helper function to format content type
const formatContentType = (contentType: ContentType): string => {
  switch (contentType) {
    case ContentType.TEXT:
      return 'Text';
    case ContentType.IMAGE:
      return 'Image';
    case ContentType.VIDEO:
      return 'Video';
    case ContentType.CAROUSEL:
      return 'Carousel';
    case ContentType.LINK:
      return 'Link';
    case ContentType.POLL:
      return 'Poll';
    case ContentType.STORY:
      return 'Story';
    case ContentType.REEL:
      return 'Reel';
    default:
      return contentType;
  }
};

const LoadingSkeleton = () => (
  <div style={{ padding: '0' }}>
    {/* Header skeleton */}
    <div style={{ 
      padding: '16px',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      display: 'flex',
      gap: '12px'
    }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ 
          width: '120px',
          height: '32px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
      ))}
    </div>
    
    {/* Table rows skeleton */}
    <div style={{ height: '400px' }}>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} style={{ 
          display: 'grid',
          gridTemplateColumns: '120px 300px 130px repeat(3, 100px)',
          gap: '16px',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          <div style={{ 
            width: '80%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
          <div style={{ 
            width: '90%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
          <div style={{ 
            width: '70%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
          <div style={{ 
            width: '60%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
          <div style={{ 
            width: '60%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
          <div style={{ 
            width: '60%',
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          }}></div>
        </div>
      ))}
    </div>
  </div>
);

const ContentPerformance: React.FC<ContentPerformanceProps> = ({
  topPerformingContent,
  underperformingContent,
  isLoading = false
}) => {
  // State for which content to display (top performing or underperforming)
  const [showTopPerforming, setShowTopPerforming] = useState<boolean>(true);
  
  // State for selected metric to sort by
  const [sortMetric, setSortMetric] = useState<MetricType>(MetricType.ENGAGEMENT_RATE);
  
  // Determine which content to display
  const contentToShow = showTopPerforming ? topPerformingContent : underperformingContent;
  
  // Columns to display metrics
  const metricColumns = [
    MetricType.LIKES,
    MetricType.COMMENTS,
    MetricType.SHARES,
    MetricType.IMPRESSIONS,
    MetricType.REACH
  ];
  
  // Sort options
  const sortOptions = [
    { text: 'Engagement Rate', value: MetricType.ENGAGEMENT_RATE },
    { text: 'Likes', value: MetricType.LIKES },
    { text: 'Comments', value: MetricType.COMMENTS },
    { text: 'Shares', value: MetricType.SHARES },
    { text: 'Impressions', value: MetricType.IMPRESSIONS },
    { text: 'Reach', value: MetricType.REACH }
  ];
  
  // Cell template for platform
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
  
  // Cell template for content title
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
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '4px'
          }}>
            <span>{formatContentType(dataItem.contentType)}</span>
            <span>•</span>
            <span>{formatDate(dataItem.publishedDate)}</span>
            {dataItem.isAIOptimized && (
              <>
                <span>•</span>
                <span style={{ 
                  background: 'rgba(75, 85, 232, 0.1)',
                  color: '#4b55e8',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  AI Optimized
                </span>
              </>
            )}
          </div>
        </div>
      </td>
    );
  };
  
  // Cell template for engagement rate
  const EngagementCell = (props: any) => {
    const { dataItem } = props;
    
    return (
      <td>
        <div style={{ fontWeight: 600 }}>
          {dataItem.engagementRate.toFixed(2)}%
        </div>
        <div style={{ 
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          color: dataItem.changePercentage >= 0 ? '#22C55E' : '#EF4444',
          fontWeight: 500,
          marginTop: '2px'
        }}>
          <span>{dataItem.changePercentage >= 0 ? '↑' : '↓'}</span>
          <span style={{ marginLeft: '2px' }}>
            {Math.abs(dataItem.changePercentage).toFixed(1)}%
          </span>
        </div>
      </td>
    );
  };
  
  // Cell template for metrics
  const MetricCell = (props: any) => {
    const { dataItem, field } = props;
    const metricValue = dataItem.metrics[field] || 0;
    
    return (
      <td style={{ fontWeight: 500 }}>
        {formatMetricValue(metricValue, field as MetricType)}
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
          {showTopPerforming ? 'Top Performing Content' : 'Underperforming Content'}
        </CardTitle>
        <CardActions>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <DropDownList
              data={sortOptions}
              textField="text"
              dataItemKey="value"
              value={sortOptions.find(o => o.value === sortMetric)}
              onChange={(e) => setSortMetric(e.value.value)}
              style={{ width: '150px' }}
            />
            <SplitButton
              text={showTopPerforming ? 'Top Performing' : 'Underperforming'}
              onItemClick={(e) => {
                if (e.item.text === 'Top Performing') {
                  setShowTopPerforming(true);
                } else {
                  setShowTopPerforming(false);
                }
              }}
            >
              <SplitButtonItem text="Top Performing" />
              <SplitButtonItem text="Underperforming" />
            </SplitButton>
          </div>
        </CardActions>
      </CardHeader>
      <CardBody style={{ padding: '0' }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Grid
            data={contentToShow}
            style={{ height: '400px', border: 'none' }}
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
              field="engagementRate" 
              title="Engagement" 
              width="130px"
              cell={EngagementCell}
            />
            {metricColumns.map(metricType => (
              <GridColumn 
                key={metricType}
                field={metricType} 
                title={metricType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                width="100px"
                cell={(props) => <MetricCell {...props} field={metricType} />}
              />
            ))}
          </Grid>
        )}
      </CardBody>
    </Card>
  );
};

export default ContentPerformance; 