import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DeliveryAddress {
  id: string;
  user_id: string;
  address_line: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function useDeliveryAddresses() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching delivery addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async (addressData: Partial<DeliveryAddress> & { address_line: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .upsert({
          user_id: user.id,
          ...addressData
        });

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving delivery address:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user) return;

    try {
      // First, set all addresses to non-default
      await supabase
        .from('delivery_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('delivery_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting delivery address:', error);
      throw error;
    }
  };

  return {
    addresses,
    loading,
    saveAddress,
    setDefaultAddress,
    deleteAddress,
    refetch: fetchAddresses
  };
}