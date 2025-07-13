import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string, productName: string, price: number, imageUrl?: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save items to your wishlist.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          product_name: productName,
          price: price,
          image_url: imageUrl
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already in Wishlist",
            description: "This item is already in your wishlist."
          });
          return false;
        }
        throw error;
      }
      
      await fetchWishlistItems();
      toast({
        title: "Added to Wishlist",
        description: `${productName} has been added to your wishlist.`
      });
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      await fetchWishlistItems();
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist."
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlistItems
  };
}