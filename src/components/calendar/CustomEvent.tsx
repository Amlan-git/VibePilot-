import React from 'react';
import { Badge } from '@progress/kendo-react-indicators';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { CalendarEvent } from '../../types/calendar';
import './CustomEvent.css';

interface CustomEventProps {
  dataItem: any;  // This contains our CalendarEvent in the dataItem property
  resources?: any;
  style?: React.CSSProperties;
  onEdit?: (dataItem: any) => void;
  onDelete?: (dataItem: any) => void;
}

export const CustomEvent: React.FC<CustomEventProps> = (props) => {
  const event = props.dataItem.dataItem as CalendarEvent;
  const style = {
    ...props.style,
    backgroundColor: getStatusColor(event.status),
    borderLeft: `4px solid ${getPlatformColor(event.platforms[0] || '')}`,
  };
  
  // Get appropriate color based on post status
  function getStatusColor(status: string): string {
    switch (status) {
      case 'draft':
        return '#f0f0f0';
      case 'scheduled':
        return '#e6f7ff';
      case 'published':
        return '#e6ffec';
      case 'failed':
        return '#fff2e6';
      default:
        return '#f0f0f0';
    }
  }
  
  // Get appropriate color based on platform
  function getPlatformColor(platformId: string): string {
    switch (platformId) {
      case 'twitter':
        return '#1DA1F2';
      case 'facebook':
        return '#4267B2';
      case 'instagram':
        return '#C13584';
      case 'linkedin':
        return '#0077B5';
      case 'youtube':
        return '#FF0000';
      case 'tiktok':
        return '#000000';
      default:
        return '#808080';
    }
  }

  // Format time to display
  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Tooltip title={event.post?.content || ''} position="right">
      <div className="custom-event" style={style}>
        <div className="event-title">
          {event.title || 'Untitled Post'}
        </div>
        
        <div className="event-time">
          {formatTime(new Date(event.start))}
        </div>
        
        <div className="event-badges">
          {event.platforms.map((platform: string) => (
            <Badge
              key={platform}
              themeColor="info"
              shape="rounded"
              size="small"
              className="platform-badge"
              icon={getPlatformIcon(platform)}
              title={getPlatformName(platform)}
            />
          ))}
          
          <Badge
            themeColor={getStatusBadgeTheme(event.status)}
            shape="rounded"
            size="small"
            className="status-badge"
            text={capitalizeFirstLetter(event.status)}
          />
        </div>
      </div>
    </Tooltip>
  );
};

// Helper functions
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPlatformIcon(platformId: string): string {
  switch (platformId) {
    case 'twitter':
      return 'twitter';
    case 'facebook':
      return 'facebook';
    case 'instagram':
      return 'instagram';
    case 'linkedin':
      return 'linkedin';
    case 'youtube':
      return 'play';
    case 'tiktok':
      return 'clock';
    default:
      return 'share';
  }
}

function getPlatformName(platformId: string): string {
  switch (platformId) {
    case 'twitter':
      return 'Twitter';
    case 'facebook':
      return 'Facebook';
    case 'instagram':
      return 'Instagram';
    case 'linkedin':
      return 'LinkedIn';
    case 'youtube':
      return 'YouTube';
    case 'tiktok':
      return 'TikTok';
    default:
      return 'Unknown';
  }
}

function getStatusBadgeTheme(status: string): 'warning' | 'info' | 'success' | 'error' {
  switch (status) {
    case 'draft':
      return 'warning';
    case 'scheduled':
      return 'info';
    case 'published':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'info';
  }
} 