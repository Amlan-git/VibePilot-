import React, { useState } from 'react';
import { 
  Scheduler, 
  DayView, 
  WeekView, 
  MonthView, 
  AgendaView 
} from '@progress/kendo-react-scheduler';
import { IntlProvider, LocalizationProvider } from '@progress/kendo-react-intl';
import { useCalendar } from '../../hooks/useCalendar';
import { ScheduleView } from '../../types/calendar';
import { CalendarToolbar } from './CalendarToolbar';
import { ScheduleEditor } from './ScheduleEditor';
import { CalendarEvent } from '../../types/calendar';
import { CustomEvent } from './CustomEvent';
import { CustomDayCell } from './CustomDayCell';
import { CustomMonthCell } from './CustomMonthCell';
import { Loader } from '../common/Loader';
import './ContentCalendar.css';

export const ContentCalendar: React.FC = () => {
  const {
    currentDate,
    view,
    events,
    filters,
    selectedEvent,
    isScheduleEditorOpen,
    calendarSettings,
    isLoadingEvents,
    isErrorEvents,
    eventsError,
    handleNavigate,
    handleViewChange,
    handleFilterChange,
    handleEventSelect,
    handleSlotSelect,
    handleEventResize,
    handleEventDrop,
    handleCreatePost,
    handleUpdatePost,
    openCreateScheduleEditor,
    closeScheduleEditor,
    getPostDensity
  } = useCalendar();

  // Handle view mapping from string to component
  const renderView = () => {
    const viewProps = {
      workDayStart: new Date(
        new Date().setHours(parseInt(calendarSettings.workDayStart.split(':')[0], 10), 
        parseInt(calendarSettings.workDayStart.split(':')[1], 10))
      ),
      workDayEnd: new Date(
        new Date().setHours(parseInt(calendarSettings.workDayEnd.split(':')[0], 10), 
        parseInt(calendarSettings.workDayEnd.split(':')[1], 10))
      ),
      workWeekStart: calendarSettings.workWeekStart,
      workWeekEnd: calendarSettings.workWeekEnd,
      showWorkHours: true,
      slotDivisions: 2, // 30-minute intervals
      editable: true
    };

    switch (view) {
      case 'day':
        return <DayView 
          {...viewProps} 
          dayHeaderTemplate={(props) => (
            <div className="day-header">
              <span>{props.formattedDate}</span>
            </div>
          )}
        />;
      case 'week':
        return <WeekView 
          {...viewProps} 
          showWorkHours
          firstDayOfWeek={calendarSettings.firstDayOfWeek}
          // @ts-ignore - The KendoReact type definitions are incomplete
          dayCellContent={(props) => <CustomDayCell {...props} getPostDensity={getPostDensity} />}
        />;
      case 'month':
        return <MonthView 
          // @ts-ignore - The KendoReact type definitions are incomplete
          dayCellContent={(props) => <CustomMonthCell {...props} getPostDensity={getPostDensity} />}
          firstDayOfWeek={calendarSettings.firstDayOfWeek}
          showWorkDays={!calendarSettings.showWeekends}
        />;
      case 'list':
      default:
        return <AgendaView />;
    }
  };

  // Handle event render - customize appearance based on status and platform
  const eventRender = (props: any) => {
    return <CustomEvent {...props} />;
  };

  // Handle error state
  if (isErrorEvents) {
    return (
      <div className="calendar-error">
        <h3>Error Loading Calendar</h3>
        <p>{eventsError?.message || 'An unknown error occurred'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="content-calendar">
      <CalendarToolbar 
        currentDate={currentDate}
        view={view}
        filters={filters}
        onViewChange={handleViewChange}
        onDateChange={handleNavigate}
        onFilterChange={handleFilterChange}
        onCreateClick={() => openCreateScheduleEditor()}
      />
      
      {isLoadingEvents ? (
        <Loader message="Loading calendar events..." />
      ) : (
        <LocalizationProvider language="en">
          <IntlProvider locale="en">
            <Scheduler
              data={events.map((event: CalendarEvent) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                isAllDay: event.isAllDay,
                description: event.post?.content,
                status: event.status,
                platforms: event.platforms,
                postId: event.postId,
                // Pass the original event for access in custom components
                dataItem: event
              }))}
              date={currentDate}
              view={view}
              timezone={calendarSettings.timezone}
              onDateChange={(newDate: Date) => handleNavigate(newDate)}
              onViewChange={(newView: { value: ScheduleView }) => handleViewChange(newView.value)}
              editable={{
                add: true,
                remove: false,
                drag: true,
                resize: true,
                edit: true
              }}
              onDataChange={(changes: any) => {
                // Handle event modifications from the UI
                if (changes.created && changes.created.length) {
                  handleSlotSelect({
                    start: changes.created[0].start,
                    end: changes.created[0].end
                  });
                }
              }}
              onEventClick={(event: any) => {
                handleEventSelect(event.dataItem);
              }}
              onEventResize={(event: any) => {
                handleEventResize({
                  event: event.dataItem,
                  start: event.start,
                  end: event.end
                });
              }}
              onEventDrop={(event: any) => {
                handleEventDrop({
                  event: event.dataItem,
                  start: event.start,
                  end: event.end
                });
              }}
              eventRender={eventRender}
              style={{ height: 'calc(100vh - 180px)' }}
            >
              {renderView()}
            </Scheduler>
          </IntlProvider>
        </LocalizationProvider>
      )}

      {isScheduleEditorOpen && selectedEvent && (
        <ScheduleEditor
          event={selectedEvent}
          onSave={selectedEvent.postId ? handleUpdatePost : handleCreatePost}
          onClose={closeScheduleEditor}
        />
      )}
    </div>
  );
}; 