import axios from 'axios';
import { authService } from './authService';
import { postService } from './postService';
import { Post, Platform } from '../types/posts';
import { 
  CalendarEvent, 
  CalendarFilter, 
  BestTimeRecommendation, 
  TimeSlot,
  CalendarDensity
} from '../types/calendar';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to convert a Post to a CalendarEvent
const postToCalendarEvent = (post: Post): CalendarEvent => {
  const scheduledDate = new Date(post.scheduledDate);
  const endDate = new Date(scheduledDate);
  endDate.setMinutes(scheduledDate.getMinutes() + 30); // Default 30-min duration
  
  return {
    id: `event-${post.id}`,
    postId: post.id,
    title: post.title,
    start: scheduledDate,
    end: endDate,
    platforms: post.platforms,
    status: post.status,
    isAllDay: false,
    description: post.content,
    post
  };
};

export const calendarService = {
  async getCalendarEvents(filter?: CalendarFilter): Promise<CalendarEvent[]> {
    // In a real app, this would be a direct API call to get optimized calendar data
    // For now, we'll reuse the posts endpoint and convert posts to calendar events
    try {
      const response = await axios.get(`${API_URL}/calendar/events`, {
        headers: getAuthHeader(),
        params: filter
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Fallback to mock data during development
      return this.getMockCalendarEvents(filter);
    }
  },

  async reschedulePost(postId: string, newDate: Date): Promise<Post> {
    try {
      const response = await axios.patch(
        `${API_URL}/posts/${postId}/reschedule`,
        { scheduledDate: newDate.toISOString() },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error rescheduling post:', error);
      throw error;
    }
  },

  async getBestTimeRecommendations(platform?: Platform): Promise<BestTimeRecommendation[]> {
    try {
      const response = await axios.get(`${API_URL}/calendar/best-times`, {
        headers: getAuthHeader(),
        params: { platform }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching best time recommendations:', error);
      return this.getMockBestTimeRecommendations(platform);
    }
  },

  async getTimeSlots(): Promise<TimeSlot[]> {
    try {
      const response = await axios.get(`${API_URL}/calendar/time-slots`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      return this.getMockTimeSlots();
    }
  },

  async updateTimeSlot(timeSlot: TimeSlot): Promise<TimeSlot> {
    try {
      const response = await axios.put(
        `${API_URL}/calendar/time-slots/${timeSlot.id}`, 
        timeSlot,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
  },

  async getCalendarDensity(year: number, month: number): Promise<CalendarDensity[]> {
    try {
      const response = await axios.get(`${API_URL}/calendar/density`, {
        headers: getAuthHeader(),
        params: { year, month }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar density:', error);
      return this.getMockCalendarDensity(year, month);
    }
  },

  // Mock implementations for development
  getMockCalendarEvents(filter?: CalendarFilter): CalendarEvent[] {
    // Use the mock posts from postService and convert them to calendar events
    const posts = postService.getMockPosts(20);
    return posts.map(post => {
      // Apply filters if provided
      if (filter) {
        // Filter by platforms
        if (filter.platforms && filter.platforms.length > 0) {
          if (!post.platforms.some(p => filter.platforms?.includes(p))) {
            return null;
          }
        }
        
        // Filter by status
        if (filter.status && filter.status.length > 0) {
          if (!filter.status.includes(post.status)) {
            return null;
          }
        }
        
        // Filter by date range
        if (filter.dateRange) {
          const postDate = new Date(post.scheduledDate);
          if (
            postDate < filter.dateRange.start ||
            postDate > filter.dateRange.end
          ) {
            return null;
          }
        }
        
        // Filter by search term
        if (filter.searchTerm) {
          const term = filter.searchTerm.toLowerCase();
          if (
            !post.title.toLowerCase().includes(term) &&
            !post.content.toLowerCase().includes(term)
          ) {
            return null;
          }
        }
        
        // Filter by tags
        if (filter.tags && filter.tags.length > 0) {
          if (!post.tags.some(tag => filter.tags?.includes(tag))) {
            return null;
          }
        }
      }
      
      return postToCalendarEvent(post);
    }).filter(Boolean) as CalendarEvent[];
  },

  getMockBestTimeRecommendations(platform?: Platform): BestTimeRecommendation[] {
    const platforms: Platform[] = platform 
      ? [platform] 
      : ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'pinterest'];
    
    const recommendations: BestTimeRecommendation[] = [];
    
    platforms.forEach(p => {
      // Add multiple recommendations per platform
      for (let day = 0; day < 7; day++) {
        recommendations.push({
          platform: p,
          dayOfWeek: day,
          timeOfDay: `${8 + Math.floor(Math.random() * 12)}:${Math.random() > 0.5 ? '30' : '00'}`,
          engagementScore: 50 + Math.floor(Math.random() * 50),
          confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
        });
        
        // Add a second time for some days
        if (Math.random() > 0.5) {
          recommendations.push({
            platform: p,
            dayOfWeek: day,
            timeOfDay: `${15 + Math.floor(Math.random() * 6)}:${Math.random() > 0.5 ? '30' : '00'}`,
            engagementScore: 50 + Math.floor(Math.random() * 50),
            confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
          });
        }
      }
    });
    
    return recommendations;
  },

  getMockTimeSlots(): TimeSlot[] {
    const platforms: Platform[] = ['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'pinterest'];
    const timeSlots: TimeSlot[] = [];
    
    platforms.forEach((platform, pIndex) => {
      for (let day = 0; day < 7; day++) {
        // Morning slot
        timeSlots.push({
          id: `slot-${platform}-${day}-morning`,
          platform,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '11:00',
          isActive: Math.random() > 0.3
        });
        
        // Afternoon slot
        timeSlots.push({
          id: `slot-${platform}-${day}-afternoon`,
          platform,
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '16:00',
          isActive: Math.random() > 0.3
        });
        
        // Evening slot
        timeSlots.push({
          id: `slot-${platform}-${day}-evening`,
          platform,
          dayOfWeek: day,
          startTime: '18:00',
          endTime: '20:00',
          isActive: Math.random() > 0.3
        });
      }
    });
    
    return timeSlots;
  },

  getMockCalendarDensity(year: number, month: number): CalendarDensity[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const density: CalendarDensity[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date string in YYYY-MM-DD format
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Generate random count and conflict status
      const count = Math.floor(Math.random() * 6); // 0-5 posts per day
      const hasConflicts = count > 3 ? Math.random() > 0.5 : false; // More likely conflicts with more posts
      
      density.push({ date, count, hasConflicts });
    }
    
    return density;
  }
}; 