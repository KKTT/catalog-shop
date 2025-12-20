import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_image?: string;
  rating: number;
  review_text: string;
  product_name?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          ...testimonialData,
          created_by: user.id
        });

      if (error) throw error;
      await loadTestimonials();
      return true;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return false;
    }
  };

  const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadTestimonials();
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTestimonials();
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }
  };

  return {
    testimonials,
    loading,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refreshTestimonials: loadTestimonials
  };
}
