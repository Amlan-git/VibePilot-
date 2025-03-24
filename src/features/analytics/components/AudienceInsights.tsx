import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle,
  CardActions
} from '@progress/kendo-react-layout';
import { 
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartTooltip,
  ChartValueAxis,
  ChartValueAxisItem
} from '@progress/kendo-react-charts';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { AudienceDemographic } from '../types';
import { PLATFORM_COLORS } from '../../../services/mockAnalyticsService';
import 'hammerjs';

interface AudienceInsightsProps {
  audienceDemographics: AudienceDemographic[];
  isLoading?: boolean;
}

const AudienceInsights: React.FC<AudienceInsightsProps> = ({
  audienceDemographics,
  isLoading = false
}) => {
  // State for selected platform
  const [selectedPlatformIndex, setSelectedPlatformIndex] = useState<number>(0);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  
  // If no data, show placeholder
  if (audienceDemographics.length === 0) {
    return (
      <Card style={{ 
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '24px'
      }}>
        <CardHeader style={{ 
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 20px',
          background: 'var(--bg-secondary)'
        }}>
          <CardTitle style={{ fontSize: '18px', fontWeight: 600 }}>
            Audience Insights
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div>No audience data available</div>
        </CardBody>
      </Card>
    );
  }
  
  // Get the selected platform data
  const selectedPlatform = audienceDemographics[selectedPlatformIndex];
  
  // Platform options for dropdown
  const platformOptions = audienceDemographics.map(demo => ({
    text: demo.platformType.charAt(0).toUpperCase() + demo.platformType.slice(1),
    value: demo.platformType
  }));
  
  return (
    <Card style={{ 
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '24px'
    }}>
      <CardHeader style={{ 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <CardTitle style={{ fontSize: '18px', fontWeight: 600 }}>
          Audience Insights
        </CardTitle>
        <CardActions>
          <DropDownList
            data={platformOptions}
            textField="text"
            dataItemKey="value"
            value={platformOptions[selectedPlatformIndex]}
            onChange={(e) => {
              const newIndex = audienceDemographics.findIndex(
                demo => demo.platformType === e.value.value
              );
              if (newIndex !== -1) {
                setSelectedPlatformIndex(newIndex);
              }
            }}
            style={{ width: '150px' }}
          />
        </CardActions>
      </CardHeader>
      <CardBody style={{ padding: '20px' }}>
        {isLoading ? (
          <div>Loading audience data...</div>
        ) : (
          <TabStrip
            selected={activeTabIndex}
            onSelect={(e) => setActiveTabIndex(e.selected)}
            animation={false}
          >
            <TabStripTab title="Age & Gender">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '24px', 
                marginTop: '20px' 
              }}>
                {/* Age distribution chart */}
                <Card style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>Age Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <Chart style={{ height: '100%' }}>
                      <ChartLegend visible={false} />
                      <ChartSeries>
                        <ChartSeriesItem
                          type="column"
                          data={selectedPlatform.ageGroups.map(group => group.percentage)}
                          color={PLATFORM_COLORS[selectedPlatform.platformType]}
                          labels={{
                            visible: true,
                            content: (e) => `${e.value}%`
                          }}
                        />
                      </ChartSeries>
                      <ChartCategoryAxis>
                        <ChartCategoryAxisItem
                          categories={selectedPlatform.ageGroups.map(group => group.label)}
                        />
                      </ChartCategoryAxis>
                      <ChartValueAxis>
                        <ChartValueAxisItem
                          min={0}
                          max={100}
                          labels={{
                            format: '{0}%'
                          }}
                        />
                      </ChartValueAxis>
                    </Chart>
                  </div>
                </Card>
                
                {/* Gender distribution chart */}
                <Card style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>Gender Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <Chart style={{ height: '100%' }}>
                      <ChartLegend position="bottom" />
                      <ChartSeries>
                        <ChartSeriesItem
                          type="pie"
                          data={selectedPlatform.genderDistribution.map(gender => ({
                            category: gender.label,
                            value: gender.percentage
                          }))}
                          field="value"
                          categoryField="category"
                          labels={{
                            visible: true,
                            content: (e) => `${e.value}%`
                          }}
                        />
                      </ChartSeries>
                    </Chart>
                  </div>
                </Card>
              </div>
            </TabStripTab>
            
            <TabStripTab title="Locations">
              <div style={{ marginTop: '20px' }}>
                <Card style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>Top Locations</h3>
                  <div style={{ height: '300px', overflow: 'auto' }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '12px' 
                    }}>
                      {selectedPlatform.topLocations.map((location, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ 
                            fontWeight: 500,
                            fontSize: '14px',
                            maxWidth: '60%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {location.location}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '16px',
                            width: '40%'
                          }}>
                            <div style={{ 
                              flex: 1,
                              height: '8px',
                              background: '#f1f5f9',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                height: '100%',
                                width: `${location.percentage}%`,
                                background: PLATFORM_COLORS[selectedPlatform.platformType],
                                borderRadius: '4px'
                              }} />
                            </div>
                            <div style={{ 
                              width: '40px',
                              textAlign: 'right',
                              fontSize: '14px',
                              fontWeight: 600
                            }}>
                              {location.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabStripTab>
            
            <TabStripTab title="Interests">
              <div style={{ marginTop: '20px' }}>
                <Card style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>Top Interests</h3>
                  <div style={{ height: '300px' }}>
                    <Chart style={{ height: '100%' }}>
                      <ChartSeries>
                        <ChartSeriesItem
                          type="bar"
                          data={selectedPlatform.interests.map(interest => interest.percentage)}
                          color={PLATFORM_COLORS[selectedPlatform.platformType]}
                          labels={{
                            visible: true,
                            content: (e) => `${e.value}%`
                          }}
                        />
                      </ChartSeries>
                      <ChartCategoryAxis>
                        <ChartCategoryAxisItem
                          categories={selectedPlatform.interests.map(interest => interest.interest)}
                        />
                      </ChartCategoryAxis>
                      <ChartValueAxis>
                        <ChartValueAxisItem
                          min={0}
                          max={100}
                          labels={{
                            format: '{0}%'
                          }}
                        />
                      </ChartValueAxis>
                    </Chart>
                  </div>
                </Card>
              </div>
            </TabStripTab>
          </TabStrip>
        )}
      </CardBody>
    </Card>
  );
};

export default AudienceInsights; 