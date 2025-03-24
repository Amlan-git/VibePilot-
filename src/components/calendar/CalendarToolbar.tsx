import React, { useState } from 'react';
import { 
  Button, 
  ButtonGroup,
  DropDownButton,
  DropDownButtonItem
} from '@progress/kendo-react-buttons';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { 
  Dialog, 
  DialogActionsBar 
} from '@progress/kendo-react-dialogs';
import {
  MultiSelect
} from '@progress/kendo-react-dropdowns';
import { CalendarFilter, ScheduleView } from '../../types/calendar';
import { usePlatforms } from '../../hooks/usePlatforms';
import './CalendarToolbar.css';

interface CalendarToolbarProps {
  currentDate: Date;
  view: ScheduleView;
  filters: CalendarFilter;
  onViewChange: (view: ScheduleView) => void;
  onDateChange: (date: Date) => void;
  onFilterChange: (filters: CalendarFilter) => void;
  onCreateClick: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentDate,
  view,
  filters,
  onViewChange,
  onDateChange,
  onFilterChange,
  onCreateClick
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { platforms } = usePlatforms();
  
  // View buttons
  const views: {text: string; icon: string; value: ScheduleView}[] = [
    { text: 'Day', icon: 'k-i-calendar-date', value: 'day' },
    { text: 'Week', icon: 'k-i-calendar-week', value: 'week' },
    { text: 'Month', icon: 'k-i-calendar-month', value: 'month' },
    { text: 'List', icon: 'k-i-list-bulleted', value: 'list' }
  ];

  // Navigation helpers
  const handleToday = () => {
    onDateChange(new Date());
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      default:
        newDate.setDate(newDate.getDate() - 7);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        newDate.setDate(newDate.getDate() + 7);
        break;
    }
    onDateChange(newDate);
  };

  // Filter handling
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (key: keyof CalendarFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  // Date formatting
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    
    switch (view) {
      case 'day':
        return new Intl.DateTimeFormat('en-US', options).format(currentDate);
      case 'week': {
        const startOfWeek = new Date(currentDate);
        const day = currentDate.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(startOfWeek)} - ${new Intl.DateTimeFormat('en-US', options).format(endOfWeek)}`;
      }
      case 'month':
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
      default:
        return new Intl.DateTimeFormat('en-US', options).format(currentDate);
    }
  };

  // Status options for filter
  const statusOptions = [
    { text: 'Draft', value: 'draft' },
    { text: 'Scheduled', value: 'scheduled' },
    { text: 'Published', value: 'published' },
    { text: 'Failed', value: 'failed' }
  ];

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-section">
        <Button 
          icon="plus" 
          themeColor="primary" 
          onClick={onCreateClick}
        >
          New Post
        </Button>
        
        <ButtonGroup>
          <Button onClick={handleToday} title="Today">Today</Button>
          <Button onClick={handlePrev} icon="arrow-left" title="Previous" />
          <Button onClick={handleNext} icon="arrow-right" title="Next" />
        </ButtonGroup>
        
        <div className="date-display">
          <span>{formatDateRange()}</span>
          <DatePicker
            value={currentDate}
            onChange={(e) => e.value && onDateChange(e.value)}
            format="MMMM dd, yyyy"
            popupSettings={{ animate: false }}
          />
        </div>
      </div>

      <div className="toolbar-section">
        <Button 
          icon="filter" 
          onClick={handleFilterToggle}
          togglable
          selected={showFilters}
          title="Show/Hide Filters"
        >
          Filters
        </Button>
        
        <ButtonGroup>
          {views.map((viewOption) => (
            <Button 
              key={viewOption.value}
              icon={viewOption.icon}
              selected={view === viewOption.value}
              onClick={() => onViewChange(viewOption.value)}
              title={viewOption.text}
            >
              {viewOption.text}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {showFilters && (
        <Dialog title="Calendar Filters" onClose={handleFilterToggle} width={500}>
          <div className="calendar-filters">
            <div className="filter-group">
              <label>Platforms</label>
              <MultiSelect
                data={platforms}
                value={filters.platforms || []}
                onChange={(e) => handleFilterChange('platforms', e.value)}
                textField="name"
                valueField="id"
                placeholder="Filter by platform"
                clearButton
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <MultiSelect
                data={statusOptions}
                value={filters.status || []}
                onChange={(e) => handleFilterChange('status', e.value)}
                textField="text"
                valueField="value"
                placeholder="Filter by status"
                clearButton
              />
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-range-picker">
                <DatePicker
                  value={filters.startDate ? new Date(filters.startDate) : null}
                  onChange={(e) => handleFilterChange('startDate', e.value?.toISOString())}
                  placeholder="Start date"
                  format="MMM dd, yyyy"
                />
                <span>to</span>
                <DatePicker
                  value={filters.endDate ? new Date(filters.endDate) : null}
                  onChange={(e) => handleFilterChange('endDate', e.value?.toISOString())}
                  placeholder="End date"
                  format="MMM dd, yyyy"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Search post titles and content"
                className="k-textbox"
              />
            </div>
          </div>
          
          <DialogActionsBar>
            <Button onClick={() => onFilterChange({})} look="flat">
              Clear All
            </Button>
            <Button onClick={handleFilterToggle} themeColor="primary">
              Apply Filters
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}; 