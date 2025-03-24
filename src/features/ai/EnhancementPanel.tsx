import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  CardTitle,
  CardActions,
  PanelBar,
  PanelBarItem
} from '@progress/kendo-react-layout';
import { 
  Button,
  ButtonGroup,
  Chip,
  ChipList
} from '@progress/kendo-react-buttons';
import { 
  TextArea,
  Input,
  Slider,
  Switch
} from '@progress/kendo-react-inputs';
import { 
  DropDownList,
  MultiSelect
} from '@progress/kendo-react-dropdowns';
import { 
  Loader 
} from '@progress/kendo-react-indicators';
import {
  ToneType,
  SuggestionType,
  EnhancementRequest,
  ContentSuggestion
} from './types';
import SuggestionCards from './SuggestionCards';
import { generateContent } from '../../services/cohereService';

const initialContent = "Check out our new product line! We're excited to share our latest innovations with you.";

const platforms = [
  { text: 'Twitter', value: 'twitter', icon: '🐦', maxLength: 280 },
  { text: 'Instagram', value: 'instagram', icon: '📸', maxLength: 2200 },
  { text: 'Facebook', value: 'facebook', icon: '👍', maxLength: 63206 },
  { text: 'LinkedIn', value: 'linkedin', icon: '💼', maxLength: 3000 },
  { text: 'TikTok', value: 'tiktok', icon: '🎵', maxLength: 2200 },
  { text: 'YouTube', value: 'youtube', icon: '▶️', maxLength: 5000 }
];

const tones = [
  { text: 'Professional', value: ToneType.PROFESSIONAL },
  { text: 'Casual', value: ToneType.CASUAL },
  { text: 'Promotional', value: ToneType.PROMOTIONAL },
  { text: 'Friendly', value: ToneType.FRIENDLY },
  { text: 'Enthusiastic', value: ToneType.ENTHUSIASTIC },
  { text: 'Formal', value: ToneType.FORMAL }
];

const generateDummySuggestions = (
  request: EnhancementRequest, 
  count: number = 3
): ContentSuggestion[] => {
  // This is a placeholder to simulate AI suggestions
  const suggestions: ContentSuggestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const suffixes = [
      "🔥 Don't miss out!",
      "Limited time offer!",
      "See what's new today!",
      "Exclusive deals await!",
      "Discover the difference!"
    ];
    
    const tonePrefixes = {
      [ToneType.PROFESSIONAL]: ["We're pleased to introduce", "We're proud to present", "Announcing our latest"],
      [ToneType.CASUAL]: ["Hey! Check out", "Just dropped", "Guess what? We've got"],
      [ToneType.PROMOTIONAL]: ["SPECIAL OFFER:", "NEW RELEASE:", "LIMITED TIME:"],
      [ToneType.FRIENDLY]: ["Friends! We've got exciting news about", "You're going to love our", "We can't wait for you to see"],
      [ToneType.ENTHUSIASTIC]: ["WOW! 🤩 Just launched:", "AMAZING new products just arrived!", "SO EXCITED to show you"],
      [ToneType.FORMAL]: ["We are pleased to announce", "It is our pleasure to present", "We cordially invite you to explore"]
    };
    
    const prefix = request.tone ? 
      tonePrefixes[request.tone][Math.floor(Math.random() * tonePrefixes[request.tone].length)] :
      tonePrefixes[ToneType.PROFESSIONAL][0];
    
    const hashtags = [
      "#NewRelease", "#Innovation", "#MustHave", "#TrendAlert", "#LimitedEdition",
      "#ExclusiveOffer", "#ShopNow", "#NewCollection", "#CustomerFavorite"
    ];
    
    const selectedHashtags = [];
    const hashtagCount = Math.floor(Math.random() * 5) + 2; // 2-6 hashtags
    for (let j = 0; j < hashtagCount; j++) {
      const randomIndex = Math.floor(Math.random() * hashtags.length);
      selectedHashtags.push(hashtags[randomIndex]);
      hashtags.splice(randomIndex, 1);
    }
    
    let suggestedText = "";
    
    switch (request.type) {
      case SuggestionType.REWRITE:
        suggestedText = `${prefix} our new product line! ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        break;
      case SuggestionType.HASHTAGS:
        suggestedText = `${request.text} ${selectedHashtags.join(' ')}`;
        break;
      case SuggestionType.IDEA:
        suggestedText = `${prefix} our new product line! Here's what makes it special: [Feature 1], [Feature 2], and [Feature 3]. ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        break;
      case SuggestionType.RESPONSE:
        suggestedText = `Thank you for your interest in our new product line! We're glad you're excited. Feel free to check out our website for more details or let us know if you have any questions.`;
        break;
      case SuggestionType.OPTIMIZATION:
        const platform = request.platform || 'twitter';
        if (platform === 'twitter') {
          suggestedText = `New products alert! 🚨 Check out our latest innovations - designed with you in mind. ${selectedHashtags.slice(0, 2).join(' ')}`;
        } else if (platform === 'instagram') {
          suggestedText = `✨ NEW PRODUCT LINE ALERT ✨\n\nWe're thrilled to introduce our latest innovations! Designed with you in mind, our new collection features cutting-edge technology and sleek designs.\n\n${selectedHashtags.join(' ')}`;
        } else {
          suggestedText = `${prefix} our new product line! We've been working hard to bring you the best quality and innovative features. ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${selectedHashtags.slice(0, 3).join(' ')}`;
        }
        break;
      default:
        suggestedText = request.text;
    }
    
    suggestions.push({
      id: `suggestion-${i + 1}`,
      originalText: request.text,
      suggestedText,
      type: request.type,
      platform: request.platform,
      relevanceScore: Math.floor(Math.random() * 20) + 80, // 80-100
      characterCount: suggestedText.length,
      metadata: {
        toneType: request.tone,
        readabilityScore: Math.floor(Math.random() * 20) + 80, // 80-100
        engagement: Math.floor(Math.random() * 30) + 70, // 70-100
        hashtags: request.type === SuggestionType.HASHTAGS ? selectedHashtags : undefined
      }
    });
  }
  
  return suggestions;
};

