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
  Button, 
  ButtonGroup 
} from '@progress/kendo-react-buttons';
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

  const handleComparisonToggle = () => {
    onFilterChange({
      ...filter,
      compareWithPreviousPeriod: !filter.compareWithPreviousPeriod
    });
  };

  const handleAIToggle = () => {
    onFilterChange({
      ...filter,
      showAIOptimizedOnly: !filter.showAIOptimizedOnly
    });
  };

  const selectedTimeRange = timeRangeOptions.find(option => option.value === filter.timeRange);

  return (
    <div className="time-selector" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ minWidth: '200px' }}>
        <DropDownList
          data={timeRangeOptions}
          textField="text"
          dataItemKey="value"
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          style={{ width: '100%' }}
        />
      </div>

      {filter.timeRange === TimeRange.CUSTOM && (
        <div style={{ minWidth: '300px' }}>
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

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        <Button
          togglable
          selected={filter.compareWithPreviousPeriod}
          onClick={handleComparisonToggle}
          style={{ padding: '8px 12px' }}
        >
          Compare to Previous Period
        </Button>
        
        <Button
          togglable
          selected={filter.showAIOptimizedOnly}
          onClick={handleAIToggle}
          style={{ padding: '8px 12px' }}
        >
          AI-Optimized Content Only
        </Button>
      </div>
    </div>
  );
};

export default TimeSelector; 