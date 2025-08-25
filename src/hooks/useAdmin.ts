import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    phone_number: string;
  };
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminRole(null);
      setLoading(false);
      return;
    }

    try {
      // Check if user is admin
      const { data: isAdminResult } = await supabase.rpc('is_admin', { 
        _user_id: user.id 
      });

      if (isAdminResult) {
        // Get admin role
        const { data: roleResult } = await supabase.rpc('get_admin_role', { 
          _user_id: user.id 
        });
        setAdminRole(roleResult);
      }

      setIsAdmin(!!isAdminResult);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminRole(null);
    } finally {
      setLoading(false);
    }
  };

  const callAdminAPI = async (endpoint: string, method: string = 'GET', data?: any) => {
    if (!session?.access_token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://myuqekgahmislpvmbblm.supabase.co/functions/v1/${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  };

  // Product management
  const getProducts = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  } = {}) => {
    const url = new URL(`https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-products`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  };

  const createProduct = async (product: any) => {
    return callAdminAPI('admin-products', 'POST', product);
  };

  const updateProduct = async (id: string, product: any) => {
    const url = `https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-products?id=${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  };

  const deleteProduct = async (id: string) => {
    const url = `https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-products?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  };

  // Order management
  const getOrders = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const url = new URL(`https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-orders`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const url = `https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-orders?id=${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  };

  // User management
  const getUsers = async (params: {
    page?: number;
    limit?: number;
    type?: 'users' | 'admins';
  } = {}) => {
    const url = new URL(`https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-users`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  };

  const createAdminUser = async (data: {
    user_id: string;
    role: string;
    permissions?: string[];
  }) => {
    return callAdminAPI('admin-users', 'POST', data);
  };

  const updateAdminUser = async (id: string, data: any) => {
    const url = `https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-users?id=${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update admin user');
    return response.json();
  };

  const deleteAdminUser = async (id: string) => {
    const url = `https://myuqekgahmislpvmbblm.supabase.co/functions/v1/admin-users?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to delete admin user');
    return response.json();
  };

  return {
    isAdmin,
    adminRole,
    loading,
    // Product methods
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Order methods
    getOrders,
    updateOrderStatus,
    // User methods
    getUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
  };
}