import React, { useState } from 'react';
import { ContentType, AnalyticsFilter } from '../types';
import { PLATFORM_TYPES } from '../../../types/platforms';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';

interface PlatformFilterProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
}

const PlatformFilter: React.FC<PlatformFilterProps> = ({ filter, onFilterChange }) => {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  
  const platformOptions = Object.values(PLATFORM_TYPES).map(platform => ({
    text: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: platform,
    color: PLATFORM_COLORS[platform]
  }));
  
  const contentTypeOptions = Object.values(ContentType).map(type => ({
    text: type.charAt(0).toUpperCase() + type.slice(1),
    value: type
  }));
  
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filter.platforms.includes(platform)
      ? filter.platforms.filter(p => p !== platform)
      : [...filter.platforms, platform];
    
    onFilterChange({
      ...filter,
      platforms: newPlatforms
    });
  };
  
  const handleContentTypeToggle = (contentType: ContentType) => {
    const newContentTypes = filter.contentTypes.includes(contentType)
      ? filter.contentTypes.filter(ct => ct !== contentType)
      : [...filter.contentTypes, contentType];
    
    onFilterChange({
      ...filter,
      contentTypes: newContentTypes
    });
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px',
        gap: '8px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          Content Filters
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 600, 
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            Platforms
          </label>
          
          {/* Custom platform selector */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                border: '1px solid #ccc', 
                padding: '8px 12px', 
                borderRadius: '4px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                minHeight: '38px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
            >
              {filter.platforms.length === 0 ? (
                <span style={{ color: '#888' }}>Select platforms</span>
              ) : (
                filter.platforms.map(platform => {
                  const color = PLATFORM_COLORS[platform];
                  return (
                    <div 
                      key={platform}
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}30`,
                        color: color,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </div>
                  );
                })
              )}
            </div>
            
            {showPlatformDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {platformOptions.map(option => (
                  <div
                    key={option.value}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      backgroundColor: filter.platforms.includes(option.value) ? `${option.color}15` : undefined,
                      transition: 'background-color 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlatformToggle(option.value);
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={filter.platforms.includes(option.value)}
                      onChange={() => {}}
                      style={{
                        width: '16px',
                        height: '16px'
                      }}
                    />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: option.color, 
                      borderRadius: '3px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}></div>
                    <span>{option.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 600, 
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            Content Types
          </label>
          
          {/* Custom content type selector */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                border: '1px solid #ccc', 
                padding: '8px 12px', 
                borderRadius: '4px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                minHeight: '38px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
              onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
            >
              {filter.contentTypes.length === 0 ? (
                <span style={{ color: '#888' }}>Select content types</span>
              ) : (
                filter.contentTypes.map(contentType => (
                  <div 
                    key={contentType}
                    style={{
                      backgroundColor: 'rgba(56, 128, 255, 0.1)',
                      border: '1px solid rgba(56, 128, 255, 0.3)',
                      color: '#3880FF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  </div>
                ))
              )}
            </div>
            
            {showContentTypeDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {contentTypeOptions.map(option => (
                  <div
                    key={option.value}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      backgroundColor: filter.contentTypes.includes(option.value) ? 'rgba(56, 128, 255, 0.1)' : undefined,
                      transition: 'background-color 0.2s'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContentTypeToggle(option.value);
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={filter.contentTypes.includes(option.value)}
                      onChange={() => {}}
                      style={{
                        width: '16px',
                        height: '16px'
                      }}
                    />
                    <span>{option.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformFilter; 