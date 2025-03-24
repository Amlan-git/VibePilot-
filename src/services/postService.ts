import axios from 'axios';
import { Post, PostCreateRequest, PostFilter, PostsResponse, PostUpdateRequest, Platform, PostStatus } from '../types/posts';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postService = {
  async getPosts(page = 1, pageSize = 10, filters?: PostFilter): Promise<PostsResponse> {
    const params = { page, pageSize, ...filters };
    const response = await axios.get(`${API_URL}/posts`, {
      headers: getAuthHeader(),
      params,
    });
    return response.data;
  },

  async getPostById(id: string): Promise<Post> {
    const response = await axios.get(`${API_URL}/posts/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async createPost(postData: PostCreateRequest): Promise<Post> {
    const response = await axios.post(`${API_URL}/posts`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async updatePost(id: string, postData: PostUpdateRequest): Promise<Post> {
    const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await axios.delete(`${API_URL}/posts/${id}`, {
      headers: getAuthHeader(),
    });
  },

  async duplicatePost(id: string): Promise<Post> {
    const response = await axios.post(`${API_URL}/posts/${id}/duplicate`, {}, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Mock implementation for development
  getMockPosts(count = 10): Post[] {
    const platforms: Array<Array<Platform>> = [
      ['twitter', 'instagram'],
      ['facebook', 'linkedin'],
      ['twitter', 'facebook', 'linkedin'],
      ['instagram', 'tiktok'],
      ['pinterest', 'instagram']
    ];
    
    const statuses: PostStatus[] = ['draft', 'scheduled', 'published', 'failed'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `post-${i + 1}`,
      title: `Sample Post ${i + 1}`,
      content: `This is the content for sample post ${i + 1}. #vibepilot #social`,
      platforms: platforms[i % platforms.length],
      scheduledDate: new Date(Date.now() + (i * 86400000)).toISOString(),
      status: statuses[i % statuses.length],
      tags: ['sample', 'test', `tag-${i}`],
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 43200000)).toISOString(),
      analytics: i % 2 === 0 ? {
        engagementRate: Math.random() * 10,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        clicks: Math.floor(Math.random() * 200)
      } : undefined
    }));
  }
}; 