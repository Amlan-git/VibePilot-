import { useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { FloatingActionButton } from '@progress/kendo-react-buttons';
import { NotificationGroup, Notification } from '@progress/kendo-react-notification';
import { usePostManagement } from '../../hooks/usePostManagement';
import PostGrid from './components/PostGrid';
import PostFilters from './components/PostFilters';
import PostEditor from './components/PostEditor';
import { Loader } from '@progress/kendo-react-indicators';

const PostManagement = () => {
  const {
    posts,
    total,
    page,
    pageSize,
    filters,
    isLoading,
    isError,
    error,
    selectedPost,
    isEditorOpen,
    notification,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    createPost,
    updatePost,
    deletePost,
    duplicatePost,
  } = usePostManagement();

  useEffect(() => {
    document.title = 'VibePilot - Post Management';
  }, []);

  return (
    <div className="py-6 px-4 md:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <Button
          themeColor="primary"
          icon="plus"
          onClick={openCreateEditor}
        >
          Create New Post
        </Button>
      </div>

      {/* Filters */}
      <PostFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <Loader size="large" type="infinite-spinner" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-4 my-4 bg-red-50 text-red-600 rounded-lg">
          <h3 className="font-bold">Error loading posts</h3>
          <p>{error?.message || 'An unexpected error occurred'}</p>
        </div>
      )}

      {/* Posts grid */}
      {!isLoading && !isError && (
        <>
          <PostGrid
            posts={posts}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEditPost={openEditEditor}
            onDeletePost={deletePost}
            onDuplicatePost={duplicatePost}
          />

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No posts found</p>
              <p>Try adjusting your filters or create a new post</p>
            </div>
          )}
        </>
      )}

      {/* Post editor dialog */}
      {isEditorOpen && (
        <PostEditor
          isOpen={isEditorOpen}
          post={selectedPost}
          onClose={closeEditor}
          onSave={selectedPost ? updatePost : createPost}
        />
      )}

      {/* Mobile floating action button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <FloatingActionButton
          icon="plus"
          themeColor="primary"
          onClick={openCreateEditor}
        />
      </div>

      {/* Notification area */}
      {notification && (
        <NotificationGroup
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
          }}
        >
          <Notification
            type={{ style: notification.type, icon: true }}
            closable={true}
          >
            {notification.message}
          </Notification>
        </NotificationGroup>
      )}
    </div>
  );
};

export default PostManagement; 