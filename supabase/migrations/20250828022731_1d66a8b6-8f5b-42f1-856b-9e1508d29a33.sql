-- Create blog posts table
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  category text,
  author_name text,
  featured_image_url text,
  meta_title text,
  meta_description text,
  slug text UNIQUE,
  is_featured boolean DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Create FAQ items table
CREATE TABLE public.faq_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Create contact info table
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  phone text,
  address text,
  business_hours jsonb DEFAULT '{}',
  support_description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid
);

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for faq_items
CREATE POLICY "Anyone can view published FAQs" 
ON public.faq_items 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage FAQs" 
ON public.faq_items 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for contact_info
CREATE POLICY "Anyone can view active contact info" 
ON public.contact_info 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.contact_info (email, phone, address, business_hours, support_description) VALUES (
  'contact@company.com',
  '+1 (555) 123-4567',
  '123 Business Street, City, State 12345',
  '{"monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 5:00 PM", "friday": "9:00 AM - 5:00 PM", "saturday": "Closed", "sunday": "Closed"}',
  'Our support team is here to help you with any questions or concerns you may have.'
);

INSERT INTO public.faq_items (question, answer, category, sort_order) VALUES 
('What is your return policy?', 'We offer a 30-day return policy for all unused items in original packaging.', 'returns', 1),
('How long does shipping take?', 'Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery.', 'shipping', 2),
('Do you offer international shipping?', 'Yes, we ship to most countries worldwide. International shipping fees apply.', 'shipping', 3),
('How can I track my order?', 'Once your order ships, you will receive a tracking number via email.', 'orders', 4),
('What payment methods do you accept?', 'We accept all major credit cards, PayPal, and bank transfers.', 'payment', 5);

INSERT INTO public.blog_posts (title, excerpt, content, status, category, author_name, slug, published_at) VALUES
('Welcome to Our Blog', 'Learn about our latest updates and insights', 'Welcome to our company blog where we share insights, updates, and industry knowledge.', 'published', 'company', 'Admin Team', 'welcome-to-our-blog', now()),
('Product Quality Standards', 'How we ensure the highest quality in our products', 'Quality is at the heart of everything we do. Learn about our rigorous testing processes and quality standards.', 'published', 'products', 'Quality Team', 'product-quality-standards', now()),
('Customer Success Stories', 'Real stories from our satisfied customers', 'Read about how our products have made a difference in our customers lives.', 'draft', 'testimonials', 'Marketing Team', 'customer-success-stories', null);