import axios from 'axios';
import { Platform } from '../types/posts';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ConnectedPlatform {
  id: string;
  type: Platform;
  name: string;
  profileUrl: string;
  profileImage: string;
  isConnected: boolean;
}

const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const platformService = {
  async getConnectedPlatforms(): Promise<ConnectedPlatform[]> {
    const response = await axios.get(`${API_URL}/platforms`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Mock implementation for development
  getMockPlatforms(): ConnectedPlatform[] {
    return [
      {
        id: 'twitter-1',
        type: 'twitter',
        name: 'Twitter Main',
        profileUrl: 'https://twitter.com/vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: true,
      },
      {
        id: 'instagram-1',
        type: 'instagram',
        name: 'Instagram Business',
        profileUrl: 'https://instagram.com/vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: true,
      },
      {
        id: 'facebook-1',
        type: 'facebook',
        name: 'Facebook Page',
        profileUrl: 'https://facebook.com/vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: true,
      },
      {
        id: 'linkedin-1',
        type: 'linkedin',
        name: 'LinkedIn Company',
        profileUrl: 'https://linkedin.com/company/vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: true,
      },
      {
        id: 'tiktok-1',
        type: 'tiktok',
        name: 'TikTok Business',
        profileUrl: 'https://tiktok.com/@vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: false,
      },
      {
        id: 'pinterest-1',
        type: 'pinterest',
        name: 'Pinterest Business',
        profileUrl: 'https://pinterest.com/vibepilot',
        profileImage: 'https://placehold.co/100x100',
        isConnected: false,
      },
    ];
  }
}; 