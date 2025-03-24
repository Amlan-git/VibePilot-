import { Platform } from './platforms';

export interface Post {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  status: PostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  media?: Media[];
  analytics?: PostAnalytics;
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  altText?: string;
}

export interface PostAnalytics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  engagement: number;
  platformAnalytics: PlatformAnalytics[];
}

export interface PlatformAnalytics {
  platformId: string;
  likes: number;
  shares: number;
  comments: number;
  reach?: number;
  engagement?: number;
}

export interface PostCreateRequest {
  id?: string; // Optional for update operations
  title: string;
  content: string;
  scheduledDate: string;
  platforms: string[];
  status: PostStatus;
  tags: string[];
}

export interface PostUpdateRequest extends PostCreateRequest {
  id: string;
}

export interface PostFilter {
  search?: string;
  platforms?: Platform[];
  status?: PostStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
} 