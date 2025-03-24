import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, PostCreateRequest, PostFilter, PostUpdateRequest } from '../types/posts';
import { postService } from '../services/postService';
import { Notification } from '@progress/kendo-react-notification';
import { NotificationGroup } from '@progress/kendo-react-notification';

export const usePostManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PostFilter>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fetch posts
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts', page, pageSize, filters],
    queryFn: () => postService.getPosts(page, pageSize, filters),
    // Fallback to mock data during development
    placeholderData: {
      posts: postService.getMockPosts(pageSize),
      total: 100,
      page,
      pageSize,
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (postData: PostCreateRequest) => postService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showNotification('success', 'Post created successfully');
      closeEditor();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      showNotification('error', 'Failed to create post');
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, postData }: { id: string; postData: PostUpdateRequest }) =>
      postService.updatePost(id, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showNotification('success', 'Post updated successfully');
      closeEditor();
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      showNotification('error', 'Failed to update post');
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showNotification('success', 'Post deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      showNotification('error', 'Failed to delete post');
    },
  });

  // Duplicate post mutation
  const duplicatePostMutation = useMutation({
    mutationFn: (id: string) => postService.duplicatePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showNotification('success', 'Post duplicated successfully');
    },
    onError: (error) => {
      console.error('Error duplicating post:', error);
      showNotification('error', 'Failed to duplicate post');
    },
  });

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Open editor for creating a new post
  const openCreateEditor = useCallback(() => {
    setSelectedPost(null);
    setIsEditorOpen(true);
  }, []);

  // Open editor for editing an existing post
  const openEditEditor = useCallback((post: Post) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  }, []);

  // Close editor
  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    setSelectedPost(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: PostFilter) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when applying filters
  }, []);

  // Create a new post
  const createPost = useCallback((postData: PostCreateRequest) => {
    createPostMutation.mutate(postData);
  }, [createPostMutation]);

  // Update an existing post
  const updatePost = useCallback((postData: PostUpdateRequest) => {
    if (!postData.id) return;
    updatePostMutation.mutate({
      id: postData.id,
      postData,
    });
  }, [updatePostMutation]);

  // Delete a post
  const deletePost = useCallback((id: string) => {
    deletePostMutation.mutate(id);
  }, [deletePostMutation]);

  // Duplicate a post
  const duplicatePost = useCallback((id: string) => {
    duplicatePostMutation.mutate(id);
  }, [duplicatePostMutation]);

  return {
    posts: data?.posts || [],
    total: data?.total || 0,
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
  };
}; 