import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle
} from '@progress/kendo-react-layout';
import { PostScheduleHeatmap } from '../types';
import 'hammerjs';

interface PostTimingProps {
  postScheduleHeatmap: PostScheduleHeatmap[];
  isLoading?: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Helper to format hour
const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

// Helper to get color based on engagement rate
const getColor = (engagementRate: number): string => {
  const max = 5; // 5% engagement rate is considered very good
  const normalized = Math.min(engagementRate / max, 1);
  
  // Gradient from light blue to dark blue
  const r = Math.round(220 - normalized * 180);
  const g = Math.round(240 - normalized * 190);
  const b = Math.round(255 - normalized * 60);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Helper to get cell opacity based on post count
const getOpacity = (count: number, maxCount: number): number => {
  if (maxCount === 0) return 0;
  return Math.max(0.2, Math.min(count / maxCount, 1));
};

const PostTiming: React.FC<PostTimingProps> = ({
  postScheduleHeatmap,
  isLoading = false
}) => {
  // If no data, show placeholder
  if (postScheduleHeatmap.length === 0) {
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
            Post Timing Insights
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div>No post timing data available</div>
        </CardBody>
      </Card>
    );
  }
  
  // Find max count for scaling
  const maxCount = Math.max(...postScheduleHeatmap.map(item => item.count));
  
  // Create a map for quick lookup
  const heatmapData: Record<string, PostScheduleHeatmap> = {};
  postScheduleHeatmap.forEach(item => {
    heatmapData[`${item.day}-${item.hour}`] = item;
  });
  
  // Calculate best times
  const bestTimes = [...postScheduleHeatmap]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);
  
  // Calculate worst times with at least some posts
  const worstTimes = [...postScheduleHeatmap]
    .filter(item => item.count > 0)
    .sort((a, b) => a.engagementRate - b.engagementRate)
    .slice(0, 3);
  
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
          Post Timing Insights
        </CardTitle>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        {isLoading ? (
          <div>Loading post timing data...</div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'auto repeat(24, 1fr)',
                gap: '2px',
                fontSize: '12px'
              }}>
                {/* Header with hours */}
                <div style={{ padding: '4px' }}></div>
                {HOURS.map(hour => (
                  <div 
                    key={hour}
                    style={{ 
                      padding: '4px 0', 
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                  >
                    {hour % 3 === 0 ? formatHour(hour) : ''}
                  </div>
                ))}
                
                {/* Rows for each day */}
                {DAYS.map((day, dayIndex) => (
                  <React.Fragment key={day}>
                    <div style={{ 
                      padding: '8px 12px 8px 4px',
                      textAlign: 'right',
                      fontWeight: 500
                    }}>
                      {day}
                    </div>
                    {HOURS.map(hour => {
                      const key = `${dayIndex}-${hour}`;
                      const data = heatmapData[key] || { count: 0, engagementRate: 0 };
                      
                      return (
                        <div 
                          key={hour}
                          style={{ 
                            backgroundColor: getColor(data.engagementRate),
                            opacity: getOpacity(data.count, maxCount),
                            height: '30px',
                            position: 'relative'
                          }}
                          title={`${day} ${formatHour(hour)}
Posts: ${data.count}
Engagement: ${data.engagementRate.toFixed(2)}%`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '12px',
                gap: '8px'
              }}>
                <span style={{ 
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Lower engagement
                </span>
                <div style={{ 
                  display: 'flex',
                  width: '150px',
                  height: '8px',
                  background: 'linear-gradient(to right, rgb(220, 240, 255), rgb(40, 50, 195))',
                  borderRadius: '4px'
                }} />
                <span style={{ 
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  Higher engagement
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '32px'
            }}>
              {/* Best times */}
              <Card style={{ padding: '16px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  marginTop: 0, 
                  marginBottom: '16px',
                  color: '#22C55E'
                }}>
                  Best Times to Post
                </h3>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {bestTimes.map((time, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{ 
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#22C55E'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {DAYS[time.day]} at {formatHour(time.hour)}
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: 'var(--text-secondary)'
                          }}>
                            {time.count} posts
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#22C55E'
                      }}>
                        {time.engagementRate.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Worst times */}
              <Card style={{ padding: '16px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  marginTop: 0, 
                  marginBottom: '16px',
                  color: '#EF4444'
                }}>
                  Worst Times to Post
                </h3>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {worstTimes.map((time, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{ 
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#EF4444'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {DAYS[time.day]} at {formatHour(time.hour)}
                          </div>
                          <div style={{ 
                            fontSize: '12px',
                            color: 'var(--text-secondary)'
                          }}>
                            {time.count} posts
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#EF4444'
                      }}>
                        {time.engagementRate.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default PostTiming; 