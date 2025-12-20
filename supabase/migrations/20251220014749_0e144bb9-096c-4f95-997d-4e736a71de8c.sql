-- Add missing columns to company_content table for About page
ALTER TABLE public.company_content 
ADD COLUMN IF NOT EXISTS page_title text DEFAULT 'About Our Company',
ADD COLUMN IF NOT EXISTS page_subtitle text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS vision_title text DEFAULT 'Our Vision',
ADD COLUMN IF NOT EXISTS vision_description text DEFAULT NULL;