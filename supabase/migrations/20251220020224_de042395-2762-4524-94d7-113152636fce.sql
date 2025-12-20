-- Add RLS policies for image bucket to allow admins to upload
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'image' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'image' AND
  is_admin(auth.uid())
);

CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'image' AND
  is_admin(auth.uid())
);

CREATE POLICY "Anyone can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'image');

-- Create leadership_team table
CREATE TABLE public.leadership_team (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.leadership_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active leadership team"
ON public.leadership_team FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage leadership team"
ON public.leadership_team FOR ALL
USING (is_admin(auth.uid()));

-- Create awards table
CREATE TABLE public.awards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  organization text,
  year integer,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active awards"
ON public.awards FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage awards"
ON public.awards FOR ALL
USING (is_admin(auth.uid()));