const EnhancementPanel: React.FC = () => {
  const [content, setContent] = useState<string>(initialContent);
  const [selectedType, setSelectedType] = useState<SuggestionType>(SuggestionType.REWRITE);
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platforms[0].value);
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.PROFESSIONAL);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [suggestionsCount, setSuggestionsCount] = useState<number>(3);
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [preserveLinks, setPreserveLinks] = useState<boolean>(true);
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [characterCount, setCharacterCount] = useState<number>(initialContent.length);

  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

  const handleContentChange = (e: any) => {
    setContent(e.target.value);
  };

  const handleTypeChange = (type: SuggestionType) => {
    setSelectedType(type);
  };

  const handlePlatformChange = (e: any) => {
    setSelectedPlatform(e.target.value);
  };

  const handleToneChange = (e: any) => {
    setSelectedTone(e.target.value);
  };

  const handleKeywordInputChange = (e: any) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim() !== '') {
      e.preventDefault();
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  const handleSuggestionsCountChange = (e: any) => {
    setSuggestionsCount(e.target.value);
  };

  const handleIncludeHashtagsChange = (e: any) => {
    setIncludeHashtags(e.target.value);
  };

  const handlePreserveLinksChange = (e: any) => {
    setPreserveLinks(e.target.value);
  };

  const handleIncludeEmojisChange = (e: any) => {
    setIncludeEmojis(e.target.value);
  };

  const generateSuggestions = async () => {
    if (content.trim() === '') return;
    
    setIsLoading(true);
    setSuggestions([]);
    
    const request: EnhancementRequest = {
      text: content,
      type: selectedType,
      platform: selectedPlatform,
      tone: selectedTone,
      keywords: keywords.length > 0 ? keywords : undefined,
      options: {
        includeHashtags,
        preserveLinks,
        includeEmojis
      }
    };
    
    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_COHERE_API_KEY;
      
      let newSuggestions: ContentSuggestion[];
      
      if (apiKey && apiKey !== 'your_cohere_api_key_here') {
        // Call the Cohere service
        newSuggestions = await generateContent(request);
      } else {
        // Fall back to dummy suggestions for demo/development
        console.warn('No Cohere API key found, using dummy suggestions');
        await new Promise(resolve => setTimeout(resolve, 1500));
        newSuggestions = generateDummySuggestions(request, suggestionsCount);
      }
      
      setSuggestions(newSuggestions);
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxLength = platforms.find(p => p.value === selectedPlatform)?.maxLength || 280;
  
  return (
    <div className="enhancement-panel">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="content-section">
          <Card style={{ 
            marginBottom: '24px',
            borderRadius: '14px',
            boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
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
              }}>Your Content</CardTitle>
            </CardHeader>
            <CardBody style={{ padding: '20px' }}>
              <TextArea
                value={content}
                onChange={handleContentChange}
                rows={5}
                placeholder="Enter your content here..."
                style={{ 
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 1)',
                  fontSize: '14px',
                  color: '#2D3748',
                  resize: 'vertical'
                }}
              />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px'
              }}>
                <div style={{ 
                  fontSize: '13px',
                  color: characterCount > maxLength ? 'var(--error-color)' : 'var(--text-secondary)'
                }}>
                  {characterCount} / {maxLength} characters
                </div>
                
                <Button
                  themeColor="primary"
                  disabled={content.trim() === '' || isLoading}
                  onClick={generateSuggestions}
                  style={{
                    background: 'linear-gradient(90deg, #4299E1, #3182CE)',
                    boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    padding: '10px 20px'
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Loader size="small" themeColor="light" />
                      Generating suggestions...
                    </span>
                  ) : (
                    'Generate Suggestions'
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
          
          {suggestions.length > 0 && !isLoading && (
            <SuggestionCards 
              suggestions={suggestions}
              onApply={(suggestion: ContentSuggestion) => {
                setContent(suggestion.suggestedText);
              }}
            />
          )}
          
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <Loader size="large" themeColor="primary" />
              <p style={{ 
                marginTop: '20px',
                color: 'var(--text-secondary)',
                fontSize: '15px'
              }}>
                Generating AI suggestions...
              </p>
            </div>
          )}
        </div>
        
        <div className="options-section">
          <Card style={{ 
            borderRadius: '14px',
            boxShadow: '0 10px 25px rgba(30, 64, 175, 0.05), 0 4px 10px rgba(30, 64, 175, 0.03)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
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
              }}>Enhancement Options</CardTitle>
            </CardHeader>
            <CardBody style={{ padding: '20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#4A5568'
                }}>
                  Enhancement Type
                </label>
                <ButtonGroup className="enhancement-options">
                  <Button
                    selected={selectedType === SuggestionType.REWRITE}
                    onClick={() => handleTypeChange(SuggestionType.REWRITE)}
                    style={{
                      flex: 1,
                      fontSize: '13px',
                      borderRadius: '8px 0 0 8px'
                    }}
                  >
                    Rewrite
                  </Button>
                  <Button
                    selected={selectedType === SuggestionType.HASHTAGS}
                    onClick={() => handleTypeChange(SuggestionType.HASHTAGS)}
                    style={{
                      flex: 1,
                      fontSize: '13px'
                    }}
                  >
                    Hashtags
                  </Button>
                  <Button
                    selected={selectedType === SuggestionType.IDEA}
                    onClick={() => handleTypeChange(SuggestionType.IDEA)}
                    style={{
                      flex: 1,
                      fontSize: '13px'
                    }}
                  >
                    Ideas
                  </Button>
                  <Button
                    selected={selectedType === SuggestionType.OPTIMIZATION}
                    onClick={() => handleTypeChange(SuggestionType.OPTIMIZATION)}
                    style={{
                      flex: 1,
                      fontSize: '13px',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    Optimize
                  </Button>
                </ButtonGroup>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#4A5568'
                }}>
                  Platform
                </label>
                <DropDownList
                  data={platforms}
                  textField="text"
                  dataItemKey="value"
                  value={platforms.find(p => p.value === selectedPlatform)}
                  onChange={handlePlatformChange}
                  style={{ width: '100%' }}
                  itemRender={(li, itemProps) => {
                    const dataItem = itemProps.dataItem;
                    return (
                      <span>
                        <span style={{ marginRight: '8px' }}>{dataItem.icon}</span>
                        {dataItem.text} <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                          (max {dataItem.maxLength} chars)
                        </span>
                      </span>
                    );
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#4A5568'
                }}>
                  Tone
                </label>
                <DropDownList
                  data={tones}
                  textField="text"
                  dataItemKey="value"
                  value={tones.find(t => t.value === selectedTone)}
                  onChange={handleToneChange}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#4A5568'
                }}>
                  Keywords
                </label>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <Input
                    value={keywordInput}
                    onChange={handleKeywordInputChange}
                    onKeyPress={handleKeywordKeyPress}
                    placeholder="Add keyword and press Enter"
                    style={{ flex: 1 }}
                  />
                </div>
                {keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        text={keyword}
                        removable={true}
                        onRemove={() => handleRemoveKeyword(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <PanelBar>
                <PanelBarItem title="Advanced Options" expanded={false}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#4A5568'
                      }}>
                        Number of Suggestions
                      </label>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={suggestionsCount}
                        onChange={handleSuggestionsCountChange}
                        style={{ width: '100%' }}
                      />
                      <div style={{ textAlign: 'center', fontSize: '13px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                        {suggestionsCount}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <label style={{ 
                          fontWeight: '500',
                          fontSize: '14px',
                          color: '#4A5568'
                        }}>
                          Include Hashtags
                        </label>
                        <Switch
                          checked={includeHashtags}
                          onChange={handleIncludeHashtagsChange}
                        />
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <label style={{ 
                          fontWeight: '500',
                          fontSize: '14px',
                          color: '#4A5568'
                        }}>
                          Preserve Links
                        </label>
                        <Switch
                          checked={preserveLinks}
                          onChange={handlePreserveLinksChange}
                        />
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <label style={{ 
                          fontWeight: '500',
                          fontSize: '14px',
                          color: '#4A5568'
                        }}>
                          Include Emojis
                        </label>
                        <Switch
                          checked={includeEmojis}
                          onChange={handleIncludeEmojisChange}
                        />
                      </div>
                    </div>
                  </div>
                </PanelBarItem>
              </PanelBar>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancementPanel; 