import React from 'react';
import { 
  MultiSelect, 
  MultiSelectChangeEvent 
} from '@progress/kendo-react-dropdowns';
import { Chip } from '@progress/kendo-react-buttons';
import { AnalyticsFilter, ContentType } from '../types';
import { PLATFORM_TYPES } from '../../../types/platforms';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';

interface PlatformFilterProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
}

const PlatformFilter: React.FC<PlatformFilterProps> = ({ filter, onFilterChange }) => {
  // Platform options
  const platformOptions = Object.values(PLATFORM_TYPES).map(platformType => ({
    value: platformType,
    text: platformType.charAt(0).toUpperCase() + platformType.slice(1),
    color: PLATFORM_COLORS[platformType]
  }));

  // Content type options
  const contentTypeOptions = Object.values(ContentType).map(contentType => ({
    value: contentType,
    text: contentType.charAt(0).toUpperCase() + contentType.slice(1)
  }));

  const handlePlatformChange = (e: MultiSelectChangeEvent) => {
    const selectedPlatforms = e.value || [];
    onFilterChange({
      ...filter,
      platforms: selectedPlatforms.map(item => item.value)
    });
  };

  const handleContentTypeChange = (e: MultiSelectChangeEvent) => {
    const selectedContentTypes = e.value || [];
    onFilterChange({
      ...filter,
      contentTypes: selectedContentTypes.map(item => item.value)
    });
  };

  // Map selected values to dropdown data items
  const selectedPlatforms = platformOptions.filter(p => filter.platforms.includes(p.value));
  const selectedContentTypes = contentTypeOptions.filter(c => filter.contentTypes.includes(c.value));

  // Customized item rendering for platforms with color indicators
  const platformItemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: any) => {
    const itemChildren = (
      <span>
        <span 
          style={{ 
            display: 'inline-block', 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            backgroundColor: itemProps.dataItem.color,
            marginRight: '8px'
          }}
        />
        {itemProps.dataItem.text}
      </span>
    );

    return React.cloneElement(li, li.props, itemChildren);
  };

  // Customized rendering of the values in the multiselect input
  const platformTagRender = (tagData: any) => {
    const platform = platformOptions.find(p => p.value === tagData.value);
    
    return (
      <Chip
        text={platform?.text}
        style={{
          backgroundColor: `${platform?.color}20`,
          borderColor: platform?.color,
          color: platform?.color
        }}
      />
    );
  };

  return (
    <div className="platform-filter" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 600,
          fontSize: '14px' 
        }}>
          Platforms
        </label>
        <MultiSelect
          data={platformOptions}
          textField="text"
          dataItemKey="value"
          value={selectedPlatforms}
          onChange={handlePlatformChange}
          itemRender={platformItemRender}
          tagRender={platformTagRender}
          placeholder="Select platforms"
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 600,
          fontSize: '14px' 
        }}>
          Content Types
        </label>
        <MultiSelect
          data={contentTypeOptions}
          textField="text"
          dataItemKey="value"
          value={selectedContentTypes}
          onChange={handleContentTypeChange}
          placeholder="Select content types"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default PlatformFilter; 