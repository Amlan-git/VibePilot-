import React, { useState } from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  CardTitle,
  TabStrip,
  TabStripTab
} from '@progress/kendo-react-layout';
import { 
  Button
} from '@progress/kendo-react-buttons';
import EnhancementPanel from './EnhancementPanel';
import ChatPanel from './ChatPanel';

const AIAssistantPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabSelect = (e: any) => {
    setSelectedTab(e.selected);
  };

  return (
    <div className="ai-assistant-page" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          color: '#2D3748',
          margin: 0
        }}>
          AI Assistant
        </h1>
        
        <div>
          <Button
            themeColor="info"
            fillMode="flat"
            style={{ 
              marginRight: '12px',
              fontWeight: '500'
            }}
          >
            View History
          </Button>
          
          <Button
            themeColor="primary"
            style={{
              background: 'linear-gradient(90deg, #4299E1, #3182CE)',
              boxShadow: '0 4px 15px rgba(66, 153, 225, 0.2)',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '10px 20px'
            }}
          >
            Settings
          </Button>
        </div>
      </div>
      
      <Card style={{ 
        borderRadius: '14px',
        boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <CardHeader style={{ 
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          padding: '16px 20px',
          background: 'white'
        }}>
          <CardTitle style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#2D3748'
          }}>
            VibePilot AI Features
          </CardTitle>
        </CardHeader>
        <CardBody style={{ 
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(237, 242, 247, 0.6), rgba(247, 250, 252, 0.6))'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ 
              padding: '24px',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #EBF8FF, #BEE3F8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                ✏️
              </div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2D3748'
              }}>
                Content Enhancement
              </h3>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#4A5568',
                margin: 0
              }}>
                Optimize your posts with AI-powered content improvements, rewrites, and suggestions.
              </p>
            </div>
            
            <div style={{ 
              padding: '24px',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #E6FFFA, #B2F5EA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                🤖
              </div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2D3748'
              }}>
                AI Chat Assistant
              </h3>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#4A5568',
                margin: 0
              }}>
                Chat with our AI to brainstorm ideas, create content, or get help with your social media strategy.
              </p>
            </div>
            
            <div style={{ 
              padding: '24px',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FAF5FF, #E9D8FD)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                📊
              </div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2D3748'
              }}>
                Content Analysis
              </h3>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#4A5568',
                margin: 0
              }}>
                Get insights and analytics on your content performance and suggestions for improvement.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <TabStrip
        selected={selectedTab}
        onSelect={handleTabSelect}
        style={{ 
          marginBottom: '24px'
        }}
      >
        <TabStripTab title="Content Enhancement">
          <div style={{ padding: '24px 0' }}>
            <EnhancementPanel />
          </div>
        </TabStripTab>
        <TabStripTab title="AI Chat Assistant">
          <div style={{ padding: '24px 0', height: '600px' }}>
            <ChatPanel />
          </div>
        </TabStripTab>
      </TabStrip>
    </div>
  );
};

export default AIAssistantPage; 