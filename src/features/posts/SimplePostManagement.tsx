import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';

// Types
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  platform: string;
  scheduledDate: Date;
}

interface PostFormData {
  id?: string;
  title: string;
  content: string;
  status: PostStatus;
  platform: string;
  scheduledDate: Date;
}

const SimplePostManagement: React.FC = () => {
  // Sample posts data
  const [posts, setPosts] = useState<Post[]>([
    { 
      id: '1', 
      title: 'New Product Launch', 
      content: 'We are excited to announce our newest product line!', 
      status: 'draft',
      platform: 'twitter',
      scheduledDate: new Date(2023, 6, 15, 10, 0) 
    },
    { 
      id: '2', 
      title: 'Summer Sale Promotion', 
      content: 'Get up to 50% off on all summer items!', 
      status: 'scheduled',
      platform: 'facebook',
      scheduledDate: new Date(2023, 6, 20, 14, 30) 
    },
    { 
      id: '3', 
      title: 'Customer Testimonial', 
      content: 'See what our customers are saying about our services!', 
      status: 'published',
      platform: 'instagram',
      scheduledDate: new Date(2023, 6, 10, 9, 0) 
    },
  ]);

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<string | 'all'>('all');
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    status: 'draft',
    platform: 'twitter',
    scheduledDate: new Date()
  });

  // State for syncing with calendar
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Platform options
  const platforms = [
    { text: 'Twitter', value: 'twitter' },
    { text: 'Facebook', value: 'facebook' },
    { text: 'Instagram', value: 'instagram' },
    { text: 'LinkedIn', value: 'linkedin' },
    { text: 'YouTube', value: 'youtube' },
  ];

  // Status options
  const statuses = [
    { text: 'Draft', value: 'draft' },
    { text: 'Scheduled', value: 'scheduled' },
    { text: 'Published', value: 'published' },
    { text: 'Failed', value: 'failed' },
  ];

  // Filter options
  const statusOptions = [
    { text: 'All Statuses', value: 'all' },
    ...statuses
  ];

  const platformOptions = [
    { text: 'All Platforms', value: 'all' },
    ...platforms
  ];

  // Effect to simulate initial data loading
  useEffect(() => {
    // This would typically fetch posts from an API
    console.log('Posts component mounted');
  }, []);

  // Handlers
  const handleOpenCreateDialog = () => {
    setSelectedPostId(null);
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      platform: 'twitter',
      scheduledDate: new Date()
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostId(postId);
      setFormData({
        id: post.id,
        title: post.title,
        content: post.content,
        status: post.status,
        platform: post.platform,
        scheduledDate: post.scheduledDate
      });
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (postId: string) => {
    setSelectedPostId(postId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPostId(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePost = () => {
    if (formData.title.trim() === '' || formData.content.trim() === '') {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedPostId) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === selectedPostId 
          ? { ...post, ...formData, id: selectedPostId }
          : post
      ));
    } else {
      // Create new post
      const newPost = {
        ...formData,
        id: Date.now().toString()
      };
      setPosts([...posts, newPost]);
    }

    setIsDialogOpen(false);
  };

  const handleDeletePost = () => {
    if (selectedPostId) {
      setPosts(posts.filter(post => post.id !== selectedPostId));
    }
    setIsDeleteDialogOpen(false);
    setSelectedPostId(null);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Platform and status helpers
  const getPlatformName = (value: string) => {
    const platform = platforms.find(p => p.value === value);
    return platform ? platform.text : value;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return '#1da1f2';
      case 'facebook': return '#4267B2';
      case 'instagram': return '#C13584';
      case 'linkedin': return '#0077B5';
      case 'youtube': return '#FF0000';
      default: return '#888888';
    }
  };

  const getStatusStyle = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'scheduled':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'draft':
        return { backgroundColor: '#e2e3e5', color: '#383d41' };
      case 'failed':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { backgroundColor: '#e9ecef', color: '#495057' };
    }
  };

  // Sync posts with calendar
  const handleSyncWithCalendar = () => {
    setIsSyncDialogOpen(true);
  };

  const performSync = () => {
    setSyncStatus('syncing');
    
    // Simulate API call to sync posts with calendar
    setTimeout(() => {
      setSyncStatus('success');
      
      // After 1.5 seconds, close the dialog
      setTimeout(() => {
        setIsSyncDialogOpen(false);
        setSyncStatus('idle');
      }, 1500);
    }, 2000);
  };

  const handleCloseSyncDialog = () => {
    if (syncStatus !== 'syncing') {
      setIsSyncDialogOpen(false);
      setSyncStatus('idle');
    }
  };

  // Staggered animation helper
  const getDelayClass = (index: number) => {
    const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
    return delays[index % delays.length];
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="animate-slideInBottom" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem' 
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Post Management</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button className="transition-all hover-elevate" onClick={handleSyncWithCalendar}>
            Sync with Calendar
          </Button>
          <Button className="transition-all hover-elevate" themeColor="primary" onClick={handleOpenCreateDialog}>
            Create New Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-scaleIn" style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '0.25rem'
      }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ width: '200px' }}>
          <DropDownList
            data={statusOptions}
            textField="text"
            dataItemKey="value"
            value={statusOptions.find(s => s.value === statusFilter)}
            onChange={(e) => setStatusFilter(e.value.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ width: '200px' }}>
          <DropDownList
            data={platformOptions}
            textField="text"
            dataItemKey="value"
            value={platformOptions.find(p => p.value === platformFilter)}
            onChange={(e) => setPlatformFilter(e.value.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredPosts.length === 0 && (
          <div className="animate-fadeIn" style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa',
            borderRadius: '0.25rem'
          }}>
            <p>No posts found matching your criteria.</p>
          </div>
        )}

        {filteredPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`animate-slideInBottom ${getDelayClass(index)} transition-all hover-elevate`}
            style={{ 
              padding: '1rem', 
              border: '1px solid #ddd', 
              borderRadius: '0.25rem',
              backgroundColor: '#fff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {post.title}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  ...getStatusStyle(post.status)
                }}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: getPlatformColor(post.platform),
                  color: 'white'
                }}>
                  {getPlatformName(post.platform)}
                </span>
              </div>
            </div>

            <p style={{ marginBottom: '1rem' }}>{post.content}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                  Scheduled for: {post.scheduledDate.toLocaleString()}
                </span>
              </div>
              <div>
                <Button 
                  className="transition-all hover-elevate"
                  style={{ marginRight: '0.5rem' }}
                  onClick={() => handleOpenEditDialog(post.id)}
                >
                  Edit
                </Button>
                <Button 
                  className="transition-all hover-elevate"
                  themeColor="error" 
                  onClick={() => handleOpenDeleteDialog(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <Dialog title={selectedPostId ? "Edit Post" : "Create New Post"} onClose={handleCloseDialog}>
          <div className="animate-fadeIn" style={{ padding: '1rem', width: '500px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Content</label>
              <TextArea
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                rows={5}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Platform</label>
              <DropDownList
                data={platforms}
                textField="text"
                dataItemKey="value"
                value={platforms.find(p => p.value === formData.platform)}
                onChange={(e) => handleFormChange('platform', e.value.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Status</label>
              <DropDownList
                data={statuses}
                textField="text"
                dataItemKey="value"
                value={statuses.find(s => s.value === formData.status)}
                onChange={(e) => handleFormChange('status', e.value.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Scheduled Date</label>
              <DateTimePicker
                value={formData.scheduledDate}
                onChange={(e) => handleFormChange('scheduledDate', e.value)}
                format="yyyy-MM-dd HH:mm"
                width="100%"
              />
            </div>
          </div>

          <DialogActionsBar>
            <Button className="transition-all hover-elevate" onClick={handleCloseDialog}>Cancel</Button>
            <Button className="transition-all hover-elevate" themeColor="primary" onClick={handleSavePost}>Save</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <Dialog title="Confirm Delete" onClose={handleCloseDeleteDialog}>
          <div className="animate-scaleIn" style={{ padding: '1rem', width: '400px' }}>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </div>

          <DialogActionsBar>
            <Button className="transition-all hover-elevate" onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button className="transition-all hover-elevate" themeColor="error" onClick={handleDeletePost}>Delete</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Sync with Calendar Dialog */}
      {isSyncDialogOpen && (
        <Dialog title="Sync Posts with Calendar" onClose={handleCloseSyncDialog}>
          <div className="animate-fadeIn" style={{ padding: '1rem', width: '500px' }}>
            {syncStatus === 'idle' && (
              <div>
                <p>Sync your posts with the calendar to ensure all scheduled content is properly represented in your content calendar.</p>
                <p>This action will:</p>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <li>Update calendar events for all scheduled posts</li>
                  <li>Remove calendar events for deleted posts</li>
                  <li>Create new calendar events for newly scheduled posts</li>
                </ul>
              </div>
            )}
            
            {syncStatus === 'syncing' && (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div className="animate-spin" style={{ 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 1rem'
                }}>
                </div>
                <p>Synchronizing posts with calendar...</p>
              </div>
            )}
            
            {syncStatus === 'success' && (
              <div className="animate-scaleIn" style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ 
                  color: '#28a745',
                  fontSize: '2rem',
                  marginBottom: '1rem'
                }}>
                  ✓
                </div>
                <p>Posts successfully synchronized with calendar!</p>
              </div>
            )}
            
            {syncStatus === 'error' && (
              <div className="animate-scaleIn" style={{ textAlign: 'center', padding: '1rem', color: '#dc3545' }}>
                <p>There was an error synchronizing posts with calendar. Please try again.</p>
              </div>
            )}
          </div>

          <DialogActionsBar>
            {syncStatus === 'idle' && (
              <>
                <Button className="transition-all hover-elevate" onClick={handleCloseSyncDialog}>Cancel</Button>
                <Button className="transition-all hover-elevate" themeColor="primary" onClick={performSync}>Sync Now</Button>
              </>
            )}
            {syncStatus === 'success' && (
              <Button className="transition-all hover-elevate" onClick={handleCloseSyncDialog}>Close</Button>
            )}
            {syncStatus === 'error' && (
              <>
                <Button className="transition-all hover-elevate" onClick={handleCloseSyncDialog}>Cancel</Button>
                <Button className="transition-all hover-elevate" themeColor="primary" onClick={performSync}>Try Again</Button>
              </>
            )}
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
};

export default SimplePostManagement; 