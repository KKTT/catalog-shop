import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  status: string;
  category?: string;
  author_name?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          created_by: user.id
        });

      if (error) throw error;
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error creating blog post:', error);
      return false;
    }
  };

  const updatePost = async (id: string, data: Partial<BlogPost>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return false;
    }
  };

  const deletePost = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    refreshPosts: loadPosts
  };
}