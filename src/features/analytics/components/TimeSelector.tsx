import React from 'react';
import { 
  DropDownList, 
  DropDownListChangeEvent 
} from '@progress/kendo-react-dropdowns';
import { 
  DateRangePicker,
  DateRangePickerChangeEvent
} from '@progress/kendo-react-dateinputs';
import { 
  Checkbox,
  Switch
} from '@progress/kendo-react-inputs';
import { TimeRange, DateRange, AnalyticsFilter } from '../types';
import { format } from 'date-fns';

interface TimeSelectorProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ filter, onFilterChange }) => {
  const timeRangeOptions = [
    { text: 'Last 7 Days', value: TimeRange.LAST_7_DAYS },
    { text: 'Last 30 Days', value: TimeRange.LAST_30_DAYS },
    { text: 'Last 90 Days', value: TimeRange.LAST_90_DAYS },
    { text: 'Custom Range', value: TimeRange.CUSTOM }
  ];

  const handleTimeRangeChange = (e: DropDownListChangeEvent) => {
    onFilterChange({
      ...filter,
      timeRange: e.value.value
    });
  };

  const handleDateRangeChange = (e: DateRangePickerChangeEvent) => {
    if (e.value.start && e.value.end) {
      onFilterChange({
        ...filter,
        customDateRange: {
          startDate: e.value.start,
          endDate: e.value.end
        }
      });
    }
  };

  const handleComparisonToggle = (e: any) => {
    onFilterChange({
      ...filter,
      compareWithPreviousPeriod: e.value
    });
  };

  const handleAIToggle = (e: any) => {
    onFilterChange({
      ...filter,
      showAIOptimizedOnly: e.value
    });
  };

  const selectedTimeRange = timeRangeOptions.find(option => option.value === filter.timeRange);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ minWidth: '200px', flex: 1 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 600,
            fontSize: '14px' 
          }}>
            Time Period
          </label>
          <DropDownList
            data={timeRangeOptions}
            textField="text"
            dataItemKey="value"
            value={selectedTimeRange}
            onChange={handleTimeRangeChange}
            style={{ width: '100%' }}
            popupSettings={{
              animate: true
            }}
            size="medium"
          />
        </div>

        {filter.timeRange === TimeRange.CUSTOM && (
          <div style={{ minWidth: '300px', flex: 2 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              fontSize: '14px' 
            }}>
              Date Range
            </label>
            <DateRangePicker
              value={{
                start: filter.customDateRange?.startDate || null,
                end: filter.customDateRange?.endDate || null
              }}
              onChange={handleDateRangeChange}
              format="MMM dd, yyyy"
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        flexWrap: 'wrap',
        margin: '8px 0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(56, 128, 255, 0.07)',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: filter.compareWithPreviousPeriod ? '1px solid rgba(56, 128, 255, 0.5)' : '1px solid transparent'
        }}
        onClick={() => onFilterChange({ ...filter, compareWithPreviousPeriod: !filter.compareWithPreviousPeriod })}
        >
          <Switch
            checked={filter.compareWithPreviousPeriod}
            onChange={handleComparisonToggle}
            onLabel={''}
            offLabel={''}
          />
          <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 500 }}>Compare to Previous Period</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(75, 85, 232, 0.07)',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: filter.showAIOptimizedOnly ? '1px solid rgba(75, 85, 232, 0.5)' : '1px solid transparent'
        }}
        onClick={() => onFilterChange({ ...filter, showAIOptimizedOnly: !filter.showAIOptimizedOnly })}
        >
          <Switch
            checked={filter.showAIOptimizedOnly}
            onChange={handleAIToggle}
            onLabel={''}
            offLabel={''}
          />
          <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 500 }}>AI-Optimized Content Only</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector; 