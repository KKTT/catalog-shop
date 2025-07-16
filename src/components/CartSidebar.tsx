import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus, Trash2, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function CartSidebar() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="save-address" 
                      checked={saveAddress}
                      onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                    />
                    <label 
                      htmlFor="save-address" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Save delivery address for future use
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <div className="flex gap-2">
                      <Button
                        variant={paymentMethod === 'credit-card' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('credit-card')}
                      >
                        Credit Card
                      </Button>
                      <Button
                        variant={paymentMethod === 'aba-pay' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod('aba-pay')}
                        className="relative"
                      >
                        ABA Pay
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Transfer the total to our ABA account 007827973. Then upload the receipt.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-medium text-lg border-t pt-3">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}