import React from 'react';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { CalendarDensity } from '../../types/calendar';
import './CustomDayCell.css';

interface CustomDayCellProps {
  date: Date;
  isToday?: boolean;
  isWeekend?: boolean;
  isSelected?: boolean;
  getPostDensity: (date: Date) => CalendarDensity | undefined;
}

export const CustomDayCell: React.FC<CustomDayCellProps> = ({ 
  date, 
  isToday,
  isWeekend,
  isSelected,
  getPostDensity 
}) => {
  const density = getPostDensity(date);
  
  // Determine cell class based on properties
  const cellClass = `custom-day-cell ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${isSelected ? 'selected' : ''}`;
  
  // Get density indicator
  const getDensityIndicator = () => {
    if (!density) return null;
    
    const { postCount, conflicts } = density;
    let color = '#7CCD7C'; // Green for low density (1-2 posts)
    let tooltip = `${postCount} posts scheduled`;
    
    if (postCount > 5) {
      color = '#FF6B6B'; // Red for high density (>5 posts)
      tooltip = `High volume: ${postCount} posts scheduled`;
    } else if (postCount > 2) {
      color = '#FFB347'; // Orange for medium density (3-5 posts)
      tooltip = `Medium volume: ${postCount} posts scheduled`;
    }
    
    if (conflicts > 0) {
      color = '#FF6B6B'; // Red for conflicts
      tooltip += `, with ${conflicts} platform conflicts`;
    }
    
    return {
      color,
      tooltip
    };
  };
  
  const densityIndicator = getDensityIndicator();
  
  return (
    <div className={cellClass}>
      <div className="date-number">
        {date.getDate()}
      </div>
      
      {densityIndicator && (
        <Tooltip title={densityIndicator.tooltip} position="top">
          <div 
            className="density-indicator" 
            style={{ backgroundColor: densityIndicator.color }}
          >
            {density?.postCount || 0}
          </div>
        </Tooltip>
      )}
    </div>
  );
}; 