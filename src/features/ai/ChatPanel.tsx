import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter
} from '@progress/kendo-react-layout';
import { 
  Button,
  Chip
} from '@progress/kendo-react-buttons';
import { 
  Input,
  TextArea
} from '@progress/kendo-react-inputs';
import { 
  DropDownList
} from '@progress/kendo-react-dropdowns';
import { 
  Loader 
} from '@progress/kendo-react-indicators';
import {
  MessageType,
  AIMessage,
  ToneType,
  PromptTemplate
} from './types';
import { generateChatResponse } from '../../services/cohereService';

const templates: PromptTemplate[] = [
  { text: 'Create a social media campaign', value: 'create-campaign' },
  { text: 'Generate post ideas about a product', value: 'product-ideas' },
  { text: 'Create an email newsletter', value: 'email-newsletter' },
  { text: 'Write a blog post outline', value: 'blog-outline' },
  { text: 'Create a customer survey', value: 'customer-survey' }
];

const tones = [
  { text: 'Professional', value: ToneType.PROFESSIONAL },
  { text: 'Casual', value: ToneType.CASUAL },
  { text: 'Promotional', value: ToneType.PROMOTIONAL },
  { text: 'Friendly', value: ToneType.FRIENDLY },
  { text: 'Enthusiastic', value: ToneType.ENTHUSIASTIC },
  { text: 'Formal', value: ToneType.FORMAL }
];

const initialMessages: AIMessage[] = [
  {
    id: 'welcome-message',
    type: MessageType.AI,
    content: "👋 Hi there! I'm your VibePilot AI assistant. I can help you create content, generate ideas, or optimize your social media posts. How can I help you today?",
    timestamp: new Date()
  }
];

