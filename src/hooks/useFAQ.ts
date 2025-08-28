import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faqData: Omit<FAQItem, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('faq_items')
        .insert({
          ...faqData,
          created_by: user.id
        });

      if (error) throw error;
      await loadFAQs();
      return true;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return false;
    }
  };

  const updateFAQ = async (id: string, data: Partial<FAQItem>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('faq_items')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await loadFAQs();
      return true;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return false;
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadFAQs();
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  };

  return {
    faqs,
    loading,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refreshFAQs: loadFAQs
  };
}