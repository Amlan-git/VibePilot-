import React, { useState } from 'react';
import { TimeRange, DateRange, AnalyticsFilter } from '../types';

interface TimeSelectorProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ filter, onFilterChange }) => {
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  
  const timeRangeOptions = [
    { text: 'Last 7 Days', value: TimeRange.LAST_7_DAYS },
    { text: 'Last 30 Days', value: TimeRange.LAST_30_DAYS },
    { text: 'Last 90 Days', value: TimeRange.LAST_90_DAYS },
    { text: 'Custom Range', value: TimeRange.CUSTOM }
  ];

  const handleTimeRangeSelect = (timeRange: TimeRange) => {
    onFilterChange({
      ...filter,
      timeRange
    });
    setShowTimeRangeDropdown(false);
  };

  const selectedTimeRange = timeRangeOptions.find(option => option.value === filter.timeRange);

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px',
        gap: '8px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          Time Period
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              Time Range
            </label>
            
            {/* Custom dropdown for time range */}
            <div style={{ position: 'relative' }}>
              <div 
                style={{ 
                  border: '1px solid #ccc', 
                  padding: '8px 12px', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '38px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              >
                <span>{selectedTimeRange?.text}</span>
                <span style={{ fontSize: '12px' }}>▼</span>
              </div>
              
              {showTimeRangeDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 100
                }}>
                  {timeRangeOptions.map(option => (
                    <div
                      key={option.value}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: filter.timeRange === option.value ? 'rgba(56, 128, 255, 0.1)' : undefined,
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleTimeRangeSelect(option.value)}
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filter.timeRange === TimeRange.CUSTOM && (
            <div style={{ minWidth: '300px', flex: '2 1 300px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-secondary)' 
              }}>
                Date Range
              </label>
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'center'
              }}>
                <input 
                  type="date" 
                  value={filter.customDateRange?.startDate?.toISOString().split('T')[0] || ''} 
                  onChange={(e) => {
                    const startDate = e.target.value ? new Date(e.target.value) : undefined;
                    onFilterChange({
                      ...filter,
                      customDateRange: {
                        ...filter.customDateRange,
                        startDate
                      }
                    });
                  }}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    flex: 1
                  }}
                />
                <span>to</span>
                <input 
                  type="date" 
                  value={filter.customDateRange?.endDate?.toISOString().split('T')[0] || ''} 
                  onChange={(e) => {
                    const endDate = e.target.value ? new Date(e.target.value) : undefined;
                    onFilterChange({
                      ...filter,
                      customDateRange: {
                        ...filter.customDateRange,
                        endDate
                      }
                    });
                  }}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    flex: 1
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px', 
          margin: '8px 0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(56, 128, 255, 0.07)',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            border: filter.compareWithPreviousPeriod ? '1px solid rgba(56, 128, 255, 0.5)' : '1px solid transparent',
            flex: '1 1 220px'
          }}
          onClick={() => onFilterChange({ ...filter, compareWithPreviousPeriod: !filter.compareWithPreviousPeriod })}
          >
            <input
              type="checkbox"
              checked={filter.compareWithPreviousPeriod}
              onChange={(e) => onFilterChange({ ...filter, compareWithPreviousPeriod: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '14px', 
              fontWeight: 500,
              flexShrink: 0
            }}>
              Compare to Previous Period
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(75, 85, 232, 0.07)',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            border: filter.showAIOptimizedOnly ? '1px solid rgba(75, 85, 232, 0.5)' : '1px solid transparent',
            flex: '1 1 220px'
          }}
          onClick={() => onFilterChange({ ...filter, showAIOptimizedOnly: !filter.showAIOptimizedOnly })}
          >
            <input
              type="checkbox"
              checked={filter.showAIOptimizedOnly}
              onChange={(e) => onFilterChange({ ...filter, showAIOptimizedOnly: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '14px', 
              fontWeight: 500,
              flexShrink: 0
            }}>
              AI-Optimized Content Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector; 