import { useState } from 'react';
import { Grid, GridColumn, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { DropDownButton, DropDownButtonItem } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import { Icon } from '@progress/kendo-react-common';
import { Post, Platform, PostStatus } from '../../../types/posts';
import { usePlatforms } from '../../../hooks/usePlatforms';

interface PostGridProps {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onDuplicatePost: (id: string) => void;
}

const PostGrid: React.FC<PostGridProps> = ({
  posts,
  total,
  page,
  pageSize,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onEditPost,
  onDeletePost,
  onDuplicatePost,
}) => {
  const { getPlatformIcon, getPlatformColor } = usePlatforms();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sort, setSort] = useState<Array<SortDescriptor>>([
    { field: 'scheduledDate', dir: 'desc' },
  ]);

  // Handle grid page change
  const handlePageChange = (event: any) => {
    onPageChange(event.page.skip / event.page.take + 1);
  };

  // Handle row selection change
  const handleSelectionChange = (event: GridSelectionChangeEvent) => {
    const { dataItem } = event.selectedRows[0] || { dataItem: null };
    setSelectedPost(dataItem);
  };

  // Handle sort change
  const handleSortChange = (event: any) => {
    setSort(event.sort);
  };

  // Handle actions dropdown selection
  const handleActionSelect = (event: any, post: Post) => {
    const { itemIndex } = event || {};

    switch (itemIndex) {
      case 0: // Edit
        onEditPost(post);
        break;
      case 1: // Duplicate
        onDuplicatePost(post.id);
        break;
      case 2: // Delete
        setSelectedPost(post);
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (selectedPost) {
      onDeletePost(selectedPost.id);
      setShowDeleteDialog(false);
      setSelectedPost(null);
    }
  };

  // Handle closing delete dialog
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedPost(null);
  };

  // Status cell with appropriate badge color
  const StatusCell = (props: any) => {
    const status: PostStatus = props.dataItem.status;
    let color: string;

    switch (status) {
      case 'draft':
        color = 'info';
        break;
      case 'scheduled':
        color = 'warning';
        break;
      case 'published':
        color = 'success';
        break;
      case 'failed':
        color = 'error';
        break;
      default:
        color = 'default';
    }

    return (
      <td>
        <Badge themeColor={color as any}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </td>
    );
  };

  // Platforms cell with icons
  const PlatformCell = (props: any) => {
    const platforms: Platform[] = props.dataItem.platforms;

    return (
      <td>
        <div className="flex gap-1">
          {platforms.map((platform) => (
            <Tooltip key={platform} title={platform} position="top">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ backgroundColor: getPlatformColor(platform) + '20', color: getPlatformColor(platform) }}
              >
                <Icon name={getPlatformIcon(platform)} size="medium" />
              </span>
            </Tooltip>
          ))}
        </div>
      </td>
    );
  };

  // Actions cell with dropdown
  const ActionsCell = (props: any) => {
    const post: Post = props.dataItem;

    return (
      <td>
        <DropDownButton
          text="Actions"
          onItemClick={(e) => handleActionSelect(e, post)}
          icon="more-vertical"
        >
          <DropDownButtonItem text="Edit" icon="edit" />
          <DropDownButtonItem text="Duplicate" icon="copy" />
          <DropDownButtonItem text="Delete" icon="trash" />
        </DropDownButton>
      </td>
    );
  };

  // Format date cell
  const DateCell = (props: any) => {
    const date = new Date(props.dataItem[props.field]);
    return (
      <td>
        {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
    );
  };

  // Format analytics cell
  const AnalyticsCell = (props: any) => {
    const analytics = props.dataItem.analytics;
    
    if (!analytics) {
      return <td>-</td>;
    }

    return (
      <td>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{analytics.engagementRate.toFixed(1)}% Engagement</span>
          <span className="text-xs text-gray-500">
            {analytics.likes} likes • {analytics.comments} comments
          </span>
        </div>
      </td>
    );
  };

  // Apply sorting to data
  const sortedData = sort.length > 0 ? orderBy(posts, sort) : posts;

  return (
    <>
      <Grid
        data={sortedData}
        sortable={{ allowUnsort: true, mode: 'multiple' }}
        sort={sort}
        onSortChange={handleSortChange}
        selectedField="selected"
        onSelectionChange={handleSelectionChange}
        pageable={{
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: [10, 20, 50],
          previousNext: true,
        }}
        total={total}
        skip={(page - 1) * pageSize}
        take={pageSize}
        onPageChange={handlePageChange}
        style={{ height: 'auto' }}
      >
        <GridColumn field="title" title="Title" />
        <GridColumn field="platforms" title="Platforms" cell={PlatformCell} />
        <GridColumn field="scheduledDate" title="Scheduled Date" cell={DateCell} />
        <GridColumn field="status" title="Status" cell={StatusCell} />
        <GridColumn field="analytics" title="Performance" cell={AnalyticsCell} />
        <GridColumn field="actions" title="Actions" cell={ActionsCell} width="120px" />
      </Grid>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog title="Confirm Delete" onClose={handleDeleteCancel}>
          <p>
            Are you sure you want to delete the post "{selectedPost?.title}"? This action cannot be
            undone.
          </p>
          <DialogActionsBar>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button themeColor="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
};

export default PostGrid; 