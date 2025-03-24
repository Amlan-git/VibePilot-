export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
}

export const PLATFORM_TYPES = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok'
} as const;

export type PlatformType = typeof PLATFORM_TYPES[keyof typeof PLATFORM_TYPES]; 