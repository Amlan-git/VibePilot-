import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardBody, CardActions, TileLayout, TileLayoutItem } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartLegend, ChartTooltip, ChartTitle, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ListView } from '@progress/kendo-react-listview';
import { Badge, Loader } from '@progress/kendo-react-indicators';
import { Link } from 'react-router-dom';
import { PLATFORM_TYPES } from '../../types/platforms';
import { formatDistanceToNow } from 'date-fns';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Sparkline } from '@progress/kendo-react-charts';
import 'hammerjs';

interface PostMetrics {
  total: number;
  scheduled: number;
  published: number;
  draft: number;
  failed: number;
}

interface PlatformMetrics {
  platform: string;
  count: number;
  color: string;
}

interface UpcomingPost {
  id: string;
  title: string;
  platform: string;
  scheduledDate: Date;
}

interface DashboardMetrics {
  posts: {
    total: number;
    scheduled: number;
    published: number;
    draft: number;
    change: number;
    trend: number[];
  };
  engagement: {
    total: number;
    likes: number;
    comments: number;
    shares: number;
    change: number;
    trend: number[];
  };
  topPlatforms: {
    name: string;
    value: number;
  }[];
  performance: {
    day: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
}

// Get platform values to use in the chart
const PLATFORM_VALUES = Object.values(PLATFORM_TYPES);

// helper function to get platform colors based on platform type
const getPlatformColor = (platform: string): string => {
  const colors: Record<string, string> = {
    twitter: '#1DA1F2',
    facebook: '#4267B2',
    instagram: '#E1306C',
    linkedin: '#0077B5',
    youtube: '#FF0000',
    tiktok: '#000000',
  };
  
  return colors[platform] || '#6c757d';
};

// Staggered animation helper
const getDelayClass = (index: number) => {
  const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
  return delays[index % delays.length];
};

const SimpleDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
  const [platformStatus, setPlatformStatus] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'warning' | 'error', message: string } | null>(null);
  
  const postsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMetrics({
        posts: {
          total: 345,
          scheduled: 28,
          published: 297,
          draft: 20,
          change: +15,
          trend: [25, 28, 32, 37, 40, 35, 30, 27, 29, 35, 40, 42]
        },
        engagement: {
          total: 8245,
          likes: 5932,
          comments: 1823,
          shares: 490,
          change: +21,
          trend: [400, 420, 480, 550, 600, 650, 700, 720, 750, 800, 850, 900]
        },
        topPlatforms: [
          { name: 'Instagram', value: 42 },
          { name: 'Twitter', value: 28 },
          { name: 'LinkedIn', value: 16 },
          { name: 'Facebook', value: 14 },
        ],
        performance: [
          { day: 'Mon', likes: 120, comments: 45, shares: 18 },
          { day: 'Tue', likes: 145, comments: 48, shares: 22 },
          { day: 'Wed', likes: 135, comments: 55, shares: 25 },
          { day: 'Thu', likes: 170, comments: 75, shares: 33 },
          { day: 'Fri', likes: 180, comments: 85, shares: 40 },
          { day: 'Sat', likes: 150, comments: 65, shares: 32 },
          { day: 'Sun', likes: 130, comments: 50, shares: 20 },
        ]
      });

      setUpcomingPosts([
        { id: 1, title: "New Product Launch", content: "Excited to announce our latest product line hitting stores next week!", platform: "Instagram", platformIcon: "📸", status: "scheduled", scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24) },
        { id: 2, title: "Customer Testimonial", content: "Hear what our customers are saying about our services.", platform: "Facebook", platformIcon: "👍", status: "scheduled", scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48) },
        { id: 3, title: "Industry News Update", content: "Breaking news that's shaping our industry and how we're adapting.", platform: "LinkedIn", platformIcon: "💼", status: "draft", scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 72) },
        { id: 4, title: "Behind the Scenes", content: "Take a peek at how we create the magic behind our products.", platform: "Twitter", platformIcon: "🐦", status: "scheduled", scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 96) },
        { id: 5, title: "Weekend Special Offer", content: "Limited time discount on all premium subscriptions this weekend!", platform: "YouTube", platformIcon: "▶️", status: "scheduled", scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 120) },
      ]);

      setPlatformStatus([
        { id: 1, name: "Twitter", icon: "🐦", status: "connected", color: "#1DA1F2" },
        { id: 2, name: "Facebook", icon: "👍", status: "connected", color: "#4267B2" },
        { id: 3, name: "Instagram", icon: "📸", status: "disconnected", color: "#E1306C" },
        { id: 4, name: "LinkedIn", icon: "💼", status: "connected", color: "#0077B5" },
        { id: 5, name: "YouTube", icon: "▶️", status: "disconnected", color: "#FF0000" },
        { id: 6, name: "TikTok", icon: "🎵", status: "connected", color: "#000000" },
      ]);

      // Show a welcome notification
      setNotification({
        type: 'success',
        message: 'Dashboard data loaded successfully'
      });

      setLoading(false);
    }, 1500);

    // Clear notification after 5 seconds
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getPlatformColor = (platform: string): string => {
    const colorMap: Record<string, string> = {
      twitter: '#1DA1F2',
      facebook: '#4267B2',
      instagram: '#E1306C',
      linkedin: '#0077B5',
      youtube: '#FF0000',
      tiktok: '#000000'
    };
    
    return colorMap[platform.toLowerCase()] || '#6c757d';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Function to scroll posts
  const scrollPosts = (direction: 'left' | 'right') => {
    if (postsScrollRef.current) {
      const container = postsScrollRef.current;
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Custom rendering for platform status
  const renderPlatformItem = (props: any) => {
    const platform = props.dataItem;
    
    // Determine status color and icon
    const statusColor = platform.status === 'connected' ? 'var(--success-color)' : 'var(--warning-color)';
    const statusBgColor = platform.status === 'connected' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(221, 107, 32, 0.1)';
    const statusIcon = platform.status === 'connected' ? '✓' : '⚠️';
    
    return (
      <div className="platform-item hover-elevate" style={{ 
        padding: '16px',
        borderRadius: '12px',
        width: '100%',
        minWidth: '230px',
        maxWidth: '100%',
        background: 'white',
        border: `1px solid ${platform.status === 'connected' ? 'rgba(226, 232, 240, 0.8)' : `${statusColor}40`}`,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        margin: '8px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        transform: 'translateZ(0)'
      }}>
        {/* Color accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: platform.color
        }}></div>
        
        {/* Platform content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '12px', width: '100%' }}>
          <div style={{ 
            fontSize: '1.25rem',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${platform.color}10`,
            borderRadius: '12px',
            color: platform.color,
            flexShrink: 0,
            border: `1px solid ${platform.color}20`
          }}>
            {platform.icon}
          </div>
          
          <div style={{ flex: '1' }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#2D3748',
              fontSize: '1rem',
              marginBottom: '6px',
              letterSpacing: '0.01em'
            }}>
              {platform.name}
            </div>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              color: statusColor,
              fontWeight: '500',
              letterSpacing: '0.01em'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: statusBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                border: `1px solid ${statusColor}`
              }}>
                {statusIcon}
              </div>
              <span style={{ 
                textTransform: 'capitalize',
                lineHeight: '1.2'
              }}>{platform.status}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Custom rendering for post items
  const renderPostItem = (props: any) => {
    const post = props.dataItem;
    const platformColor = getPlatformColor(post.platform);
    
    return (
      <div className="post-item hover-elevate" style={{
        padding: '16px',
        borderRadius: '12px',
        minWidth: '280px',
        height: '100%',
        background: 'white',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        transform: 'translateZ(0)'
      }}>
        {/* Color accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          backgroundColor: platformColor
        }}></div>
        
        <div style={{ marginLeft: '10px' }}>
          {/* Platform indicator */}
          <div style={{ 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px' 
          }}>
            <div style={{ 
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: `${platformColor}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: platformColor,
              fontSize: '0.9rem',
              border: `1px solid ${platformColor}20`
            }}>
              {post.platformIcon}
            </div>
            <span style={{ 
              color: platformColor,
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.01em' 
            }}>
              {post.platform}
            </span>
            <div style={{ 
              marginLeft: 'auto', 
              fontSize: '0.8rem', 
              color: 'var(--text-secondary)',
              fontWeight: '500',
              padding: '2px 8px',
              background: 'rgba(226, 232, 240, 0.5)',
              borderRadius: '12px'
            }}>
              {formatDistanceToNow(new Date(post.scheduledDate), { addSuffix: true })}
            </div>
          </div>
          
          {/* Post content */}
          <h3 style={{ 
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#2D3748',
            lineHeight: '1.4',
            letterSpacing: '0.01em'
          }}>
            {post.title}
          </h3>
          
          <p style={{ 
            margin: '0 0 16px',
            fontSize: '0.875rem',
            color: '#4A5568',
            lineHeight: '1.5',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            letterSpacing: '0.01em'
          }}>
            {post.content}
          </p>
          
          {/* Post footer */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'auto',
            alignItems: 'center',
            padding: '8px 0 0',
            borderTop: '1px solid rgba(226, 232, 240, 0.6)'
          }}>
            <div style={{ 
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: post.status === 'scheduled' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(221, 107, 32, 0.1)',
              color: post.status === 'scheduled' ? 'var(--success-color)' : 'var(--warning-color)',
              fontWeight: '500',
              letterSpacing: '0.01em',
              textTransform: 'capitalize',
              border: post.status === 'scheduled' ? '1px solid var(--success-color)' : '1px solid var(--warning-color)'
            }}>
              {post.status}
            </div>
            <Button 
              fillMode="flat" 
              size="small" 
              icon="edit" 
              style={{ 
                padding: '6px',
                borderRadius: '8px',
                background: 'rgba(66, 153, 225, 0.1)'
              }} 
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader size="large" themeColor="primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ 
      padding: '28px', 
      maxWidth: '1920px', 
      margin: '0 auto',
      background: 'linear-gradient(145deg, rgba(250,251,255,0.5), rgba(240,245,255,0.5))',
      minHeight: '100vh'
    }}>
      <div className="dashboard-header" style={{ 
        marginBottom: '28px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            background: 'linear-gradient(90deg, #2D3748, #4A5568)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{getGreeting()}, User</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Here's what's happening with your content today</p>
        </div>
        <Button 
          themeColor="primary" 
          size="large"
          style={{
            background: 'linear-gradient(90deg, #4299E1, #3182CE)',
            boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)',
            fontWeight: 'bold',
            borderRadius: '10px',
            padding: '10px 18px'
          }}
        >Create New Post</Button>
      </div>

      {/* Notifications */}
      {notification && (
        <NotificationGroup style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000 }}>
          <Notification
            type={{ style: notification.type, icon: true }}
            closable={true}
            onClose={() => setNotification(null)}
            style={{
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px'
            }}
          >
            <span>{notification.message}</span>
          </Notification>
        </NotificationGroup>
      )}

      {/* Dashboard Content */}
      <TileLayout
        columns={4}
        rowHeight={260}
        gap={{ rows: 20, columns: 20 }}
        items={[
          {
            header: 'Content Overview',
            body: (
              <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {metrics && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '16px', height: '100%' }}>
                    <Card style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '5px',
                        width: '100%',
                        background: 'linear-gradient(90deg, #3182CE, #63B3ED)'
                      }}></div>
                      <CardBody style={{ padding: '18px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Total Posts</span>
                          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginRight: '8px', color: '#2D3748' }}>{metrics.posts.total}</h2>
                            <span style={{ 
                              color: 'var(--success-color)', 
                              fontSize: '14px',
                              background: 'rgba(56, 161, 105, 0.1)',
                              padding: '2px 6px',
                              borderRadius: '20px',
                              fontWeight: '500'
                            }}>+{metrics.posts.change}%</span>
                          </div>
                        </div>
                        <Sparkline 
                          data={metrics.posts.trend}
                          type="line"
                          style={{ height: '60px' }}
                        >
                          <ChartSeriesItem color="#3182CE" />
                        </Sparkline>
                      </CardBody>
                    </Card>

                    <Card style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '5px',
                        width: '100%',
                        background: 'linear-gradient(90deg, #38A169, #68D391)'
                      }}></div>
                      <CardBody style={{ padding: '18px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Engagement</span>
                          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginRight: '8px', color: '#2D3748' }}>{metrics.engagement.total}</h2>
                            <span style={{ 
                              color: 'var(--success-color)', 
                              fontSize: '14px',
                              background: 'rgba(56, 161, 105, 0.1)',
                              padding: '2px 6px',
                              borderRadius: '20px',
                              fontWeight: '500'
                            }}>+{metrics.engagement.change}%</span>
                          </div>
                        </div>
                        <Sparkline 
                          data={metrics.engagement.trend}
                          type="line"
                          style={{ height: '60px' }}
                        >
                          <ChartSeriesItem color="#38A169" />
                        </Sparkline>
                      </CardBody>
                    </Card>

                    <Card style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '5px',
                        width: '100%',
                        background: 'linear-gradient(90deg, #805AD5, #B794F4)'
                      }}></div>
                      <CardBody style={{ padding: '18px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Scheduled</span>
                          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginRight: '8px', color: '#2D3748' }}>{metrics.posts.scheduled}</h2>
                            <span style={{ 
                              color: '#805AD5', 
                              fontSize: '14px',
                              background: 'rgba(128, 90, 213, 0.1)',
                              padding: '2px 6px',
                              borderRadius: '20px',
                              fontWeight: '500'
                            }}>Upcoming</span>
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-around', 
                          marginTop: '18px',
                          background: 'rgba(247, 250, 252, 0.8)',
                          borderRadius: '10px',
                          padding: '12px'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2D3748' }}>{metrics.posts.published}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Published</div>
                          </div>
                          <div style={{ 
                            width: '1px', 
                            height: '36px', 
                            background: 'rgba(203, 213, 224, 0.5)',
                            margin: '0 10px' 
                          }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2D3748' }}>{metrics.posts.draft}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Drafts</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                      borderRadius: '14px',
                      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '5px',
                        width: '100%',
                        background: 'linear-gradient(90deg, #DD6B20, #ED8936)'
                      }}></div>
                      <CardBody style={{ padding: '18px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Top Platform</span>
                          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginRight: '8px', color: '#2D3748' }}>{metrics.topPlatforms[0].name}</h2>
                          </div>
                        </div>
                        <div style={{ height: '100px' }}>
                          <Chart style={{ height: '100%' }}>
                            <ChartSeries>
                              <ChartSeriesItem
                                type="donut"
                                data={metrics.topPlatforms.map(p => ({ 
                                  name: p.name, 
                                  value: p.value,
                                  color: getPlatformColor(p.name.toLowerCase())
                                }))}
                                categoryField="name"
                                field="value"
                                holeSize={45}
                              />
                            </ChartSeries>
                            <ChartLegend visible={false} />
                          </Chart>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>
            ),
          },
          {
            header: 'Performance Trends',
            body: (
              <div style={{ 
                height: '100%', 
                padding: '16px',
                background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
              }}>
                {metrics && (
                  <Chart style={{ height: '100%' }}>
                    <ChartTitle text="Weekly Performance" />
                    <ChartLegend position="top" orientation="horizontal" />
                    <ChartCategoryAxis>
                      <ChartCategoryAxisItem categories={metrics.performance.map(p => p.day)} />
                    </ChartCategoryAxis>
                    <ChartSeries>
                      <ChartSeriesItem
                        type="line"
                        data={metrics.performance.map(p => p.likes)}
                        name="Likes"
                        color="#4299E1"
                        markers={{ visible: true, size: 6 }}
                      />
                      <ChartSeriesItem
                        type="line"
                        data={metrics.performance.map(p => p.comments)}
                        name="Comments"
                        color="#9F7AEA"
                        markers={{ visible: true, size: 6 }}
                      />
                      <ChartSeriesItem
                        type="line"
                        data={metrics.performance.map(p => p.shares)}
                        name="Shares"
                        color="#38A169"
                        markers={{ visible: true, size: 6 }}
                      />
                    </ChartSeries>
                    <ChartValueAxis>
                      <ChartValueAxisItem title={{ text: "Count" }} min={0} />
                    </ChartValueAxis>
                    <ChartTooltip visible={true} />
                  </Chart>
                )}
              </div>
            ),
          },
          {
            header: 'Platform Status',
            body: (
              <div style={{ 
                height: '100%', 
                padding: '0 8px', 
                overflow: 'auto',
                background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
              }}>
                <ListView
                  data={platformStatus}
                  item={renderPlatformItem}
                  style={{ 
                    border: 'none', 
                    height: '100%', 
                    overflow: 'auto', 
                    padding: '10px'
                  }}
                />
              </div>
            ),
          },
          {
            header: 'Upcoming Posts',
            body: (
              <div style={{ 
                position: 'relative', 
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8faff)', 
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                overflow: 'hidden'
              }}>
                <div 
                  ref={postsScrollRef} 
                  style={{
                    display: 'flex',
                    gap: '16px',
                    overflowX: 'auto',
                    padding: '16px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    height: '100%'
                  }}
                  className="hide-scrollbar"
                >
                  {upcomingPosts.map((post, index) => (
                    <div key={post.id} style={{ flex: '0 0 300px' }}>
                      {renderPostItem({ dataItem: post, index })}
                    </div>
                  ))}
                </div>
                
                <Button 
                  themeColor="light"
                  fillMode="flat"
                  icon="arrow-left"
                  onClick={() => scrollPosts('left')}
                  style={{ 
                    position: 'absolute', 
                    left: '8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    zIndex: 2,
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px'
                  }}
                />
                
                <Button 
                  themeColor="light"
                  fillMode="flat"
                  icon="arrow-right"
                  onClick={() => scrollPosts('right')}
                  style={{ 
                    position: 'absolute', 
                    right: '8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    zIndex: 2,
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px'
                  }}
                />
              </div>
            ),
          }
        ]}
        className="dashboard-tilelayout"
        style={{
          '--kendo-tilelayout-container-padding': '0',
          '--kendo-tilelayout-item-header-padding': '14px 18px',
          '--kendo-tilelayout-item-header-border-bottom': '1px solid rgba(226, 232, 240, 0.6)',
          '--kendo-tilelayout-item-header-background': 'white',
          '--kendo-tilelayout-item-border-radius': '16px',
          '--kendo-tilelayout-item-border': 'none',
          '--kendo-tilelayout-item-box-shadow': '0 10px 25px rgba(0, 0, 0, 0.06)',
          '--kendo-tilelayout-item-header-text-transform': 'none'
        } as any}
      />
    </div>
  );
};

export default SimpleDashboard; 