// Simulate AI response
const generateAIResponse = async (message: string): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (message.toLowerCase().includes('campaign')) {
    return "I'd be happy to help you with a campaign! Here are some ideas:\n\n1. Run a user-generated content campaign where followers share their experiences\n2. Create a limited-time offer with exclusive discounts\n3. Partner with micro-influencers for authentic promotion\n4. Launch a hashtag challenge that encourages participation\n5. Host a social media contest with prizes\n\nWould you like me to elaborate on any of these options?";
  } else if (message.toLowerCase().includes('idea') || message.toLowerCase().includes('suggest')) {
    return "Here are some content ideas you might want to try:\n\n• Behind-the-scenes look at your team or process\n• Customer testimonial or success story\n• Industry news or trend analysis\n• Tutorial or how-to guide related to your products\n• Q&A session addressing common customer questions\n• Product feature spotlight\n• Team member highlight\n\nLet me know if any of these catch your interest!";
  } else if (message.toLowerCase().includes('optimize') || message.toLowerCase().includes('improve')) {
    return "To optimize your social media presence, consider these strategies:\n\n1. Post consistently using a content calendar\n2. Analyze your engagement metrics to determine best posting times\n3. Use high-quality, eye-catching visuals\n4. Keep captions concise on platforms like Instagram and Twitter\n5. Incorporate relevant hashtags (research trending options)\n6. Ask questions to encourage comments\n7. Include clear calls-to-action\n\nWould you like specific optimization tips for a particular platform?";
  } else {
    return "I'm here to help with your content and social media needs. I can assist with:\n\n• Creating social media posts\n• Generating content ideas\n• Optimizing your existing content\n• Suggesting hashtags or keywords\n• Planning content calendars\n• Writing captions or headlines\n\nWhat specific aspect would you like assistance with today?";
  }
};

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.PROFESSIONAL);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleNewMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };
  
  const handleTemplateChange = (e: any) => {
    setSelectedTemplate(e.target.value);
    
    // Pre-fill message based on template
    let templateMessage = '';
    switch (e.target.value) {
      case 'create-campaign':
        templateMessage = "Can you help me create a social media campaign for product launch? Our target audience is [audience] and our main goal is [goal].";
        break;
      case 'product-ideas':
        templateMessage = "I need some post ideas for our new [product type]. The key features are [features] and our target audience is [audience].";
        break;
      case 'email-newsletter':
        templateMessage = "Can you help me draft an email newsletter for our [monthly/weekly] update? We want to include [topics] and our tone should be [tone].";
        break;
      case 'blog-outline':
        templateMessage = "I need an outline for a blog post about [topic]. The target audience is [audience] and the main points should include [points].";
        break;
      case 'customer-survey':
        templateMessage = "Help me create a customer survey to gather feedback on [product/service]. We specifically want to know about [specific aspects].";
        break;
    }
    
    setNewMessage(templateMessage);
  };
  
  const handleToneChange = (e: any) => {
    setSelectedTone(e.target.value);
  };
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: MessageType.USER,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_COHERE_API_KEY;
      
      let aiResponseContent: string;
      
      if (apiKey && apiKey !== 'your_cohere_api_key_here') {
        // Call the Cohere service with all messages for context
        const allMessages = [...messages, userMessage];
        aiResponseContent = await generateChatResponse(allMessages);
      } else {
        // Fall back to local dummy response generator for demo/development
        console.warn('No Cohere API key found, using dummy responses');
        aiResponseContent = await generateAIResponse(userMessage.content);
      }
      
      // Add AI response
      const aiResponse: AIMessage = {
        id: `ai-${Date.now()}`,
        type: MessageType.AI,
        content: aiResponseContent,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        type: MessageType.ERROR,
        content: "Sorry, I'm having trouble responding. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="chat-panel">
      <Card style={{ 
        height: '100%',
        borderRadius: '14px',
        boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardHeader style={{ 
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          padding: '16px 20px',
          background: 'white'
        }}>
          <CardTitle style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#2D3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(66, 153, 225, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3182CE',
              fontSize: '16px'
            }}>
              🤖
            </span>
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardBody style={{ 
          padding: '0', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <div style={{ 
            padding: '20px',
            overflow: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map(message => (
              <div 
                key={message.id}
                style={{ 
                  display: 'flex',
                  flexDirection: message.type === MessageType.USER ? 'row-reverse' : 'row',
                  marginBottom: '8px'
                }}
              >
                <div style={{ 
                  maxWidth: '80%',
                  padding: '14px 18px',
                  borderRadius: message.type === MessageType.USER ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  backgroundColor: message.type === MessageType.USER ? 
                    'linear-gradient(90deg, #4299E1, #3182CE)' :
                    message.type === MessageType.ERROR ? 'rgba(254, 215, 215, 0.8)' : 'rgba(237, 242, 247, 0.8)',
                  color: message.type === MessageType.USER ? 'white' : 
                    message.type === MessageType.ERROR ? '#C53030' : '#2D3748',
                  boxShadow: message.type === MessageType.USER ? 
                    '0 4px 15px rgba(66, 153, 225, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  fontSize: '14px'
                }}
              >
                {message.content}
              </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardBody>
        <CardFooter style={{ 
          padding: '16px',
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DropDownList
              data={templates}
              textField="text"
              dataItemKey="value"
              value={templates.find(t => t.value === selectedTemplate)}
              onChange={handleTemplateChange}
              defaultItem={{text: "Select a prompt template...", value: null}}
              style={{ flex: 1 }}
            />
            
            <DropDownList
              data={tones}
              textField="text"
              dataItemKey="value"
              value={tones.find(t => t.value === selectedTone)}
              onChange={handleToneChange}
              style={{ width: '150px' }}
            />
          </div>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px'
          }}>
            <TextArea
              value={newMessage}
              onChange={handleNewMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={2}
              style={{ 
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(226, 232, 240, 1)',
                fontSize: '14px',
                resize: 'none'
              }}
            />
            
            <Button
              themeColor="primary"
              disabled={newMessage.trim() === '' || isLoading}
              onClick={handleSendMessage}
              style={{
                height: '42px',
                width: '42px',
                padding: '0',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #4299E1, #3182CE)',
                boxShadow: '0 4px 15px rgba(66, 153, 225, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isLoading ? 
                <Loader size="small" themeColor="light" /> : 
                <span style={{ fontSize: '18px' }}>➤</span>
              }
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatPanel; 