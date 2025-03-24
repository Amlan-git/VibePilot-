import React from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter
} from '@progress/kendo-react-layout';
import { 
  Button,
  ButtonGroup,
  Chip
} from '@progress/kendo-react-buttons';
import { ContentSuggestion, SuggestionType } from './types';

interface SuggestionCardsProps {
  suggestions: ContentSuggestion[];
  onApply: (suggestion: ContentSuggestion) => void;
}

const SuggestionCards: React.FC<SuggestionCardsProps> = ({ suggestions, onApply }) => {
  
  const getSuggestionTypeLabel = (type: SuggestionType): string => {
    switch (type) {
      case SuggestionType.REWRITE:
        return 'Rewrite';
      case SuggestionType.HASHTAGS:
        return 'Hashtags';
      case SuggestionType.IDEA:
        return 'Idea';
      case SuggestionType.RESPONSE:
        return 'Response';
      case SuggestionType.OPTIMIZATION:
        return 'Optimization';
      default:
        return 'Suggestion';
    }
  };

  const getRelevanceColor = (score: number): string => {
    if (score >= 90) return '#38A169'; // green
    if (score >= 80) return '#3182CE'; // blue
    if (score >= 70) return '#DD6B20'; // orange
    return '#E53E3E'; // red
  };

  return (
    <div className="suggestion-cards">
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '16px',
        color: '#2D3748'
      }}>
        AI Suggestions
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {suggestions.map((suggestion) => (
          <Card 
            key={suggestion.id}
            style={{ 
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardHeader style={{ 
              borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
              padding: '16px 20px',
              background: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CardTitle style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#2D3748',
                  margin: 0
                }}>
                  {getSuggestionTypeLabel(suggestion.type)}
                </CardTitle>
                
                <Chip
                  text={`${suggestion.relevanceScore}%`}
                  style={{ 
                    backgroundColor: `${getRelevanceColor(suggestion.relevanceScore)}20`,
                    color: getRelevanceColor(suggestion.relevanceScore),
                    fontWeight: '600',
                    fontSize: '12px'
                  }}
                />
              </div>
              
              {suggestion.platform && (
                <div style={{ 
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(237, 242, 247, 0.8)',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize'
                }}>
                  {suggestion.platform}
                </div>
              )}
            </CardHeader>
            
            <CardBody style={{ 
              padding: '20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#4A5568',
                whiteSpace: 'pre-wrap',
                flex: 1,
                overflow: 'auto'
              }}>
                {suggestion.suggestedText}
              </div>
              
              {suggestion.metadata?.hashtags && suggestion.metadata.hashtags.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#4A5568' }}>
                    Hashtags:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {suggestion.metadata.hashtags.map((hashtag, index) => (
                      <Chip
                        key={index}
                        text={hashtag}
                        style={{ 
                          backgroundColor: 'rgba(66, 153, 225, 0.1)',
                          color: '#3182CE',
                          fontSize: '12px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                <div>
                  {suggestion.characterCount} characters
                </div>
                
                {suggestion.metadata && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {suggestion.metadata.readabilityScore && (
                      <div>
                        Readability: {suggestion.metadata.readabilityScore}%
                      </div>
                    )}
                    
                    {suggestion.metadata.engagement && (
                      <div>
                        Engagement: {suggestion.metadata.engagement}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardBody>
            
            <CardFooter style={{ 
              padding: '12px 20px',
              borderTop: '1px solid rgba(226, 232, 240, 0.6)',
              background: 'rgba(247, 250, 252, 0.5)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <Button
                themeColor="light"
                fillMode="flat"
                style={{ padding: '6px 12px' }}
                onClick={() => {
                  navigator.clipboard.writeText(suggestion.suggestedText);
                }}
              >
                Copy
              </Button>
              
              <Button
                themeColor="primary"
                style={{
                  background: 'linear-gradient(90deg, #4299E1, #3182CE)',
                  boxShadow: '0 4px 15px rgba(66, 153, 225, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '6px'
                }}
                onClick={() => onApply(suggestion)}
              >
                Apply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestionCards; 