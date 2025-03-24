import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody,
  TabStrip, 
  TabStripTab
} from '@progress/kendo-react-layout';
import { 
  Button,
  Chip
} from '@progress/kendo-react-buttons';
import { 
  Input
} from '@progress/kendo-react-inputs';
import { 
  Loader 
} from '@progress/kendo-react-indicators';
import { 
  Notification, 
  NotificationGroup 
} from '@progress/kendo-react-notification';

import EnhancementPanel from './EnhancementPanel';
import SuggestionCards from './SuggestionCards';
import PromptLibrary from './PromptLibrary';
import AISettings from './AISettings';
import { AIMessage, AITab, MessageType } from './types';

const AIAssistant: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      id: '1', 
      type: MessageType.ASSISTANT, 
      content: "Hi there! I'm your content assistant. How can I enhance your content today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{type: 'success' | 'info' | 'warning' | 'error', message: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tabs: AITab[] = [
    { name: 'Chat', icon: 'chat' },
    { name: 'Content Enhancer', icon: 'edit' },
    { name: 'Prompt Library', icon: 'folder' },
    { name: 'Settings', icon: 'gear' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabSelect = (e: any) => {
    setSelected(e.selected);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: MessageType.ASSISTANT,
        content: "I'll help you enhance that content! What specific improvements are you looking for? You can ask for tone adjustment, hashtag suggestions, or platform-specific optimizations.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setNotification({
        type: 'success',
        message: 'AI response generated successfully'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to generate AI response'
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
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

  const renderTabContent = () => {
    switch (selected) {
      case 0: // Chat
        return (
          <div className="ai-chat-container" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: 'calc(100vh - 220px)',
            maxHeight: '600px'
          }}>
            <div className="messages-container" style={{ 
              flex: 1, 
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.type === MessageType.USER ? 'user-message' : 'assistant-message'}`}
                  style={{
                    alignSelf: message.type === MessageType.USER ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: message.type === MessageType.USER 
                      ? 'linear-gradient(90deg, #4299E1, #3182CE)' 
                      : 'linear-gradient(145deg, #ffffff, #f8faff)',
                    color: message.type === MessageType.USER ? 'white' : '#2D3748',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    border: message.type === MessageType.USER 
                      ? 'none' 
                      : '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <div style={{ 
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.content}
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: message.type === MessageType.USER ? 'rgba(255, 255, 255, 0.7)' : '#718096',
                    marginTop: '6px',
                    textAlign: 'right'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="input-container" style={{ 
              padding: '16px',
              borderTop: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'white',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}>
              <Input
                style={{ 
                  flex: 1,
                  borderRadius: '12px',
                  background: 'rgba(247, 250, 252, 0.8)', 
                  padding: '10px 16px',
                  borderColor: 'rgba(226, 232, 240, 1)'
                }}
                placeholder="Type your message here..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Chip
                  text="Rewrite"
                  themeColor="info"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setInputValue(prev => prev + ' [Rewrite]')}
                />
                <Chip
                  text="Hashtags"
                  themeColor="warning"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setInputValue(prev => prev + ' [Hashtags]')}
                />
                <Chip
                  text="Ideas"
                  themeColor="success"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setInputValue(prev => prev + ' [Ideas]')}
                />
              </div>
              
              <Button
                primary={true}
                disabled={inputValue.trim() === '' || isLoading}
                onClick={handleSendMessage}
                style={{
                  background: 'linear-gradient(90deg, #4299E1, #3182CE)',
                  boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  minWidth: '100px'
                }}
              >
                {isLoading ? (
                  <Loader size="small" themeColor="light" />
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </div>
        );
      case 1: // Content Enhancer
        return <EnhancementPanel />;
      case 2: // Prompt Library
        return <PromptLibrary />;
      case 3: // Settings
        return <AISettings />;
      default:
        return null;
    }
  };

  return (
    <div className="ai-assistant-container" style={{ 
      padding: '28px', 
      maxWidth: '1920px', 
      margin: '0 auto',
      background: 'linear-gradient(145deg, rgba(250,251,255,0.5), rgba(240,245,255,0.5))',
      minHeight: '100vh'
    }}>
      <div className="ai-assistant-header" style={{ 
        marginBottom: '28px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            background: 'linear-gradient(90deg, #2D3748, #4A5568)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>AI Assistant</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Enhance your content with AI-powered suggestions
          </p>
        </div>
        {isLoading && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(237, 242, 247, 0.8)',
            padding: '8px 16px',
            borderRadius: '24px'
          }}>
            <Loader size="small" themeColor="primary" />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              AI is thinking...
            </span>
          </div>
        )}
      </div>

      {notification && (
        <NotificationGroup style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000 }}>
          <Notification
            type={{ style: notification.type, icon: true }}
            closable={true}
            onClose={() => setNotification(null)}
            style={{
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px'
            }}
          >
            <span>{notification.message}</span>
          </Notification>
        </NotificationGroup>
      )}

      <Card style={{ 
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
        borderRadius: '16px',
        border: 'none',
        overflow: 'hidden'
      }}>
        <CardBody style={{ padding: 0 }}>
          <TabStrip
            selected={selected}
            onSelect={handleTabSelect}
            animation={true}
            style={{ 
              '--kendo-tabstrip-border-bottom': 'none',
              '--kendo-tabstrip-header-background': 'white',
              '--kendo-tabstrip-header-color': 'var(--text-secondary)',
              '--kendo-tabstrip-header-selected-color': '#3182CE',
              '--kendo-tabstrip-header-selected-background': 'white',
              '--kendo-tabstrip-header-selected-font-weight': 'bold',
              '--kendo-tabstrip-header-selected-border-bottom': '2px solid #3182CE'
            } as any}
          >
            {tabs.map((tab, index) => (
              <TabStripTab
                key={index}
                title={tab.name}
                icon={tab.icon as any}
                style={{ 
                  padding: '16px 24px', 
                  fontSize: '15px',
                  fontWeight: selected === index ? 'bold' : 'normal'
                }}
              />
            ))}
          </TabStrip>
          <div style={{ padding: selected === 0 ? 0 : '24px' }}>
            {renderTabContent()}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AIAssistant; 