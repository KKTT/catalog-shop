import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContactInfo {
  id: string;
  email: string;
  phone?: string;
  address?: string;
  business_hours?: any;
  support_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export function useContact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setContactInfo(data);
    } catch (error) {
      console.error('Error loading contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (data: Partial<ContactInfo>) => {
    if (!user || !contactInfo) return false;

    try {
      const { error } = await supabase
        .from('contact_info')
        .update(data)
        .eq('id', contactInfo.id);

      if (error) throw error;
      await loadContactInfo();
      return true;
    } catch (error) {
      console.error('Error updating contact info:', error);
      return false;
    }
  };

  return {
    contactInfo,
    loading,
    updateContactInfo,
    refreshContactInfo: loadContactInfo
  };
}