import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogActionsBar
} from '@progress/kendo-react-dialogs';
import {
  Form,
  Field,
  FormElement,
  FieldWrapper
} from '@progress/kendo-react-form';
import {
  Input,
  TextArea,
  Checkbox
} from '@progress/kendo-react-inputs';
import {
  DateTimePicker
} from '@progress/kendo-react-dateinputs';
import {
  MultiSelect,
  DropDownList
} from '@progress/kendo-react-dropdowns';
import { CalendarEvent } from '../../types/calendar';
import { PostUpdateRequest, PostCreateRequest } from '../../types/posts';
import { usePlatforms } from '../../hooks/usePlatforms';
import { useCalendar } from '../../hooks/useCalendar';
import './ScheduleEditor.css';
import { Button } from '@progress/kendo-react-buttons';

interface ScheduleEditorProps {
  event: CalendarEvent;
  onSave: (postData: PostCreateRequest | PostUpdateRequest) => void;
  onClose: () => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  event,
  onSave,
  onClose
}) => {
  const isNewEvent = !event.postId;
  const { platforms } = usePlatforms();
  const { findBestTimeToPost } = useCalendar();

  // Form state
  const [formData, setFormData] = useState({
    id: event.postId || '',
    title: event.title || '',
    content: event.post?.content || '',
    scheduledDate: event.start || new Date(),
    scheduledEndDate: event.end || new Date(new Date().setHours(new Date().getHours() + 1)),
    platforms: event.platforms || [],
    status: event.status || 'draft',
    isAllDay: event.isAllDay || false,
    tags: event.post?.tags || []
  });

  // Status options
  const statusOptions = [
    { text: 'Draft', value: 'draft' },
    { text: 'Scheduled', value: 'scheduled' }
  ];

  // Tags options (example)
  const tagOptions = [
    { text: 'Announcement', value: 'announcement' },
    { text: 'Promotion', value: 'promotion' },
    { text: 'Content', value: 'content' },
    { text: 'News', value: 'news' },
    { text: 'Product', value: 'product' }
  ];

  // Form validation
  const validateForm = (formValue: any) => {
    const errors: Record<string, string> = {};

    if (!formValue.title) {
      errors.title = 'Title is required';
    }

    if (!formValue.content) {
      errors.content = 'Content is required';
    }

    if (!formValue.scheduledDate) {
      errors.scheduledDate = 'Schedule date is required';
    }

    if (formValue.platforms.length === 0) {
      errors.platforms = 'At least one platform is required';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (dataItem: any) => {
    const postData: PostCreateRequest | PostUpdateRequest = {
      id: formData.id,
      title: dataItem.title,
      content: dataItem.content,
      scheduledDate: dataItem.scheduledDate.toISOString(),
      platforms: dataItem.platforms,
      status: dataItem.status,
      tags: dataItem.tags
    };

    onSave(postData);
  };

  // Handle form change
  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Find best time recommendations
  const handleFindBestTime = (platformId: string) => {
    // Get current day of the week (0 = Sunday, 1 = Monday, etc.)
    const currentDayOfWeek = new Date().getDay();
    const bestTime = findBestTimeToPost(platformId, currentDayOfWeek);
    
    if (bestTime) {
      // Create a date with today's date and best time
      const bestDate = new Date();
      const [hours, minutes] = bestTime.timeOfDay.split(':').map(Number);
      bestDate.setHours(hours, minutes, 0, 0);
      
      // If best time is earlier than current time, schedule for next week
      if (bestDate < new Date()) {
        bestDate.setDate(bestDate.getDate() + 7);
      }
      
      setFormData({
        ...formData,
        scheduledDate: bestDate,
        scheduledEndDate: new Date(bestDate.getTime() + 30 * 60000) // 30 minutes later
      });
    }
  };

  return (
    <Dialog title={isNewEvent ? 'Create Post' : 'Edit Post'} onClose={onClose} width={700}>
      <Form
        initialValues={formData}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: '650px' }}>
            <fieldset className="k-form-fieldset">
              <div className="form-row">
                <Field
                  id="title"
                  name="title"
                  label="Title"
                  component={Input}
                  validator={(value) => (!value ? 'Title is required' : '')}
                  onChange={(e) => handleFormChange('title', e.value)}
                />
              </div>

              <div className="form-row">
                <Field
                  id="content"
                  name="content"
                  label="Content"
                  component={TextArea}
                  validator={(value) => (!value ? 'Content is required' : '')}
                  onChange={(e) => handleFormChange('content', e.value)}
                />
              </div>

              <div className="form-row form-row-multi">
                <div className="form-column">
                  <Field
                    id="scheduledDate"
                    name="scheduledDate"
                    label="Schedule Date & Time"
                    component={DateTimePicker}
                    validator={(value) => (!value ? 'Schedule date is required' : '')}
                    onChange={(e) => handleFormChange('scheduledDate', e.value)}
                    format="MMMM dd, yyyy HH:mm"
                    min={new Date()}
                  />
                </div>
                <div className="form-column">
                  <Field
                    id="isAllDay"
                    name="isAllDay"
                    label="All Day Event"
                    component={Checkbox}
                    onChange={(e) => handleFormChange('isAllDay', e.value)}
                  />
                </div>
              </div>

              <div className="form-row form-row-multi">
                <div className="form-column">
                  <Field
                    id="platforms"
                    name="platforms"
                    label="Platforms"
                    component={(fieldProps) => (
                      <FieldWrapper>
                        <label className="k-label">{fieldProps.label}</label>
                        <div className="platform-selection">
                          <MultiSelect
                            {...fieldProps.input}
                            data={platforms}
                            textField="name"
                            valueField="id"
                            onChange={(e) => handleFormChange('platforms', e.value)}
                            placeholder="Select platforms"
                            clearButton
                          />
                          {formData.platforms.length === 1 && (
                            <Button 
                              look="flat" 
                              icon="clock" 
                              onClick={() => handleFindBestTime(formData.platforms[0])}
                              title="Find best time to post"
                            >
                              Best Time
                            </Button>
                          )}
                        </div>
                        {fieldProps.meta.touched && fieldProps.meta.error && (
                          <div className="k-form-error">{fieldProps.meta.error}</div>
                        )}
                      </FieldWrapper>
                    )}
                    validator={(value) => (!value || value.length === 0 ? 'At least one platform is required' : '')}
                  />
                </div>
              </div>

              <div className="form-row form-row-multi">
                <div className="form-column">
                  <Field
                    id="status"
                    name="status"
                    label="Status"
                    component={(fieldProps) => (
                      <FieldWrapper>
                        <label className="k-label">{fieldProps.label}</label>
                        <DropDownList
                          {...fieldProps.input}
                          data={statusOptions}
                          textField="text"
                          valueField="value"
                          onChange={(e) => handleFormChange('status', e.value)}
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>

                <div className="form-column">
                  <Field
                    id="tags"
                    name="tags"
                    label="Tags"
                    component={(fieldProps) => (
                      <FieldWrapper>
                        <label className="k-label">{fieldProps.label}</label>
                        <MultiSelect
                          {...fieldProps.input}
                          data={tagOptions}
                          textField="text"
                          valueField="value"
                          onChange={(e) => handleFormChange('tags', e.value)}
                          placeholder="Select tags"
                          clearButton
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>
              </div>
            </fieldset>

            <DialogActionsBar>
              <Button onClick={onClose} look="flat">Cancel</Button>
              <Button
                type="submit"
                themeColor="primary"
                disabled={!formRenderProps.allowSubmit}
                onClick={formRenderProps.onSubmit}
              >
                {isNewEvent ? 'Create' : 'Update'}
              </Button>
            </DialogActionsBar>
          </FormElement>
        )}
      />
    </Dialog>
  );
}; 