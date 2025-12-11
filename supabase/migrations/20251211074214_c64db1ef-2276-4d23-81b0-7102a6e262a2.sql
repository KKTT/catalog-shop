-- Add phone_number and map_link columns to delivery_addresses table
ALTER TABLE public.delivery_addresses 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS map_link text;