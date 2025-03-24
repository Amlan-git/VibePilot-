import React from 'react';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { CalendarDensity } from '../../types/calendar';
import './CustomMonthCell.css';

interface CustomMonthCellProps {
  date: Date;
  isToday?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
  isSelected?: boolean;
  getPostDensity: (date: Date) => CalendarDensity | undefined;
}

export const CustomMonthCell: React.FC<CustomMonthCellProps> = ({ 
  date, 
  isToday,
  isWeekend,
  isOtherMonth,
  isSelected,
  getPostDensity 
}) => {
  const density = getPostDensity(date);
  
  // Determine cell class based on properties
  const cellClass = `custom-month-cell ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${isOtherMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`;
  
  // Create density bars to represent post volume
  const renderDensityBars = () => {
    if (!density || !density.postCount) return null;
    
    const { postCount, platforms = [] } = density;
    const maxBars = Math.min(postCount, 5); // Show max 5 bars
    
    const bars = [];
    for (let i = 0; i < maxBars; i++) {
      const platformId = platforms[i] || '';
      bars.push(
        <div 
          key={i} 
          className="density-bar"
          style={{ backgroundColor: getPlatformColor(platformId) }}
          title={platformId ? getPlatformName(platformId) : `Post ${i + 1}`}
        />
      );
    }
    
    // If there are more posts than shown bars, add an indicator
    if (postCount > maxBars) {
      bars.push(
        <div key="more" className="more-indicator">
          +{postCount - maxBars}
        </div>
      );
    }
    
    return bars;
  };
  
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
  
  // Get platform name from ID
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
        return 'Unknown Platform';
    }
  }
  
  // Get conflict indicator if there are conflicts
  const getConflictIndicator = () => {
    if (!density || !density.conflicts) return null;
    
    return (
      <Tooltip title={`${density.conflicts} platform scheduling conflicts detected`} position="top">
        <div className="conflict-indicator">!</div>
      </Tooltip>
    );
  };
  
  return (
    <div className={cellClass}>
      <div className="date-display">
        <span className="date-number">{date.getDate()}</span>
        {getConflictIndicator()}
      </div>
      
      {density && density.postCount > 0 && (
        <div className="density-container">
          {renderDensityBars()}
        </div>
      )}
    </div>
  );
}; 