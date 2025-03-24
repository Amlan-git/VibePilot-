import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';

// Types
type ViewType = 'day' | 'week' | 'month';
type EventStatus = 'draft' | 'scheduled' | 'published';

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  start: Date;
  end: Date;
  platform: string;
  status: EventStatus;
}

interface EventFormData {
  id?: string;
  title: string;
  content: string;
  start: Date;
  end: Date;
  platform: string;
  status: EventStatus;
}

const SimpleContentCalendar: React.FC = () => {
  // State for views and filters
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [platformFilter, setPlatformFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  
  // Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    content: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    platform: 'twitter',
    status: 'draft'
  });

  // Sample events data
  const [events, setEvents] = useState<CalendarEvent[]>([
    { 
      id: '1', 
      title: 'Product Launch Tweet', 
      content: 'Announcing our new product line!',
      start: new Date(2023, new Date().getMonth(), 15, 10, 0), 
      end: new Date(2023, new Date().getMonth(), 15, 11, 0),
      platform: 'twitter',
      status: 'scheduled' 
    },
    { 
      id: '2', 
      title: 'Summer Sale Announcement', 
      content: 'Get 50% off on all summer items!',
      start: new Date(2023, new Date().getMonth(), 20, 14, 30), 
      end: new Date(2023, new Date().getMonth(), 20, 15, 30),
      platform: 'facebook',
      status: 'draft' 
    },
    { 
      id: '3', 
      title: 'Weekly Product Showcase', 
      content: 'Check out our top products of the week!',
      start: new Date(2023, new Date().getMonth(), 25, 9, 0), 
      end: new Date(2023, new Date().getMonth(), 25, 10, 0),
      platform: 'instagram',
      status: 'published' 
    },
  ]);

  // Platform options
  const platforms = [
    { text: 'Twitter', value: 'twitter' },
    { text: 'Facebook', value: 'facebook' },
    { text: 'Instagram', value: 'instagram' },
    { text: 'LinkedIn', value: 'linkedin' },
    { text: 'YouTube', value: 'youtube' },
  ];

  // Status options
  const statuses = [
    { text: 'Draft', value: 'draft' },
    { text: 'Scheduled', value: 'scheduled' },
    { text: 'Published', value: 'published' },
  ];

  // Filter options
  const platformOptions = [
    { text: 'All Platforms', value: 'all' },
    ...platforms
  ];

  const statusOptions = [
    { text: 'All Statuses', value: 'all' },
    ...statuses
  ];

  // Date helpers
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  const getEndOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() + (6 - day);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  const getDaysInWeek = (date: Date) => {
    const start = getStartOfWeek(date);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Add days from previous month to start on Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDay = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push(prevDay);
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const rows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    const totalCells = rows * 7;
    const daysToAdd = totalCells - days.length;
    
    for (let i = 1; i <= daysToAdd; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getHoursForDay = (date: Date) => {
    const hours = [];
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    
    for (let i = 8; i <= 20; i++) { // 8 AM to 8 PM
      const hour = new Date(day);
      hour.setHours(i);
      hours.push(hour);
    }
    
    return hours;
  };

  // Filter events
  const filterEvents = (events: CalendarEvent[]) => {
    return events.filter(event => {
      const matchesPlatform = platformFilter === 'all' || event.platform === platformFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesPlatform && matchesStatus;
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return filterEvents(events).filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear();
    });
  };

  // Get events for a specific hour
  const getEventsForHour = (hour: Date) => {
    return filterEvents(events).filter(event => {
      const eventHour = new Date(event.start);
      return eventHour.getHours() === hour.getHours() &&
             eventHour.getDate() === hour.getDate() &&
             eventHour.getMonth() === hour.getMonth() &&
             eventHour.getFullYear() === hour.getFullYear();
    });
  };

  // Navigation helpers
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event dialog handlers
  const handleOpenCreateDialog = (date: Date) => {
    setSelectedEventId(null);
    setSelectedDate(date);
    
    const endTime = new Date(date);
    endTime.setHours(endTime.getHours() + 1);
    
    setFormData({
      title: '',
      content: '',
      start: date,
      end: endTime,
      platform: 'twitter',
      status: 'draft'
    });
    
    setIsEventDialogOpen(true);
  };

  const handleOpenEditDialog = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEventId(eventId);
      setFormData({
        id: event.id,
        title: event.title,
        content: event.content,
        start: new Date(event.start),
        end: new Date(event.end),
        platform: event.platform,
        status: event.status
      });
      setIsEventDialogOpen(true);
    }
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEventId(null);
    setSelectedDate(null);
  };

  const handleOpenDeleteDialog = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEvent = () => {
    if (formData.title.trim() === '') {
      alert('Please enter a title for the event');
      return;
    }

    if (selectedEventId) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEventId 
          ? { ...event, ...formData, id: selectedEventId }
          : event
      ));
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: Date.now().toString()
      };
      setEvents([...events, newEvent]);
    }

    setIsEventDialogOpen(false);
    setSelectedEventId(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = () => {
    if (selectedEventId) {
      setEvents(events.filter(event => event.id !== selectedEventId));
    }
    setIsDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  // Styling helpers
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return '#1da1f2';
      case 'facebook': return '#4267B2';
      case 'instagram': return '#C13584';
      case 'linkedin': return '#0077B5';
      case 'youtube': return '#FF0000';
      default: return '#888888';
    }
  };

  const getStatusStyle = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return { borderLeft: '3px solid #28a745' };
      case 'scheduled':
        return { borderLeft: '3px solid #ffc107' };
      case 'draft':
        return { borderLeft: '3px solid #6c757d' };
      default:
        return { borderLeft: '3px solid #e9ecef' };
    }
  };

  // Format helpers
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatWeekRange = (date: Date) => {
    const start = getStartOfWeek(date);
    const end = getEndOfWeek(date);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Staggered animation helper
  const getDelayClass = (index: number) => {
    const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
    return delays[index % delays.length];
  };

  // Render calendar based on view
  const renderDayView = () => {
    const hours = getHoursForDay(currentDate);
    
    return (
      <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', height: '700px', overflow: 'auto' }}>
        <div style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          {formatDate(currentDate)}
        </div>
        
        {hours.map((hour, index) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <div key={hour.toString()} className={`transition-all ${getDelayClass(index)}`} style={{ 
              display: 'flex',
              borderBottom: '1px solid #e0e0e0',
              padding: '0.5rem 0',
              minHeight: '80px'
            }}>
              <div style={{ width: '80px', padding: '0.5rem', textAlign: 'right', color: '#666' }}>
                {formatTime(hour)}
              </div>
              
              <div 
                style={{ flex: 1, padding: '0.25rem', position: 'relative' }}
                onClick={() => handleOpenCreateDialog(hour)}
              >
                {hourEvents.map((event, eventIndex) => (
                  <div key={event.id} className={`animate-slideInRight ${getDelayClass(eventIndex)} transition-all hover-elevate`} style={{ 
                    padding: '0.5rem',
                    margin: '0.25rem 0',
                    backgroundColor: getPlatformColor(event.platform),
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    ...getStatusStyle(event.status)
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditDialog(event.id);
                  }}>
                    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                    <div>{formatTime(event.start)} - {formatTime(event.end)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getDaysInWeek(currentDate);
    const hours = getHoursForDay(new Date());
    
    return (
      <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', height: '700px', overflow: 'auto' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '80px' }}></div>
          {weekDays.map((day, index) => {
            const isToday = new Date().toDateString() === day.toDateString();
            return (
              <div 
                key={day.toString()} 
                className={`transition-colors ${getDelayClass(index)}`}
                style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  padding: '0.5rem', 
                  fontWeight: isToday ? 'bold' : 'normal',
                  backgroundColor: isToday ? '#e6f7ff' : '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div>{day.getDate()}</div>
              </div>
            );
          })}
        </div>
        
        {hours.map((hour, hourIndex) => (
          <div key={hour.toString()} style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ width: '80px', padding: '0.5rem', textAlign: 'right', color: '#666' }}>
              {formatTime(hour)}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const currentHour = new Date(day);
              currentHour.setHours(hour.getHours());
              const dayHourEvents = getEventsForHour(currentHour);
              
              return (
                <div 
                  key={day.toString() + hour.toString()} 
                  style={{ flex: 1, padding: '0.25rem', minHeight: '80px', position: 'relative' }}
                  onClick={() => {
                    const clickedTime = new Date(day);
                    clickedTime.setHours(hour.getHours());
                    handleOpenCreateDialog(clickedTime);
                  }}
                >
                  {dayHourEvents.map((event, eventIndex) => (
                    <div key={event.id} className={`animate-slideInRight transition-all hover-elevate`} style={{ 
                      padding: '0.5rem',
                      margin: '0.25rem 0',
                      backgroundColor: getPlatformColor(event.platform),
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      ...getStatusStyle(event.status)
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDialog(event.id);
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                      <div>{formatTime(event.start)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="animate-fadeIn">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              padding: '0.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === day.toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div 
                key={day.toISOString()}
                className={`transition-all hover-elevate ${getDelayClass(index % 7)}`}
                style={{ 
                  minHeight: '100px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  backgroundColor: isToday ? '#e6f7ff' : 'white',
                  opacity: isCurrentMonth ? 1 : 0.5,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const clickTime = new Date(day);
                  clickTime.setHours(9, 0, 0, 0); // Default to 9 AM
                  handleOpenCreateDialog(clickTime);
                }}
              >
                <div style={{ 
                  textAlign: 'right', 
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isToday ? '#0066cc' : 'inherit'
                }}>
                  {day.getDate()}
                </div>
                
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div 
                    key={event.id}
                    className={`animate-slideInRight transition-all ${getDelayClass(eventIndex)}`}
                    style={{ 
                      margin: '0.25rem 0',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: getPlatformColor(event.platform),
                      color: 'white',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                      ...getStatusStyle(event.status)
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDialog(event.id);
                    }}
                  >
                    {formatTime(event.start)} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header with title and view selector */}
      <div className="animate-slideInBottom" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem' 
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Content Calendar</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            className="transition-all hover-elevate"
            themeColor={view === 'month' ? 'primary' : 'base'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button 
            className="transition-all hover-elevate"
            themeColor={view === 'week' ? 'primary' : 'base'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button 
            className="transition-all hover-elevate"
            themeColor={view === 'day' ? 'primary' : 'base'}
            onClick={() => setView('day')}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Date navigation and filters */}
      <div className="animate-scaleIn" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button className="transition-all hover-elevate" onClick={goToPrevious}>&lt;</Button>
          <Button className="transition-all hover-elevate" onClick={goToToday}>Today</Button>
          <Button className="transition-all hover-elevate" onClick={goToNext}>&gt;</Button>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontWeight: 'bold',
            marginLeft: '1rem'
          }}>
            {view === 'month' && formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))}
            {view === 'week' && formatWeekRange(currentDate)}
            {view === 'day' && formatDate(currentDate)}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: '150px' }}>
            <DropDownList
              data={platformOptions}
              textField="text"
              dataItemKey="value"
              value={platformOptions.find(p => p.value === platformFilter)}
              onChange={(e) => setPlatformFilter(e.value.value)}
            />
          </div>
          <div style={{ width: '150px' }}>
            <DropDownList
              data={statusOptions}
              textField="text"
              dataItemKey="value"
              value={statusOptions.find(s => s.value === statusFilter)}
              onChange={(e) => setStatusFilter(e.value.value)}
            />
          </div>
        </div>
      </div>

      {/* Calendar view based on selected type */}
      <div className="transition-all" style={{ backgroundColor: 'white', borderRadius: '4px', padding: '1rem' }}>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      {/* Event dialog */}
      {isEventDialogOpen && (
        <Dialog title={selectedEventId ? "Edit Event" : "Create New Event"} onClose={handleCloseEventDialog}>
          <div className="animate-fadeIn" style={{ padding: '1rem', width: '500px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.value)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Content</label>
              <TextArea
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Start</label>
                <DateTimePicker
                  value={formData.start}
                  onChange={(e) => handleFormChange('start', e.value)}
                  format="yyyy-MM-dd HH:mm"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>End</label>
                <DateTimePicker
                  value={formData.end}
                  onChange={(e) => handleFormChange('end', e.value)}
                  format="yyyy-MM-dd HH:mm"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Platform</label>
                <DropDownList
                  data={platforms}
                  textField="text"
                  dataItemKey="value"
                  value={platforms.find(p => p.value === formData.platform)}
                  onChange={(e) => handleFormChange('platform', e.value.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Status</label>
                <DropDownList
                  data={statuses}
                  textField="text"
                  dataItemKey="value"
                  value={statuses.find(s => s.value === formData.status)}
                  onChange={(e) => handleFormChange('status', e.value.value)}
                />
              </div>
            </div>
          </div>

          <DialogActionsBar>
            {selectedEventId && (
              <Button className="transition-all hover-elevate" themeColor="error" onClick={() => {
                handleCloseEventDialog();
                handleOpenDeleteDialog(selectedEventId);
              }}>
                Delete
              </Button>
            )}
            <span style={{ flex: 1 }}></span>
            <Button className="transition-all hover-elevate" onClick={handleCloseEventDialog}>Cancel</Button>
            <Button className="transition-all hover-elevate" themeColor="primary" onClick={handleSaveEvent}>Save</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <Dialog title="Confirm Delete" onClose={handleCloseDeleteDialog}>
          <div className="animate-scaleIn" style={{ padding: '1rem', width: '400px' }}>
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          </div>

          <DialogActionsBar>
            <Button className="transition-all hover-elevate" onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button className="transition-all hover-elevate" themeColor="error" onClick={handleDeleteEvent}>Delete</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default SimpleContentCalendar; 