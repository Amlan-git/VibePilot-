import axios from 'axios';
import { 
  EnhancementRequest, 
  ContentSuggestion, 
  SuggestionType,
  MessageType,
  AIMessage
} from '../features/ai/types';

// Cohere API key from environment variables
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/v1';

// Create an axios instance for Cohere API
const cohereClient = axios.create({
  baseURL: COHERE_API_URL,
  headers: {
    'Authorization': `Bearer ${COHERE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Function to generate content using Cohere's generate endpoint
export const generateContent = async (request: EnhancementRequest): Promise<ContentSuggestion[]> => {
  try {
    // Create prompt based on the request type and parameters
    let prompt = '';
    let maxTokens = 150;
    
    switch (request.type) {
      case SuggestionType.REWRITE:
        prompt = `Rewrite the following social media post for ${request.platform || 'social media'} 
                 in a ${request.tone || 'professional'} tone: "${request.text}"`;
        maxTokens = 200;
        break;
      case SuggestionType.HASHTAGS:
        prompt = `Suggest relevant hashtags for the following ${request.platform || 'social media'} post: "${request.text}"`;
        maxTokens = 100;
        break;
      case SuggestionType.IDEA:
        prompt = `Generate a new content idea similar to this post for ${request.platform || 'social media'}: "${request.text}"`;
        maxTokens = 250;
        break;
      case SuggestionType.OPTIMIZATION:
        prompt = `Optimize this ${request.platform || 'social media'} post for maximum engagement: "${request.text}"`;
        maxTokens = 200;
        break;
      default:
        prompt = `Improve the following social media post: "${request.text}"`;
    }
    
    // Add keywords if provided
    if (request.keywords && request.keywords.length > 0) {
      prompt += ` Include these keywords: ${request.keywords.join(', ')}.`;
    }
    
    // Add options
    if (request.options) {
      if (request.options.includeHashtags) {
        prompt += ' Include relevant hashtags.';
      }
      if (request.options.preserveLinks) {
        prompt += ' Preserve any links in the original text.';
      }
      if (request.options.includeEmojis) {
        prompt += ' Include appropriate emojis.';
      }
    }
    
    // Call Cohere API
    const response = await cohereClient.post('/generate', {
      model: 'command',
      prompt,
      max_tokens: maxTokens,
      temperature: 0.7,
      k: 0,
      p: 0.75,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    });
    
    // Transform API response into ContentSuggestion objects
    const generations = response.data.generations || [];
    return generations.map((gen: any, index: number) => {
      const suggestedText = gen.text.trim();
      
      // Extract hashtags if they exist
      const hashtagRegex = /#[a-zA-Z0-9_]+/g;
      const hashtags = suggestedText.match(hashtagRegex) || [];
      
      return {
        id: `suggestion-${index + 1}`,
        originalText: request.text,
        suggestedText,
        type: request.type,
        platform: request.platform,
        relevanceScore: Math.floor(Math.random() * 20) + 80, // Would be provided by API in real implementation
        characterCount: suggestedText.length,
        metadata: {
          toneType: request.tone,
          readabilityScore: Math.floor(Math.random() * 20) + 80, // Placeholder
          engagement: Math.floor(Math.random() * 30) + 70, // Placeholder
          hashtags: hashtags.length > 0 ? hashtags : undefined
        }
      };
    });
  } catch (error) {
    console.error('Error generating content with Cohere:', error);
    throw error;
  }
};

// Function to chat with the AI
export const generateChatResponse = async (messages: AIMessage[]): Promise<string> => {
  try {
    // Format chat history for Cohere
    const chatHistory = messages
      .filter(msg => msg.type === MessageType.USER || msg.type === MessageType.AI)
      .map(msg => ({
        role: msg.type === MessageType.USER ? 'USER' : 'CHATBOT',
        message: msg.content
      }));
    
    // Call Cohere chat API
    const response = await cohereClient.post('/chat', {
      model: 'command',
      chat_history: chatHistory,
      message: messages[messages.length - 1].content,
      temperature: 0.8,
      p: 0.7,
      k: 0,
      max_tokens: 300
    });
    
    return response.data.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error generating chat response with Cohere:', error);
    throw error;
  }
};

export default {
  generateContent,
  generateChatResponse
}; 