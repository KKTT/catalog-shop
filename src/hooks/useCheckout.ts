import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useDeliveryAddresses } from '@/hooks/useDeliveryAddresses';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ShippingAddress {
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Cambodia'
  });
  
  const { cartItems, cartTotal, clearCart } = useCart();
  const { saveAddress, addresses } = useDeliveryAddresses();
  const { user } = useAuth();
  const { toast } = useToast();

  const processCheckout = async (paymentMethod: string, saveAddressForFuture: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress.address_line.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a shipping address.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save address if requested
      let deliveryAddressId = null;
      if (saveAddressForFuture) {
        await saveAddress({
          ...shippingAddress,
          is_default: addresses.length === 0 // Set as default if it's the first address
        });
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal + 5.00, // Including delivery fee
          delivery_fee: 5.00,
          status: 'pending',
          delivery_address_id: deliveryAddressId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });

      return order;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectSavedAddress = (addressId: string) => {
    const savedAddress = addresses.find(addr => addr.id === addressId);
    if (savedAddress) {
      setShippingAddress({
        address_line: savedAddress.address_line,
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        postal_code: savedAddress.postal_code || '',
        country: savedAddress.country || 'Cambodia'
      });
    }
  };

  return {
    isProcessing,
    shippingAddress,
    setShippingAddress,
    processCheckout,
    selectSavedAddress
  };
}