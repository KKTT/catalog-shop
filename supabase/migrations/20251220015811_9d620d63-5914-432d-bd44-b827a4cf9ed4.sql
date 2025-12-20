-- Add story image column to company_content table
ALTER TABLE public.company_content 
ADD COLUMN IF NOT EXISTS story_image_url text;