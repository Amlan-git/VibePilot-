import React from 'react';
import { Card, CardHeader, CardTitle, CardBody, CardActions } from '@progress/kendo-react-layout';
import { Avatar } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';

// Mock user data
const mockUserData = {
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "Account Administrator",
  memberSince: "January 2023",
  avatar: null // placeholder for real avatar
};

const UserProfile: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
    }}>
      <Card style={{ 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid var(--border-color)'
      }}>
        <CardHeader style={{ 
          background: 'linear-gradient(to right, #3880FF, #4B55E8)',
          padding: '20px 24px',
          position: 'relative'
        }}>
          <CardTitle style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '22px',
            fontWeight: 600
          }}>
            User Profile
          </CardTitle>
        </CardHeader>

        <CardBody>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '20px 0'
          }}>
            {/* Profile header with avatar and name */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '20px',
              padding: '10px 0'
            }}>
              <Avatar type="image" size="large" style={{ 
                width: '100px',
                height: '100px',
                fontSize: '32px',
                background: 'linear-gradient(to bottom right, #3880FF, #4B55E8)',
                color: 'white'
              }}>
                {mockUserData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700,
                  margin: '0 0 8px 0',
                  color: 'var(--text-primary)'
                }}>
                  {mockUserData.name}
                </h2>
                <p style={{ 
                  fontSize: '16px',
                  margin: 0,
                  color: 'var(--text-secondary)'
                }}>
                  {mockUserData.email}
                </p>
              </div>
            </div>

            {/* User details section */}
            <div style={{ 
              padding: '20px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600,
                margin: '0 0 16px 0',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="k-icon k-i-user"></span>
                Account Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <InfoItem label="Role" value={mockUserData.role} />
                <InfoItem label="Member Since" value={mockUserData.memberSince} />
              </div>
            </div>

            {/* Account preferences section */}
            <div style={{ 
              padding: '20px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600,
                margin: '0 0 16px 0',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="k-icon k-i-gear"></span>
                Account Preferences
              </h3>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>Email Notifications</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Receive email updates about your account</div>
                  </div>
                  <Button themeColor="primary" rounded="full">
                    Manage
                  </Button>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>Password</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Change your account password</div>
                  </div>
                  <Button themeColor="primary" rounded="full">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        <CardActions style={{ 
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button themeColor="primary" fillMode="solid" rounded="medium">
            Edit Profile
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

// Helper component for displaying info fields
interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div style={{ padding: '8px 0' }}>
    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{ fontSize: '16px', fontWeight: 500 }}>
      {value}
    </div>
  </div>
);

export default UserProfile; 