import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Platform, PLATFORM_TYPES } from '../types/platforms';

// Mock data for platforms
const mockPlatforms: Platform[] = [
  {
    id: PLATFORM_TYPES.TWITTER,
    name: 'Twitter',
    icon: 'twitter',
    color: '#1DA1F2',
    isConnected: true
  },
  {
    id: PLATFORM_TYPES.FACEBOOK,
    name: 'Facebook',
    icon: 'facebook',
    color: '#4267B2',
    isConnected: true
  },
  {
    id: PLATFORM_TYPES.INSTAGRAM,
    name: 'Instagram',
    icon: 'instagram',
    color: '#C13584',
    isConnected: true
  },
  {
    id: PLATFORM_TYPES.LINKEDIN,
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077B5',
    isConnected: false
  },
  {
    id: PLATFORM_TYPES.YOUTUBE,
    name: 'YouTube',
    icon: 'youtube',
    color: '#FF0000',
    isConnected: false
  },
  {
    id: PLATFORM_TYPES.TIKTOK,
    name: 'TikTok',
    icon: 'tiktok',
    color: '#000000',
    isConnected: false
  }
];

// This service would fetch platforms from the API in a real implementation
const fetchPlatforms = async (): Promise<Platform[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPlatforms;
};

export const usePlatforms = () => {
  const {
    data: platforms = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
  });

  const getConnectedPlatforms = () => {
    return platforms.filter(platform => platform.isConnected);
  };

  const getPlatformById = (id: string) => {
    return platforms.find(platform => platform.id === id);
  };

  return {
    platforms,
    isLoading,
    isError,
    error,
    getConnectedPlatforms,
    getPlatformById
  };
}; 