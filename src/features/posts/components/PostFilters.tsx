import { ChangeEvent, FormEvent, useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';
import { Chip, ChipList } from '@progress/kendo-react-buttons';
import { PostFilter, PostStatus } from '../../../types/posts';
import { Platform } from '../../../types/platforms';
import { usePlatforms } from '../../../hooks/usePlatforms';

interface PostFiltersProps {
  filters: PostFilter;
  onFilterChange: (filters: PostFilter) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({ filters, onFilterChange }) => {
  const { platforms } = usePlatforms();
  const [localFilters, setLocalFilters] = useState<PostFilter>(filters);
  
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
    { text: 'Published', value: 'published' },
    { text: 'Failed', value: 'failed' },
  ];

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  // Handle platform selection change
  const handlePlatformChange = (e: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      platforms: e.target.value as Platform[],
    }));
  };

  // Handle status selection change
  const handleStatusChange = (e: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      status: e.target.value as PostStatus[],
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (e: any) => {
    if (e.value.start && e.value.end) {
      setLocalFilters((prev) => ({
        ...prev,
        dateRange: {
          start: e.value.start.toISOString(),
          end: e.value.end.toISOString(),
        },
      }));
    } else {
      // Clear date range if null
      setLocalFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.dateRange;
        return newFilters;
      });
    }
  };

  // Handle filter form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // Handle remove chip (for applied filters)
  const handleRemoveChip = (key: string) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key as keyof PostFilter];
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Helper to determine applied filter count
  const getAppliedFilterCount = (): number => {
    const { search, platforms, status, dateRange, tags } = localFilters;
    let count = 0;
    if (search) count++;
    if (platforms && platforms.length > 0) count++;
    if (status && status.length > 0) count++;
    if (dateRange) count++;
    if (tags && tags.length > 0) count++;
    return count;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Search input */}
          <div className="col-span-12 sm:col-span-4">
            <Input
              placeholder="Search posts..."
              value={localFilters.search || ''}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Platform filter */}
          <div className="col-span-12 sm:col-span-4">
            <MultiSelect
              data={platformOptions}
              value={localFilters.platforms || []}
              onChange={handlePlatformChange}
              placeholder="Select platforms"
              textField="text"
              dataItemKey="value"
              className="w-full"
            />
          </div>

          {/* Status filter */}
          <div className="col-span-12 sm:col-span-4">
            <MultiSelect
              data={statusOptions}
              value={localFilters.status || []}
              onChange={handleStatusChange}
              placeholder="Select status"
              textField="text"
              dataItemKey="value"
              className="w-full"
            />
          </div>

          {/* Date range filter */}
          <div className="col-span-12 sm:col-span-8">
            <DateRangePicker
              value={
                localFilters.dateRange
                  ? {
                      start: new Date(localFilters.dateRange.start),
                      end: new Date(localFilters.dateRange.end),
                    }
                  : undefined
              }
              onChange={handleDateRangeChange}
              placeholder="Select date range"
              className="w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="col-span-12 sm:col-span-4 flex justify-end items-center space-x-2">
            <Button
              type="button"
              onClick={handleClearFilters}
              disabled={getAppliedFilterCount() === 0}
              className="k-button k-button-md k-rounded-md k-button-flat k-button-flat-base"
            >
              Clear
            </Button>
            <Button
              type="submit"
              themeColor="primary"
              className="k-button k-button-md k-rounded-md"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </form>

      {/* Applied filters chips */}
      {getAppliedFilterCount() > 0 && (
        <div className="mt-4">
          <ChipList>
            {localFilters.search && (
              <Chip
                text={`Search: ${localFilters.search}`}
                removable={true}
                onRemove={() => handleRemoveChip('search')}
              />
            )}
            {localFilters.platforms && localFilters.platforms.length > 0 && (
              <Chip
                text={`Platforms: ${localFilters.platforms.length}`}
                removable={true}
                onRemove={() => handleRemoveChip('platforms')}
              />
            )}
            {localFilters.status && localFilters.status.length > 0 && (
              <Chip
                text={`Status: ${localFilters.status.length}`}
                removable={true}
                onRemove={() => handleRemoveChip('status')}
              />
            )}
            {localFilters.dateRange && (
              <Chip
                text="Date Range"
                removable={true}
                onRemove={() => handleRemoveChip('dateRange')}
              />
            )}
          </ChipList>
        </div>
      )}
    </div>
  );
};

export default PostFilters; 