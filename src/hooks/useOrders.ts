import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  delivery_fee?: number;
  delivery_address_id?: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalOrders = () => orders.length;
  const getTotalSpent = () => orders.reduce((total, order) => total + order.total_amount, 0);

  return {
    orders,
    loading,
    refetch: fetchOrders,
    getTotalOrders,
    getTotalSpent
  };
}