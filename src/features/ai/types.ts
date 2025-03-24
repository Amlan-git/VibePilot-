export enum MessageType {
  USER = 'user',
  AI = 'ai',
  ERROR = 'error'
}

export interface AIMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  metadata?: AIMessageMetadata;
}

export interface AIMessageMetadata {
  suggestionsCount?: number;
  platform?: string;
  toneType?: ToneType;
  characterCount?: number;
  processingTime?: number;
}

export interface AITab {
  name: string;
  icon: string;
}

export enum ToneType {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  PROMOTIONAL = 'promotional',
  FRIENDLY = 'friendly',
  ENTHUSIASTIC = 'enthusiastic',
  FORMAL = 'formal'
}

export interface ContentSuggestion {
  id: string;
  originalText: string;
  suggestedText: string;
  type: SuggestionType;
  platform?: string;
  relevanceScore: number; // 0-100
  characterCount: number;
  metadata?: {
    toneType?: ToneType;
    readabilityScore?: number;
    engagement?: number; // 0-100
    hashtags?: string[];
  };
}

export enum SuggestionType {
  REWRITE = 'rewrite',
  HASHTAGS = 'hashtags',
  IDEA = 'idea',
  RESPONSE = 'response',
  OPTIMIZATION = 'optimization'
}

export interface PromptTemplate {
  text: string;
  value: string;
}

export enum PromptCategory {
  REWRITE = 'rewrite',
  HASHTAGS = 'hashtags',
  IDEAS = 'ideas',
  RESPONSES = 'responses',
  OPTIMIZATION = 'optimization',
  CUSTOM = 'custom'
}

export interface AISettings {
  apiKey?: string;
  defaultTone: ToneType;
  defaultMaxCharacters: number;
  defaultPlatform: string;
  suggestionsCount: number;
  temperatures: {
    creative: number; // 0.7-1.0
    balanced: number; // 0.5-0.7
    precise: number; // 0.2-0.5
  };
  historyRetentionDays: number;
}

export interface AIHistoryEntry {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  type: SuggestionType;
  metadata?: {
    platform?: string;
    toneType?: ToneType;
    characterCount?: number;
    processingTime?: number;
  };
}

export interface EnhancementRequest {
  text: string;
  type: SuggestionType;
  platform?: string;
  tone?: ToneType;
  maxCharacters?: number;
  keywords?: string[];
  options?: {
    includeHashtags?: boolean;
    keepMentions?: boolean;
    preserveLinks?: boolean;
    includeEmojis?: boolean;
  };
}

export interface PlatformSpecifics {
  name: string;
  icon: string;
  color: string;
  maxCharacters: number;
  supportedFeatures: string[];
  recommendedTags: number;
  bestTimes?: {
    day: string;
    time: string;
  }[];
  engagementTips: string[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  processingTime?: number;
} 