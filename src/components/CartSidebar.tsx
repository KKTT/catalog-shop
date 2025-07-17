import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useCheckout';
import { useDeliveryAddresses } from '@/hooks/useDeliveryAddresses';
import { ShoppingCart, Plus, Minus, Trash2, Info, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function CartSidebar() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('delivery-person');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const { addresses } = useDeliveryAddresses();
  const { 
    isProcessing, 
    shippingAddress, 
    setShippingAddress, 
    processCheckout, 
    selectSavedAddress 
  } = useCheckout();

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
                {/* Shipping Address Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Shipping Address</Label>
                    {addresses.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {showAddressForm ? 'Select Saved' : 'New Address'}
                      </Button>
                    )}
                  </div>

                  {!showAddressForm && addresses.length > 0 ? (
                    <Select onValueChange={selectSavedAddress}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a saved address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.address_line}, {address.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        placeholder="Phone Number *"
                        value={shippingAddress.phone_number || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone_number: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="Delivery Location *"
                        value={shippingAddress.address_line}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="Map Link (optional)"
                        value={shippingAddress.map_link || ''}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, map_link: e.target.value }))}
                      />
                    </div>
                  )}

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
                    <div className="space-y-3">
                      <div 
                        className={`p-3 border rounded-lg cursor-pointer ${paymentMethod === 'delivery-person' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => setPaymentMethod('delivery-person')}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            checked={paymentMethod === 'delivery-person'} 
                            onChange={() => setPaymentMethod('delivery-person')}
                            className="text-primary"
                          />
                          <span className="font-medium">Delivery Person</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          User will pay the delivery person upon arrival.
                        </p>
                      </div>

                      <div 
                        className={`p-3 border rounded-lg cursor-pointer ${paymentMethod === 'aba-pay' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => setPaymentMethod('aba-pay')}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            checked={paymentMethod === 'aba-pay'} 
                            onChange={() => setPaymentMethod('aba-pay')}
                            className="text-primary"
                          />
                          <span className="font-medium">ABA Pay</span>
                        </div>
                        {paymentMethod === 'aba-pay' && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-800 space-y-2">
                              <p><strong>ABA Account:</strong> 007827973</p>
                              <p>Please transfer the total to the above ABA account. Then upload your payment receipt.</p>
                            </div>
                            <div className="mt-3 space-y-2">
                              <Label htmlFor="receipt-upload" className="text-sm font-medium">Upload Receipt</Label>
                              <Input
                                id="receipt-upload"
                                type="file"
                                accept="image/*,.pdf"
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-medium text-lg border-t pt-3">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => processCheckout(paymentMethod, saveAddress)}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}