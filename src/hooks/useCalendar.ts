import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarEvent, 
  CalendarFilter, 
  ScheduleView, 
  BestTimeRecommendation,
  TimeSlot,
  CalendarSettings,
  CalendarDensity
} from '../types/calendar';
import { PostCreateRequest, PostUpdateRequest, Post } from '../types/posts';
import { calendarService } from '../services/calendarService';
import { postService } from '../services/postService';
import { Platform } from '../types/platforms';

export const useCalendar = () => {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ScheduleView>('month');
  const [filters, setFilters] = useState<CalendarFilter>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({
    defaultView: 'week',
    workWeekStart: 1, // Monday
    workWeekEnd: 5, // Friday
    workDayStart: '09:00',
    workDayEnd: '17:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    showWeekends: true,
    firstDayOfWeek: 0 // Sunday
  });
  
  // Get current year and month for density data
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Fetch calendar events
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: eventsError,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['calendarEvents', currentDate, view, filters],
    queryFn: () => calendarService.getCalendarEvents(filters),
  });

  // Fetch best time recommendations
  const {
    data: bestTimes = [],
    isLoading: isLoadingBestTimes
  } = useQuery({
    queryKey: ['bestTimes', filters.platforms],
    queryFn: () => calendarService.getBestTimeRecommendations(
      filters.platforms && filters.platforms.length === 1 
        ? filters.platforms[0] 
        : undefined
    ),
  });

  // Fetch time slots
  const {
    data: fetchedTimeSlots = [],
    isLoading: isLoadingTimeSlots
  } = useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => calendarService.getTimeSlots(),
    onSuccess: (data: TimeSlot[]) => setTimeSlots(data)
  });

  // Fetch calendar density
  const {
    data: density = [],
    isLoading: isLoadingDensity
  } = useQuery({
    queryKey: ['calendarDensity', currentYear, currentMonth],
    queryFn: () => calendarService.getCalendarDensity(currentYear, currentMonth),
  });

  // Reschedule post mutation
  const rescheduleMutation = useMutation({
    mutationFn: ({ postId, newDate }: { postId: string; newDate: Date }) => 
      calendarService.reschedulePost(postId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  // Update time slot mutation
  const updateTimeSlotMutation = useMutation({
    mutationFn: (timeSlot: TimeSlot) => 
      calendarService.updateTimeSlot(timeSlot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
    }
  });

  // Create post mutation (reusing from postService)
  const createPostMutation = useMutation({
    mutationFn: (postData: PostCreateRequest) => 
      postService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      closeScheduleEditor();
    }
  });

  // Update post mutation (reusing from postService)
  const updatePostMutation = useMutation({
    mutationFn: ({ id, postData }: { id: string; postData: PostUpdateRequest }) =>
      postService.updatePost(id, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      closeScheduleEditor();
    }
  });

  // Handler for calendar navigation
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Handler for view change
  const handleViewChange = useCallback((newView: ScheduleView) => {
    setView(newView);
  }, []);

  // Handler for filter change
  const handleFilterChange = useCallback((newFilters: CalendarFilter) => {
    setFilters(newFilters);
  }, []);

  // Handler for event selection
  const handleEventSelect = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsScheduleEditorOpen(true);
  }, []);

  // Handler for create new event from slot
  const handleSlotSelect = useCallback((slotInfo: { start: Date; end: Date }) => {
    // Create a blank event with the selected time
    const newEvent: CalendarEvent = {
      id: `new-event-${Date.now()}`,
      postId: '',
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      platforms: [],
      status: 'draft',
      isAllDay: false,
      post: {
        id: '',
        title: '',
        content: '',
        platforms: [],
        scheduledDate: slotInfo.start.toISOString(),
        status: 'draft',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    setSelectedEvent(newEvent);
    setIsScheduleEditorOpen(true);
  }, []);

  // Handler for event resizing (changing duration)
  const handleEventResize = useCallback((
    { event, start, end }: { event: CalendarEvent; start: Date; end: Date }
  ) => {
    // In this app we only care about start time (for scheduling)
    rescheduleMutation.mutate({ 
      postId: event.postId, 
      newDate: start 
    });
  }, [rescheduleMutation]);

  // Handler for event dragging (changing date/time)
  const handleEventDrop = useCallback((
    { event, start, end }: { event: CalendarEvent; start: Date; end: Date }
  ) => {
    rescheduleMutation.mutate({ 
      postId: event.postId, 
      newDate: start 
    });
  }, [rescheduleMutation]);

  // Handler for creating a new post
  const handleCreatePost = useCallback((postData: PostCreateRequest) => {
    createPostMutation.mutate(postData);
  }, [createPostMutation]);

  // Handler for updating a post
  const handleUpdatePost = useCallback((postData: PostUpdateRequest) => {
    if (!postData.id) return;
    
    updatePostMutation.mutate({
      id: postData.id,
      postData
    });
  }, [updatePostMutation]);

  // Handler for updating a time slot
  const handleUpdateTimeSlot = useCallback((timeSlot: TimeSlot) => {
    updateTimeSlotMutation.mutate(timeSlot);
  }, [updateTimeSlotMutation]);

  // Open the schedule editor for creating a new event
  const openCreateScheduleEditor = useCallback((date?: Date) => {
    const startDate = date || new Date();
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);
    
    const newEvent: CalendarEvent = {
      id: `new-event-${Date.now()}`,
      postId: '',
      title: '',
      start: startDate,
      end: endDate,
      platforms: [],
      status: 'draft',
      isAllDay: false,
      post: {
        id: '',
        title: '',
        content: '',
        platforms: [],
        scheduledDate: startDate.toISOString(),
        status: 'draft',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    setSelectedEvent(newEvent);
    setIsScheduleEditorOpen(true);
  }, []);

  // Close the schedule editor
  const closeScheduleEditor = useCallback(() => {
    setIsScheduleEditorOpen(false);
    setSelectedEvent(null);
  }, []);

  // Get post density for a specific date
  const getPostDensity = useCallback((date: Date): CalendarDensity | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return density.find((d: CalendarDensity) => d.date === dateStr);
  }, [density]);

  // Update calendar settings
  const updateCalendarSettings = useCallback((newSettings: Partial<CalendarSettings>) => {
    setCalendarSettings((prev: CalendarSettings) => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Find best time to post
  const findBestTimeToPost = useCallback((platform: Platform, dayOfWeek?: number): BestTimeRecommendation | null => {
    const platformBestTimes = bestTimes.filter((bt: BestTimeRecommendation) => bt.platform === platform);
    
    if (dayOfWeek !== undefined) {
      const dayBestTimes = platformBestTimes.filter((bt: BestTimeRecommendation) => bt.dayOfWeek === dayOfWeek);
      if (dayBestTimes.length === 0) return null;
      
      // Return the best time for this day (highest engagement score)
      return dayBestTimes.reduce((best: BestTimeRecommendation, current: BestTimeRecommendation) => 
        current.engagementScore > best.engagementScore ? current : best
      , dayBestTimes[0]);
    }
    
    // If no day specified, return the overall best time
    if (platformBestTimes.length === 0) return null;
    
    return platformBestTimes.reduce((best: BestTimeRecommendation, current: BestTimeRecommendation) => 
      current.engagementScore > best.engagementScore ? current : best
    , platformBestTimes[0]);
  }, [bestTimes]);

  return {
    currentDate,
    view,
    filters,
    events,
    selectedEvent,
    isScheduleEditorOpen,
    timeSlots,
    bestTimes,
    density,
    calendarSettings,
    isLoadingEvents,
    isErrorEvents,
    eventsError,
    isLoadingBestTimes,
    isLoadingTimeSlots,
    isLoadingDensity,
    setCurrentDate,
    setView,
    setFilters,
    handleNavigate,
    handleViewChange,
    handleFilterChange,
    handleEventSelect,
    handleSlotSelect,
    handleEventResize,
    handleEventDrop,
    handleCreatePost,
    handleUpdatePost,
    handleUpdateTimeSlot,
    openCreateScheduleEditor,
    closeScheduleEditor,
    getPostDensity,
    updateCalendarSettings,
    findBestTimeToPost
  };
}; 