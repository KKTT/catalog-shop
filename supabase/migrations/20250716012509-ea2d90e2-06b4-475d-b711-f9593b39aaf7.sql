-- Add support for delivery addresses
CREATE TABLE IF NOT EXISTS public.delivery_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Cambodia',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery addresses
CREATE POLICY "Users can manage their own delivery addresses" 
ON public.delivery_addresses 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_delivery_addresses_updated_at
BEFORE UPDATE ON public.delivery_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update orders table to include delivery fee and delivery address
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS delivery_address_id UUID REFERENCES public.delivery_addresses(id);

-- Update order_items to include item image for recent orders display
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS image_url TEXT;