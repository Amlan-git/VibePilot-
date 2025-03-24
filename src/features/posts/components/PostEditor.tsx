import { useEffect, useState } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import { MultiSelect, DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from '@progress/kendo-react-upload';
import { Tabs, TabStrip } from '@progress/kendo-react-layout';
import { Chip, ChipList } from '@progress/kendo-react-buttons';
import { Label, Hint, Error } from '@progress/kendo-react-labels';
import { Loader } from '@progress/kendo-react-indicators';
import { Post, Platform, PostStatus, PostCreateRequest, PostUpdateRequest, Media } from '../../../types/posts';
import { usePlatforms } from '../../../hooks/usePlatforms';

interface PostEditorProps {
  isOpen: boolean;
  post?: Post | null;
  onClose: () => void;
  onSave: (post: PostCreateRequest | PostUpdateRequest) => void;
}

// Form validation
const validateTitle = (value: string) => {
  if (!value) {
    return 'Title is required';
  }
  if (value.length > 100) {
    return 'Title must be less than 100 characters';
  }
  return '';
};

const validateContent = (value: string) => {
  if (!value) {
    return 'Content is required';
  }
  return '';
};

const validatePlatforms = (value: Platform[]) => {
  if (!value || value.length === 0) {
    return 'At least one platform is required';
  }
  return '';
};

const validateScheduleDate = (value: Date) => {
  if (!value) {
    return 'Schedule date is required';
  }
  if (value < new Date()) {
    return 'Schedule date must be in the future';
  }
  return '';
};

const PostEditor: React.FC<PostEditorProps> = ({ isOpen, post, onClose, onSave }) => {
  const { platforms, getPlatformIcon, getPlatformColor } = usePlatforms();
  const [formData, setFormData] = useState<PostCreateRequest | PostUpdateRequest>({
    title: '',
    content: '',
    platforms: [],
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'draft',
    tags: [],
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Media[]>([]);
  
  // Platform options
  const platformOptions = [
    { text: 'Twitter', value: 'twitter' },
    { text: 'Instagram', value: 'instagram' },
    { text: 'Facebook', value: 'facebook' },
    { text: 'LinkedIn', value: 'linkedin' },
    { text: 'TikTok', value: 'tiktok' },
    { text: 'Pinterest', value: 'pinterest' },
  ];
  
  // Status options
  const statusOptions = [
    { text: 'Draft', value: 'draft' },
    { text: 'Scheduled', value: 'scheduled' },
  ];

  // Initialize form with post data when editing
  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title,
        content: post.content,
        platforms: post.platforms,
        scheduledDate: post.scheduledDate,
        status: post.status === 'published' || post.status === 'failed' ? 'draft' : post.status,
        tags: post.tags,
      });
      setUploadedFiles(post.media || []);
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        platforms: [],
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'draft',
        tags: [],
      });
      setUploadedFiles([]);
    }
  }, [post]);

  // Handle tab change
  const handleTabChange = (e: any) => {
    setActiveTab(e.selected);
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Convert form data
    const postData: PostCreateRequest | PostUpdateRequest = {
      ...data,
      scheduledDate: new Date(data.scheduledDate).toISOString(),
      media: uploadedFiles,
    };

    // Add id if editing
    if (post) {
      postData.id = post.id;
    }

    onSave(postData);
  };

  // Handle file upload
  const handleUpload = (e: any) => {
    const files = e.newState.filter((f: any) => !f.validationErrors);
    
    if (files.length > 0) {
      setUploading(true);
      
      // Simulate file upload (in real app, would upload to server/S3)
      setTimeout(() => {
        const newMedia = files.map((file: any, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          type: file.extension.startsWith('video') ? 'video' : 'image',
          url: URL.createObjectURL(file.getRawFile()),
          alt: file.name,
        }));
        
        setUploadedFiles((prev) => [...prev, ...newMedia]);
        setUploading(false);
      }, 1000);
    }
  };

  // Handle media delete
  const handleMediaDelete = (id: string) => {
    setUploadedFiles((prev) => prev.filter((media) => media.id !== id));
  };

  // Handle tag input
  const [tagInput, setTagInput] = useState('');
  
  const handleTagInputChange = (e: any) => {
    setTagInput(e.target.value);
  };

  const handleTagAdd = (e: any) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Content character limits by platform
  const getContentLimit = (): number => {
    if (formData.platforms.includes('twitter')) {
      return 280;
    }
    return 2200; // Instagram caption limit
  };

  return (
    <Dialog
      title={post ? 'Edit Post' : 'Create New Post'}
      onClose={onClose}
      width={800}
    >
      <TabStrip
        selected={activeTab}
        onSelect={handleTabChange}
        animation={false}
      >
        <Tabs.Item title="Create" disabled={false}>
          <Form
            initialValues={formData}
            onSubmit={handleSubmit}
            render={(formRenderProps) => (
              <FormElement style={{ maxWidth: 750 }}>
                <div className="mb-4">
                  <Field
                    id="title"
                    name="title"
                    label="Post Title"
                    component={Input}
                    validator={validateTitle}
                  />
                </div>

                <div className="mb-4">
                  <FieldWrapper>
                    <Label>Platforms</Label>
                    <Field
                      id="platforms"
                      name="platforms"
                      component={MultiSelect}
                      data={platformOptions}
                      textField="text"
                      dataItemKey="value"
                      validator={validatePlatforms}
                    />
                  </FieldWrapper>
                </div>

                <div className="mb-4">
                  <FieldWrapper>
                    <div className="flex justify-between">
                      <Label>Content</Label>
                      {formData.content && (
                        <Hint>
                          {formData.content.length} / {getContentLimit()}
                        </Hint>
                      )}
                    </div>
                    <Field
                      id="content"
                      name="content"
                      component={TextArea}
                      style={{ minHeight: 120 }}
                      validator={validateContent}
                    />
                  </FieldWrapper>
                </div>

                <div className="mb-4">
                  <FieldWrapper>
                    <Label>Media</Label>
                    <Upload
                      batch={false}
                      multiple={true}
                      autoUpload={false}
                      restrictions={{
                        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.mp4'],
                        maxFileSize: 10485760, // 10MB
                      }}
                      onStatusChange={handleUpload}
                    />
                    {uploading && <Loader size="medium" />}
                    {uploadedFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {uploadedFiles.map((media) => (
                          <div
                            key={media.id}
                            className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={media.alt}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                            <Button
                              icon="x"
                              themeColor="error"
                              fillMode="flat"
                              size="small"
                              className="absolute top-1 right-1"
                              onClick={() => handleMediaDelete(media.id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldWrapper>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <Field
                      id="scheduledDate"
                      name="scheduledDate"
                      label="Schedule Date"
                      component={DateTimePicker}
                      format="yyyy-MM-dd HH:mm"
                      min={new Date()}
                      validator={validateScheduleDate}
                    />
                  </div>

                  <div className="mb-4">
                    <Field
                      id="status"
                      name="status"
                      label="Status"
                      component={DropDownList}
                      data={statusOptions}
                      textField="text"
                      dataItemKey="value"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <FieldWrapper>
                    <Label>Tags</Label>
                    <div className="flex mb-2">
                      <Input
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagAdd}
                        placeholder="Add tag and press Enter"
                        className="flex-1"
                      />
                    </div>
                    {formData.tags.length > 0 && (
                      <ChipList>
                        {formData.tags.map((tag) => (
                          <Chip
                            key={tag}
                            text={tag}
                            removable={true}
                            onRemove={() => handleTagRemove(tag)}
                          />
                        ))}
                      </ChipList>
                    )}
                  </FieldWrapper>
                </div>

                <DialogActionsBar>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    themeColor="primary"
                    disabled={!formRenderProps.allowSubmit}
                  >
                    {post ? 'Update Post' : 'Create Post'}
                  </Button>
                </DialogActionsBar>
              </FormElement>
            )}
          />
        </Tabs.Item>
        <Tabs.Item title="Preview" disabled={false}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Preview how your post will appear</h3>
            
            {formData.platforms.length === 0 ? (
              <p className="text-gray-500">Select platforms to see previews</p>
            ) : (
              <div className="space-y-6">
                {formData.platforms.map((platform) => (
                  <div key={platform} className="border rounded-lg overflow-hidden">
                    <div
                      className="p-3 flex items-center gap-2"
                      style={{ backgroundColor: getPlatformColor(platform) + '20' }}
                    >
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ backgroundColor: getPlatformColor(platform), color: 'white' }}
                      >
                        <span className="k-icon k-i-{getPlatformIcon(platform)}"></span>
                      </span>
                      <span className="font-medium">{platform.charAt(0).toUpperCase() + platform.slice(1)} Preview</span>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex gap-2 items-center mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="font-bold">Account Name</div>
                          <div className="text-gray-500 text-sm">@username</div>
                        </div>
                      </div>
                      <div className="mb-3">{formData.content}</div>
                      {uploadedFiles.length > 0 && (
                        <div 
                          className={`grid ${
                            uploadedFiles.length === 1 
                              ? 'grid-cols-1' 
                              : 'grid-cols-2'
                          } gap-2 mb-2`}
                        >
                          {uploadedFiles.slice(0, 4).map((media, index) => (
                            <div
                              key={media.id}
                              className={`bg-gray-100 rounded-lg overflow-hidden ${
                                uploadedFiles.length === 3 && index === 0
                                  ? 'col-span-2'
                                  : ''
                              }`}
                              style={{ height: '200px' }}
                            >
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={media.alt}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                          {uploadedFiles.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold">
                              +{uploadedFiles.length - 4} more
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-gray-500 text-sm">
                        {new Date(
                          formData.scheduledDate
                        ).toLocaleDateString()} at{' '}
                        {new Date(formData.scheduledDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs.Item>
      </TabStrip>
    </Dialog>
  );
};

export default PostEditor; 